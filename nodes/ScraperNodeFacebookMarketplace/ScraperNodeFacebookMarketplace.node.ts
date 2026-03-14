import { buildScraperNodeClass } from "../shared/scraperNode";

export class ScraperNodeFacebookMarketplace extends buildScraperNodeClass({
	scraperId: "facebook-marketplace",
	displayName: "ScraperNode Facebook Marketplace",
	nodeName: "scraperNodeFacebookMarketplace",
	description:
		"Extract Marketplace listings with pricing, seller info, and item details",
	inputLabel: "Marketplace Listing URLs",
	inputDescription:
		"Facebook Marketplace listing URLs (facebook.com/marketplace/item/...) — one per line",
	inputPlaceholder: "https://facebook.com/marketplace/item/123456",
	creditCost: 1,
	platform: "facebook",
	allowedDomains: ["facebook.com"],
}) {}
