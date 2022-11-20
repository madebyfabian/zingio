# Twitter-Clone

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
