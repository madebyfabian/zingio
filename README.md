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

### Installing EdgeDB CLI & TypeScript Types

- Install EdgeDB CLI locally
- after that, run `edgedb project init`
- then `npm run generate-types:edgedb`

### Deploy EdgeDB

- See https://www.edgedb.com/docs/guides/deployment/digitalocean
- Create `digitalocean` Link in CLI (`<dsn>` is the `edgedb://...` connection string)
  ```bash
  edgedb instance link \
  	--dsn <dsn> \
  	--trust-tls-cert \
  	--non-interactive \
  	digitalocean
  ```
- Run migrations
  ```bash
  edgedb migrate --dsn <dsn> --tls-security insecure
  ```

#### Connect to edgeDB

This is not required, but to test the connection, you can run

```bash
edgedb -I digitalocean
```

### Add .env

```bash
# Supabase
SUPABASE_URL="https://example.supabase.com"
SUPABASE_KEY="<your_key>"

# EdgeDB
EDGEDB_DSN="<your_dsn>"
EDGEDB_CLIENT_TLS_SECURITY=insecure
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

## Info

`node-fetch@2` in `devDependencies` is required due to a bug where it would otherwise use `node-fetch@3` and because this is esm, it doesn't work with the `edgedb` package. See: https://discord.com/channels/841451783728529451/1046195371933696069/1046206050266787911
