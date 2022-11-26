# zingio App

A Nuxt 3, TailwindCSS, Supabase Auth, EdgeDB Twitter Clone.

## Features

- Authentication (Password, GitHub)
- User Profiles
- Post Lists
- Creating Posts
- Post Comments
- Post Likes
- Profile Settings
- Bookmark Folders
- See [Notion Roadmap](https://madebyfabian.notion.site/zingio-Roadmap-4f80eeac03584de6afeeeccc529e1ae4) for all features.

## Setup

### Installing EdgeDB

- Install EdgeDB CLI locally
- after that, run `edgedb project init`
- then `npm run generate-types:edgedb`

### Add .env

```bash
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

### After changing a `dbschema/*.esdl` file

- `npm run edgedb-migrate`
