import { buildScraperNodeClass } from "../shared/scraperNode";

export class WeldInstagramComments extends buildScraperNodeClass({
	scraperId: "instagram-comments",
	displayName: "Weld Instagram Comments",
	nodeName: "weldInstagramComments",
	description: "Extract comments from Instagram post URLs",
	inputLabel: "Post URLs",
	inputDescription:
		"Instagram post URLs to scrape comments from — one per line or comma-separated",
	inputPlaceholder: "https://instagram.com/p/ABC123",
	creditCost: 2,
	platform: "instagram",
	allowedDomains: ["instagram.com"],
}) {}
