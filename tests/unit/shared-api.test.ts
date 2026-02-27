import { describe, expect, it } from "vitest";
import { isRetryableError } from "../../nodes/shared/api";

describe("isRetryableError", () => {
	it("should return true for 5xx errors", () => {
		expect(isRetryableError(new Error("502 Bad Gateway"))).toBe(true);
		expect(isRetryableError(new Error("503 Service Unavailable"))).toBe(true);
		expect(isRetryableError(new Error("500 Internal Server Error"))).toBe(true);
	});

	it("should return true for 429 rate limit errors", () => {
		expect(isRetryableError(new Error("429 Too Many Requests"))).toBe(true);
	});

	it("should return true for network errors", () => {
		expect(isRetryableError(new Error("ECONNRESET"))).toBe(true);
		expect(isRetryableError(new Error("ETIMEDOUT"))).toBe(true);
		expect(isRetryableError(new Error("ENOTFOUND"))).toBe(true);
		expect(isRetryableError(new Error("socket hang up"))).toBe(true);
	});

	it("should return false for 4xx client errors", () => {
		expect(isRetryableError(new Error("400 Bad Request"))).toBe(false);
		expect(isRetryableError(new Error("401 Unauthorized"))).toBe(false);
		expect(isRetryableError(new Error("404 Not Found"))).toBe(false);
	});

	it("should return false for non-Error values", () => {
		expect(isRetryableError("string error")).toBe(false);
		expect(isRetryableError(null)).toBe(false);
		expect(isRetryableError(undefined)).toBe(false);
	});
});
