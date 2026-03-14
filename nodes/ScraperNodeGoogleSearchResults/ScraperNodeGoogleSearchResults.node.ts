import { buildScraperNodeClass } from "../shared/scraperNode";

export class ScraperNodeGoogleSearchResults extends buildScraperNodeClass({
	scraperId: "google-search-results",
	displayName: "ScraperNode Google Search Results",
	nodeName: "scraperNodeGoogleSearchResults",
	description: "Extract up to 100 organic search results from Google SERP",
	inputLabel: "Search Queries",
	inputDescription: "Search keywords to query — one per entry",
	inputPlaceholder: "best CRM software for startups",
	creditCost: 1,
	platform: "google-search",
	allowedDomains: [],
}) {}
