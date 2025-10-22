import { protocolParameters } from "@/lib/esphome-constants";
import { ipAddressSchema, protocolSchema, getProtocolParamsSchema } from "@/lib/esphome-validation";
import Logger from "@/lib/logger";
import {
  CapturedCode,
  ESPHomeConnection,
  ESPHomeDevice,
  ESPHomeLogEntry,
} from "@/types/esphome";
import { SSEESPHomeConnection } from "@/types/form";

const logger = new Logger("ESPHomeSSEAPI");

class ESPHomeSSEAPI {
  private connections: Map<string, SSEESPHomeConnection> = new Map();
  private maxReconnectAttempts = 5;
  private reconnectDelay = 2000;

  async connect(
    device: ESPHomeDevice,
    protocol?: string,
  ): Promise<ESPHomeConnection> {
    try {
      if (!this.isValidIP(device.ip)) {
        const error = `Invalid IP address: ${device.ip}`;
        logger.error(error);
        throw new Error(error);
      }

      const existingConnection = this.connections.get(device.ip);
      if (existingConnection?.connected) {
        if (protocol && existingConnection.selectedProtocol !== protocol) {
          existingConnection.selectedProtocol = protocol;
        }
        return existingConnection;
      }

      const url = `http://${device.ip}/events`;

      const connection: SSEESPHomeConnection = {
        device,
        connected: false,
        logs: [],
        selectedProtocol: protocol,
        reconnectAttempts: 0,
        lastError: undefined,
      };

      this.connections.set(device.ip, connection);

      return this.createSSEConnection(connection, url);
    } catch (error) {
      const errorMsg =
        error instanceof Error ? error.message : "Unknown connection error";
      logger.error(`Connection failed for ${device.ip}`, error);
      throw new Error(
        `Failed to connect to ESPHome device at ${device.ip}: ${errorMsg}`,
      );
    }
  }

  private async createSSEConnection(
    connection: SSEESPHomeConnection,
    url: string,
  ): Promise<ESPHomeConnection> {
    return new Promise((resolve, reject) => {
      const eventSource = new EventSource(url);
      connection.eventSource = eventSource;

      const connectionTimeout = setTimeout(() => {
        eventSource.close();
        this.connections.delete(connection.device.ip);
        reject(new Error(`Connection timeout for ${connection.device.ip}`));
      }, 15000);

      eventSource.onopen = () => {
        clearTimeout(connectionTimeout);
        connection.connected = true;
        connection.reconnectAttempts = 0;
        connection.lastError = undefined;
        resolve(connection);
      };

      eventSource.onmessage = (event) => {
        this.handleSSEEvent(connection, event);
      };

      eventSource.addEventListener("log", (event) => {
        this.handleSSEEvent(connection, event);
      });

      eventSource.addEventListener("state", (event) => {
        this.handleSSEEvent(connection, event);
      });

      eventSource.onerror = () => {
        clearTimeout(connectionTimeout);
        const errorMessage =
          eventSource.readyState === EventSource.CLOSED
            ? "Connection closed unexpectedly"
            : "Connection error";
        connection.lastError = errorMessage;

        if (connection.connected) {
          connection.connected = false;
          this.attemptReconnection(connection);
        } else {
          eventSource.close();
          this.connections.delete(connection.device.ip);
          reject(new Error(`Connection failed for ${connection.device.ip}`));
        }
      };
    });
  }

  private async attemptReconnection(
    connection: SSEESPHomeConnection,
  ): Promise<void> {
    if (!connection.reconnectAttempts) connection.reconnectAttempts = 0;
    if (connection.reconnectAttempts >= this.maxReconnectAttempts) return;

    connection.reconnectAttempts++;
    const delay = this.reconnectDelay * connection.reconnectAttempts;

    setTimeout(async () => {
      if (connection.eventSource) connection.eventSource.close();
      const url = `http://${connection.device.ip}/events`;
      await this.createSSEConnection(connection, url);
    }, delay);
  }

  private isValidIP(ip: string): boolean {
    return ipAddressSchema.safeParse(ip).success;
  }

  async disconnect(ip: string): Promise<void> {
    const connection = this.connections.get(ip);
    if (!connection) return;

    if (connection.eventSource) connection.eventSource.close();
    connection.connected = false;
    this.connections.delete(ip);
  }

