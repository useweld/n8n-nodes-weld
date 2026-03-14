import { buildScraperNodeClass } from "../shared/scraperNode";

export class ScraperNodeMartindaleLawyers extends buildScraperNodeClass({
	scraperId: "martindale-lawyers",
	displayName: "ScraperNode Martindale Lawyers",
	nodeName: "scraperNodeMartindaleLawyers",
	description:
		"Extract US attorney and law firm data from the Martindale-Hubbell directory",
	inputLabel: "Attorney or Law Firm URLs",
	inputDescription:
		"Martindale attorney or law firm URLs (martindale.com/attorney/...) — one per line",
	inputPlaceholder: "https://martindale.com/attorney/firstname-lastname-12345",
	creditCost: 1,
	platform: "martindale",
	allowedDomains: ["martindale.com"],
}) {}
