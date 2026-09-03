# 🚀 Rentra Complete Deployment Guide (Vercel + Render)

This document provides a comprehensive, production-ready step-by-step guide to deploying the **Rentra Heavy Equipment Rental Platform**.

---

## 🏗️ Architecture Overview

Rentra follows a modern decoupled full-stack architecture:

```
┌────────────────────────────────────────────────────────┐
│                   CLIENT (Frontend)                    │
│      Hosted on Vercel (Global Edge CDN Network)        │
│          Vite + React 19 + Tailwind CSS + SPA          │
└───────────────▲────────────────────────▲───────────────┘
                │                        │
        REST API Calls               Socket.IO
     (JSON over HTTPS)         (WebSockets / Polling)
                │                        │
┌───────────────▼────────────────────────▼───────────────┐
│                   SERVER (Backend)                     │
│         Hosted on Render (Node.js Web Service)         │
│          Express 5 + Socket.IO + Passport.js           │
└───────┬──────────────┬─────────────┬─────────────┬─────┘
        │              │             │             │
┌───────▼──────┐┌──────▼──────┐┌─────▼─────┐┌──────▼─────┐
│MongoDB Atlas ││ Cloudinary  ││ Razorpay  ││  Groq AI   │
│Cloud Database││Media Storage││  Payments ││Chatbot LLM │
└──────────────┘└─────────────┘└───────────┘└────────────┘
```

- **Frontend (Client)**: React 19 Single Page Application built with Vite and Tailwind CSS. Deployed on **Vercel**.
- **Backend (Server)**: Node.js / Express REST API and Socket.IO real-time engine. Deployed on **Render**.
- **Database**: MongoDB Atlas Cloud.
- **Media Pipeline**: Cloudinary CDN.
- **Payment Gateway**: Razorpay Escrow.
- **OAuth Authentication**: Google Cloud Console (OAuth 2.0).
- **AI Assistant**: Groq LLM Cloud API.

---

## ⚡ Pre-Deployment Optimizations Already Applied

The following critical deployment fixes have been configured in the repository:

1. **Vercel SPA Routing Configuration (`client/vercel.json`)**:
   - Added rewrite rules to ensure refreshing pages or deep links (e.g. `/login`, `/dashboard`, `/equipment/...`) route cleanly to `index.html` rather than throwing Vercel 404 errors.
2. **File Encoding Fixes**:
   - Fixed corrupted UTF-16LE / BOM encoding in `NotFound.jsx` and `ScrollToTop.jsx` so `npm run build` compiles cleanly into `client/dist`.
3. **Render Reverse Proxy Trust (`server/src/app.js`)**:
   - Added `app.set('trust proxy', 1)` so Express correctly identifies HTTPS requests behind Render's reverse proxy load balancer.
4. **Resilient CORS Handling (`server/src/app.js`)**:
   - Normalizes origins, strips trailing slashes, handles comma-separated domains in `CLIENT_URL`, and automatically permits Vercel preview deployments (`*.vercel.app`).
5. **Google OAuth Proxy Configuration (`server/src/config/passport.js`)**:
   - Added `proxy: true` to `GoogleStrategy` so redirect URLs use `https://` instead of `http://`, preventing `redirect_uri_mismatch` errors.

---

## 🗄️ Step 0: Ensure External Cloud Services Are Ready

Before deploying the frontend and backend, make sure your external services are set up:

