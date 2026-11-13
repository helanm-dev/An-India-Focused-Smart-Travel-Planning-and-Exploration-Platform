(() => {
  const existing = document.querySelector(".chat-launcher");
  if (existing) return;
  const launcher = document.createElement("button");
  launcher.className = "chat-launcher";
  launcher.type = "button";
  launcher.setAttribute("aria-label", "Open WandeRoam travel assistant");
  launcher.setAttribute("aria-expanded", "false");
  launcher.innerHTML = '<span aria-hidden="true">✦</span>';

  const panel = document.createElement("section");
  panel.className = "chat-panel";
  panel.setAttribute("aria-label", "WandeRoam travel assistant");
  panel.hidden = true;
  panel.innerHTML = '<div class="chat-head"><span class="chat-head-icon" aria-hidden="true">✦</span><span><strong>Roam, the travel guide</strong><small>Here to help you find your way</small></span><button class="chat-close" type="button" aria-label="Close chat">×</button></div><div class="chat-messages" role="log" aria-live="polite" aria-relevant="additions"><div class="bot-msg">Hey there! Ask me about Indian destinations, budgets, seasons, stays, itineraries or travel tips.</div></div><form class="chat-form"><label class="visually-hidden" for="chat-input">Ask the travel assistant</label><input id="chat-input" type="text" autocomplete="off" placeholder="Ask me anything about your trip…" required><button type="submit" aria-label="Send message">↑</button></form>';
  document.body.append(launcher, panel);

  const messages = panel.querySelector(".chat-messages");
  const input = panel.querySelector("#chat-input");
  const closeButton = panel.querySelector(".chat-close");
  const responses = [
    { match: /budget|cost|expensive|cheap|money|rupee/i, answer: "A comfortable India trip can vary a lot by region and travel style. As a rough student-travel starting point, plan around ₹1,500–₹3,500 per person per day for budget stays, local food and transport; check current prices before booking." },
    { match: /season|weather|when|month|monsoon|best time/i, answer: "For many northern destinations, October to March brings cooler sightseeing weather. Kerala and the south are often pleasant from September to March. Check local forecasts: monsoon timing and mountain conditions can vary." },
    { match: /stay|hotel|accommodation|hostel|homestay|where.*sleep/i, answer: "Try locally run homestays and guesthouses for a more personal stay. Compare recent reviews, location, cancellation terms and transport access, and book through a trusted channel." },
    { match: /itinerary|plan|days|route|trip|schedule/i, answer: "A relaxed plan usually leaves time for fewer places. Pick one region, group nearby sights together, and keep a little unscheduled time. You can add ideas to the itinerary section on the dashboard." },
    { match: /destination|place|where|visit|india|recommend/i, answer: "For heritage, try Jaipur or Varanasi; for mountains, explore Himachal; for a slower waterside break, consider Kerala. Tell me what you enjoy and how many days you have, and I can narrow it down." },
    { match: /tip|safe|safety|pack|travel advice/i, answer: "A few good basics: carry water, respect local customs, keep digital copies of important documents, check transport and weather updates, and share your itinerary with someone you trust." },
    { match: /hello|hi|hey|namaste/i, answer: "Namaste! What are you dreaming about—mountains, heritage, food, beaches or a little of everything?" }
  ];

  const addMessage = (text, className) => {
    const message = document.createElement("div");
    message.className = className;
    message.textContent = text;
    messages.appendChild(message);
    messages.scrollTop = messages.scrollHeight;
  };
  const getReply = (text) => {
    const result = responses.find((item) => item.match.test(text));
    return result ? result.answer : "I'm best at helping with Indian destinations, travel budgets, seasons, accommodation, itinerary planning and practical tips. Which would you like to explore?";
  };
  const togglePanel = (open) => {
    panel.hidden = !open;
    launcher.setAttribute("aria-expanded", String(open));
    launcher.setAttribute("aria-label", open ? "Close WandeRoam travel assistant" : "Open WandeRoam travel assistant");
    launcher.innerHTML = `<span aria-hidden="true">${open ? "×" : "✦"}</span>`;
    if (open) input.focus();
  };

  launcher.addEventListener("click", () => togglePanel(panel.hidden));
  closeButton.addEventListener("click", () => togglePanel(false));
  panel.querySelector(".chat-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    addMessage(text, "user-msg");
    input.value = "";
    window.setTimeout(() => addMessage(getReply(text), "bot-msg"), 180);
  });
})();
