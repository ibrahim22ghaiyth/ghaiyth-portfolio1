import { createRoot } from "react-dom/client";
import { setAuthTokenGetter, setBaseUrl } from "@workspace/api-client-react";
import "@fontsource-variable/ibm-plex-sans/wght.css";
import "@fontsource/ibm-plex-sans-arabic/arabic-400.css";
import "@fontsource/ibm-plex-sans-arabic/arabic-500.css";
import "@fontsource/ibm-plex-sans-arabic/arabic-600.css";
import "@fontsource/ibm-plex-sans-arabic/arabic-700.css";
import "@fontsource/ibm-plex-mono/latin-400.css";
import "@fontsource/ibm-plex-mono/latin-500.css";
import "@fontsource/ibm-plex-mono/latin-600.css";
import "@fontsource/ibm-plex-mono/latin-700.css";
import App from "./App";
import { RootErrorBoundary } from "@/components/RootErrorBoundary";
import { API_BASE_URL } from "@/lib/api-base";
import { trackVisit } from "@/lib/analytics";
import "./index.css";

if (API_BASE_URL) {
  setBaseUrl(API_BASE_URL);
}
setAuthTokenGetter(() => localStorage.getItem("admin_token"));
trackVisit();

createRoot(document.getElementById("root")!).render(
  <RootErrorBoundary>
    <App />
  </RootErrorBoundary>,
);
