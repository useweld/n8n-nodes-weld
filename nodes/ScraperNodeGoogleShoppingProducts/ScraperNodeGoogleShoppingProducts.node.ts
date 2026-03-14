import { buildScraperNodeClass } from "../shared/scraperNode";

export class ScraperNodeGoogleShoppingProducts extends buildScraperNodeClass({
	scraperId: "google-shopping-products",
	displayName: "ScraperNode Google Shopping Products",
	nodeName: "scraperNodeGoogleShoppingProducts",
	description:
		"Extract product listings from Google Shopping with prices and merchant info",
	inputLabel: "Product URLs",
	inputDescription:
		"Google Shopping product URLs (google.com/shopping/product/...) — one per line",
	inputPlaceholder: "https://google.com/shopping/product/123",
	creditCost: 1,
	platform: "google-shopping",
	allowedDomains: ["google.com"],
}) {}
