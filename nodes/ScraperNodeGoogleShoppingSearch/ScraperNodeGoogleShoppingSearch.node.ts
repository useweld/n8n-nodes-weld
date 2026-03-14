import { buildScraperNodeClass } from "../shared/scraperNode";

export class ScraperNodeGoogleShoppingSearch extends buildScraperNodeClass({
	scraperId: "google-shopping-search",
	displayName: "ScraperNode Google Shopping Search",
	nodeName: "scraperNodeGoogleShoppingSearch",
	description:
		"Extract Google Shopping search results by keyword with pricing and product details",
	inputLabel: "Product Search Queries",
	inputDescription: "Product search keywords — one per entry",
	inputPlaceholder: "standing desk adjustable",
	creditCost: 1,
	platform: "google-shopping",
	allowedDomains: [],
}) {}
