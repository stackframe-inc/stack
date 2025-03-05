import { generateSecureRandomString } from "./crypto";
import { templateIdentity } from "./strings";

export function createUrlIfValid(...args: ConstructorParameters<typeof URL>) {
  try {
    return new URL(...args);
  } catch (e) {
    return null;
  }
}
import.meta.vitest?.test("createUrlIfValid", ({ expect }) => {
  // Test with valid URLs
  expect(createUrlIfValid("https://example.com")).toBeInstanceOf(URL);
  expect(createUrlIfValid("https://example.com/path?query=value#hash")).toBeInstanceOf(URL);
  expect(createUrlIfValid("/path", "https://example.com")).toBeInstanceOf(URL);

  // Test with invalid URLs
  expect(createUrlIfValid("")).toBeNull();
  expect(createUrlIfValid("not a url")).toBeNull();
  expect(createUrlIfValid("http://")).toBeNull();
});

export function isValidUrl(url: string) {
  return createUrlIfValid(url) !== null;
}
import.meta.vitest?.test("isValidUrl", ({ expect }) => {
  // Test with valid URLs
  expect(isValidUrl("https://example.com")).toBe(true);
  expect(isValidUrl("http://localhost:3000")).toBe(true);
  expect(isValidUrl("ftp://example.com")).toBe(true);

  // Test with invalid URLs
  expect(isValidUrl("")).toBe(false);
  expect(isValidUrl("not a url")).toBe(false);
  expect(isValidUrl("http://")).toBe(false);
});

export function isValidHostname(hostname: string) {
  const url = createUrlIfValid(`https://${hostname}`);
  if (!url) return false;
  return url.hostname === hostname;
}
import.meta.vitest?.test("isValidHostname", ({ expect }) => {
  // Test with valid hostnames
  expect(isValidHostname("example.com")).toBe(true);
  expect(isValidHostname("localhost")).toBe(true);
  expect(isValidHostname("sub.domain.example.com")).toBe(true);
  expect(isValidHostname("127.0.0.1")).toBe(true);

  // Test with invalid hostnames
  expect(isValidHostname("")).toBe(false);
  expect(isValidHostname("example.com/path")).toBe(false);
  expect(isValidHostname("https://example.com")).toBe(false);
  expect(isValidHostname("example com")).toBe(false);
});

export function isLocalhost(urlOrString: string | URL) {
  const url = createUrlIfValid(urlOrString);
  if (!url) return false;
  if (url.hostname === "localhost" || url.hostname.endsWith(".localhost")) return true;
  if (url.hostname.match(/^127\.\d+\.\d+\.\d+$/)) return true;
  return false;
}
import.meta.vitest?.test("isLocalhost", ({ expect }) => {
  // Test with localhost URLs
  expect(isLocalhost("http://localhost")).toBe(true);
  expect(isLocalhost("https://localhost:8080")).toBe(true);
  expect(isLocalhost("http://sub.localhost")).toBe(true);
  expect(isLocalhost("http://127.0.0.1")).toBe(true);
  expect(isLocalhost("http://127.1.2.3")).toBe(true);

  // Test with non-localhost URLs
  expect(isLocalhost("https://example.com")).toBe(false);
  expect(isLocalhost("http://192.168.1.1")).toBe(false);
  expect(isLocalhost("http://10.0.0.1")).toBe(false);

  // Test with URL objects
  expect(isLocalhost(new URL("http://localhost"))).toBe(true);
  expect(isLocalhost(new URL("https://example.com"))).toBe(false);

  // Test with invalid URLs
  expect(isLocalhost("not a url")).toBe(false);
  expect(isLocalhost("")).toBe(false);
});

export function isRelative(url: string) {
  const randomDomain = `${generateSecureRandomString()}.stack-auth.example.com`;
  const u = createUrlIfValid(url, `https://${randomDomain}`);
  if (!u) return false;
  if (u.host !== randomDomain) return false;
  if (u.protocol !== "https:") return false;
  return true;
}
import.meta.vitest?.test("isRelative", ({ expect }) => {
  // We can't easily mock generateSecureRandomString in this context
  // but we can still test the function's behavior

  // Test with relative URLs
  expect(isRelative("/")).toBe(true);
  expect(isRelative("/path")).toBe(true);
  expect(isRelative("/path?query=value#hash")).toBe(true);

  // Test with absolute URLs
  expect(isRelative("https://example.com")).toBe(false);
  expect(isRelative("http://example.com")).toBe(false);
  expect(isRelative("//example.com")).toBe(false);

  // Note: The implementation treats empty strings and invalid URLs as relative
  // This is because they can be resolved against a base URL
  expect(isRelative("")).toBe(true);
  expect(isRelative("not a url")).toBe(true);
});

