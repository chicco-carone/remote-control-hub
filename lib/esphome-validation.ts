import { z } from "zod";

// Schema per validazione IP address/hostname
export const ipAddressSchema = z.string().refine((val) => {
  if (!val || val.trim() === "") return false;

  const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
  if (ipv4Regex.test(val)) {
    const parts = val.split(".");
    return parts.every((part) => {
      const num = parseInt(part, 10);
      return num >= 0 && num <= 255;
    });
  }

  const hostnameRegex =
    /^[a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?)*$/;
  return hostnameRegex.test(val);
}, "Invalid IP address or hostname");

// Schema per il protocollo NEC
const necSchema = z.object({
  address: z.int().min(0).max(0xFFFF).describe("16-bit device address"),
  command: z.int().min(0).max(0xFFFF).describe("16-bit command with inverse"),
  command_repeats: z.int().min(1).optional().describe("Number of command repeats (default: 1)"),
});

// Schema per il protocollo Samsung
const samsungSchema = z.object({
  data: z.int().min(0).max(0xFFFFFFFF).describe("Samsung code data"),
  nbits: z.int().min(1).max(64).optional().describe("Number of bits (default: 32)"),
});

// Schema per il protocollo Samsung36
const samsung36Schema = z.object({
  address: z.int().min(0).max(0xFFFF).describe("Address to send"),
  command: z.int().min(0).max(0xFFFFFFFF).describe("Samsung36 command"),
});

// Schema per il protocollo Sony
const sonySchema = z.object({
  data: z.int().min(0).max(0xFFFFFFFF).describe("Sony code data"),
  nbits: z.int().min(1).max(64).optional().describe("Number of bits (default: 12)"),
});

// Schema per il protocollo LG
const lgSchema = z.object({
  data: z.int().min(0).max(0xFFFFFFFF).describe("LG code data"),
  nbits: z.int().min(1).max(64).optional().describe("Number of bits (default: 28)"),
});

// Schema per il protocollo Panasonic
const panasonicSchema = z.object({
  address: z.int().min(0).max(0xFFFF).describe("Device address"),
  command: z.int().min(0).max(0xFFFF).describe("Command code"),
});

// Schema per il protocollo RC5
const rc5Schema = z.object({
  address: z.int().min(0).max(31).describe("Device address (0-31)"),
  command: z.int().min(0).max(63).describe("Command code (0-63)"),
});

// Schema per il protocollo RC6
const rc6Schema = z.object({
  address: z.int().min(0).max(0xFFFF).describe("Device address"),
  command: z.int().min(0).max(0xFFFF).describe("Command code"),
});

// Schema per il protocollo JVC
const jvcSchema = z.object({
  data: z.int().min(0).max(0xFFFF).describe("JVC code data"),
});

// Schema per il protocollo Pioneer
const pioneerSchema = z.object({
  rc_code_1: z.int().min(0).max(0xFFFFFFFF).describe("Primary Pioneer remote code"),
  rc_code_2: z.int().min(0).max(0xFFFF).optional().describe("Secondary Pioneer remote code"),
});

// Schema per il protocollo Coolix
const coolixSchema = z.object({
  first: z.int().min(0).max(0xFFFFFF).describe("First 24-bit Coolix code"),
  second: z.int().min(0).max(0xFFFFFF).optional().describe("Second 24-bit Coolix code"),
});

// Schema per il protocollo Midea
const mideaSchema = z.object({
  code: z.array(z.int().min(0).max(255)).length(5).describe("5-byte Midea code array"),
});

// Schema per il protocollo Haier
const haierSchema = z.object({
  code: z.array(z.int().min(0).max(255)).length(13).describe("13-byte Haier code array"),
});

// Schema per il protocollo Toshiba AC
const toshibaAcSchema = z.object({
  rc_code_1: z.int().min(0).max(0xFFFFFFFFFFFF).describe("First remote code"),
  rc_code_2: z.int().min(0).max(0xFFFFFFFFFFFF).optional().describe("Second remote code"),
});

// Schema per il protocollo Mirage
const mirageSchema = z.object({
  code: z.array(z.int().min(0).max(255)).length(14).describe("14-byte Mirage code array"),
});

// Schema per il protocollo Dish
const dishSchema = z.object({
  address: z.int().min(1).max(16).optional().describe("Receiver number (1-16, default: 1)"),
  command: z.int().min(0).max(63).describe("Dish command (0-63)"),
});

// Schema per il protocollo Pronto
const prontoSchema = z.object({
  data: z.string().regex(/^[0-9A-Fa-f\s]+$/).describe("Pronto hex string"),
});

// Schema per il protocollo Raw
const rawSchema = z.object({
  code: z.array(z.int()).describe("Raw timing array (positive=ON, negative=OFF in µs)"),
});

