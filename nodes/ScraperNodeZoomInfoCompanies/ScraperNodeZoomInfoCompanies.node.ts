import { buildScraperNodeClass } from "../shared/scraperNode";

export class ScraperNodeZoomInfoCompanies extends buildScraperNodeClass({
	scraperId: "zoominfo-companies",
	displayName: "ScraperNode ZoomInfo Companies",
	nodeName: "scraperNodeZoomInfoCompanies",
	description:
		"Extract company data from ZoomInfo including size, revenue, contacts, and tech stack",
	inputLabel: "Company URLs",
	inputDescription:
		"ZoomInfo company profile URLs (zoominfo.com/c/...) — one per line",
	inputPlaceholder: "https://zoominfo.com/c/company-name/123456",
	creditCost: 2,
	platform: "zoominfo",
	allowedDomains: ["zoominfo.com"],
}) {}
