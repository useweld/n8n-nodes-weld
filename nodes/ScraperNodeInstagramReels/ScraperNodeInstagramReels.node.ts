import { buildScraperNodeClass } from "../shared/scraperNode";

export class ScraperNodeInstagramReels extends buildScraperNodeClass({
	scraperId: "instagram-reels",
	displayName: "ScraperNode Instagram Reels",
	nodeName: "scraperNodeInstagramReels",
	description:
		"Extract reel data including views, likes, and engagement metrics from Instagram",
	inputLabel: "Reel URLs",
	inputDescription:
		"Instagram reel URLs (instagram.com/reel/...) — one per line or comma-separated",
	inputPlaceholder: "https://instagram.com/reel/reelId",
	creditCost: 1,
	platform: "instagram",
	allowedDomains: ["instagram.com"],
}) {}
