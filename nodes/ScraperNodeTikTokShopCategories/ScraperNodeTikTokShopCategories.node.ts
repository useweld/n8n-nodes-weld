import { buildScraperNodeClass } from "../shared/scraperNode";

export class ScraperNodeTikTokShopCategories extends buildScraperNodeClass({
	scraperId: "tiktok-shop-categories",
	displayName: "ScraperNode TikTok Shop Categories",
	nodeName: "scraperNodeTikTokShopCategories",
	description:
		"Extract TikTok Shop products by category URL with pricing and ratings",
	inputLabel: "Shop Category URLs",
	inputDescription:
		"TikTok Shop category URLs (tiktok.com/shop/...) — one per line",
	inputPlaceholder: "https://tiktok.com/shop/category/123",
	creditCost: 1,
	platform: "tiktok",
	allowedDomains: ["tiktok.com"],
}) {}
