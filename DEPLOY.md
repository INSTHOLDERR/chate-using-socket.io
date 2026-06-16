# Render Deployment Guide

## Steps

1. Push this code to your GitHub repo (replace the old code)
2. Go to https://render.com → **New → Web Service**
3. Connect your GitHub repo
4. Set these settings:
   - **Build Command:** `npm run build`
   - **Start Command:** `npm start`
   - **Root Directory:** *(leave blank)*

## Environment Variables (set in Render Dashboard → Environment)

Add ALL of these — do NOT commit `.env` files to GitHub.

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `PORT` | `5001` |
| `MONGODB_URI` | your MongoDB Atlas connection string |
| `JWT_SECRET` | your secret key |
| `CLOUDINARY_CLOUD_NAME` | your Cloudinary name |
| `CLOUDINARY_API_KEY` | your Cloudinary API key |
| `CLOUDINARY_API_SECRET` | your Cloudinary secret |
| `EMAIL_USER` | your Gmail address |
| `EMAIL_PASS` | your Gmail app password |
| `GOOGLE_CLIENT_ID` | your Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | your Google OAuth client secret |
| `VITE_GOOGLE_CLIENT_ID` | **same value as GOOGLE_CLIENT_ID** ⬅️ critical! |

> `VITE_GOOGLE_CLIENT_ID` must be set in Render because Vite bakes env vars
> at **build time** — the `.env` file in the repo is not read during Render builds.

## Google OAuth Console Settings

Go to https://console.cloud.google.com → Your project → OAuth 2.0 Credentials:

- **Authorised JavaScript origins:** add your Render URL  
  e.g. `https://chate-using-socket-io.onrender.com`
- **Authorised redirect URIs:** add your Render URL  
  e.g. `https://chate-using-socket-io.onrender.com`

## What was fixed

1. **`vite: not found`** — moved `vite` and build tools from `devDependencies` to `dependencies`
2. **Google login broken** — `VITE_GOOGLE_CLIENT_ID` was not available at build time; must be set as Render env var
3. **401 on `/api/auth/check`** — cookie `sameSite` was `"strict"` which blocks cookies on HTTPS; changed to `"none"` with `secure: true`
4. **OTP / email** — no code change needed; ensure `EMAIL_USER` and `EMAIL_PASS` are set correctly in Render
5. **Socket.IO CORS** — was hardcoded to `localhost:5173`; fixed to allow same-origin in production
