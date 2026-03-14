import { buildScraperNodeClass } from "../shared/scraperNode";

export class ScraperNodeVentureRadarCompanies extends buildScraperNodeClass({
	scraperId: "ventureradar-companies",
	displayName: "ScraperNode VentureRadar Companies",
	nodeName: "scraperNodeVentureRadarCompanies",
	description:
		"Extract startup and emerging company data from VentureRadar",
	inputLabel: "Company URLs",
	inputDescription:
		"VentureRadar company profile URLs (ventureradar.com/company/...) — one per line",
	inputPlaceholder: "https://ventureradar.com/company/company-name/123",
	creditCost: 1,
	platform: "ventureradar",
	allowedDomains: ["ventureradar.com"],
}) {}
