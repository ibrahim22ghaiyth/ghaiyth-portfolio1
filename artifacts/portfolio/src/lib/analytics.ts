const VISITOR_ID_KEY = "ig_visitor_id";
const LAST_VISIT_KEY = "ig_last_visit_at";

const getVisitorId = () => {
  const existing = localStorage.getItem(VISITOR_ID_KEY);
  if (existing) return existing;

  const generated =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

  localStorage.setItem(VISITOR_ID_KEY, generated);
  return generated;
};

const getCountryFromLocale = () => {
  const locale = navigator.languages?.[0] || navigator.language || "";
  const region = locale.split("-")[1];
  return region?.toUpperCase() || "Unknown";
};

export function trackVisit() {
  const lastVisit = Number(localStorage.getItem(LAST_VISIT_KEY) || 0);
  const now = Date.now();

  if (now - lastVisit < 5 * 60 * 1000) return;

  localStorage.setItem(LAST_VISIT_KEY, String(now));

  fetch("/api/analytics/visit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      clientId: getVisitorId(),
      path: window.location.pathname,
      country: getCountryFromLocale(),
    }),
    keepalive: true,
  }).catch(() => {
    localStorage.removeItem(LAST_VISIT_KEY);
  });
}
