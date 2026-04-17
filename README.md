<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1cTijtr_W8T2hlR3-pwF3MYToyyKP6QNj

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Deploy to GitHub Pages

This project is configured for deployment via GitHub Actions.

- The workflow is in `.github/workflows/deploy.yml`
- A custom domain is defined in `CNAME` as `dua.shakhbanov.org`

On each push to the `main` branch, GitHub Actions will:

1. install dependencies
2. build the app with `npm run build`
3. publish the `dist` folder to GitHub Pages

To finish deployment:

- enable GitHub Pages on your repository (use the default Pages settings for the branch)
- add a CNAME or A-record for `dua.shakhbanov.org` in your DNS provider
- wait for GitHub to verify the custom domain and provision HTTPS automatically
