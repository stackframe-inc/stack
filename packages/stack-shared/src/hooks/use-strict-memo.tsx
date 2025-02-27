import { useId, useInsertionEffect, useMemo } from "react";
import { Result } from "../utils/results";

type CacheInner = Map<unknown, CacheInner> | WeakMap<WeakKey, CacheInner> | { isNotNestedMap: true, value: any };

const cached = new Map<string, CacheInner>();

function unwrapFromInner(dependencies: any[], inner: CacheInner): Result<any, void> {
  if ((dependencies.length === 0) !== ("isNotNestedMap" in inner)) {
    return Result.error(undefined);
  }
  if ("isNotNestedMap" in inner) {
    if (dependencies.length === 0) {
      return Result.ok(inner.value);
    } else {
      return Result.error(undefined);
    }
  } else {
    if (dependencies.length === 0) {
      return Result.error(undefined);
    } else {
      const [key, ...rest] = dependencies;
      const newInner = inner.get(key);
      if (!newInner) {
        return Result.error(undefined);
      }
      return unwrapFromInner(rest, newInner);
    }
  }
}
import.meta.vitest?.test("unwrapFromInner", ({ expect }) => {
  // Test with empty dependencies and non-nested map
  const nonNestedMap = { isNotNestedMap: true, value: "test" };
  expect(unwrapFromInner([], nonNestedMap).status).toBe("ok");
  expect(unwrapFromInner([], nonNestedMap).data).toBe("test");
  
  // Test with non-empty dependencies and non-nested map (should error)
  expect(unwrapFromInner(["key"], nonNestedMap).status).toBe("error");
  
  // Test with empty dependencies and nested map (should error)
  const nestedMap = new Map([["key", { isNotNestedMap: true, value: "test" }]]);
  expect(unwrapFromInner([], nestedMap).status).toBe("error");
  
  // Test with matching dependencies and nested map
  expect(unwrapFromInner(["key"], nestedMap).status).toBe("ok");
  expect(unwrapFromInner(["key"], nestedMap).data).toBe("test");
  
  // Test with non-matching dependencies and nested map
  expect(unwrapFromInner(["wrongKey"], nestedMap).status).toBe("error");
  
  // Test with deeply nested map
  const deeplyNestedMap = new Map([
    ["key1", new Map([
      ["key2", { isNotNestedMap: true, value: "nested" }]
    ])]
  ]);
  expect(unwrapFromInner(["key1", "key2"], deeplyNestedMap).status).toBe("ok");
  expect(unwrapFromInner(["key1", "key2"], deeplyNestedMap).data).toBe("nested");
  
  // Test with partial match in deeply nested map
  expect(unwrapFromInner(["key1", "wrongKey"], deeplyNestedMap).status).toBe("error");
});

function wrapToInner(dependencies: any[], value: any): CacheInner {
  if (dependencies.length === 0) {
    return { isNotNestedMap: true, value };
  }
  const [key, ...rest] = dependencies;
  const inner = wrapToInner(rest, value);

  const isObject = (typeof key === "object" && key !== null);
  const isUnregisteredSymbol = (typeof key === "symbol" && Symbol.keyFor(key) === undefined);
  const isWeak = isObject || isUnregisteredSymbol;
  const mapType = isWeak ? WeakMap : Map;

  return new mapType([[key, inner]]);
}
import.meta.vitest?.test("wrapToInner", ({ expect }) => {
  // Test with empty dependencies
  const emptyResult = wrapToInner([], "test");
  expect(emptyResult).toEqual({ isNotNestedMap: true, value: "test" });
  
  // Test with single string dependency
  const singleResult = wrapToInner(["key"], "test");
  expect(singleResult instanceof Map).toBe(true);
  expect(singleResult.get("key")).toEqual({ isNotNestedMap: true, value: "test" });
  
  // Test with multiple string dependencies
  const multiResult = wrapToInner(["key1", "key2"], "test");
  expect(multiResult instanceof Map).toBe(true);
  const innerMap = multiResult.get("key1");
  expect(innerMap instanceof Map).toBe(true);
  expect(innerMap.get("key2")).toEqual({ isNotNestedMap: true, value: "test" });
  
  // Test with object dependency (should use WeakMap)
  const obj = { test: true };
  const objResult = wrapToInner([obj], "test");
  expect(objResult instanceof WeakMap).toBe(true);
  expect(objResult.get(obj)).toEqual({ isNotNestedMap: true, value: "test" });
  
  // Test with unregistered symbol dependency (should use WeakMap)
  const symbol = Symbol("test");
  const symbolResult = wrapToInner([symbol], "test");
  expect(symbolResult instanceof WeakMap).toBe(true);
  expect(symbolResult.get(symbol)).toEqual({ isNotNestedMap: true, value: "test" });
  
  // Test with registered symbol dependency (should use Map)
  const registeredSymbol = Symbol.for("test");
  const registeredSymbolResult = wrapToInner([registeredSymbol], "test");
  expect(registeredSymbolResult instanceof Map).toBe(true);
  expect(registeredSymbolResult.get(registeredSymbol)).toEqual({ isNotNestedMap: true, value: "test" });
});

/**
 * Like memo, but minimizes recomputation of the value at all costs (instead of useMemo which recomputes whenever the renderer feels like it).
 *
 * The most recent value will be kept from garbage collection until one of the dependencies becomes unreachable. This may be true even after the component no longer renders. Be wary of memory leaks.
 */
export function useStrictMemo<T>(callback: () => T, dependencies: any[]): T {
  const id = useId();
  useInsertionEffect(() => {
    return () => {
      cached.delete(id);
    };
  }, [id]);

  const c = cached.get(id);
  if (c) {
    const unwrapped = unwrapFromInner(dependencies, c);
    if (unwrapped.status === "ok") {
      return unwrapped.data;
    }
  }
  const value = callback();
  cached.set(id, wrapToInner(dependencies, value));
  return value;
}
