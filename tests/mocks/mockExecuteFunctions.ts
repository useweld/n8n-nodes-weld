import type { IExecuteFunctions, INodeExecutionData } from "n8n-workflow";
import type { Mock } from "vitest";
import { vi } from "vitest";

type HttpRequest = {
	method: string;
	url: string;
	body?: unknown;
	json?: boolean;
};

type HttpHandler = (request: HttpRequest) => unknown;

interface MockOptions {
	nodeParameters?: Record<string, unknown>;
	credentials?: Record<string, unknown>;
	inputData?: INodeExecutionData[];
	continueOnFail?: boolean;
	httpHandler?: HttpHandler;
}

const DEFAULT_CREDENTIALS = {
	apiKey: "weld_test_key_123",
};

/** IExecuteFunctions with typed mock helpers for test assertions. */
export type MockedExecuteFunctions = IExecuteFunctions & {
	helpers: {
		httpRequestWithAuthentication: Mock;
	};
};

/**
 * Creates a mock IExecuteFunctions that can be used with `.call(mock)` on the
 * Weld node's execute method and the createJob helper.
 */
export function createMockExecuteFunctions(
	options: MockOptions = {}
): MockedExecuteFunctions {
	const {
		nodeParameters = {},
		credentials = DEFAULT_CREDENTIALS,
		inputData = [{ json: {} }],
		continueOnFail = false,
		httpHandler,
	} = options;

	const httpRequestWithAuthentication = vi.fn(
		async (_credentialType: string, request: HttpRequest): Promise<unknown> => {
			if (httpHandler) {
				return httpHandler(request);
			}
			return {};
		}
	);

	const mock = {
		getInputData: vi.fn(() => inputData),

		getNodeParameter: vi.fn(
			(name: string, _itemIndex: number, fallback?: unknown) => {
				if (name in nodeParameters) {
					return nodeParameters[name];
				}
				if (fallback !== undefined) {
					return fallback;
				}
				throw new Error(`Parameter "${name}" not found in mock`);
			}
		),

		getCredentials: vi.fn(async (_name: string) => credentials),

		getNode: vi.fn(() => ({
			name: "Weld",
			type: "n8n-nodes-weld.weld",
			typeVersion: 1,
			position: [0, 0],
			parameters: {},
		})),

		continueOnFail: vi.fn(() => continueOnFail),

		helpers: {
			httpRequestWithAuthentication,
		},
	} as unknown as MockedExecuteFunctions;

	return mock;
}

export { DEFAULT_CREDENTIALS };
