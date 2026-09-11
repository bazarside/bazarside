# BazarSide Studio

Marketing and portfolio website for **BazarSide** — a digital craft studio that designs and builds bespoke web platforms, ecommerce ecosystems, and digital tools.

Live site: **https://www.bazarside.com**

## What's inside

A zero-build static site — plain HTML, CSS, and vanilla JavaScript. No framework, no bundler, no database.

```
.
├── index.html          # Home: hero, portfolio, services, process, engagement, FAQ
├── contact.html        # Project inquiry form
├── 404.html            # Not-found page
├── assets/
│   ├── css/styles.css  # Full design system (tokens, components, responsive)
│   └── js/app.js       # Theme toggle, mobile nav, scroll reveal, filters, form
├── CNAME               # Custom domain for GitHub Pages
├── robots.txt
├── sitemap.xml
├── .nojekyll           # Serve assets verbatim (skip Jekyll processing)
└── .github/workflows/deploy.yml   # Auto-deploy to GitHub Pages
```

## Features

- **Responsive** — mobile-first, works from 320px to ultrawide.
- **Dark / light theme** — respects system preference, remembers the manual choice.
- **Accessible** — skip link, semantic landmarks, keyboard-friendly nav, reduced-motion support.
- **Fast** — no runtime dependencies; portfolio mockups are rendered in CSS (no heavy images).
- **Portfolio filter** — filter projects by category (ecommerce, brand, tools).
- **Contact form** — client-side validated; ready to wire to a form backend (see below).

## Local preview

No build required. Serve the folder with any static server:

```bash
python -m http.server 8000
# then open http://localhost:8000
```

## Deployment (GitHub Pages)

Deployment is automatic. On every push to `main`, the included GitHub Actions
workflow (`.github/workflows/deploy.yml`) publishes the site to GitHub Pages.

One-time setup in the repo:

1. **Settings → Pages → Build and deployment → Source**: select **GitHub Actions**.
2. The `CNAME` file already points the site at `www.bazarside.com`. To use a
   different domain, edit `CNAME` (or delete it to use the default
   `*.github.io` URL) and update the URLs in `sitemap.xml` and `robots.txt`.

That's it — push and the site goes live.

## Wiring up the contact form

The form (`contact.html` + `assets/js/app.js`) validates on the client and
currently logs the submission to the console. Because the site has no backend,
point it at a hosted form service to receive real inquiries. Open
`assets/js/app.js`, find the `CONTACT FORM HANDLING` section, and replace the
simulated call with a `fetch` to your provider, for example:

- [Formspree](https://formspree.io/)
- [Basin](https://usebasin.com/)
- [Getform](https://getform.io/)

```js
await fetch('https://formspree.io/f/YOUR_FORM_ID', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
  body: JSON.stringify(data),
})
```

## Customizing

- **Colors / type / spacing**: all design tokens live at the top of
  `assets/css/styles.css` under `:root` (and the `[data-theme="light"]` block).
- **Portfolio projects**: edit the `<article class="work">` cards in
  `index.html`. Each card's `data-work` attribute controls which filter it
  appears under.
- **Services, process, engagement, FAQ**: plain markup in `index.html`, grouped
  under labelled section comments.
