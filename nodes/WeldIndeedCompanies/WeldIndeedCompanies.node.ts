import { buildScraperNodeClass } from "../shared/scraperNode";

export class WeldIndeedCompanies extends buildScraperNodeClass({
	scraperId: "indeed-companies",
	displayName: "Weld Indeed Companies",
	nodeName: "weldIndeedCompanies",
	description: "Extract company reviews and ratings from Indeed company pages",
	inputLabel: "Company URLs",
	inputDescription:
		"Indeed company page URLs — one per line or comma-separated",
	inputPlaceholder: "https://indeed.com/cmp/Acme-Corp",
	creditCost: 5,
	platform: "indeed",
	allowedDomains: [
		"indeed.com",
		"indeed.co.uk",
		"indeed.ca",
		"indeed.co.in",
		"indeed.com.au",
		"indeed.de",
		"indeed.fr",
	],
}) {}
