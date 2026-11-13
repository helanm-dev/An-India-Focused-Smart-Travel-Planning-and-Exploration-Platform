(() => {
  document.querySelectorAll(".save-place").forEach((button) => {
    button.addEventListener("click", () => {
      const saved = button.getAttribute("aria-pressed") !== "true";
      const card = button.closest(".landing-place-card, .place-card");
      const name = card.querySelector("h3").textContent;
      button.setAttribute("aria-pressed", String(saved));
      button.textContent = saved ? "♥" : "♡";
      button.setAttribute("aria-label", `${saved ? "Unsave" : "Save"} ${name}`);
    });
  });

  const sidebar = document.getElementById("dashboard-sidebar");
  if (!sidebar) return;
  const toggle = document.getElementById("menu-toggle");
  const close = document.getElementById("menu-close");
  const scrim = document.getElementById("drawer-scrim");
  const openMenu = () => {
    sidebar.classList.add("is-open");
    scrim.classList.add("is-open");
    toggle.setAttribute("aria-expanded", "true");
    toggle.setAttribute("aria-label", "Close navigation menu");
  };
  const closeMenu = () => {
    sidebar.classList.remove("is-open");
    scrim.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open navigation menu");
  };
  toggle.addEventListener("click", () => sidebar.classList.contains("is-open") ? closeMenu() : openMenu());
  close.addEventListener("click", closeMenu);
  scrim.addEventListener("click", closeMenu);
  sidebar.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      document.getElementById("destination-search").focus();
    }
  });

  const search = document.getElementById("destination-search");
  const cards = [...document.querySelectorAll(".place-card")];
  const empty = document.getElementById("search-empty");
  search.addEventListener("input", () => {
    const query = search.value.trim().toLowerCase();
    let visible = 0;
    cards.forEach((card) => {
      const matches = !query || `${card.dataset.search} ${card.textContent}`.toLowerCase().includes(query);
      card.hidden = !matches;
      if (matches) visible += 1;
    });
    empty.hidden = visible > 0;
  });

  const form = document.getElementById("itinerary-form");
  const input = document.getElementById("trip-stop");
  const list = document.getElementById("itinerary-list");
  const storageKey = "wanderoam-demo-itinerary";
  const render = () => {
    let stops;
    try {
      const stored = window.localStorage.getItem(storageKey);
      stops = stored ? JSON.parse(stored) : [];
      if (!Array.isArray(stops)) throw new Error("Saved itinerary is not a list.");
    } catch (error) {
      console.warn("WandeRoam could not load the saved itinerary.", error);
      stops = [];
    }
    list.replaceChildren();
    if (!stops.length) {
      const emptyItem = document.createElement("li");
      emptyItem.className = "itinerary-empty";
      emptyItem.textContent = "Your trip ideas will show up here.";
      list.appendChild(emptyItem);
      return;
    }
    stops.forEach((stop, index) => {
      const item = document.createElement("li");
      const label = document.createElement("span");
      label.textContent = stop;
      const remove = document.createElement("button");
      remove.type = "button";
      remove.className = "remove-stop";
      remove.setAttribute("aria-label", `Remove ${stop} from itinerary`);
      remove.textContent = "×";
      remove.addEventListener("click", () => {
        stops.splice(index, 1);
        persist(stops);
        render();
      });
      item.append(label, remove);
      list.appendChild(item);
    });
  };
  const persist = (stops) => {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(stops));
      return true;
    } catch (error) {
      console.error("WandeRoam could not save the itinerary.", error);
      window.alert("We couldn't save this trip idea in your browser. Check storage settings and try again.");
      return false;
    }
  };
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const stop = input.value.trim();
    if (!stop) {
      input.focus();
      return;
    }
    let stops = [];
    try {
      const stored = window.localStorage.getItem(storageKey);
      stops = stored ? JSON.parse(stored) : [];
      if (!Array.isArray(stops)) throw new Error("Saved itinerary is not a list.");
    } catch (error) {
      console.warn("WandeRoam could not read the saved itinerary.", error);
    }
    stops.push(stop);
    if (persist(stops)) {
      input.value = "";
      render();
    }
  });
  render();
})();
