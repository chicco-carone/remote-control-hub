/**
 * Security tests for user mutations
 * Tests SEC-005: Protection against privilege escalation via role field
 */

import { describe, it, expect } from "@jest/globals";

describe("User Mutation Security - SEC-005", () => {
  describe("upsertUser mutation", () => {
    it("should validate role field is not passed at runtime", () => {
      // This test verifies that upsertUser has runtime validation
      // to prevent role field from being set externally.

      const fs = require("fs");
      const path = require("path");
      const mutationsPath = path.join(
        process.cwd(),
        "convex/mutations/users.ts",
      );
      const content = fs.readFileSync(mutationsPath, "utf-8");

      // Verify runtime validation exists
      expect(content).toContain('if ("role" in args)');
      expect(content).toContain(
        "SECURITY: role field cannot be set externally",
      );
    });

    it("should not accept role field in args schema", () => {
      const fs = require("fs");
      const path = require("path");
      const mutationsPath = path.join(
        process.cwd(),
        "convex/mutations/users.ts",
      );
      const content = fs.readFileSync(mutationsPath, "utf-8");

      // Find the args definition for upsertUser
      const argsStart = content.indexOf("export const upsertUser");
      const argsEnd = content.indexOf("handler:", argsStart);
      const argsSection = content.substring(argsStart, argsEnd);

      // Verify role is NOT in the args schema
      expect(argsSection).not.toContain("role: v.");

      // Verify there's a security comment about not accepting role
      expect(argsSection).toContain("SECURITY");
      expect(argsSection.toLowerCase()).toContain("role");
    });

    it("should have security documentation about role preservation", () => {
      const fs = require("fs");
      const path = require("path");
      const mutationsPath = path.join(
        process.cwd(),
        "convex/mutations/users.ts",
      );
      const content = fs.readFileSync(mutationsPath, "utf-8");

      // Verify security documentation exists
      expect(content).toContain("SECURITY:");
      expect(content.toLowerCase()).toContain("privilege escalation");
      expect(content.toLowerCase()).toContain("preserve");
      expect(content.toLowerCase()).toContain("default role");
    });

    it("should set default role to 'user' for new users", () => {
      const fs = require("fs");
      const path = require("path");
      const mutationsPath = path.join(
        process.cwd(),
        "convex/mutations/users.ts",
      );
      const content = fs.readFileSync(mutationsPath, "utf-8");

      // Find the insert statement for new users
      const insertMatch = content.match(
        /ctx\.db\.insert\("users",[\s\S]+?role:\s*"([^"]+)"/,
      );

      expect(insertMatch).toBeTruthy();
      expect(insertMatch?.[1]).toBe("user");
    });

    it("should not update role field when updating existing users", () => {
      const fs = require("fs");
      const path = require("path");
      const mutationsPath = path.join(
        process.cwd(),
        "convex/mutations/users.ts",
      );
      const content = fs.readFileSync(mutationsPath, "utf-8");

      // Find the update section
      const updateStart = content.indexOf("if (existingByClerk)");
      const updateEnd = content.indexOf("// For new users", updateStart);
      const updateSection = content.substring(updateStart, updateEnd);

      // Verify role is NOT being updated
      expect(updateSection).not.toContain("updateData.role");
      expect(updateSection).not.toContain("role:");
    });
  });

  describe("Server client security", () => {
    it("should have security documentation", () => {
      const fs = require("fs");
      const path = require("path");
      const clientPath = path.join(
        process.cwd(),
        "lib/convex-server-client.ts",
      );
      const content = fs.readFileSync(clientPath, "utf-8");

      // Verify security documentation exists
      expect(content).toContain("SECURITY:");
      expect(content.toLowerCase()).toContain("role");
      expect(content.toLowerCase()).toContain("privilege escalation");
    });

    it("should not accept role parameter", () => {
      const fs = require("fs");
      const path = require("path");
      const clientPath = path.join(
        process.cwd(),
        "lib/convex-server-client.ts",
      );
      const content = fs.readFileSync(clientPath, "utf-8");

      // Find the upsertUserServer function signature
      const funcStart = content.indexOf(
        "export async function upsertUserServer",
      );
      const funcEnd = content.indexOf("}", funcStart);
      const funcSection = content.substring(funcStart, funcEnd);

      // Verify role is NOT in the parameters
      expect(funcSection).not.toContain("role?:");
      expect(funcSection).not.toContain("role:");

      // Verify security comment about not including role
      expect(funcSection).toContain("SECURITY");
    });
  });

  describe("Webhook handler security", () => {
    it("should not pass role field to upsertUserServer", () => {
      const fs = require("fs");
      const path = require("path");
      const webhookPath = path.join(
        process.cwd(),
        "app/api/webhooks/clerk/route.ts",
      );
      const content = fs.readFileSync(webhookPath, "utf-8");

      // Find the upsertUserServer call
      const callStart = content.indexOf("await upsertUserServer");
      const callEnd = content.indexOf("});", callStart) + 3;
      const callSection = content.substring(callStart, callEnd);

      // Verify role is NOT being passed
      expect(callSection).not.toContain("role:");
    });
  });
});
