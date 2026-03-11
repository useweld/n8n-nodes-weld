import type {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from "n8n-workflow";

export class ScraperNodeApi implements ICredentialType {
	name = "scraperNodeApi";
	displayName = "ScraperNode API";
	documentationUrl = "https://scrapernode.com/docs/api";
	icon = {
		light: "file:scrapernode.svg",
		dark: "file:scrapernode.dark.svg",
	} as const;

	properties: INodeProperties[] = [
		{
			displayName: "API Key",
			name: "apiKey",
			type: "string",
			typeOptions: { password: true },
			default: "",
			placeholder: "sn_...",
			description: "API key from your ScraperNode dashboard (Settings → API Keys)",
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
			baseURL: "https://api.scrapernode.com",
			url: "/api/credits/balance",
			method: "GET",
		},
	};
}
