# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## Client Environment

The app routes API and auth requests through same-origin `/api/*` paths so Vercel can proxy them to the backend.

- Local development can use the built-in fallback of `http://localhost:5000`.
- `VITE_API_URL` is still used by the image/video helpers to resolve relative media URLs.
- For deployment, set `VITE_API_URL` to your backend origin if your API returns relative media paths.
- The image upload flow also requires `VITE_IMGBB_API_KEY`.

Example:

```bash
VITE_API_URL=https://your-backend-domain.com
VITE_IMGBB_API_KEY=your-imgbb-key
```

## Vercel Deployment

If you deploy this client on Vercel, set the environment variables in the project settings rather than hardcoding them in `vercel.json`.

Required variables:

- `VITE_API_URL` for media URL resolution
- `VITE_IMGBB_API_KEY` for image uploads

The app includes an API rewrite so client-side code can call `/api/*` without cross-origin CORS failures, and an SPA rewrite so routes like `/login` and `/facility/:id` keep working on refresh.

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
