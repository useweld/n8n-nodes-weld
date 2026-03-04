import { buildScraperNodeClass } from "../shared/scraperNode";

export class WeldCrunchbaseCompanies extends buildScraperNodeClass({
	scraperId: "crunchbase-companies",
	displayName: "Weld Crunchbase Companies",
	nodeName: "weldCrunchbaseCompanies",
	description:
		"Extract company data with funding information from Crunchbase company pages",
	inputLabel: "Company URLs",
	inputDescription:
		"Crunchbase company page URLs — one per line or comma-separated",
	inputPlaceholder: "https://crunchbase.com/organization/acme-corp",
	creditCost: 5,
	platform: "crunchbase",
	allowedDomains: ["crunchbase.com"],
}) {}