// Schema per il protocollo AEHA
const aehaSchema = z.object({
  address: z.int().min(0).max(0xFFFF).describe("Address to send"),
  data: z.array(z.int().min(0).max(255)).min(2).max(35).describe("2-35 byte list"),
});

// Schema per il protocollo B&O Beo4
const beo4Schema = z.object({
  source: z.int().min(0).max(255).describe("8-bit source"),
  command: z.int().min(0).max(255).describe("Command to send"),
});

// Schema per il protocollo Byron SX
const byronsxSchema = z.object({
  address: z.int().min(0).max(255).describe("8-bit ID code"),
  command: z.int().min(0).max(255).describe("Command to send"),
});

// Schema per il protocollo CanalSat
const canalsatSchema = z.object({
  device: z.int().min(0).max(255).describe("Device to send to"),
  address: z.int().min(0).max(255).optional().describe("Address or sub-device (default: 0)"),
  command: z.int().min(0).max(255).describe("Command to send"),
});

// Schema per il protocollo CanalSat LD
const canalsatLdSchema = z.object({
  device: z.int().min(0).max(255).describe("Device to send to"),
  address: z.int().min(0).max(255).optional().describe("Address or sub-device (default: 0)"),
  command: z.int().min(0).max(255).describe("Command to send"),
});

// Schema per il protocollo Dooya
const dooyaSchema = z.object({
  id: z.int().min(0).max(0xFFFFFF).describe("24-bit ID code"),
  channel: z.int().min(0).max(255).describe("8-bit channel (0-255)"),
  button: z.int().min(0).max(15).describe("4-bit button (0-15)"),
  check: z.int().min(0).max(15).describe("4-bit check code"),
});

// Schema per il protocollo Drayton
const draytonSchema = z.object({
  address: z.int().min(0).max(0xFFFF).describe("16-bit ID code"),
  channel: z.int().min(0).max(127).describe("Switch/channel (0-127)"),
  command: z.int().min(0).max(63).describe("Command to send (0-63)"),
});

// Schema per il protocollo Go-Box
const goboxSchema = z.object({
  code: z.int().min(0).max(0xFFFF).describe("Go-Box command code"),
});

// Schema per il protocollo KeeLoq
const keeloqSchema = z.object({
  address: z.int().min(0).max(0xFFFFFFFF).describe("32-bit address"),
  command: z.int().min(0).max(15).describe("4-bit command/button code"),
  code: z.int().min(0).max(0xFFFFFFFF).optional().describe("32-bit encrypted field"),
  level: z.boolean().optional().describe("Low battery level status bit"),
});

// Schema per il protocollo MagiQuest
const magiquestSchema = z.object({
  wand_id: z.int().min(0).max(0xFFFFFFFF).describe("MagiQuest wand ID"),
  magnitude: z.int().min(0).max(0xFFFF).optional().describe("Magnitude of swishes/swirls"),
});

// Schema per il protocollo Nexa
const nexaSchema = z.object({
  device: z.int().min(0).max(0xFFFFFF).describe("Nexa device code"),
  state: z.int().min(0).max(2).describe("Nexa state code (0=OFF, 1=ON, 2=DIM)"),
  group: z.int().min(0).max(255).describe("Nexa group code"),
  channel: z.int().min(0).max(255).describe("Nexa channel code"),
  level: z.int().min(0).max(255).describe("Nexa level code"),
});

// Schema per il protocollo Roomba
const roombaSchema = z.object({
  data: z.int().min(0).max(255).describe("Roomba command code"),
});

// Schema per il protocollo Toto
const totoSchema = z.object({
  command: z.int().min(0).max(255).describe("1-byte Toto command (0-255)"),
  rc_code_1: z.int().min(0).max(15).optional().describe("First 4-bit parameter"),
  rc_code_2: z.int().min(0).max(15).optional().describe("Second 4-bit parameter"),
});

// Schema per il protocollo ABB Welcome
const abbWelcomeSchema = z.object({
  source_address: z.int().min(0).max(0xFFFF).describe("Source address"),
  destination_address: z.int().min(0).max(0xFFFF).describe("Destination address"),
  three_byte_address: z.boolean().optional().describe("Use 3-byte address length"),
  retransmission: z.boolean().optional().describe("Message is a re-transmission"),
  message_type: z.int().min(0).max(255).describe("Message type"),
  message_id: z.int().min(0).max(255).optional().describe("Message ID"),
  data: z.array(z.int().min(0).max(255)).max(7).optional().describe("0-7 byte list"),
});

// Schema per il protocollo RC Switch Raw
const rcSwitchRawSchema = z.object({
  code: z.string().regex(/^[01]+$/).describe("Raw binary code to send"),
});

// Schema per il protocollo RC Switch Type A
const rcSwitchTypeASchema = z.object({
  group: z.string().regex(/^[01]+$/).describe("Binary string for the group"),
  device: z.string().regex(/^[01]+$/).describe("Binary string for the device"),
  state: z.boolean().describe("On/off state to send"),
});

