import { buildScraperNodeClass } from "../shared/scraperNode";

export class ScraperNodeTikTokShop extends buildScraperNodeClass({
	scraperId: "tiktok-shop",
	displayName: "ScraperNode TikTok Shop Products",
	nodeName: "scraperNodeTikTokShop",
	description:
		"Extract TikTok Shop product data including pricing, ratings, and seller info",
	inputLabel: "Shop Product URLs",
	inputDescription:
		"TikTok Shop product URLs (tiktok.com/shop/...) — one per line",
	inputPlaceholder: "https://tiktok.com/shop/product/123",
	creditCost: 1,
	platform: "tiktok",
	allowedDomains: ["tiktok.com"],
}) {}
