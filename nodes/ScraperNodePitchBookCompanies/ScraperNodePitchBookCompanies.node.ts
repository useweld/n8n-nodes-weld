import { buildScraperNodeClass } from "../shared/scraperNode";

export class ScraperNodePitchBookCompanies extends buildScraperNodeClass({
	scraperId: "pitchbook-companies",
	displayName: "ScraperNode PitchBook Companies",
	nodeName: "scraperNodePitchBookCompanies",
	description:
		"Extract company funding, investors, valuations, and financial data from PitchBook",
	inputLabel: "Company URLs",
	inputDescription:
		"PitchBook company profile URLs (pitchbook.com/profiles/company/...) — one per line",
	inputPlaceholder: "https://pitchbook.com/profiles/company/12345-67",
	creditCost: 2,
	platform: "pitchbook",
	allowedDomains: ["pitchbook.com"],
}) {}
