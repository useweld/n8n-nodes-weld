import { buildScraperNodeClass } from "../shared/scraperNode";

export class WeldGitHubRepositories extends buildScraperNodeClass({
	scraperId: "github-repositories",
	displayName: "Weld GitHub Repositories",
	nodeName: "weldGitHubRepositories",
	description: "Extract repository data from GitHub repository URLs",
	inputLabel: "Repository URLs",
	inputDescription:
		"GitHub repository URLs — one per line or comma-separated",
	inputPlaceholder: "https://github.com/owner/repo",
	creditCost: 5,
	platform: "github",
	allowedDomains: ["github.com"],
}) {}
