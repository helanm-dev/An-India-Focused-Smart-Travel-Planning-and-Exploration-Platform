# WandeRoam

**Explore India. Discover Stories. Travel Your Way.**

A responsive, frontend-only travel-planning microproject built with HTML5, CSS3 and vanilla JavaScript (ES6+). It brings Indian destination inspiration, demo account forms, itinerary notes, stay ideas, a travel assistant and a budget calculator into one simple experience.

## Run locally

No package installation or build step is required. Open `index.html` in a browser, or use the VS Code **Live Server** extension for a local preview. The pages link to each other using relative paths.

## Pages and scripts

- `index.html` — WandeRoam landing and destination inspiration.
- `register.html` — Registration form with the IA-3 field rules and inline validation.
- `signup.html` / `signin.html` — Demo account creation and sign-in.
- `home.html` — Responsive travel dashboard, itinerary, stays, destination search and calculator.
- `layout.css` / `styles.css` — Shared design tokens, layout and components.
- `assets/images/` — Locally bundled destination photographs for Jaipur, Kerala, Varanasi, the Himalayas, Goa, Agra, Manali, Munnar, Udaipur and Meghalaya.
- `validation.js` — Form validation and explicitly frontend-only demo account storage.
- `theme.js` — Light/dark theme toggle and saved preference.
- `dashboard.js` — Mobile navigation, destination search, saved place buttons and itinerary.
- `chatbot.js` — Floating keyword-based travel assistant.
- `calculator.js` — Arithmetic calculator with a parser (no `eval()`).

## Demo account note

Account details, including passwords, are saved in browser `localStorage` solely to demonstrate frontend form flows. This is **not authentication** and is not secure for real users. Do not enter real credentials. There is no backend, account recovery, booking, live availability or live travel-pricing service.

## Photo credits and deployment

The local photos were downloaded from Pexels' free photo collection and are served from `assets/images/` so the site does not depend on third-party image servers at runtime. Original photo pages: [Jaipur](https://www.pexels.com/photo/37899524/), [Kerala](https://www.pexels.com/photo/12921487/), [Varanasi](https://www.pexels.com/photo/36527284/), [Himalayas](https://www.pexels.com/photo/1478116/), [Goa](https://www.pexels.com/photo/28355680/), [Agra](https://www.pexels.com/photo/11521892/), [Manali](https://www.pexels.com/photo/32464426/), [Munnar](https://www.pexels.com/photo/36982207/), [Udaipur](https://www.pexels.com/photo/15534251/) and [Meghalaya](https://www.pexels.com/photo/10101268/). The site has no runtime package dependencies. The included `vercel.json` supports static deployment from the project root. To publish, create a Git repository, push it to GitHub, then import that repository into Vercel. No remote repository or deployment has been created by this project setup.
