import { buildScraperNodeClass } from "../shared/scraperNode";

export class ScraperNodeOwlerCompanies extends buildScraperNodeClass({
	scraperId: "owler-companies",
	displayName: "ScraperNode Owler Companies",
	nodeName: "scraperNodeOwlerCompanies",
	description:
		"Extract company intelligence from Owler including revenue estimates, competitors, and news",
	inputLabel: "Company URLs",
	inputDescription:
		"Owler company profile URLs (owler.com/company/...) — one per line",
	inputPlaceholder: "https://owler.com/company/company-name",
	creditCost: 1,
	platform: "owler",
	allowedDomains: ["owler.com"],
}) {}
