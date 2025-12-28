import { transmitActionSchema } from "@/lib/esphome-validation";
import { ESPHomeCode } from "@/types/form";
import { z } from "zod";

export interface CodeValidationError {
  name?: string;
  parameters?: { [key: string]: string };
}

export interface ValidationResult {
  isValid: boolean;
  errors: CodeValidationError;
}

/**
 * Converte i parametri del codice in un formato adatto per la validazione Zod
 */
function convertParametersForValidation(
  parameters: Record<string, string | number | boolean>
): Record<string, unknown> {
  const converted: Record<string, unknown> = {};

  Object.entries(parameters).forEach(([key, value]) => {
    if (typeof value === "string") {
      const trimmedValue = value.trim();
      
      // Skip empty strings
      if (trimmedValue === "") {
        return;
      }

      // Try to parse as number (including hex)
      if (trimmedValue.startsWith("0x") || trimmedValue.startsWith("0X")) {
        // Keep hex values as strings for now, let Zod handle them
        const hexValue = parseInt(trimmedValue, 16);
        if (!isNaN(hexValue)) {
          converted[key] = hexValue;
        } else {
          converted[key] = trimmedValue;
        }
      } else if (!isNaN(Number(trimmedValue))) {
        converted[key] = Number(trimmedValue);
      } else if (trimmedValue === "true") {
        converted[key] = true;
      } else if (trimmedValue === "false") {
        converted[key] = false;
      } else if (trimmedValue.startsWith("[") && trimmedValue.endsWith("]")) {
        // Handle array format like [0xA1, 0x82, 0x40]
        try {
          const arrayStr = trimmedValue.slice(1, -1);
          const arrayValues = arrayStr.split(",").map((s) => {
            const trimmed = s.trim();
            if (trimmed.startsWith("0x") || trimmed.startsWith("0X")) {
              return parseInt(trimmed, 16);
            }
            return parseInt(trimmed, 10);
          });
          
          // Check if all values were parsed successfully
          if (arrayValues.every((v) => !isNaN(v))) {
            converted[key] = arrayValues;
          } else {
            converted[key] = trimmedValue;
          }
        } catch {
          converted[key] = trimmedValue;
        }
      } else {
        // Keep as string for other cases
        converted[key] = trimmedValue;
      }
    } else {
      converted[key] = value;
    }
  });

  return converted;
}

/**
 * Valida un singolo codice IR usando gli schema Zod
 */
export function validateCode(code: ESPHomeCode): ValidationResult {
  const errors: CodeValidationError = {};
  let isValid = true;

  // Validate name
  if (!code.name.trim()) {
    errors.name = "Function name is required";
    isValid = false;
  }

  // Validate protocol
  if (!code.protocol || !code.protocol.trim()) {
    return { isValid: false, errors };
  }

  // Validate parameters using Zod
  try {
    const paramsToValidate = convertParametersForValidation(code.parameters);

    const validationData = {
      protocol: code.protocol.toLowerCase(),
      params: paramsToValidate,
    };

    transmitActionSchema.parse(validationData);
  } catch (error) {
    if (error instanceof z.ZodError) {
      errors.parameters = {};
      
      (error as z.ZodError).issues.forEach((issue: z.ZodIssue) => {
        if (issue.path.length > 1 && issue.path[0] === "params") {
          const paramName = issue.path[1] as string;
          
          // Make error messages more user-friendly
          let message = issue.message;
          
          if (issue.code === "invalid_type") {
            if (issue.expected === "number") {
              message = "Deve essere un numero valido";
            } else if (issue.expected === "boolean") {
              message = "Deve essere true o false";
            } else if (issue.expected === "array") {
              message = "Deve essere un array (es: [0xA1, 0x82])";
            }
          } else if (issue.code === "too_small") {
            const min = (issue as z.ZodIssue & { minimum?: number }).minimum;
            message = `Valore minimo: ${min}`;
          } else if (issue.code === "too_big") {
            const max = (issue as z.ZodIssue & { maximum?: number }).maximum;
            message = `Valore massimo: ${max}`;
          } else if (issue.code === "invalid_format") {
            message = "Formato non valido";
          }
          
          if (!errors.parameters) {
            errors.parameters = {};
          }
          errors.parameters[paramName] = message;
        } else if (issue.path.length === 1 && issue.path[0] === "params") {
          // General parameter error
          if (!errors.parameters) {
            errors.parameters = {};
          }
          errors.parameters["_general"] = issue.message;
        }
      });
      
      isValid = false;
    }
  }

  return { isValid, errors };
}

/**
 * Valida un singolo parametro di un codice IR
 * Utile per validazione in tempo reale durante la digitazione
 */
export function validateParameter(
  protocol: string,
  paramName: string,
  value: string | number | boolean,
  allParameters: Record<string, string | number | boolean>
): string | undefined {
  if (!protocol || !protocol.trim()) {
    return undefined;
  }

  try {
    const paramsToValidate = convertParametersForValidation({
      ...allParameters,
      [paramName]: value,
    });

    const validationData = {
      protocol: protocol.toLowerCase(),
      params: paramsToValidate,
    };

    transmitActionSchema.parse(validationData);
    return undefined;
  } catch (error) {
    if (error instanceof z.ZodError) {
      const paramError = (error as z.ZodError).issues.find(
        (issue: z.ZodIssue) => issue.path.length > 1 && issue.path[1] === paramName
      );

      if (paramError) {
        let message = paramError.message;

        // Make error messages more user-friendly
        if (paramError.code === "invalid_type") {
          if (paramError.expected === "number") {
            message = "Deve essere un numero valido";
          } else if (paramError.expected === "boolean") {
            message = "Deve essere true o false";
          } else if (paramError.expected === "array") {
            message = "Deve essere un array (es: [0xA1, 0x82])";
          }
        } else if (paramError.code === "too_small") {
          const min = (paramError as z.ZodIssue & { minimum?: number }).minimum;
          message = `Valore minimo: ${min}`;
        } else if (paramError.code === "too_big") {
          const max = (paramError as z.ZodIssue & { maximum?: number }).maximum;
          message = `Valore massimo: ${max}`;
        } else if (paramError.code === "invalid_format") {
          message = "Formato non valido";
        }

        return message;
      }
    }
  }

  return undefined;
}

/**
 * Hook per la validazione dei codici IR
 */
export function useCodeValidation() {
  return {
    validateCode,
    validateParameter,
  };
}
