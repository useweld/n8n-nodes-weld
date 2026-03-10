import { buildScraperNodeClass } from "../shared/scraperNode";

export class ScraperNodeFacebookComments extends buildScraperNodeClass({
	scraperId: "facebook-comments",
	displayName: "ScraperNode Facebook Comments",
	nodeName: "scraperNodeFacebookComments",
	description: "Extract comments from Facebook posts with user details",
	inputLabel: "Post URLs",
	inputDescription:
		"Facebook post URLs (facebook.com/.../posts/...) — one per line or comma-separated",
	inputPlaceholder: "https://facebook.com/username/posts/123456",
	creditCost: 1,
	platform: "facebook",
	allowedDomains: ["facebook.com", "fb.com"],
}) {}
