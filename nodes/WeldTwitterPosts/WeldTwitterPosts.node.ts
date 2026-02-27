import { buildScraperNodeClass } from "../shared/scraperNode";

export class WeldTwitterPosts extends buildScraperNodeClass({
	scraperId: "twitter-posts",
	displayName: "Weld Twitter/X Posts",
	nodeName: "weldTwitterPosts",
	description: "Extract tweets from Twitter/X post URLs",
	inputLabel: "Post URLs",
	inputDescription:
		"Twitter/X post URLs (x.com/user/status/id) — one per line or comma-separated",
	inputPlaceholder: "https://x.com/user/status/123456",
	creditCost: 3,
	platform: "twitter",
	allowedDomains: ["twitter.com", "x.com"],
}) {}
