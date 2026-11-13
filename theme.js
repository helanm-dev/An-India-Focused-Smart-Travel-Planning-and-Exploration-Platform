(() => {
  const storageKey = "wanderoam-theme";
  const root = document.documentElement;
  const readTheme = () => {
    try {
      const saved = window.localStorage.getItem(storageKey);
      return saved === "dark" || saved === "light" ? saved : "light";
    } catch (error) {
      console.warn("WandeRoam could not read the saved theme.", error);
      return "light";
    }
  };

  const applyTheme = (theme) => {
    root.dataset.theme = theme;
    document.querySelectorAll("[data-theme-toggle]").forEach((button) => {
      const dark = theme === "dark";
      button.setAttribute("aria-label", dark ? "Switch to light theme" : "Switch to dark theme");
      button.setAttribute("aria-pressed", String(dark));
      const icon = button.querySelector("span");
      if (icon) icon.textContent = dark ? "☀" : "☾";
    });
  };

  applyTheme(readTheme());
  document.addEventListener("click", (event) => {
    const toggle = event.target.closest("[data-theme-toggle]");
    if (!toggle) return;
    const theme = root.dataset.theme === "dark" ? "light" : "dark";
    applyTheme(theme);
    try {
      window.localStorage.setItem(storageKey, theme);
    } catch (error) {
      console.warn("WandeRoam could not save the selected theme.", error);
    }
  });
})();
