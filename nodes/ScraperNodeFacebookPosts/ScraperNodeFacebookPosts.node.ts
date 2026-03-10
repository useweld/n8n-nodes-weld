import { buildScraperNodeClass } from "../shared/scraperNode";

export class ScraperNodeFacebookPosts extends buildScraperNodeClass({
	scraperId: "facebook-posts",
	displayName: "ScraperNode Facebook Posts",
	nodeName: "scraperNodeFacebookPosts",
	description:
		"Extract Facebook posts with engagement metrics and media data",
	inputLabel: "Post URLs",
	inputDescription:
		"Facebook post URLs (facebook.com/.../posts/...) — one per line or comma-separated",
	inputPlaceholder: "https://facebook.com/username/posts/123456",
	creditCost: 1,
	platform: "facebook",
	allowedDomains: ["facebook.com", "fb.com"],
}) {}
