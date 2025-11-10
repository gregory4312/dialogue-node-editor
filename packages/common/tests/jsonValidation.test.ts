import fs from "fs";
import path from "path";
import Ajv from "ajv";
import { expect, test } from "vitest";
import strictSchema from "../schemas/dialogue.strict.schema.json";
import looseSchema from "../schemas/dialogue.loose.schema.json";

const ajv = new Ajv();

const strictValidate = ajv.compile(strictSchema);
const looseValidate = ajv.compile(looseSchema);

const extraDialoguePath = path.resolve(__dirname, "fixtures", "extraDialogue.json");
const validDialoguePath = path.resolve(__dirname, "fixtures", "validDialogue.json");
const invalidDialoguePath = path.resolve(__dirname, "fixtures", "invalidDialogue.json");
const extraDialogue = JSON.parse(fs.readFileSync(extraDialoguePath, "utf-8"));
const validDialogue = JSON.parse(fs.readFileSync(validDialoguePath, "utf-8"));
const invalidDialogue = JSON.parse(fs.readFileSync(invalidDialoguePath, "utf-8"));

test("validDialogue.json passes strict schema", () => {
  expect(strictValidate(validDialogue)).toBe(true);
});

test("invalidDialogue.json fails strict schema", () => {
  expect(strictValidate(invalidDialogue)).toBe(false);
});

test("extraDialogue.json passes loose schema", () => {
  expect(looseValidate(extraDialogue)).toBe(true);
});

test("extraDialogue.json fails strict schema", () => {
  expect(strictValidate(extraDialogue)).toBe(false);
});