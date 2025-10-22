import { z } from "zod";

export const codeSchema = z.object({
  name: z.string().trim().min(1, "Code name is required"),
  code: z.string().trim().min(1, "Code value is required"),
});

export const deviceSchema = z.object({
  name: z.string().trim().min(1, "Device name is required"),
  manufacturer: z.string().trim().min(1, "Manufacturer is required"),
  deviceType: z.string().trim().min(1, "Device type is required"),
  model: z.string().trim().optional(),
  notes: z.string().trim().optional(),
  codes: z.array(codeSchema).min(1, "At least one remote code is required"),
});
