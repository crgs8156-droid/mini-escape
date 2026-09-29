'use client';

// Single route — the app keeps its own state-based view switching inside
// App.jsx (no route-based navigation), so every screen lives under here as
// a client component. No server rendering is required for gameplay.
import App from '../src/App.jsx';

export default function Page() {
  return <App />;
}