export function getRelativePart(url: URL) {
  return url.pathname + url.search + url.hash;
}
import.meta.vitest?.test("getRelativePart", ({ expect }) => {
  // Test with various URLs
  expect(getRelativePart(new URL("https://example.com"))).toBe("/");
  expect(getRelativePart(new URL("https://example.com/path"))).toBe("/path");
  expect(getRelativePart(new URL("https://example.com/path?query=value"))).toBe("/path?query=value");
  expect(getRelativePart(new URL("https://example.com/path#hash"))).toBe("/path#hash");
  expect(getRelativePart(new URL("https://example.com/path?query=value#hash"))).toBe("/path?query=value#hash");

  // Test with different domains but same paths
  const url1 = new URL("https://example.com/path?query=value#hash");
  const url2 = new URL("https://different.com/path?query=value#hash");
  expect(getRelativePart(url1)).toBe(getRelativePart(url2));
});

/**
 * A template literal tag that returns a URL.
 *
 * Any values passed are encoded.
 */
export function url(strings: TemplateStringsArray | readonly string[], ...values: (string|number|boolean)[]): URL {
  return new URL(urlString(strings, ...values));
}
import.meta.vitest?.test("url", ({ expect }) => {
  // Test with no interpolation
  expect(url`https://example.com`).toBeInstanceOf(URL);
  expect(url`https://example.com`.href).toBe("https://example.com/");

  // Test with string interpolation
  expect(url`https://example.com/${"path"}`).toBeInstanceOf(URL);
  expect(url`https://example.com/${"path"}`.pathname).toBe("/path");

  // Test with number interpolation
  expect(url`https://example.com/${42}`).toBeInstanceOf(URL);
  expect(url`https://example.com/${42}`.pathname).toBe("/42");

  // Test with boolean interpolation
  expect(url`https://example.com/${true}`).toBeInstanceOf(URL);
  expect(url`https://example.com/${true}`.pathname).toBe("/true");

  // Test with special characters in interpolation
  expect(url`https://example.com/${"path with spaces"}`).toBeInstanceOf(URL);
  expect(url`https://example.com/${"path with spaces"}`.pathname).toBe("/path%20with%20spaces");

  // Test with multiple interpolations
  expect(url`https://example.com/${"path"}?query=${"value"}`).toBeInstanceOf(URL);
  expect(url`https://example.com/${"path"}?query=${"value"}`.pathname).toBe("/path");
  expect(url`https://example.com/${"path"}?query=${"value"}`.search).toBe("?query=value");
});


/**
 * A template literal tag that returns a URL string.
 *
 * Any values passed are encoded.
 */
export function urlString(strings: TemplateStringsArray | readonly string[], ...values: (string|number|boolean)[]): string {
  return templateIdentity(strings, ...values.map(encodeURIComponent));
}
import.meta.vitest?.test("urlString", ({ expect }) => {
  // Test with no interpolation
  expect(urlString`https://example.com`).toBe("https://example.com");

  // Test with string interpolation
  expect(urlString`https://example.com/${"path"}`).toBe("https://example.com/path");

  // Test with number interpolation
  expect(urlString`https://example.com/${42}`).toBe("https://example.com/42");

  // Test with boolean interpolation
  expect(urlString`https://example.com/${true}`).toBe("https://example.com/true");

  // Test with special characters in interpolation
  expect(urlString`https://example.com/${"path with spaces"}`).toBe("https://example.com/path%20with%20spaces");
  expect(urlString`https://example.com/${"?&="}`).toBe("https://example.com/%3F%26%3D");

  // Test with multiple interpolations
  expect(urlString`https://example.com/${"path"}?query=${"value"}`).toBe("https://example.com/path?query=value");
  expect(urlString`https://example.com/${"path"}?query=${"value with spaces"}`).toBe("https://example.com/path?query=value%20with%20spaces");
});


