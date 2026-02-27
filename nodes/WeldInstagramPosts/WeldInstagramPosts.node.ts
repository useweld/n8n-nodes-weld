import { buildScraperNodeClass } from "../shared/scraperNode";

export class WeldInstagramPosts extends buildScraperNodeClass({
	scraperId: "instagram-posts",
	displayName: "Weld Instagram Posts",
	nodeName: "weldInstagramPosts",
	description: "Extract posts with media data from Instagram post URLs",
	inputLabel: "Post URLs",
	inputDescription:
		"Instagram post URLs (instagram.com/p/id or /reel/id) — one per line or comma-separated",
	inputPlaceholder: "https://instagram.com/p/ABC123",
	creditCost: 3,
	platform: "instagram",
	allowedDomains: ["instagram.com"],
}) {}
