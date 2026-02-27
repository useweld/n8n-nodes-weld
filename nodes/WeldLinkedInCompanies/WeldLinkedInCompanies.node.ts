import { buildScraperNodeClass } from "../shared/scraperNode";

export class WeldLinkedInCompanies extends buildScraperNodeClass({
	scraperId: "linkedin-companies",
	displayName: "Weld LinkedIn Companies",
	nodeName: "weldLinkedInCompanies",
	description: "Extract company data from LinkedIn company page URLs",
	inputLabel: "Company URLs",
	inputDescription:
		"LinkedIn company URLs (linkedin.com/company/name) — one per line or comma-separated",
	inputPlaceholder: "https://linkedin.com/company/acme",
	creditCost: 5,
	platform: "linkedin",
	allowedDomains: ["linkedin.com"],
}) {}
