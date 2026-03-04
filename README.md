# n8n-nodes-weld

n8n community node for [Weld](https://www.useweld.app) — web scraping across LinkedIn, Instagram, TikTok, Twitter/X, YouTube, Facebook, Indeed, Glassdoor, Yelp, GitHub & Crunchbase.

## Installation

In your n8n instance, go to **Settings → Community Nodes → Install** and enter:

```
n8n-nodes-weld
```

## Credentials

1. Log in to [Weld](https://www.useweld.app)
2. Go to **Settings → API Keys** and create a new key
3. In n8n, add a **Weld API** credential with your API key and base URL

## Nodes

### Per-Platform Scraper Nodes

Each scraper has its own dedicated node with tailored input fields and AI agent descriptions:

| Node | Scraper | Input | Cost |
| ---- | ------- | ----- | ---- |
| **Weld LinkedIn Profiles** | `linkedin-profiles` | Profile URLs | 5 cr |
| **Weld LinkedIn Companies** | `linkedin-companies` | Company URLs | 5 cr |
| **Weld LinkedIn Posts** | `linkedin-posts` | Profile/Company/Post URLs | 3 cr |
| **Weld Instagram Profiles** | `instagram-profiles` | Profile URLs | 4 cr |
| **Weld Instagram Posts** | `instagram-posts` | Post URLs | 3 cr |
| **Weld Instagram Comments** | `instagram-comments` | Post URLs | 2 cr |
| **Weld TikTok Profiles** | `tiktok-profiles` | Profile URLs | 4 cr |
| **Weld TikTok Videos** | `tiktok-posts` | Video URLs | 3 cr |
| **Weld Twitter/X Profiles** | `twitter-profiles` | Profile URLs | 4 cr |
| **Weld Twitter/X Posts** | `twitter-posts` | Post URLs | 3 cr |
| **Weld YouTube Channels** | `youtube-channels` | Channel URLs | 4 cr |
| **Weld YouTube Comments** | `youtube-comments` | Video URLs | 2 cr |
| **Weld Facebook Profiles** | `facebook-profiles` | Profile URLs | 4 cr |
| **Weld Facebook Groups** | `facebook-groups` | Group URLs | 3 cr |
| **Weld Indeed Jobs** | `indeed-jobs` | Job listing URLs | 5 cr |
| **Weld Indeed Companies** | `indeed-companies` | Company URLs | 5 cr |
| **Weld Glassdoor Companies** | `glassdoor-companies` | Company URLs | 5 cr |
| **Weld Glassdoor Reviews** | `glassdoor-reviews` | Review URLs | 5 cr |
| **Weld Glassdoor Jobs** | `glassdoor-jobs` | Job listing URLs | 5 cr |
| **Weld Yelp Businesses** | `yelp-businesses` | Business URLs | 5 cr |
| **Weld Yelp Reviews** | `yelp-reviews` | Review URLs | 5 cr |
| **Weld GitHub Repositories** | `github-repositories` | Repository URLs | 5 cr |
| **Weld Crunchbase Companies** | `crunchbase-companies` | Company URLs | 5 cr |

Each scraper node supports three operations:

| Operation | Description |
| --------- | ----------- |
| **Create** | Start a new scrape job with URLs and optionally wait for completion |
| **Get** | Get job status and details by ID |
| **Get Results** | Retrieve scraped data from a completed job |

### Weld Jobs (Management Node)

The **Weld Jobs** node handles cross-cutting job management and credits:

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

For long-running jobs, prefer using the **Weld Jobs** node's Get/Get Results operations on a schedule to avoid holding an n8n worker.
