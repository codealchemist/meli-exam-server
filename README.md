# meli-exam-server

Server app for MELI frontend engineering exam.

[![JavaScript Style Guide](https://cdn.rawgit.com/standard/standard/master/badge.svg)](https://github.com/standard/standard)

# API

The following endpoints are exposed:

- `/api/items?q=[query]`: Uses `[query]` to search for products.
- `/api/items/:id`: Returns product details for passed product `id`.
  Combines requests to MELI endpoints:
  - /items/:id
  - /items/:id/description
- `/api/categories/:id`: Returns category details for passed category `id`.

All endpoints return JSON data.

# CORS

Cross origin is limited to whitelisted domains found in: `src/whitelist.json`

```
[
  "https://meli-exam-client.herokuapp.com",
  "http://meli-exam-client.herokuapp.com",
  "http://localhost",
  "http://0.0.0.0"
]

```

Env var `MODE` is used to enable / disable CORS.

Set `MODE=dev` to turn off CORS for development mode if needed.

It's already done on `npm start`.

# Development

Clone this repo and instal dependencies:

```
git clone https://github.com/codealchemist/meli-exam-server
cd meli-exam-server
npm i
```

Start the app with `npm start`.

# Production

Use `npm run prod` to run in production mode.

It will leverage CORS and domain whitelisting.

# Testing

Run test with `npm test`.

You can optionally run the linter on the command line with `npm run lint`.

# About

The app uses Express.js to serve it's own API, working as a proxy for MELI's APIs.

Responses are massaged to match client expectations.