  async startCapture(ip: string, protocol: string): Promise<void> {
    if (!ip || !protocol) throw new Error(`Invalid parameters`);
    const connection = this.connections.get(ip);
    if (!connection) throw new Error(`No connection for ${ip}`);
    if (!connection.connected) throw new Error(`Device ${ip} not connected`);
    if (!this.isValidProtocol(protocol))
      throw new Error(`Unsupported protocol: ${protocol}`);

    connection.selectedProtocol = protocol;
  }

  async stopCapture(ip: string): Promise<void> {
    if (!ip) throw new Error(`Invalid IP address`);
    const connection = this.connections.get(ip);
    if (!connection) throw new Error(`No connection for ${ip}`);
    if (!connection.connected) throw new Error(`Device ${ip} not connected`);
  }

  private isValidProtocol(protocol: string): boolean {
    return protocolSchema.safeParse(protocol).success;
  }

  getConnectionDiagnostics(ip: string): Record<string, unknown> {
    const connection = this.connections.get(ip);
    if (!connection) {
      return { error: "No connection found" };
    }

    return {
      connected: connection.connected,
      selectedProtocol: connection.selectedProtocol,
      reconnectAttempts: connection.reconnectAttempts || 0,
      lastError: connection.lastError,
      logCount: connection.logs.length,
      eventSourceState: connection.eventSource?.readyState,
      eventSourceUrl: connection.eventSource?.url,
    };
  }

  getActiveConnections(): string[] {
    return Array.from(this.connections.keys()).filter((ip) => {
      const connection = this.connections.get(ip);
      return connection?.connected;
    });
  }

  private handleSSEEvent(
    connection: SSEESPHomeConnection,
    event: MessageEvent,
  ): void {
    try {
      let eventData = event.data || "";
      if (!eventData) return;

      let eventType = "log";
      const dataLines = eventData
        .split("\n")
        .filter((line: string) => line.trim() !== "");
      if (dataLines.length > 1 && dataLines[0].startsWith("event:")) {
        eventType = dataLines[0].split(":")[1].trim();
        const dataLine = dataLines.find((line: string) =>
          line.startsWith("data:"),
        );
        eventData = dataLine ? dataLine.replace("data:", "").trim() : eventData;
      }

      const logMatch = eventData.match(/\[([A-Z])\]\[([^:]+):(\d+)\]: (.+)/);
      if (logMatch) {
        const [, , component, , message] = logMatch;
        if (this.isIRLog(component) && connection.selectedProtocol) {
          this.parseIRCode(connection, component, message);
        }
      } else {
        this.handleNonStandardEvent(connection, eventData, eventType);
      }
    } catch {
      logger.error(`Error handling SSE event for ${connection.device.ip}`);
    }
  }

  private handleNonStandardEvent(
    connection: SSEESPHomeConnection,
    eventData: string,
    eventType: string = "unknown",
  ): void {
    if (
      eventData.trim() === "" ||
      eventData.includes("ping") ||
      eventType === "ping"
    )
      return;
    if (eventData.startsWith("{") && eventData.endsWith("}")) {
      try {
        JSON.parse(eventData);
      } catch {
        logger.warn(`Failed to parse JSON event for ${connection.device.ip}`);
      }
    }
  }

  private isIRLog(component: string): boolean {
    const irComponents = [
      "remote_receiver",
      "remote_transmitter",
      "remote.",
      "ir_receiver",
      "ir_transmitter",
      "ir.",
      "pronto",
      "nec",
      "samsung",
      "sony",
      "lg",
      "panasonic",
      "rc5",
      "rc6",
      "jvc",
      "pioneer",
      "coolix",
      "midea",
      "haier",
    ];

    return irComponents.some((irComp) =>
      component.toLowerCase().includes(irComp.toLowerCase()),
    );
  }

