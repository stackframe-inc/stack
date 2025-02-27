import { StackAssertionError } from "./errors";

export function isNotNull<T>(value: T): value is NonNullable<T> {
  return value !== null && value !== undefined;
}
import.meta.vitest?.test("isNotNull", ({ expect }) => {
  expect(isNotNull(null)).toBe(false);
  expect(isNotNull(undefined)).toBe(false);
  expect(isNotNull(0)).toBe(true);
  expect(isNotNull("")).toBe(true);
  expect(isNotNull(false)).toBe(true);
  expect(isNotNull({})).toBe(true);
  expect(isNotNull([])).toBe(true);
});

export type DeepPartial<T> = T extends object ? { [P in keyof T]?: DeepPartial<T[P]> } : T;

/**
 * Assumes both objects are primitives, arrays, or non-function plain objects, and compares them deeply.
 *
 * Note that since they are assumed to be plain objects, this function does not compare prototypes.
 */
export function deepPlainEquals<T>(obj1: T, obj2: unknown, options: { ignoreUndefinedValues?: boolean } = {}): obj2 is T {
  if (typeof obj1 !== typeof obj2) return false;
  if (obj1 === obj2) return true;

  switch (typeof obj1) {
    case 'object': {
      if (!obj1 || !obj2) return false;

      if (Array.isArray(obj1) || Array.isArray(obj2)) {
        if (!Array.isArray(obj1) || !Array.isArray(obj2)) return false;
        if (obj1.length !== obj2.length) return false;
        return obj1.every((v, i) => deepPlainEquals(v, obj2[i], options));
      }

      const entries1 = Object.entries(obj1).filter(([k, v]) => !options.ignoreUndefinedValues || v !== undefined);
      const entries2 = Object.entries(obj2).filter(([k, v]) => !options.ignoreUndefinedValues || v !== undefined);
      if (entries1.length !== entries2.length) return false;
      return entries1.every(([k, v1]) => {
        const e2 = entries2.find(([k2]) => k === k2);
        if (!e2) return false;
        return deepPlainEquals(v1, e2[1], options);
      });
    }
    case 'undefined':
    case 'string':
    case 'number':
    case 'boolean':
    case 'bigint':
    case 'symbol':
    case 'function':{
      return false;
    }
    default: {
      throw new Error("Unexpected typeof " + typeof obj1);
    }
  }
}
import.meta.vitest?.test("deepPlainEquals", ({ expect }) => {
  // Simple values
  expect(deepPlainEquals(1, 1)).toBe(true);
  expect(deepPlainEquals("test", "test")).toBe(true);
  expect(deepPlainEquals(1, 2)).toBe(false);
  expect(deepPlainEquals("test", "other")).toBe(false);

  // Arrays
  expect(deepPlainEquals([1, 2, 3], [1, 2, 3])).toBe(true);
  expect(deepPlainEquals([1, 2, 3], [1, 2, 4])).toBe(false);
  expect(deepPlainEquals([1, 2, 3], [1, 2])).toBe(false);

  // Objects
  expect(deepPlainEquals({ a: 1, b: 2 }, { a: 1, b: 2 })).toBe(true);
  expect(deepPlainEquals({ a: 1, b: 2 }, { a: 1, b: 3 })).toBe(false);
  expect(deepPlainEquals({ a: 1, b: 2 }, { a: 1 })).toBe(false);

  // Nested structures
  expect(deepPlainEquals({ a: 1, b: [1, 2, { c: 3 }] }, { a: 1, b: [1, 2, { c: 3 }] })).toBe(true);
  expect(deepPlainEquals({ a: 1, b: [1, 2, { c: 3 }] }, { a: 1, b: [1, 2, { c: 4 }] })).toBe(false);

  // With options
  expect(deepPlainEquals({ a: 1, b: undefined }, { a: 1 }, { ignoreUndefinedValues: true })).toBe(true);
  expect(deepPlainEquals({ a: 1, b: undefined }, { a: 1 })).toBe(false);
});

export function deepPlainClone<T>(obj: T): T {
  if (typeof obj === 'function') throw new StackAssertionError("deepPlainClone does not support functions");
  if (typeof obj === 'symbol') throw new StackAssertionError("deepPlainClone does not support symbols");
  if (typeof obj !== 'object' || !obj) return obj;
  if (Array.isArray(obj)) return obj.map(deepPlainClone) as any;
  return Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, deepPlainClone(v)])) as any;
}
import.meta.vitest?.test("deepPlainClone", ({ expect }) => {
  // Primitive values
  expect(deepPlainClone(1)).toBe(1);
  expect(deepPlainClone("test")).toBe("test");
  expect(deepPlainClone(null)).toBe(null);
  expect(deepPlainClone(undefined)).toBe(undefined);

  // Arrays
  const arr = [1, 2, 3];
  const clonedArr = deepPlainClone(arr);
  expect(clonedArr).toEqual(arr);
  expect(clonedArr).not.toBe(arr); // Different reference

  // Objects
  const obj = { a: 1, b: 2 };
  const clonedObj = deepPlainClone(obj);
  expect(clonedObj).toEqual(obj);
  expect(clonedObj).not.toBe(obj); // Different reference

  // Nested structures
  const nested = { a: 1, b: [1, 2, { c: 3 }] };
  const clonedNested = deepPlainClone(nested);
  expect(clonedNested).toEqual(nested);
  expect(clonedNested).not.toBe(nested); // Different reference
  expect(clonedNested.b).not.toBe(nested.b); // Different reference for nested array
  expect(clonedNested.b[2]).not.toBe(nested.b[2]); // Different reference for nested object

  // Error cases
  expect(() => deepPlainClone(() => {})).toThrow();
  expect(() => deepPlainClone(Symbol())).toThrow();
});

