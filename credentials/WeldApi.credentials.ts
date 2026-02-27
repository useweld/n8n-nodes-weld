import type {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from "n8n-workflow";

export class WeldApi implements ICredentialType {
	name = "weldApi";
	displayName = "Weld API";
	documentationUrl = "https://www.useweld.app/docs/api";

	properties: INodeProperties[] = [
		{
			displayName: "API Key",
			name: "apiKey",
			type: "string",
			typeOptions: { password: true },
			default: "",
			placeholder: "weld_...",
			description: "API key from your Weld dashboard (Settings → API Keys)",
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: "generic",
		properties: {
			headers: {
				Authorization: "=Bearer {{$credentials?.apiKey}}",
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: "https://actions.useweld.app",
			url: "/api/credits/balance",
			method: "GET",
		},
	};
}