// Schema per il protocollo RC Switch Type B
const rcSwitchTypeBSchema = z.object({
  address: z.int().min(0).max(255).describe("Address to send the command to"),
  channel: z.int().min(0).max(255).describe("Channel to send the command to"),
  state: z.boolean().describe("On/off state to send"),
});

// Schema per il protocollo RC Switch Type C
const rcSwitchTypeCSchema = z.object({
  family: z.string().regex(/^[a-pA-P]$/).describe("Family to send command to (a-p)"),
  group: z.int().min(1).max(4).describe("Group to send command to (1-4)"),
  device: z.int().min(1).max(4).describe("Device to send command to (1-4)"),
  state: z.boolean().describe("On/off state to send"),
});

// Schema per il protocollo RC Switch Type D
const rcSwitchTypeDSchema = z.object({
  group: z.int().min(1).max(4).describe("Group to send command to (1-4)"),
  device: z.int().min(1).max(3).describe("Device to send command to (1-3)"),
  state: z.boolean().describe("On/off state to send"),
});

// Map di protocolli per centralizzare i dati
export const paramsSchemas = {
  nec: necSchema,
  samsung: samsungSchema,
  samsung36: samsung36Schema,
  sony: sonySchema,
  lg: lgSchema,
  panasonic: panasonicSchema,
  rc5: rc5Schema,
  rc6: rc6Schema,
  jvc: jvcSchema,
  pioneer: pioneerSchema,
  coolix: coolixSchema,
  midea: mideaSchema,
  haier: haierSchema,
  toshiba_ac: toshibaAcSchema,
  mirage: mirageSchema,
  dish: dishSchema,
  pronto: prontoSchema,
  raw: rawSchema,
  aeha: aehaSchema,
  beo4: beo4Schema,
  byronsx: byronsxSchema,
  canalsat: canalsatSchema,
  canalsatld: canalsatLdSchema,
  dooya: dooyaSchema,
  drayton: draytonSchema,
  gobox: goboxSchema,
  keeloq: keeloqSchema,
  magiquest: magiquestSchema,
  nexa: nexaSchema,
  roomba: roombaSchema,
  toto: totoSchema,
  abbwelcome: abbWelcomeSchema,
  rc_switch_raw: rcSwitchRawSchema,
  rc_switch_type_a: rcSwitchTypeASchema,
  rc_switch_type_b: rcSwitchTypeBSchema,
  rc_switch_type_c: rcSwitchTypeCSchema,
  rc_switch_type_d: rcSwitchTypeDSchema,
} as const;

// Schema per validazione protocollo
export const protocolSchema = z
  .string()
  .transform((val) => val.toLowerCase())
  .pipe(z.enum(Object.keys(paramsSchemas) as Array<keyof typeof paramsSchemas>));

// Funzione per ottenere lo schema dei parametri per un protocollo
export const getProtocolParamsSchema = (protocol: string) => {
  const key = protocol as keyof typeof paramsSchemas;
  return paramsSchemas[key] || null;
};

// Exporters with backward compatibility
export { necSchema, samsungSchema, samsung36Schema, sonySchema, lgSchema, panasonicSchema, rc5Schema, rc6Schema, jvcSchema, pioneerSchema, coolixSchema, mideaSchema, haierSchema, toshibaAcSchema, mirageSchema, dishSchema, prontoSchema, rawSchema, aehaSchema, beo4Schema, byronsxSchema, canalsatSchema, canalsatLdSchema, dooyaSchema, draytonSchema, goboxSchema, keeloqSchema, magiquestSchema, nexaSchema, roombaSchema, totoSchema, abbWelcomeSchema, rcSwitchRawSchema, rcSwitchTypeASchema, rcSwitchTypeBSchema, rcSwitchTypeCSchema, rcSwitchTypeDSchema };

// Schema unificato per le azioni di trasmissione ESPHome con pre-elaborazione per case insensitivity
export const protocolKeys = Object.keys(paramsSchemas) as (keyof typeof paramsSchemas)[];
export const protocolLiterals = protocolKeys.map((k) =>
  z.object({
    protocol: z.literal(k),
    params: paramsSchemas[k],
  })
);

export const transmitActionSchema = z.preprocess(
  (val) => {
    if (typeof val === 'object' && val !== null && 'protocol' in val && typeof val.protocol === 'string') {
      return { ...val, protocol: val.protocol.toLowerCase() };
    }
    return val;
  },
  z.discriminatedUnion("protocol", protocolLiterals as unknown as [typeof protocolLiterals[number], ...typeof protocolLiterals[number][]])
);

// Tipo TypeScript derivato dallo schema
export type TransmitAction = z.infer<typeof transmitActionSchema>;
