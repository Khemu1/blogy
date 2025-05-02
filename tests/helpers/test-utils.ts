import { ResponseCookies } from "next/dist/compiled/@edge-runtime/cookies";
import { NextRequest } from "next/server";

/**
 * Creates a mock HTTP request that mimics Next.js behavior
 * @param method HTTP method (GET, POST, etc.)
 * @param path Request path (can be relative or absolute)
 * @param body Optional request body
 * @param headers Optional headers (can be Headers instance or plain object)
 * @param cookies Optional cookies as key-value pairs
 */
export function createTestRequest(
  method: string,
  path: string,
  body?: any,
  headers?: Headers | Record<string, string>,
  cookies?: Record<string, string>
): NextRequest {
  console.debug("[createTestRequest] Creating request:", { method, path });

  const finalPath = path.startsWith("http")
    ? path
    : `http://localhost${path.startsWith("/") ? "" : "/"}${path}`;

  const requestHeaders =
    headers instanceof Headers ? new Headers(headers) : new Headers(headers);

  if (body && !requestHeaders.has("Content-Type")) {
    requestHeaders.set("Content-Type", "application/json");
  }

  if (cookies) {
    const cookieString = Object.entries(cookies)
      .map(
        ([key, value]) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
      )
      .join("; ");
    requestHeaders.set("Cookie", cookieString);
  }

  return new NextRequest(finalPath, {
    method,
    headers: requestHeaders,
    body: body ? JSON.stringify(body) : undefined,
    ...(body && { duplex: "half" as const }),
  });
}

/**
 * Executes a fetch request to the local server
 * @param options Request options
 */
export async function fetchHandler(options: {
  method: string;
  path: string;
  body?: any;
  headers?: Record<string, string>;
  cookies?: Record<string, string>;
  params?: Record<string, string>;
}) {
  const { method, path, body, cookies, headers = {} } = options;
  const url = `http://localhost:3000${path.startsWith("/") ? "" : "/"}${path}`;

  const requestHeaders = new Headers(headers);
  requestHeaders.set("Content-Type", "application/json");

  if (cookies) {
    const cookieString = Object.entries(cookies)
      .map(([key, value]) => `${key}=${value}`)
      .join("; ");
    requestHeaders.set("Cookie", cookieString);
  }

  try {
    const response = await fetch(url, {
      method,
      headers: requestHeaders,
      body: body ? JSON.stringify(body) : undefined,
    });

    const responseHeaders = Object.fromEntries(response.headers.entries());
    const responseCookies = parseCookies(
      response.headers.get("set-cookie") || ""
    );
    const responseBody = await response.json().catch(() => ({}));



    return {
      status: response.status,
      headers: responseHeaders,
      body: responseBody,
      cookies: responseCookies,
    };
  } catch (error) {
    console.error("[fetchHandler] Error:", error);
    throw error;
  }
}

/**
 * Extracts cookies from ResponseCookies into a plain object
 * @param responseCookies ResponseCookies instance
 */
export function extractCookies(
  responseCookies: ResponseCookies | Record<string, string>
): Record<string, string> {
  if (!responseCookies) return {};

  // If it's already a plain object, return it
  if (typeof responseCookies === "object" && !("getAll" in responseCookies)) {
    return responseCookies;
  }

  const cookies: Record<string, string> = {};
  for (const cookie of (responseCookies as ResponseCookies).getAll()) {
    cookies[cookie.name] = cookie.value;
  }

  return cookies;
}

/**
 * Helper to parse cookies from header string
 */
function parseCookies(cookieHeader: string): Record<string, string> {
  return cookieHeader.split(";").reduce((cookies, cookie) => {
    const [name, value] = cookie.split("=").map((c) => c.trim());
    if (name) {
      cookies[name] = value;
    }
    return cookies;
  }, {} as Record<string, string>);
}

/**
 * Helper to create headers from object if needed
 */
export function createHeaders(headers?: Record<string, string>): Headers {
  return new Headers(headers);
}
