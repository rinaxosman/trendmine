# TrendMine

TrendMine is an AI-powered tool that turns public trend data into practical business and side-hustle ideas.
It analyzes what people are talking about across platforms like Reddit and Google Trends, then generates actionable ideas backed by real signals.

🌐 **Live demo:** https://trendmine.vercel.app/

---

## Overview

TrendMine helps you go from **“what’s trending”** to **“what can I build?”** by combining trend signals with AI-generated idea output.

Use it to:
- Spot rising topics early  
- Understand what people are asking for  
- Generate business ideas and MVP directions backed by evidence  

---

## Features

- Pulls public discussions from selected Reddit subreddits  
- Uses Google Trends data to identify rising topics  
- Clusters related trends into clear themes  
- Generates business ideas and MVP suggestions based on real demand signals  
- Lets users configure sources (time window, location, subreddits, keywords)

---

## Tech Stack

- React + TypeScript  
- Supabase (authentication and database)  
- Public data sources (Reddit, Google Trends)

---

## Running Locally

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Then open:

```
http://localhost:3000
```
---

## Project Status

TrendMine is **feature-complete as an MVP**.

Possible future improvements:
- User accounts and saved ideas  
- Exporting ideas (PDF, CSV, Notion)  
- Improved clustering and deduplication  
- Paid tiers or subscriptions  

---

## Notes on Data & Ethics

TrendMine only uses **publicly available data**:
- Public Reddit posts from selected subreddits  
- Google Trends public search data  
- User-provided keywords  

It does **not** scrape private accounts, require external logins, or collect private or personal data.
