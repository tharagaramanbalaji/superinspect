# SuperInspect v0.1 (Testing MVP)

SuperInspect is a live API request tracker and performance monitor. It instantly identifies slow endpoints (>500ms) and provides a beautiful, real-time dashboard right over your frontend UI. 

Currently in `v0.1` Testing Phase.

## Architecture

This monorepo contains four linked components:

- **`/sdk`**: The lightweight Express middleware that captures response times.
- **`/server`**: The Socket.io relay server handling real-time data events.
- **`/dashboard`**: The React/Tailwind visual analytics panel.
- **`/client`**: The floating UI Widget (Vanilla JS injector) that drops into your SPA.

*(Plus two testing folders: `/example-app` and `/example-frontend` to prove the integration works)*

## 🚀 How to Run the Test Environment

1. **Install Dependencies & Start**
   Open the root directory and run the master script. This will boot all four services simultaneously.
   ```bash
   npm install      # Installs the root concurrently tool
   npm run install:all # Installs all 4 workspace packages
   npm start        # Boots everything up
   ```

2. **View the Dashboard Widget**
   Open your browser to: **`http://localhost:8000`**
   Click the indigo floating action button in the bottom right corner to pop open the interface natively. Hit the "Trigger API calls" buttons on the web page to watch traffic flow locally.

## Features Currently Supported
- **Zero Config**: Just `app.use()` the SDK middleware.
- **Real-Time Data**: No hard refreshes needed.
- **Latency Highlighting**: Endpoints responding slower than 500ms are flagged.
- **Floating DevTools**: Unobtrusive bottom-right floating widget.

## License
MIT