  private parseIRCode(
    connection: SSEESPHomeConnection,
    component: string,
    message: string,
  ): void {
    try {
      const receivedMatch = message.match(/Received\s+(\w+):\s*(.+)/i);

      if (receivedMatch) {
        const [, detectedProtocol, paramString] = receivedMatch;

        if (
          detectedProtocol.toLowerCase() ===
          connection.selectedProtocol?.toLowerCase()
        ) {
          const parameters = this.parseParameterString(
            paramString,
            detectedProtocol.toLowerCase(),
          );

          if (parameters && Object.keys(parameters).length > 0) {
            const capturedCode: CapturedCode = {
              protocol: detectedProtocol.toLowerCase(),
              parameters,
              rawData: message,
              timestamp: new Date().toISOString(),
            };

            if (connection.onCodeCaptured) {
              connection.onCodeCaptured(capturedCode);
            }
          }
        }
      } else if (
        component.includes("pronto") &&
        connection.selectedProtocol === "pronto"
      ) {
        const hexPattern = /([0-9A-Fa-f]{4}(?:\s+[0-9A-Fa-f]{4})*)/;
        const hexMatch = message.match(hexPattern);

        if (hexMatch) {
          const capturedCode: CapturedCode = {
            protocol: "pronto",
            parameters: { data: hexMatch[1].trim() },
            rawData: message,
            timestamp: new Date().toISOString(),
          };

          if (connection.onCodeCaptured) {
            connection.onCodeCaptured(capturedCode);
          }
        }
      } else if (
        message.includes("Raw:") &&
        connection.selectedProtocol === "raw"
      ) {
        const rawMatch = message.match(/Raw:\s*\[([^\]]+)\]/);
        if (rawMatch) {
          const capturedCode: CapturedCode = {
            protocol: "raw",
            parameters: { code: `[${rawMatch[1]}]` },
            rawData: message,
            timestamp: new Date().toISOString(),
          };

          if (connection.onCodeCaptured) {
            connection.onCodeCaptured(capturedCode);
          }
        }
      }
    } catch {
      logger.error(`Error parsing IR code`);
    }
  }

  private parseParameterString(
    paramString: string,
    protocol: string,
  ): Record<string, string | number | boolean> {
    const parameters: Record<string, string | number | boolean> = {};

    try {
      if (paramString.includes("=")) {
        const regex = /(\w+)=([^,\s]+)/g;
        let match;
        while ((match = regex.exec(paramString)) !== null) {
          const key = match[1];
          const value = match[2];
          if (value.startsWith("0x") || value.startsWith("0X")) {
            parameters[key] = value;
          } else if (!isNaN(Number(value))) {
            parameters[key] = Number(value);
          } else {
            parameters[key] = value;
          }
        }
      } else {
        const trimmed = paramString.trim();

        if (trimmed.startsWith("0x") || trimmed.startsWith("0X")) {
          parameters.data = trimmed;
        } else if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
          parameters.code = trimmed;
        } else {
          parameters.data = trimmed;
        }
      }

      return this.validateAndFormatParameters(parameters, protocol);
    } catch {
      return {};
    }
  }

  private validateAndFormatParameters(
    parameters: Record<string, string | number | boolean>,
    protocol: string,
  ): Record<string, string | number | boolean> {
    try {
      const protocolDef = protocolParameters[protocol];
      if (!protocolDef) {
        return parameters;
      }

      const validatedParams: Record<string, string | number | boolean> = {};

      for (const paramDef of protocolDef) {
        if (paramDef.skip) {
          continue;
        }

        const value = parameters[paramDef.name];

        if (value !== undefined) {
          switch (paramDef.type) {
            case "int":
              if (
                typeof value === "string" &&
                (value.startsWith("0x") || value.startsWith("0X"))
              ) {
                validatedParams[paramDef.name] = value;
              } else {
                const intVal =
                  typeof value === "number"
                    ? value
                    : parseInt(String(value), 10);
                if (!isNaN(intVal)) {
                  validatedParams[paramDef.name] = intVal;
                }
              }
              break;
            case "string":
              validatedParams[paramDef.name] = String(value);
              break;
            case "boolean":
              validatedParams[paramDef.name] = Boolean(value);
              break;
            case "bytes":
            case "list":
              validatedParams[paramDef.name] = value;
              break;
            default:
              validatedParams[paramDef.name] = value;
          }
        }
      }

      // Validate with Zod schema for additional validation
      const schema = getProtocolParamsSchema(protocol);
      if (schema) {
        const result = schema.safeParse(validatedParams);
        if (result.success) {
          return result.data as Record<string, string | number | boolean>;
        }
      }

      return validatedParams;
    } catch {
      return parameters;
    }
  }

  private convertLogLevel(levelChar: string): ESPHomeLogEntry["level"] {
    switch (levelChar.toUpperCase()) {
      case "E":
        return "ERROR";
      case "W":
        return "WARN";
      case "I":
        return "INFO";
      case "D":
      case "V":
      default:
        return "DEBUG";
    }
  }

  getConnection(ip: string): ESPHomeConnection | undefined {
    return this.connections.get(ip);
  }
}

export const esphomeAPI = new ESPHomeSSEAPI();