export function typedEntries<T extends {}>(obj: T): [keyof T, T[keyof T]][] {
  return Object.entries(obj) as any;
}

export function typedFromEntries<K extends PropertyKey, V>(entries: [K, V][]): Record<K, V> {
  return Object.fromEntries(entries) as any;
}

export function typedKeys<T extends {}>(obj: T): (keyof T)[] {
  return Object.keys(obj) as any;
}

export function typedValues<T extends {}>(obj: T): T[keyof T][] {
  return Object.values(obj) as any;
}

export function typedAssign<T extends {}, U extends {}>(target: T, source: U): T & U {
  return Object.assign(target, source);
}

export type FilterUndefined<T> =
  & { [k in keyof T as (undefined extends T[k] ? (T[k] extends undefined | void ? never : k) : never)]+?: T[k] & ({} | null) }
  & { [k in keyof T as (undefined extends T[k] ? never : k)]: T[k] & ({} | null) }

/**
 * Returns a new object with all undefined values removed. Useful when spreading optional parameters on an object, as
 * TypeScript's `Partial<XYZ>` type allows `undefined` values.
 */
export function filterUndefined<T extends {}>(obj: T): FilterUndefined<T> {
  return Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined)) as any;
}
import.meta.vitest?.test("filterUndefined", ({ expect }) => {
  expect(filterUndefined({})).toEqual({});
  expect(filterUndefined({ a: 1, b: 2 })).toEqual({ a: 1, b: 2 });
  expect(filterUndefined({ a: 1, b: undefined })).toEqual({ a: 1 });
  expect(filterUndefined({ a: undefined, b: undefined })).toEqual({});
  expect(filterUndefined({ a: null, b: undefined })).toEqual({ a: null });
  expect(filterUndefined({ a: 0, b: "", c: false, d: undefined })).toEqual({ a: 0, b: "", c: false });
});

export function pick<T extends {}, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
  return Object.fromEntries(Object.entries(obj).filter(([k]) => keys.includes(k as K))) as any;
}
import.meta.vitest?.test("pick", ({ expect }) => {
  const obj = { a: 1, b: 2, c: 3, d: 4 };
  expect(pick(obj, ["a", "c"])).toEqual({ a: 1, c: 3 });
  expect(pick(obj, [])).toEqual({});
  expect(pick(obj, ["a", "e" as keyof typeof obj])).toEqual({ a: 1 });
  // Use type assertion for empty object to avoid TypeScript error
  expect(pick({} as Record<string, unknown>, ["a"])).toEqual({});
});

export function omit<T extends {}, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> {
  return Object.fromEntries(Object.entries(obj).filter(([k]) => !keys.includes(k as K))) as any;
}
import.meta.vitest?.test("omit", ({ expect }) => {
  const obj = { a: 1, b: 2, c: 3, d: 4 };
  expect(omit(obj, ["a", "c"])).toEqual({ b: 2, d: 4 });
  expect(omit(obj, [])).toEqual(obj);
  expect(omit(obj, ["a", "e" as keyof typeof obj])).toEqual({ b: 2, c: 3, d: 4 });
  // Use type assertion for empty object to avoid TypeScript error
  expect(omit({} as Record<string, unknown>, ["a"])).toEqual({});
});

export function split<T extends {}, K extends keyof T>(obj: T, keys: K[]): [Pick<T, K>, Omit<T, K>] {
  return [pick(obj, keys), omit(obj, keys)];
}
import.meta.vitest?.test("split", ({ expect }) => {
  const obj = { a: 1, b: 2, c: 3, d: 4 };
  expect(split(obj, ["a", "c"])).toEqual([{ a: 1, c: 3 }, { b: 2, d: 4 }]);
  expect(split(obj, [])).toEqual([{}, obj]);
  expect(split(obj, ["a", "e" as keyof typeof obj])).toEqual([{ a: 1 }, { b: 2, c: 3, d: 4 }]);
  // Use type assertion for empty object to avoid TypeScript error
  expect(split({} as Record<string, unknown>, ["a"])).toEqual([{}, {}]);
});