### 1. MongoDB Atlas (Database)
1. Log in to [MongoDB Atlas](https://cloud.mongodb.com/).
2. Under **Security** -> **Network Access**, ensure IP Access List includes `0.0.0.0/0` (Allow access from anywhere). Cloud providers like Render have dynamic outbound IP ranges.
3. Under **Database Access**, verify your database user credentials.
4. Under **Clusters -> Connect -> Drivers**, grab your connection string:
   ```
   mongodb+srv://<username>:<password>@<cluster>.mongodb.net/?retryWrites=true&w=majority
   ```

### 2. Cloudinary (Image Uploads)
- Retrieve your **Cloud Name**, **API Key**, and **API Secret** from the [Cloudinary Console](https://console.cloudinary.com/).

### 3. Razorpay (Payments)
- Retrieve your **Key ID** (`rzp_test_...` or `rzp_live_...`) and **Key Secret** from [Razorpay Dashboard](https://dashboard.razorpay.com/#/app/keys).

### 4. Groq Cloud (AI Chatbot)
- Retrieve an API key from [Groq Console](https://console.groq.com/keys).

---

## 🟣 Part 1: Deploy Backend to Render

> **Why Deploy Backend First?**  
> You need your live Render backend URL (e.g., `https://rentra-backend.onrender.com`) to plug into Vercel as the frontend environment variable.

### Step 1.1: Push Your Code to GitHub
Make sure all your latest changes are pushed to your GitHub repository:
```bash
git add .
git commit -m "chore: configure production deployment files for Vercel and Render"
git push origin main
```

### Step 1.2: Create a New Web Service on Render
1. Log in to [Render.com](https://dashboard.render.com/).
2. Click the **New +** button in the top navigation and select **Web Service**.
3. Choose **Build and deploy from a Git repository** and click **Next**.
4. Connect your GitHub account and select your **Rentra** repository.

### Step 1.3: Configure Web Service Settings
Fill in the deployment settings:

| Setting | Recommended Value | Notes |
| :--- | :--- | :--- |
| **Name** | `rentra-backend` | This sets your URL: `https://rentra-backend.onrender.com` |
| **Region** | Singapore / Oregon / Frankfurt | Choose the region closest to your target users |
| **Branch** | `main` | Production branch |
| **Root Directory** | `server` | **CRITICAL**: Informs Render to run within the `server` folder |
| **Runtime** | `Node` | Node.js runtime environment |
| **Build Command** | `npm install` | Installs backend dependencies |
| **Start Command** | `npm start` | Runs `node index.js` |
| **Instance Type** | `Free` | 512 MB RAM, 0.1 CPU |

### Step 1.4: Add Backend Environment Variables
Under the **Environment Variables** section on Render, add the following variables:

| Variable Name | Recommended / Example Value | Description |
| :--- | :--- | :--- |
| `NODE_ENV` | `production` | Enables production optimizations |
| `PORT` | `10000` | Render default port (or leave empty; Render injects it) |
| `JWT_SECRET` | `your_long_random_jwt_secret_key` | Secret key for JWT auth tokens |
| `MONGO_URL` | `mongodb+srv://<user>:<password>@cluster0.mongodb.net` | MongoDB Atlas URI |
| `MONGO_DB_NAME` | `rentra_db` | Target database name |
| `CLIENT_URL` | `http://localhost:5173` *(temporary)* | Temporary placeholder; update after Vercel deployment |
| `CLOUDINARY_CLOUD_NAME` | `your_cloudinary_cloud_name` | Cloudinary Cloud Name |
| `CLOUDINARY_API_KEY` | `your_cloudinary_api_key` | Cloudinary API Key |
| `CLOUDINARY_API_SECRET` | `your_cloudinary_api_secret` | Cloudinary API Secret |
| `RAZORPAY_KEY_ID` | `rzp_test_...` | Razorpay Key ID |
| `RAZORPAY_KEY_SECRET` | `your_razorpay_secret` | Razorpay Key Secret |
| `GOOGLE_CLIENT_ID` | `your_google_client_id` | Google OAuth 2.0 Client ID |
| `GOOGLE_CLIENT_SECRET` | `your_google_client_secret` | Google OAuth 2.0 Client Secret |
| `GOOGLE_CALLBACK_URL` | `https://rentra-backend.onrender.com/api/auth/google/callback` | OAuth redirect endpoint |
| `GROQ_API_KEY` | `gsk_...` | Groq LLM API Key |
| `GROQ_MODEL` | `openai/gpt-oss-120b` | Groq Model Name |

### Step 1.5: Deploy and Verify Health Check
1. Click **Create Web Service**.
2. Wait for the build logs to finish (`npm install` -> `npm start`).
3. Once the dashboard shows **Live**, copy your service URL (e.g., `https://rentra-backend.onrender.com`).
4. Test the health check endpoint in your browser:
   ```
   https://rentra-backend.onrender.com/
   ```
   You should receive a JSON response:
   ```json
   {
     "service": "Rentra MERN REST API",
     "status": "ONLINE",
     "version": "2.0.0",
     "database": {
       "isMongoConnected": true,
       "mode": "CUSTOM_MONGODB_ATLAS",
       "databaseName": "rentra_db",
       "connectionConfigured": true
     }
   }
   ```

---

## 🟢 Part 2: Deploy Frontend to Vercel

### Step 2.1: Import Project into Vercel
1. Log in to [Vercel.com](https://vercel.com/).
2. In your dashboard, click **Add New...** -> **Project**.
3. Import your **Rentra** repository from GitHub.

### Step 2.2: Configure the Vercel Project
In the project settings:
1. **Framework Preset**: `Vite` (auto-detected).
2. **Root Directory**:
   - Click **Edit** next to Root Directory.
   - Select the `client` folder.
   - Click **Continue**.
3. **Build and Output Settings**:
   - Build Command: `npm run build` (default)
   - Output Directory: `dist` (default)
   - Install Command: `npm install` (default)

### Step 2.3: Configure Frontend Environment Variables
Expand the **Environment Variables** section and enter:

| Name | Value | Purpose |
| :--- | :--- | :--- |
| `VITE_API_BASE_URL` | `https://rentra-backend.onrender.com/api` | Live Render backend REST API endpoint |
| `VITE_SOCKET_URL` | `https://rentra-backend.onrender.com` | Live Render WebSocket server root |

> ⚠️ **Note**: Replace `rentra-backend.onrender.com` with your exact Render service domain.

### Step 2.4: Deploy
1. Click **Deploy**.
2. Vercel will install dependencies and execute `vite build`.
3. Once deployed, note your production URL:
   ```
   https://rentra-app.vercel.app
   ```

---

## 🔄 Part 3: Final Linkage & Cross-Configuration

Once both services are running, connect them with these steps:

### 1. Update `CLIENT_URL` on Render
1. Open your [Render Dashboard](https://dashboard.render.com/) -> `rentra-backend`.
2. Go to **Environment**.
3. Change `CLIENT_URL` to your production Vercel URL (e.g., `https://rentra-app.vercel.app` — **without trailing slash**).
4. Click **Save Changes**. Render will automatically trigger a zero-downtime redeployment.

### 2. Update Google Cloud OAuth Credentials
If Google Sign-In is enabled:
1. Visit [Google Cloud Console Credentials](https://console.cloud.google.com/apis/credentials).
2. Select your OAuth 2.0 Client ID.
3. In **Authorized JavaScript origins**, add:
   - `https://rentra-app.vercel.app`
4. In **Authorized redirect URIs**, add:
   - `https://rentra-backend.onrender.com/api/auth/google/callback`
5. Click **Save**.

---

## ⏱️ Part 4: Keeping Render Backend Awake (Free Tier Keep-Alive)

Render's free tier puts web services to sleep after 15 minutes of inactivity. The subsequent cold start can take 50+ seconds.

To keep your backend fast and responsive 24/7:
1. Sign up for free at [cron-job.org](https://cron-job.org) or [UptimeRobot](https://uptimerobot.com).
2. Add a new HTTP ping monitor:
   - **URL**: `https://rentra-backend.onrender.com/`
   - **Interval**: Every 10 to 14 minutes
3. This sends a lightweight ping to the healthcheck endpoint `/`, preventing Render from sleeping.

---

## 🛠️ Deployment Troubleshooting Checklist

| Issue | Cause | Solution |
| :--- | :--- | :--- |
| **CORS Error in Browser Console** | Backend does not recognize frontend domain | Ensure `CLIENT_URL` on Render matches `https://rentra-app.vercel.app` (no trailing slash). `server/src/app.js` also supports comma-separated URLs and automatically allows `*.vercel.app` preview branches. |
| **404 on Page Refresh on Vercel** | SPA routing not rewriting to `index.html` | Ensure `client/vercel.json` is committed and present in the build. It routes all paths to `/index.html`. |
| **MongoDB Atlas Connection Error** | Atlas Network Access blocking Render | Go to MongoDB Atlas -> **Network Access** -> click **Add IP Address** -> select **Allow Access From Anywhere** (`0.0.0.0/0`). |
| **Google OAuth `redirect_uri_mismatch`** | Mismatched callback URL | Ensure `https://<backend>.onrender.com/api/auth/google/callback` is saved in Google Cloud Console redirect URIs, and verify `GOOGLE_CALLBACK_URL` on Render. |
| **Image Uploads Failing** | Missing Cloudinary credentials | Check `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET` in Render environment variables. |
| **Initial Request Takes 50s+** | Free tier spin-down | Expected behavior on Render free instances after idle periods. Set up an uptime ping monitor as shown in Part 4. |

---

## 📋 Environment Variables Summary Cheat Sheet

### Backend (`server`) on Render
```env
NODE_ENV=production
PORT=10000
JWT_SECRET=your_super_secret_jwt_key
MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net
MONGO_DB_NAME=rentra_db
CLIENT_URL=https://rentra-app.vercel.app
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
RAZORPAY_KEY_ID=rzp_test_your_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=https://rentra-backend.onrender.com/api/auth/google/callback
GROQ_API_KEY=your_groq_api_key
GROQ_MODEL=openai/gpt-oss-120b
```

### Frontend (`client`) on Vercel
```env
VITE_API_BASE_URL=https://rentra-backend.onrender.com/api
VITE_SOCKET_URL=https://rentra-backend.onrender.com
```
