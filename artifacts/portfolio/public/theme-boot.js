(function () {
  try {
    var firstSegment = window.location.pathname.split("/").filter(Boolean)[0] || "";
    var lang = firstSegment === "en" ? "en" : "ar";
    var html = document.documentElement;
    html.lang = lang;
    html.dir = lang === "ar" ? "rtl" : "ltr";
    var storedTheme = localStorage.getItem("site_theme");
    var theme = storedTheme === "dark" ? "dark" : "light";
    html.classList.toggle("dark", theme === "dark");
  } catch (error) {
    /* localStorage or DOM unavailable: keep defaults */
  }
})();
