import { Result } from "./results";

export type Json =
  | null
  | boolean
  | number
  | string
  | Json[]
  | { [key: string]: Json };

export type ReadonlyJson =
  | null
  | boolean
  | number
  | string
  | readonly ReadonlyJson[]
  | { readonly [key: string]: ReadonlyJson };

export function isJson(value: unknown): value is Json {
  switch (typeof value) {
    case "object": {
      if (value === null) return true;
      if (Array.isArray(value)) return value.every(isJson);
      return Object.keys(value).every(k => typeof k === "string") && Object.values(value).every(isJson);
    }
    case "string":
    case "number":
    case "boolean": {
      return true;
    }
    default: {
      return false;
    }
  }
}
import.meta.vitest?.test("isJson", ({ expect }) => {
  // Test primitive values
  expect(isJson(null)).toBe(true);
  expect(isJson(true)).toBe(true);
  expect(isJson(false)).toBe(true);
  expect(isJson(123)).toBe(true);
  expect(isJson("string")).toBe(true);
  
  // Test arrays
  expect(isJson([])).toBe(true);
  expect(isJson([1, 2, 3])).toBe(true);
  expect(isJson(["a", "b", "c"])).toBe(true);
  expect(isJson([1, "a", true, null])).toBe(true);
  expect(isJson([1, [2, 3], { a: "b" }])).toBe(true);
  
  // Test objects
  expect(isJson({})).toBe(true);
  expect(isJson({ a: 1, b: 2 })).toBe(true);
  expect(isJson({ a: "string", b: true, c: null })).toBe(true);
  expect(isJson({ a: [1, 2, 3], b: { c: "d" } })).toBe(true);
  
  // Test invalid JSON values
  expect(isJson(undefined)).toBe(false);
  expect(isJson(() => {})).toBe(false);
  expect(isJson(Symbol())).toBe(false);
  expect(isJson(BigInt(123))).toBe(false);
  
  // Test arrays with invalid JSON values
  expect(isJson([1, undefined, 3])).toBe(false);
  expect(isJson([1, () => {}, 3])).toBe(false);
  
  // Test objects with invalid JSON values
  expect(isJson({ a: 1, b: undefined })).toBe(false);
  expect(isJson({ a: 1, b: () => {} })).toBe(false);
});

export function parseJson(json: string): Result<Json> {
  return Result.fromThrowing(() => JSON.parse(json));
}
import.meta.vitest?.test("parseJson", ({ expect }) => {
  // Test valid JSON strings
  expect(parseJson("null").status).toBe("ok");
  expect(parseJson("null").data).toBe(null);
  
  expect(parseJson("true").status).toBe("ok");
  expect(parseJson("true").data).toBe(true);
  
  expect(parseJson("123").status).toBe("ok");
  expect(parseJson("123").data).toBe(123);
  
  expect(parseJson('"string"').status).toBe("ok");
  expect(parseJson('"string"').data).toBe("string");
  
  expect(parseJson("[]").status).toBe("ok");
  expect(parseJson("[]").data).toEqual([]);
  
  expect(parseJson("[1,2,3]").status).toBe("ok");
  expect(parseJson("[1,2,3]").data).toEqual([1, 2, 3]);
  
  expect(parseJson("{}").status).toBe("ok");
  expect(parseJson("{}").data).toEqual({});
  
  expect(parseJson('{"a":1,"b":"string"}').status).toBe("ok");
  expect(parseJson('{"a":1,"b":"string"}').data).toEqual({ a: 1, b: "string" });
  
  // Test invalid JSON strings
  expect(parseJson("").status).toBe("error");
  expect(parseJson("undefined").status).toBe("error");
  expect(parseJson("{").status).toBe("error");
  expect(parseJson('{"a":1,}').status).toBe("error");
  expect(parseJson("function(){}").status).toBe("error");
});

export function stringifyJson(json: Json): Result<string> {
  return Result.fromThrowing(() => JSON.stringify(json));
}
import.meta.vitest?.test("stringifyJson", ({ expect }) => {
  // Test primitive values
  expect(stringifyJson(null).status).toBe("ok");
  expect(stringifyJson(null).data).toBe("null");
  
  expect(stringifyJson(true).status).toBe("ok");
  expect(stringifyJson(true).data).toBe("true");
  
  expect(stringifyJson(123).status).toBe("ok");
  expect(stringifyJson(123).data).toBe("123");
  
  expect(stringifyJson("string").status).toBe("ok");
  expect(stringifyJson("string").data).toBe('"string"');
  
  // Test arrays
  expect(stringifyJson([]).status).toBe("ok");
  expect(stringifyJson([]).data).toBe("[]");
  
  expect(stringifyJson([1, 2, 3]).status).toBe("ok");
  expect(stringifyJson([1, 2, 3]).data).toBe("[1,2,3]");
  
  // Test objects
  expect(stringifyJson({}).status).toBe("ok");
  expect(stringifyJson({}).data).toBe("{}");
  
  expect(stringifyJson({ a: 1, b: "string" }).status).toBe("ok");
  expect(stringifyJson({ a: 1, b: "string" }).data).toBe('{"a":1,"b":"string"}');
  
  // Test nested structures
  const nested = { a: [1, 2, 3], b: { c: "d" } };
  expect(stringifyJson(nested).status).toBe("ok");
  expect(stringifyJson(nested).data).toBe('{"a":[1,2,3],"b":{"c":"d"}}');
  
  // Test circular references (should error)
  const circular: any = { a: 1 };
  circular.self = circular;
  expect(stringifyJson(circular).status).toBe("error");
});
