# GitHub Pages deployment

This version is configured as a static Next.js export. It stores categories and prompts in the visitor's browser using `localStorage`, so it does not need PostgreSQL or a server API.

## Publish steps

1. Create a GitHub repository named exactly `<your-username>.github.io`.
2. Upload all files from this project to the repository's `main` branch.
3. Open **Settings → Pages** and set **Source** to **GitHub Actions**.
4. Push to `main` or run **Actions → Deploy to GitHub Pages → Run workflow**.
5. Open `https://<your-username>.github.io/` after the workflow completes.

The included workflow builds the site and publishes the generated `out` folder automatically.

## Important limitation

Because GitHub Pages is static hosting, data is saved separately in each visitor's browser. For shared data, login, PostgreSQL, or cross-device syncing, deploy the original server version on a Node-compatible host instead.
