import { buildScraperNodeClass } from "../shared/scraperNode";

export class ScraperNodeGoogleSearchAi extends buildScraperNodeClass({
	scraperId: "google-search-ai",
	displayName: "ScraperNode Google AI Search",
	nodeName: "scraperNodeGoogleSearchAi",
	description:
		"Extract AI-generated search results and citations from Google AI Mode",
	inputLabel: "Search Queries",
	inputDescription: "Search keywords to query — one per entry",
	inputPlaceholder: "what is the best project management tool",
	creditCost: 1,
	platform: "google-search",
	allowedDomains: [],
}) {}
