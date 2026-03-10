# n8n-nodes-scrapernode

n8n community node for [ScraperNode](https://www.scrapernode.com) — web scraping across LinkedIn, Instagram, TikTok, Twitter/X, YouTube, Facebook, Indeed, Glassdoor, Yelp, GitHub & Crunchbase.

## Installation

In your n8n instance, go to **Settings → Community Nodes → Install** and enter:

```
n8n-nodes-scrapernode
```

## Credentials

1. Log in to [ScraperNode](https://www.scrapernode.com)
2. Go to **Settings → API Keys** and create a new key
3. In n8n, add a **ScraperNode API** credential with your API key and base URL

## Nodes

### Per-Platform Scraper Nodes

Each scraper has its own dedicated node with tailored input fields and AI agent descriptions:

| Node | Scraper | Input | Cost |
| ---- | ------- | ----- | ---- |
| **ScraperNode LinkedIn Profiles** | `linkedin-profiles` | Profile URLs | 5 cr |
| **ScraperNode LinkedIn Companies** | `linkedin-companies` | Company URLs | 5 cr |
| **ScraperNode LinkedIn Posts** | `linkedin-posts` | Profile/Company/Post URLs | 3 cr |
| **ScraperNode LinkedIn Jobs** | `linkedin-jobs` | Job listing URLs | 1 cr |
| **ScraperNode LinkedIn People Search** | `linkedin-people-search` | Search URLs | 1 cr |
| **ScraperNode Instagram Profiles** | `instagram-profiles` | Profile URLs | 4 cr |
| **ScraperNode Instagram Posts** | `instagram-posts` | Post URLs | 3 cr |
| **ScraperNode Instagram Comments** | `instagram-comments` | Post URLs | 2 cr |
| **ScraperNode Instagram Reels** | `instagram-reels` | Reel URLs | 1 cr |
| **ScraperNode TikTok Profiles** | `tiktok-profiles` | Profile URLs | 4 cr |
| **ScraperNode TikTok Videos** | `tiktok-posts` | Video URLs | 3 cr |
| **ScraperNode TikTok Comments** | `tiktok-comments` | Video URLs | 1 cr |
| **ScraperNode Twitter/X Profiles** | `twitter-profiles` | Profile URLs | 4 cr |
| **ScraperNode Twitter/X Posts** | `twitter-posts` | Post URLs | 3 cr |
| **ScraperNode YouTube Channels** | `youtube-channels` | Channel URLs | 4 cr |
| **ScraperNode YouTube Comments** | `youtube-comments` | Video URLs | 2 cr |
| **ScraperNode YouTube Videos** | `youtube-videos` | Video URLs | 1 cr |
| **ScraperNode Facebook Profiles** | `facebook-profiles` | Profile URLs | 4 cr |
| **ScraperNode Facebook Groups** | `facebook-groups` | Group URLs | 3 cr |
| **ScraperNode Facebook Comments** | `facebook-comments` | Post URLs | 1 cr |
| **ScraperNode Facebook Posts** | `facebook-posts` | Post URLs | 1 cr |
| **ScraperNode Facebook Reels** | `facebook-reels` | Profile URLs | 1 cr |
| **ScraperNode Indeed Jobs** | `indeed-jobs` | Job listing URLs | 5 cr |
| **ScraperNode Indeed Companies** | `indeed-companies` | Company URLs | 5 cr |
| **ScraperNode Glassdoor Companies** | `glassdoor-companies` | Company URLs | 5 cr |
| **ScraperNode Glassdoor Reviews** | `glassdoor-reviews` | Review URLs | 5 cr |
| **ScraperNode Glassdoor Jobs** | `glassdoor-jobs` | Job listing URLs | 5 cr |
| **ScraperNode Yelp Businesses** | `yelp-businesses` | Business URLs | 5 cr |
| **ScraperNode Yelp Reviews** | `yelp-reviews` | Review URLs | 5 cr |
| **ScraperNode GitHub Repositories** | `github-repositories` | Repository URLs | 5 cr |
| **ScraperNode Crunchbase Companies** | `crunchbase-companies` | Company URLs | 5 cr |

Each scraper node supports three operations:

| Operation | Description |
| --------- | ----------- |
| **Create** | Start a new scrape job with URLs and optionally wait for completion |
| **Get** | Get job status and details by ID |
| **Get Results** | Retrieve scraped data from a completed job |

### ScraperNode Jobs (Management Node)

The **ScraperNode Jobs** node handles cross-cutting job management and credits:

| Resource | Operation | Description |
| -------- | --------- | ----------- |
| Job | **Get** | Get job status and details by ID |
| Job | **Get Results** | Retrieve scraped data from a completed job |
| Job | **List** | List recent scrape jobs with optional status filter |
| Job | **Cancel** | Cancel a pending/processing job and refund credits |
| Credits | **Get Balance** | Check your current credit balance |
| Credits | **Get Transactions** | View your credit transaction history |

## Features

- **AI Agent compatible** — each scraper node has a focused `usableAsTool` description for accurate tool selection
- **Per-platform icons** — color-coded icons make it easy to identify scrapers on the canvas
- **Return All toggle** — standard n8n pagination pattern for Get Results and List operations
- **Exponential backoff** — automatic retry on transient 5xx, 429, and network errors during polling
- **Data provenance** — every output item includes `pairedItem` for n8n's data tracking
- **Dark mode** — icons adapt to n8n's light and dark themes

## Wait for Completion

When creating a job with "Wait for Completion" enabled, the node polls until the job finishes and outputs each scraped record as a separate n8n item — ready to pipe into the next node in your workflow.

For long-running jobs, prefer using the **ScraperNode Jobs** node's Get/Get Results operations on a schedule to avoid holding an n8n worker.
