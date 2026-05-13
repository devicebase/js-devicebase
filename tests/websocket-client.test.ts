import { describe, it, expect } from "vitest";
import { MinicapClient, MinitouchClient } from "../src/websocket-client.js";
import { AuthenticationError } from "../src/http-client.js";

describe("WebSocket clients", () => {
  describe("MinicapClient", () => {
    it("throws AuthenticationError without API key", () => {
      const orig = process.env.DEVICEBASE_API_KEY;
      delete process.env.DEVICEBASE_API_KEY;
      expect(
        () => new MinicapClient({ baseUrl: "http://localhost:9999", serial: "device123" })
      ).toThrow(AuthenticationError);
      process.env.DEVICEBASE_API_KEY = orig;
    });

    it("creates client with API key", () => {
      const client = new MinicapClient({
        baseUrl: "http://localhost:9999",
        serial: "device123",
        apiKey: "test-key",
      });
      expect(client).toBeDefined();
    });

    it("creates client with wss URL from https base", () => {
      const client = new MinicapClient({
        baseUrl: "https://api.devicebase.cn",
        serial: "device123",
        apiKey: "test-key",
      });
      expect(client).toBeDefined();
    });
  });

  describe("MinitouchClient", () => {
    it("throws AuthenticationError without API key", () => {
      const orig = process.env.DEVICEBASE_API_KEY;
      delete process.env.DEVICEBASE_API_KEY;
      expect(
        () => new MinitouchClient({ baseUrl: "http://localhost:9999", serial: "device123" })
      ).toThrow(AuthenticationError);
      process.env.DEVICEBASE_API_KEY = orig;
    });

    it("creates client with API key", () => {
      const client = new MinitouchClient({
        baseUrl: "http://localhost:9999",
        serial: "device123",
        apiKey: "test-key",
      });
      expect(client).toBeDefined();
    });

    it("throws when calling methods before connect", async () => {
      const client = new MinitouchClient({
        baseUrl: "http://localhost:9999",
        serial: "device123",
        apiKey: "test-key",
      });
      await expect(client.commit()).rejects.toThrow("WebSocket not connected");
    });
  });
});
