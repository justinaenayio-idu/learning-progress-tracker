# Learning Progress Tracker

A React and Node.js learning project for tracking topics in React, JavaScript, and Node.js.

## Features

- Dashboard with a completed-topic count.
- Add topics with a title and category.
- Filter topics by learning status.
- Mark topics as completed or in progress, and delete them from the current view.
- Topic detail routes at `/topics/:topicId`.

## Requirements

Use Node.js 24 and npm.

## Run locally

Install both sets of dependencies from the project root:

```sh
npm ci
npm ci --prefix server
```

Start the Express backend in one terminal:

```sh
npm start --prefix server
```

Start the Vite frontend in another terminal:

```sh
npm run dev
```

Open `http://localhost:5173`. The backend runs at `http://localhost:3001` and allows requests from `http://localhost:5173`. Keep that frontend port available.

## Checks and build

```sh
npm run lint
npm run build
node --check server/server.mjs
```

`npm run preview` serves the frontend build locally. The backend currently allows only the development frontend origin, so API requests from the preview port require a matching CORS configuration.

## API

| Method | Endpoint | Purpose |
| --- | --- | --- |
| GET | `/api/health` | Check that the backend is running. |
| GET | `/api/topics` | List topics. |
| POST | `/api/topics` | Add a topic using a JSON body with `title` and `category`. |

## Current storage behavior

The backend stores topics in memory and resets to the sample topics when restarted. New topics are added through the API. Status changes and deletions currently affect frontend state only and reset when the page reloads.

## Project structure

```text
public/              Browser favicon
src/App.jsx          Tracker components and routes
src/index.css        Application styles
src/main.jsx         React entry point
server/server.mjs    Express API and in-memory topic data
```

Dependency folders, build output, local environment files, and logs are excluded from Git.
