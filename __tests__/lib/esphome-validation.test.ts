import { transmitActionSchema } from '@/lib/esphome-validation';

describe('ESPHome Transmit Action Validation', () => {
  describe('NEC Protocol', () => {
    it('should validate valid NEC parameters', () => {
      const validData = {
        protocol: 'nec',
        params: {
          address: 0x1234,
          command: 0x5678,
          command_repeats: 1,
        },
      };

      expect(() => transmitActionSchema.parse(validData)).not.toThrow();
    });

    it('should reject NEC with invalid address range', () => {
      const invalidData = {
        protocol: 'nec',
        params: {
          address: 0x10000, // > 0xFFFF
          command: 0x5678,
        },
      };

      expect(() => transmitActionSchema.parse(invalidData)).toThrow();
    });

    it('should reject NEC with non-integer values', () => {
      const invalidData = {
        protocol: 'nec',
        params: {
          address: 1.5,
          command: 0x5678,
        },
      };

      expect(() => transmitActionSchema.parse(invalidData)).toThrow();
    });
  });

  describe('Samsung Protocol', () => {
    it('should validate valid Samsung parameters', () => {
      const validData = {
        protocol: 'samsung',
        params: {
          data: 0x12345678,
          nbits: 32,
        },
      };

      expect(() => transmitActionSchema.parse(validData)).not.toThrow();
    });

    it('should validate Samsung with optional nbits omitted', () => {
      const validData = {
        protocol: 'samsung',
        params: {
          data: 0x12345678,
        },
      };

      expect(() => transmitActionSchema.parse(validData)).not.toThrow();
    });

    it('should reject Samsung with invalid nbits range', () => {
      const invalidData = {
        protocol: 'samsung',
        params: {
          data: 0x12345678,
          nbits: 70, // > 64
        },
      };

      expect(() => transmitActionSchema.parse(invalidData)).toThrow();
    });
  });

  describe('Sony Protocol', () => {
    it('should validate valid Sony parameters', () => {
      const validData = {
        protocol: 'sony',
        params: {
          data: 0x1234,
          nbits: 12,
        },
      };

      expect(() => transmitActionSchema.parse(validData)).not.toThrow();
    });

    it('should reject Sony with invalid data range', () => {
      const invalidData = {
        protocol: 'sony',
        params: {
          data: 0x100000000, // > 0xFFFFFFFF
          nbits: 12,
        },
      };

      expect(() => transmitActionSchema.parse(invalidData)).toThrow();
    });
  });

  describe('LG Protocol', () => {
    it('should validate valid LG parameters', () => {
      const validData = {
        protocol: 'lg',
        params: {
          data: 0x12345678,
          nbits: 28,
        },
      };

      expect(() => transmitActionSchema.parse(validData)).not.toThrow();
    });
  });

  describe('Panasonic Protocol', () => {
    it('should validate valid Panasonic parameters', () => {
      const validData = {
        protocol: 'panasonic',
        params: {
          address: 0x1234,
          command: 0x5678,
        },
      };

      expect(() => transmitActionSchema.parse(validData)).not.toThrow();
    });
  });

  describe('RC5 Protocol', () => {
    it('should validate valid RC5 parameters', () => {
      const validData = {
        protocol: 'rc5',
        params: {
          address: 5,
          command: 10,
        },
      };

      expect(() => transmitActionSchema.parse(validData)).not.toThrow();
    });

    it('should reject RC5 with address out of range', () => {
      const invalidData = {
        protocol: 'rc5',
        params: {
          address: 32, // > 31
          command: 10,
        },
      };

      expect(() => transmitActionSchema.parse(invalidData)).toThrow();
    });
  });

  describe('RC6 Protocol', () => {
    it('should validate valid RC6 parameters', () => {
      const validData = {
        protocol: 'rc6',
        params: {
          address: 0x1234,
          command: 0x5678,
        },
      };

      expect(() => transmitActionSchema.parse(validData)).not.toThrow();
    });
  });

  describe('JVC Protocol', () => {
    it('should validate valid JVC parameters', () => {
      const validData = {
        protocol: 'jvc',
        params: {
          data: 0x1234,
        },
      };

      expect(() => transmitActionSchema.parse(validData)).not.toThrow();
    });
  });

  describe('Pioneer Protocol', () => {
    it('should validate valid Pioneer parameters', () => {
      const validData = {
        protocol: 'pioneer',
        params: {
          rc_code_1: 0x12345678,
          rc_code_2: 0x5678,
        },
      };

      expect(() => transmitActionSchema.parse(validData)).not.toThrow();
    });
  });

  describe('Coolix Protocol', () => {
    it('should validate valid Coolix parameters', () => {
      const validData = {
        protocol: 'coolix',
        params: {
          first: 0x123456,
          second: 0x789ABC,
        },
      };

      expect(() => transmitActionSchema.parse(validData)).not.toThrow();
    });
  });

  describe('Midea Protocol', () => {
    it('should validate valid Midea parameters', () => {
      const validData = {
        protocol: 'midea',
        params: {
          code: [0xA1, 0xB2, 0xC3, 0xD4, 0xE5],
        },
      };

      expect(() => transmitActionSchema.parse(validData)).not.toThrow();
    });

    it('should reject Midea with wrong array length', () => {
      const invalidData = {
        protocol: 'midea',
        params: {
          code: [0xA1, 0xB2, 0xC3, 0xD4], // 4 elements instead of 5
        },
      };

      expect(() => transmitActionSchema.parse(invalidData)).toThrow();
    });
  });

  describe('Haier Protocol', () => {
    it('should validate valid Haier parameters', () => {
      const validData = {
        protocol: 'haier',
        params: {
          code: Array.from({ length: 13 }, (_, i) => i), // 13 bytes
        },
      };

      expect(() => transmitActionSchema.parse(validData)).not.toThrow();
    });
  });

  describe('Toshiba AC Protocol', () => {
    it('should validate valid Toshiba AC parameters', () => {
      const validData = {
        protocol: 'toshiba_ac',
        params: {
          rc_code_1: 0x123456789ABC,
          rc_code_2: 0xFEDCBA987654,
        },
      };

      expect(() => transmitActionSchema.parse(validData)).not.toThrow();
    });
  });

  describe('Mirage Protocol', () => {
    it('should validate valid Mirage parameters', () => {
      const validData = {
        protocol: 'mirage',
        params: {
          code: Array.from({ length: 14 }, (_, i) => i), // 14 bytes
        },
      };

      expect(() => transmitActionSchema.parse(validData)).not.toThrow();
    });
  });

  describe('Dish Protocol', () => {
    it('should validate valid Dish parameters', () => {
      const validData = {
        protocol: 'dish',
        params: {
          address: 5,
          command: 10,
        },
      };

      expect(() => transmitActionSchema.parse(validData)).not.toThrow();
    });

    it('should reject Dish with invalid address range', () => {
      const invalidData = {
        protocol: 'dish',
        params: {
          address: 20, // > 16
          command: 10,
        },
      };

      expect(() => transmitActionSchema.parse(invalidData)).toThrow();
    });
  });

  describe('Pronto Protocol', () => {
    it('should validate valid Pronto parameters', () => {
      const validData = {
        protocol: 'pronto',
        params: {
          data: '0000 0067 0000 0015 0060 0018 0018 0018 0030 0018 0030 0018 0030 0018 0018 0018 0030 0018 0018 0018 0018 0018 0030 0018 0018 0018 0030 0018 0030 0018 0030 0018 0018 03f6',
        },
      };

      expect(() => transmitActionSchema.parse(validData)).not.toThrow();
    });

    it('should reject Pronto with invalid hex characters', () => {
      const invalidData = {
        protocol: 'pronto',
        params: {
          data: 'gggg hhhh', // invalid hex
        },
      };

      expect(() => transmitActionSchema.parse(invalidData)).toThrow();
    });
  });

  describe('Raw Protocol', () => {
    it('should validate valid Raw parameters', () => {
      const validData = {
        protocol: 'raw',
        params: {
          code: [100, -50, 200, -100], // positive ON, negative OFF
        },
      };

      expect(() => transmitActionSchema.parse(validData)).not.toThrow();
    });
  });

  describe('AEHA Protocol', () => {
    it('should validate valid AEHA parameters', () => {
      const validData = {
        protocol: 'aeha',
        params: {
          address: 0x1234,
          data: [0xA1, 0xB2, 0xC3],
        },
      };

      expect(() => transmitActionSchema.parse(validData)).not.toThrow();
    });

    it('should reject AEHA with too few data bytes', () => {
      const invalidData = {
        protocol: 'aeha',
        params: {
          address: 0x1234,
          data: [], // < 2
        },
      };

      expect(() => transmitActionSchema.parse(invalidData)).toThrow();
    });
  });

  describe('B&O Beo4 Protocol', () => {
    it('should validate valid Beo4 parameters', () => {
      const validData = {
        protocol: 'beo4',
        params: {
          source: 5,
          command: 10,
        },
      };

      expect(() => transmitActionSchema.parse(validData)).not.toThrow();
    });
  });

  describe('Byron SX Protocol', () => {
    it('should validate valid Byron SX parameters', () => {
      const validData = {
        protocol: 'byronsx',
        params: {
          address: 0x12,
          command: 0x34,
        },
      };

      expect(() => transmitActionSchema.parse(validData)).not.toThrow();
    });
  });

  describe('CanalSat Protocol', () => {
    it('should validate valid CanalSat parameters', () => {
      const validData = {
        protocol: 'canalsat',
        params: {
          device: 5,
          address: 10,
          command: 15,
        },
      };

      expect(() => transmitActionSchema.parse(validData)).not.toThrow();
    });
  });

  describe('Dooya Protocol', () => {
    it('should validate valid Dooya parameters', () => {
      const validData = {
        protocol: 'dooya',
        params: {
          id: 0x123456,
          channel: 5,
          button: 3,
          check: 7,
        },
      };

      expect(() => transmitActionSchema.parse(validData)).not.toThrow();
    });

    it('should reject Dooya with invalid button range', () => {
      const invalidData = {
        protocol: 'dooya',
        params: {
          id: 0x123456,
          channel: 5,
          button: 20, // > 15
          check: 7,
        },
      };

      expect(() => transmitActionSchema.parse(invalidData)).toThrow();
    });
  });

  describe('Drayton Protocol', () => {
    it('should validate valid Drayton parameters', () => {
      const validData = {
        protocol: 'drayton',
        params: {
          address: 0x1234,
          channel: 10,
          command: 5,
        },
      };

      expect(() => transmitActionSchema.parse(validData)).not.toThrow();
    });
  });

  describe('Go-Box Protocol', () => {
    it('should validate valid Go-Box parameters', () => {
      const validData = {
        protocol: 'gobox',
        params: {
          code: 0x1234,
        },
      };

      expect(() => transmitActionSchema.parse(validData)).not.toThrow();
    });
  });

  describe('KeeLoq Protocol', () => {
    it('should validate valid KeeLoq parameters', () => {
      const validData = {
        protocol: 'keeloq',
        params: {
          address: 0x12345678,
          command: 5,
          code: 0x9ABCDEF0,
          level: true,
        },
      };

      expect(() => transmitActionSchema.parse(validData)).not.toThrow();
    });
  });

  describe('MagiQuest Protocol', () => {
    it('should validate valid MagiQuest parameters', () => {
      const validData = {
        protocol: 'magiquest',
        params: {
          wand_id: 0x12345678,
          magnitude: 1000,
        },
      };

      expect(() => transmitActionSchema.parse(validData)).not.toThrow();
    });
  });

  describe('Nexa Protocol', () => {
    it('should validate valid Nexa parameters', () => {
      const validData = {
        protocol: 'nexa',
        params: {
          device: 0x123456,
          state: 1,
          group: 5,
          channel: 10,
          level: 15,
        },
      };

      expect(() => transmitActionSchema.parse(validData)).not.toThrow();
    });

    it('should reject Nexa with invalid state', () => {
      const invalidData = {
        protocol: 'nexa',
        params: {
          device: 0x123456,
          state: 3, // > 2
          group: 5,
          channel: 10,
          level: 15,
        },
      };

      expect(() => transmitActionSchema.parse(invalidData)).toThrow();
    });
  });

  describe('Roomba Protocol', () => {
    it('should validate valid Roomba parameters', () => {
      const validData = {
        protocol: 'roomba',
        params: {
          data: 0x12,
        },
      };

      expect(() => transmitActionSchema.parse(validData)).not.toThrow();
    });
  });

  describe('Toto Protocol', () => {
    it('should validate valid Toto parameters', () => {
      const validData = {
        protocol: 'toto',
        params: {
          command: 0x12,
          rc_code_1: 5,
          rc_code_2: 10,
        },
      };

      expect(() => transmitActionSchema.parse(validData)).not.toThrow();
    });
  });

  describe('ABB Welcome Protocol', () => {
    it('should validate valid ABB Welcome parameters', () => {
      const validData = {
        protocol: 'abbwelcome',
        params: {
          source_address: 0x1234,
          destination_address: 0x5678,
          three_byte_address: false,
          retransmission: true,
          message_type: 5,
          message_id: 10,
          data: [1, 2, 3],
        },
      };

      expect(() => transmitActionSchema.parse(validData)).not.toThrow();
    });
  });

  describe('RC Switch Raw Protocol', () => {
    it('should validate valid RC Switch Raw parameters', () => {
      const validData = {
        protocol: 'rc_switch_raw',
        params: {
          code: '0101010101',
        },
      };

      expect(() => transmitActionSchema.parse(validData)).not.toThrow();
    });

    it('should reject RC Switch Raw with invalid characters', () => {
      const invalidData = {
        protocol: 'rc_switch_raw',
        params: {
          code: '01230123', // contains 2 and 3
        },
      };

      expect(() => transmitActionSchema.parse(invalidData)).toThrow();
    });
  });

  describe('RC Switch Type A Protocol', () => {
    it('should validate valid RC Switch Type A parameters', () => {
      const validData = {
        protocol: 'rc_switch_type_a',
        params: {
          group: '01010',
          device: '10101',
          state: true,
        },
      };

      expect(() => transmitActionSchema.parse(validData)).not.toThrow();
    });
  });

  describe('RC Switch Type B Protocol', () => {
    it('should validate valid RC Switch Type B parameters', () => {
      const validData = {
        protocol: 'rc_switch_type_b',
        params: {
          address: 5,
          channel: 10,
          state: false,
        },
      };

      expect(() => transmitActionSchema.parse(validData)).not.toThrow();
    });
  });

  describe('RC Switch Type C Protocol', () => {
    it('should validate valid RC Switch Type C parameters', () => {
      const validData = {
        protocol: 'rc_switch_type_c',
        params: {
          family: 'a',
          group: 2,
          device: 3,
          state: true,
        },
      };

      expect(() => transmitActionSchema.parse(validData)).not.toThrow();
    });

    it('should reject RC Switch Type C with invalid family', () => {
      const invalidData = {
        protocol: 'rc_switch_type_c',
        params: {
          family: 'z', // not a-p
          group: 2,
          device: 3,
          state: true,
        },
      };

      expect(() => transmitActionSchema.parse(invalidData)).toThrow();
    });
  });

  describe('RC Switch Type D Protocol', () => {
    it('should validate valid RC Switch Type D parameters', () => {
      const validData = {
        protocol: 'rc_switch_type_d',
        params: {
          group: 2,
          device: 2,
          state: false,
        },
      };

      expect(() => transmitActionSchema.parse(validData)).not.toThrow();
    });
  });

  describe('Protocol Case Insensitivity', () => {
    it('should accept uppercase protocol names', () => {
      const validData = {
        protocol: 'NEC', // uppercase
        params: {
          address: 0x1234,
          command: 0x5678,
        },
      };

      expect(() => transmitActionSchema.parse(validData)).not.toThrow();
    });
  });

  describe('Invalid Protocol', () => {
    it('should reject unknown protocols', () => {
      const invalidData = {
        protocol: 'unknown',
        params: {},
      };

      expect(() => transmitActionSchema.parse(invalidData)).toThrow();
    });
  });
});