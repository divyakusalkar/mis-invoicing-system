# 🚀 Deployment Guide - MIS Invoicing System

## Overview
- **Backend**: Spring Boot 3.2 → Railway (with MySQL)
- **Frontend**: React 18 + Vite → Netlify
- **CI/CD**: GitHub Actions

---

## Prerequisites

1. **GitHub Account** - Repository must be on GitHub
2. **Railway Account** - https://railway.app (free tier: 500 hours/month)
3. **Netlify Account** - https://netlify.com (free tier: unlimited)

---

## Step 1: Push Code to GitHub

```bash
# Initialize git if not already done
git init

# Add all files
git add .

# Commit
git commit -m "Prepare for production deployment"

# Create GitHub repository and push
git remote add origin https://github.com/YOUR_USERNAME/mis-invoicing-system.git
git branch -M main
git push -u origin main
```

---

## Step 2: Deploy Backend to Railway

### 2.1 Create Railway Project

1. Go to https://railway.app and sign in with GitHub
2. Click **"New Project"** → **"Deploy from GitHub repo"**
3. Select your repository
4. Railway will detect the `backend` folder

### 2.2 Add MySQL Database

1. In your Railway project, click **"New"** → **"Database"** → **"MySQL"**
2. Wait for MySQL to provision (takes ~30 seconds)
3. Click on the MySQL service → **"Variables"** tab
4. Copy these values (you'll need them):
   - `MYSQL_URL` (full JDBC URL)
   - `MYSQLUSER`
   - `MYSQLPASSWORD`
   - `MYSQLHOST`
   - `MYSQLPORT`
   - `MYSQLDATABASE`

### 2.3 Configure Backend Service

1. Click on your backend service in Railway
2. Go to **"Variables"** tab
3. Add these environment variables:

| Variable | Value |
|----------|-------|
| `MYSQL_URL` | `jdbc:mysql://${MYSQLHOST}:${MYSQLPORT}/${MYSQLDATABASE}` |
| `MYSQL_USER` | `${MYSQLUSER}` |
| `MYSQL_PASSWORD` | `${MYSQLPASSWORD}` |
| `MYSQL_DRIVER` | `com.mysql.cj.jdbc.Driver` |
| `HIBERNATE_DIALECT` | `org.hibernate.dialect.MySQLDialect` |
| `JPA_DDL_AUTO` | `update` |
| `JPA_SHOW_SQL` | `false` |
| `H2_CONSOLE_ENABLED` | `false` |
| `CORS_ORIGINS` | `https://YOUR_NETLIFY_SITE.netlify.app` |

> **Note**: Railway supports variable references like `${MYSQLHOST}`. Use the "Add Reference" button.

### 2.4 Set Root Directory

1. Go to **"Settings"** tab
2. Under **"Root Directory"**, enter: `backend`
3. Railway will auto-detect the Dockerfile

### 2.5 Generate Domain

1. Go to **"Settings"** → **"Networking"**
2. Click **"Generate Domain"**
3. Your backend URL will be: `https://YOUR_PROJECT.up.railway.app`

### 2.6 Verify Deployment

```bash
# Test the API
curl https://YOUR_PROJECT.up.railway.app/api/dashboard/stats
```

Expected response: `{"totalClients":0,"totalInvoices":0,...}`

---

## Step 3: Deploy Frontend to Netlify

### 3.1 Create Netlify Site

1. Go to https://app.netlify.com
2. Click **"Add new site"** → **"Import an existing project"**
3. Connect to GitHub and select your repository

### 3.2 Configure Build Settings

| Setting | Value |
|---------|-------|
| Base directory | `frontend` |
| Build command | `npm run build` |
| Publish directory | `frontend/dist` |

### 3.3 Set Environment Variables

1. Go to **"Site settings"** → **"Environment variables"**
2. Add:

| Key | Value |
|-----|-------|
| `VITE_API_URL` | `https://YOUR_RAILWAY_PROJECT.up.railway.app/api` |

### 3.4 Deploy

1. Click **"Deploy site"**
2. Wait for build to complete (~2 minutes)
3. Your frontend URL: `https://YOUR_SITE.netlify.app`

### 3.5 Update Backend CORS

Go back to Railway and update `CORS_ORIGINS`:
```
https://YOUR_SITE.netlify.app
```

Redeploy the backend if needed.

---

## Step 4: Setup GitHub Actions CI/CD

### 4.1 Get Railway Token

1. Go to https://railway.app/account/tokens
2. Click **"Create Token"**
3. Name it: `github-actions`
4. Copy the token

### 4.2 Get Railway Service ID

1. In your Railway project, click on the backend service
2. Go to **"Settings"**
3. Copy the **"Service ID"** (or use the service name)

### 4.3 Get Netlify Tokens

1. Go to https://app.netlify.com/user/applications
2. Click **"New access token"**
3. Name it: `github-actions`
4. Copy the token

5. For Site ID: Go to your site → **"Site configuration"** → **"Site details"**
6. Copy the **"Site ID"**

### 4.4 Add GitHub Secrets

Go to your GitHub repository → **"Settings"** → **"Secrets and variables"** → **"Actions"** → **"New repository secret"**

Add these secrets:

| Secret Name | Value |
|-------------|-------|
| `RAILWAY_TOKEN` | Your Railway API token |
| `RAILWAY_SERVICE_NAME` | Your backend service name (e.g., `backend`) |
| `NETLIFY_AUTH_TOKEN` | Your Netlify access token |
| `NETLIFY_SITE_ID` | Your Netlify site ID |
| `VITE_API_URL` | `https://YOUR_RAILWAY_PROJECT.up.railway.app/api` |

### 4.5 Test CI/CD

```bash
# Make a small change and push
git add .
git commit -m "Test CI/CD deployment"
git push origin main
```

Check GitHub Actions tab for deployment status.

---

## Step 5: Verify Live Deployment

### Backend Health Check
```bash
curl https://YOUR_RAILWAY_PROJECT.up.railway.app/api/dashboard/stats
```

### Frontend Access
Open: `https://YOUR_SITE.netlify.app`

### Full Flow Test
1. Open frontend URL in browser
2. Create a new client
3. Create an invoice for the client
4. Verify data persists after page refresh

---

## Environment Variables Reference

### Backend (Railway)

| Variable | Description | Production Value |
|----------|-------------|------------------|
| `PORT` | Server port | Auto-set by Railway |
| `MYSQL_URL` | Database JDBC URL | `jdbc:mysql://${MYSQLHOST}:${MYSQLPORT}/${MYSQLDATABASE}` |
| `MYSQL_USER` | Database username | `${MYSQLUSER}` |
| `MYSQL_PASSWORD` | Database password | `${MYSQLPASSWORD}` |
| `MYSQL_DRIVER` | JDBC driver class | `com.mysql.cj.jdbc.Driver` |
| `HIBERNATE_DIALECT` | Hibernate dialect | `org.hibernate.dialect.MySQLDialect` |
| `JPA_DDL_AUTO` | Schema management | `update` |
| `JPA_SHOW_SQL` | Log SQL queries | `false` |
| `H2_CONSOLE_ENABLED` | H2 console access | `false` |
| `CORS_ORIGINS` | Allowed CORS origins | Your Netlify URL |

### Frontend (Netlify)

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `https://xxx.up.railway.app/api` |

---

## Troubleshooting

### Backend Issues

**Build fails on Railway:**
```bash
# Check logs in Railway dashboard
# Common fix: Ensure Dockerfile is in backend/ directory
```

**Database connection fails:**
```bash
# Verify MySQL variables are correctly referenced
# Check Railway MySQL service is running
```

**CORS errors:**
```bash
# Update CORS_ORIGINS in Railway with exact Netlify URL
# Include https:// prefix
# No trailing slash
```

### Frontend Issues

**Build fails on Netlify:**
```bash
# Check build logs in Netlify dashboard
# Ensure base directory is set to 'frontend'
```

**API calls fail:**
```bash
# Check VITE_API_URL environment variable
# Verify backend is running
# Check browser console for CORS errors
```

### CI/CD Issues

**Railway deployment fails:**
```bash
# Verify RAILWAY_TOKEN is valid
# Check RAILWAY_SERVICE_NAME matches exactly
```

**Netlify deployment fails:**
```bash
# Verify NETLIFY_AUTH_TOKEN and NETLIFY_SITE_ID
# Check build output in GitHub Actions logs
```

---

## Cost & Limits (Free Tier)

### Railway
- **Hours**: 500 execution hours/month
- **Memory**: 512 MB RAM
- **Storage**: 1 GB MySQL storage
- **Bandwidth**: 100 GB/month
- **Sleep**: Service may sleep after inactivity (wakes on request)

### Netlify
- **Bandwidth**: 100 GB/month
- **Build minutes**: 300 minutes/month
- **Sites**: Unlimited
- **Uptime**: 99.9% SLA

---

## Live URLs (Update after deployment)

| Service | URL |
|---------|-----|
| **Backend API** | `https://YOUR_PROJECT.up.railway.app/api` |
| **Frontend** | `https://YOUR_SITE.netlify.app` |
| **API Health** | `https://YOUR_PROJECT.up.railway.app/api/dashboard/stats` |

---

## Quick Commands Reference

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Deploy backend manually
cd backend
railway up

# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy frontend manually
cd frontend
npm run build
netlify deploy --prod --dir=dist
```

---

## Support

- Railway Docs: https://docs.railway.app
- Netlify Docs: https://docs.netlify.com
- GitHub Actions Docs: https://docs.github.com/en/actions
