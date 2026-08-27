import { createRoot } from "react-dom/client";
import { setAuthTokenGetter } from "@workspace/api-client-react";
import App from "./App";
import { trackVisit } from "@/lib/analytics";
import "./index.css";

setAuthTokenGetter(() => localStorage.getItem("admin_token"));
trackVisit();

createRoot(document.getElementById("root")!).render(<App />);
