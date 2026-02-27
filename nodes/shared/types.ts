export interface ScraperNodeConfig {
	/** Scraper slug sent to the API, e.g. "linkedin-profiles" */
	scraperId: string;
	/** Display name shown in the n8n node palette */
	displayName: string;
	/** Internal n8n node name (camelCase, unique across all nodes) */
	nodeName: string;
	/** Short description for n8n search and AI agent tool selection */
	description: string;
	/** Label for the URL input field, e.g. "Profile URLs" */
	inputLabel: string;
	/** Help text under the URL input field */
	inputDescription: string;
	/** Placeholder example URL */
	inputPlaceholder: string;
	/** Credits charged per input record */
	creditCost: number;
	/** Platform identifier for grouping */
	platform: string;
	/** Allowed URL domains for input validation, e.g. ["linkedin.com"] */
	allowedDomains: string[];
}
