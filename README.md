# Twitter-Clone

A Nuxt 3, TailwindCSS, and Supabase Auth, Xata DB Twitter Clone.

## Features

- Authentication
- User Profiles
- Post Lists
- Creating Posts
- Post Comments
- Post Likes
- Profile Settings
- Bookmark Folders
- See [Notion Roadmap](https://www.notion.so/madebyfabian/Twitter-2-0-4f80eeac03584de6afeeeccc529e1ae4) for all features.

## Setup

### Install global dependencies

```bash
npm install @xata.io/cli -g
```

### Init Xata

See Xata docs. Init CLI.

### Add .env

```bash
# API key used by the CLI and the SDK
# Make sure your framework/tooling loads this file on startup to have it available for the SDK
XATA_API_KEY="<key>"
# Xata branch that will be used if there's not a xata branch with the same name as your git branch
XATA_FALLBACK_BRANCH="<branch>"

# Supabase
SUPABASE_URL="https://example.supabase.com"
SUPABASE_KEY="<your_key>"
```

### Install dependencies

```bash
npm install
```

### Run dev server

```bash
npm start
```
