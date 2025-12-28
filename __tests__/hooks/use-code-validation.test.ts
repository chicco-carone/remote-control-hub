import { validateCode, validateParameter } from "@/hooks/use-code-validation";
import { ESPHomeCode } from "@/types/form";

describe("useCodeValidation", () => {
  describe("validateCode", () => {
    it("should validate a valid NEC code", () => {
      const code: ESPHomeCode = {
        name: "Power",
        protocol: "nec",
        parameters: {
          address: "0x1234",
          command: "0x5678",
        },
      };

      const result = validateCode(code);
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual({});
    });

    it("should reject code with empty name", () => {
      const code: ESPHomeCode = {
        name: "",
        protocol: "nec",
        parameters: {
          address: "0x1234",
          command: "0x5678",
        },
      };

      const result = validateCode(code);
      expect(result.isValid).toBe(false);
      expect(result.errors.name).toBeDefined();
    });

    it("should reject NEC code with invalid address range", () => {
      const code: ESPHomeCode = {
        name: "Power",
        protocol: "nec",
        parameters: {
          address: "0x10000", // > 0xFFFF
          command: "0x5678",
        },
      };

      const result = validateCode(code);
      expect(result.isValid).toBe(false);
      expect(result.errors.parameters).toBeDefined();
      expect(result.errors.parameters?.address).toBeDefined();
    });

    it("should validate Samsung code with nbits", () => {
      const code: ESPHomeCode = {
        name: "Power",
        protocol: "samsung",
        parameters: {
          data: "0x12345678",
          nbits: "32",
        },
      };

      const result = validateCode(code);
      expect(result.isValid).toBe(true);
    });

    it("should validate array parameters (Midea)", () => {
      const code: ESPHomeCode = {
        name: "Power",
        protocol: "midea",
        parameters: {
          code: "[0xA1, 0xB2, 0xC3, 0xD4, 0xE5]",
        },
      };

      const result = validateCode(code);
      expect(result.isValid).toBe(true);
    });

    it("should reject Midea code with wrong array length", () => {
      const code: ESPHomeCode = {
        name: "Power",
        protocol: "midea",
        parameters: {
          code: "[0xA1, 0xB2, 0xC3]", // Only 3 elements instead of 5
        },
      };

      const result = validateCode(code);
      expect(result.isValid).toBe(false);
      expect(result.errors.parameters?.code).toBeDefined();
    });

    it("should validate RC5 code with proper ranges", () => {
      const code: ESPHomeCode = {
        name: "Power",
        protocol: "rc5",
        parameters: {
          address: "5",
          command: "10",
        },
      };

      const result = validateCode(code);
      expect(result.isValid).toBe(true);
    });

    it("should reject RC5 code with address out of range", () => {
      const code: ESPHomeCode = {
        name: "Power",
        protocol: "rc5",
        parameters: {
          address: "32", // > 31
          command: "10",
        },
      };

      const result = validateCode(code);
      expect(result.isValid).toBe(false);
      expect(result.errors.parameters?.address).toBeDefined();
    });
  });

  describe("validateParameter", () => {
    it("should validate single parameter", () => {
      const error = validateParameter(
        "nec",
        "address",
        "0x1234",
        { address: "0x1234", command: "0x5678" }
      );

      expect(error).toBeUndefined();
    });

    it("should detect invalid parameter value", () => {
      const error = validateParameter(
        "nec",
        "address",
        "0x10000", // > 0xFFFF
        { address: "0x10000", command: "0x5678" }
      );

      expect(error).toBeDefined();
    });

    it("should validate parameter with empty protocol", () => {
      const error = validateParameter(
        "",
        "address",
        "0x1234",
        { address: "0x1234" }
      );

      expect(error).toBeUndefined();
    });
  });
});
