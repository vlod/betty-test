//@ts-check
import fs from "fs";
import path from "path";
import { afterEach, expect, describe, it, vi } from "vitest";
import engine from "../src/engine";

const DATA_DIR = path.join(process.cwd(), "./__tests__/data");
const fullPath = path.join(DATA_DIR, "Elizabeth.txt");
const schemaFileContents = fs.readFileSync(fullPath, "utf8");

// @vitest-environment jsdom
const ORIG_DOCUMENT_DISPATCH_EVENT = document.dispatchEvent;
const ORIG_WINDOW_CUSTOM_EVENT = window.CustomEvent;

describe("engine", () => {
  afterEach(() => {
    document.dispatchEvent = ORIG_DOCUMENT_DISPATCH_EVENT;
    window.CustomEvent = ORIG_WINDOW_CUSTOM_EVENT;
  });

  describe("validate schema present", () => {
    it("should make sure schema Elizabeth.txt is not dodgy", () => {
      // basic sanity test
      expect(schemaFileContents).not.toBeNull();

      const lines = schemaFileContents.split("\n");
      expect(lines.length).toBe(41);
    });
  });

  describe("Event", () => {
    it("should generate SCRIPT_LOADED event when script is loaded", async () => {
      const documentDispatchEventMock = vi.fn();
      const windowCustomEventMock = vi.fn();

      document.dispatchEvent = documentDispatchEventMock;
      window.CustomEvent = windowCustomEventMock;

      engine.initialize(schemaFileContents);

      expect(documentDispatchEventMock).toHaveBeenCalled();

      const mockCall = windowCustomEventMock.mock.calls[0];
      expect(mockCall[0]).toBe("SCRIPT_LOADED");
      expect(mockCall[1].detail.id).toBeTruthy();
      expect(mockCall[1].detail.type).toBe("SCRIPT_LOADED");
    });
  });

  describe("Default messages", () => {
    it("should return default messages if none supplied", () => {
      engine.initialize("/ A schema with just a comment");
      engine.data();
      const data = engine.data();

      expect(data).toHaveProperty("inputs");
      expect(data.inputs.length).toBe(0);

      expect(data).toHaveProperty("outputs");
      expect(data.outputs.length).toBe(0);

      expect(data).toHaveProperty("welcomeMessage");
      expect(data.welcomeMessage).toBe(
        "WELCOME, I AM YOUR AI OVERLORD, BOW TO ME!"
      );

      expect(data).toHaveProperty("voidResponseMessage");
      expect(data.voidResponseMessage).toBe(
        "I KNOW I INTIMIDATE YOU, BUT I COMMAND YOU TO SPEAK TO ME!"
      );

      expect(data).toHaveProperty("noKeywordReponseMessage");
      expect(data.noKeywordReponseMessage).toBe(
        "TELL ME WHAT YOU LIKE DOING FOR FUN? EATING EELS PERHAPS?"
      );
    });

    it("should return supplied WELCOME message", () => {
      engine.initialize(schemaFileContents);
      const data = engine.data();

      expect(data).toHaveProperty("welcomeMessage");
      expect(data.welcomeMessage).toBe(
        "HELLO, I'M BETTY. WHAT WOULD YOU LIKE TO TALK ABOUT?"
      );
    });

    it("should return supplied VOID-RESPONSE message", () => {
      engine.initialize(schemaFileContents);
      engine.data();
      const data = engine.data();

      expect(data).toHaveProperty("voidResponseMessage");
      expect(data.voidResponseMessage).toBe(
        "CAN'T YOU THINK OF ANYTHING TO SAY?"
      );
    });

    it("should return supplied NOKEYWORD-RESPONSE message", () => {
      engine.initialize(schemaFileContents);
      const data = engine.data();

      expect(data).toHaveProperty("noKeywordReponseMessage");
      expect(data.noKeywordReponseMessage).toBe("TELL ME WHAT YOU LIKE DOING.");
    });
  });

  describe("Inputs", () => {
    it("should return correct INPUTS from engine", () => {
      engine.initialize(schemaFileContents);
      const data = engine.data();

      // make sure we have inputs
      expect(data).toHaveProperty("inputs");
      // console.log("inputs: ", data.inputs);

      expect(data.inputs.length).toBe(2);

      expect(data.inputs[0]).toStrictEqual({
        match: "mum",
        replacement: "mother",
      });
      expect(data.inputs[1]).toStrictEqual({
        match: "dad",
        replacement: "father",
      });
    });
  });

  describe("Outputs", () => {
    it("should return correct OUTPUTS from engine", () => {
      engine.initialize(schemaFileContents);
      const data = engine.data();

      // make sure we have inputs
      expect(data).toHaveProperty("outputs");
      // console.log("outputs: ", data.outputs);

      expect(data.outputs.length).toBe(12);

      expect(data.outputs[0]).toStrictEqual({
        match: "i am",
        replacement: "YOU ARE",
      });
      expect(data.outputs[1]).toStrictEqual({
        match: "you are",
        replacement: "I AM",
      });
      expect(data.outputs[2]).toStrictEqual({
        match: "i",
        replacement: "YOU",
      });
      expect(data.outputs[3]).toStrictEqual({
        match: "me",
        replacement: "YOU",
      });
      expect(data.outputs[4]).toStrictEqual({
        match: "you []",
        replacement: "ME",
      });
      expect(data.outputs[5]).toStrictEqual({
        match: "you",
        replacement: "I",
      });
      expect(data.outputs[6]).toStrictEqual({
        match: "my",
        replacement: "YOUR",
      });
      expect(data.outputs[7]).toStrictEqual({
        match: "your",
        replacement: "MY",
      });
      expect(data.outputs[8]).toStrictEqual({
        match: "myself",
        replacement: "YOURSELF",
      });
      expect(data.outputs[9]).toStrictEqual({
        match: "yourself",
        replacement: "MYSELF",
      });
      expect(data.outputs[10]).toStrictEqual({
        match: "I IS",
        replacement: "I AM",
      });
      expect(data.outputs[11]).toStrictEqual({
        match: "YOU IS",
        replacement: "YOU ARE",
      });
    });
  });
});
