# Dailymotion Channel Browser

A small experimental web app for browsing videos from Dailymotion channels, built with plain TypeScript.

For additional thoughts and implementation notes, see the [Project Notes](NOTES.md).

## 🎯 Features

- **Browse Channel Videos** – View videos from any Dailymotion channel
- **Simple Pagination** – Load more videos with a single button
- **Modal Player** – Watch videos directly using the Dailymotion Player SDK
- **Dark/Light Theme** – Remembers your theme preference
- **Adaptive Header** – Hides or shows based on scroll direction
- **Responsive Layout** – Starts mobile-first and adapts to larger screens

## 🛠️ Tech Stack

- **TypeScript (5.9.3)** – For type safety and better maintainability
- **Vite (7.1.12)** – Lightweight build tool and dev server
- **Vitest (4.0.7)** – Testing framework
- **ESLint + Prettier** – For consistent style and formatting
- **BEM Methodology** – For CSS class naming and organization
- **No Frameworks** – Just vanilla TypeScript and DOM APIs

## 📋 Requirements

- Node.js ≥ 18.0.0
- npm ≥ 9.0.0

## 🔒 Browser Support

Built and tested mainly on modern browsers:

- Chrome / Edge (latest)
- Firefox (latest)
- Safari (latest)

## 🚀 Getting Started

### Installation

```bash
git clone https://github.com/kevinboudot/dailymotion-channel-browser
cd dailymotion-channel-browser
npm install
```

### Development

```bash
npm run dev
```

Then open `http://localhost:5173` in your browser.

### Build

| Command                 | Description                                                 |
| ----------------------- | ----------------------------------------------------------- |
| `npm run build`         | Build the project                                           |
| `npm run build:analyze` | Build and visualize bundle size with an interactive treemap |
| `npm run preview`       | Preview the built app locally                               |

The production build is output to `dist/`.

### Tests

```bash
npm test
npm run test:watch
npm run test:ui
npm run test:cov
```

## 📖 Usage

1. Open the app in your browser.
2. By default, it loads videos from the `dm-support-policy` channel.
3. Click any video to open the modal player.
4. Use the "Load More" button to fetch additional videos.

You can also specify a custom channel via a query parameter:

```
http://localhost:5173/?channel=YOUR_CHANNEL_ID
```

If no channel is provided, the default one will be used.

## 🎨 Architecture Overview

The project is organized around small, reusable components and utilities rather than a full framework.

- **Components** – UI blocks with lifecycle methods (mount, destroy)
- **Features** – Handle state, events, and shared behavior
- **Services** – Wrap external APIs and SDKs

Communication between components follows a simple observer pattern with callbacks.

## 🔍 Code Quality

A few commands to keep things consistent:

```bash
npm run typecheck
npm run lint
npm run lint:fix
npm run format
npm run format:check
npm run check
```

## ⚙️ Configuration

No environment variables are needed for now.

Most constants are defined in `src/constants.ts`.

Vite, TypeScript, and ESLint each have their own configuration files for clarity.
