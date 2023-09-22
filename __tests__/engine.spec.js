//@ts-check
import fs from "fs";
import path from "path";
import { expect, describe, it, beforeAll } from "vitest";
import engine from "../src/engine";

const DATA_DIR = path.join(process.cwd(), "./__tests__/data");
const fullPath = path.join(DATA_DIR, "Elizabeth.txt");
const schemaFileContents = fs.readFileSync(fullPath, "utf8");

describe("engine", () => {
  it("should make sure schema Elizabeth.txt is not dodgy", () => {
    // basic sanity test
    expect(schemaFileContents).not.toBeNull();

    const lines = schemaFileContents.split("\n");
    expect(lines.length).toBe(41);
  });

  it("should return default messages if none supplied", () => {
    const data = engine.initialize("/ A schema with just a comment");
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
    const data = engine.initialize(schemaFileContents);

    expect(data).toHaveProperty("welcomeMessage");
    expect(data.welcomeMessage).toBe(
      "HELLO, I'M BETTY. WHAT WOULD YOU LIKE TO TALK ABOUT?"
    );
  });

  it("should return supplied VOID-RESPONSE message", () => {
    const data = engine.initialize(schemaFileContents);

    expect(data).toHaveProperty("voidResponseMessage");
    expect(data.voidResponseMessage).toBe(
      "CAN'T YOU THINK OF ANYTHING TO SAY?"
    );
  });

  it("should return supplied NOKEYWORD-RESPONSE message", () => {
    const data = engine.initialize(schemaFileContents);

    expect(data).toHaveProperty("noKeywordReponseMessage");
    expect(data.noKeywordReponseMessage).toBe("TELL ME WHAT YOU LIKE DOING.");
  });

  it("should return correct INPUTS from engine", () => {
    const data = engine.initialize(schemaFileContents);

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

  it("should return correct OUTPUTS from engine", () => {
    const data = engine.initialize(schemaFileContents);

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
