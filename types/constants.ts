export interface ProtocolParameter {
  name: string;
  label: string;
  type: "int" | "string" | "boolean" | "bytes" | "list";
  required: boolean;
  description?: string;
  validation?: RegExp;
  min?: number;
  max?: number;
  placeholder?: string;
  skip?: boolean;
}
