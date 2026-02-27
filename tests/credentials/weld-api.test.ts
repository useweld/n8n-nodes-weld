import { describe, expect, it } from "vitest";
import { WeldApi } from "../../credentials/WeldApi.credentials";

describe("WeldApi credentials", () => {
	const credentials = new WeldApi();

	it("should have the correct internal name", () => {
		expect(credentials.name).toBe("weldApi");
	});

	it("should have a user-facing display name", () => {
		expect(credentials.displayName).toBe("Weld API");
	});

	it("should define only apiKey property", () => {
		const names = credentials.properties.map((p) => p.name);
		expect(names).toContain("apiKey");
		expect(names).not.toContain("baseUrl");
		expect(credentials.properties).toHaveLength(1);
	});

	it("should mark apiKey as password type", () => {
		const apiKey = credentials.properties.find((p) => p.name === "apiKey");
		expect(apiKey?.type).toBe("string");
		expect(apiKey?.typeOptions).toEqual({ password: true });
	});

	it("should set Bearer auth in the Authorization header", () => {
		expect(credentials.authenticate).toEqual({
			type: "generic",
			properties: {
				headers: {
					Authorization: "=Bearer {{$credentials?.apiKey}}",
				},
			},
		});
	});

	it("should test credentials via GET /api/credits/balance", () => {
		expect(credentials.test).toEqual({
			request: {
				baseURL: "https://actions.useweld.app",
				url: "/api/credits/balance",
				method: "GET",
			},
		});
	});

	it("should have a documentation URL", () => {
		expect(credentials.documentationUrl).toBeDefined();
		expect(credentials.documentationUrl).toContain("useweld");
	});
});
