# Mobility Control Tower (Static Demo)

A single-page, static “Mobility Control Tower” that unifies five AI demos (Fleet, Ops, Revenue, Customer/Risk, ESG) powered entirely by JSON files and vanilla HTML/CSS/JS. Designed for GitHub Pages or any static host.

## Project Structure
```
/index.html
/styles.css
/app.js
/data/config.json
/data/scenarios.json
/data/fleet.json
/data/ops.json
/data/revenue.json
/data/customer.json
/data/esg.json
/README.md
```

## Running locally
1. Ensure you have Python 3 installed.
2. From the project root, start a simple web server so `fetch()` can read the JSON files:
   ```bash
   python3 -m http.server 8000
   ```
3. Open your browser to [http://localhost:8000](http://localhost:8000).

## Deploying to GitHub Pages
1. Commit and push this repository to GitHub.
2. In your GitHub repo, go to **Settings → Pages**.
3. Under **Source**, choose **Deploy from a branch** and select the default branch root (`/`).
4. Save. GitHub Pages will build and host the site at the provided URL; all data loads via `fetch()` from the `/data` folder.

## How it works
- The UI loads configuration and scenario data from `/data/config.json` and `/data/scenarios.json`.
- Each tab (Fleet, Ops, Revenue, Customer/Risk, ESG) pulls its dataset from a dedicated JSON file in `/data`.
- A single **Play story** button narrates the end-to-end journey (Normal → Disrupt → Correct) using the browser Speech Synthesis API with a female voice when available.
- Scenario playback adjusts the base dataset on the fly (adding badges, prepending recommendations, shifting KPI tone) without extra files per scenario.
- The map uses open-source OpenStreetMap tiles focused on eastern Australia with animated vehicle markers that drift as scenarios change.
- Scenario toggles adjust the base dataset on the fly (adding badges, prepending recommendations, and shifting KPI tone) without needing extra files per scenario.
- Vanilla HTML/CSS/JS only—no build steps or external dependencies—ensuring GitHub Pages compatibility.
