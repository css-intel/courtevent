# 🚀 NETLIFY DEPLOYMENT GUIDE

Follow these steps to deploy your Virtual Check In platform to Netlify.

## ✅ STEP 1: Create GitHub Repository

### 1.1 Create a GitHub Account (if you don't have one)
- Go to https://github.com
- Sign up for free

### 1.2 Create a New Repository
1. Click **+** icon (top right) → New repository
2. **Repository name:** `virtual-checkin` (or your choice)
3. **Description:** "My Virtual Check In - Event Management Platform"
4. Choose **Public** (for free deployment)
5. Click **Create repository**

### 1.3 Push Your Code to GitHub
Run these commands in your terminal:

```bash
cd c:\Users\CSS\OneDrive\Desktop\CSS\VCI

# Add remote repository
git remote add origin https://github.com/YOUR_USERNAME/virtual-checkin.git

# Rename branch to main if needed (might already be main)
git branch -M main

# Push code to GitHub
git push -u origin main
```

**Note:** Replace `YOUR_USERNAME` with your actual GitHub username.

---

## ✅ STEP 2: Set Up Supabase

### 2.1 Create Supabase Project
1. Go to https://supabase.com/dashboard
2. Click **New project**
3. **Project name:** "VirtualCheckin" (or your choice)
4. **Database password:** Create a strong password
5. Choose **Region** closest to you
6. Click **Create new project** (wait 2-3 minutes)

### 2.2 Get Your Supabase Credentials
1. Go to **Settings** → **API** (left sidebar)
2. Copy these values:
   - **Project URL** (save as `NEXT_PUBLIC_SUPABASE_URL`)
   - **Anon Key** under "Project API keys" (save as `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
   - **Service Role Key** (save as `SUPABASE_SERVICE_ROLE_KEY`)

### 2.3 Create Database Tables
1. In Supabase, go to **SQL Editor**
2. Click **New Query**
3. Copy the SQL from DEPLOYMENT.md (the CREATE TABLE statements)
4. Paste it all in
5. Click **Run**

**Wait a minute for tables to be created.**

---

## ✅ STEP 3: Deploy Frontend to Netlify

### 3.1 Create Netlify Account
1. Go to https://netlify.com
2. Click **Sign up**
3. Choose **Sign up with GitHub**
4. Authorize Netlify to access your GitHub

### 3.2 Deploy Your Site
1. After logging in, click **Add new site** → **Import an existing project**
2. Click **GitHub**
3. Authorize Netlify to access your repositories
4. Find and select **`virtual-checkin`** repository
5. Click **Deploy site**

### 3.3 Configure Build Settings
Netlify will show deployment settings. Make sure these are correct:

- **Branch to deploy:** `main`
- **Build command:** `npm run frontend:build`
- **Publish directory:** `frontend/.next`
- **Node version:** `18.x`

Click **Save** if you need to change anything.

### 3.4 Add Environment Variables
1. Go to **Site settings** → **Build & deploy** → **Environment**
2. Click **Edit variables**
3. Add these variables:

```
NEXT_PUBLIC_SUPABASE_URL=<your supabase url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your supabase anon key>
NEXT_PUBLIC_API_URL=<leave blank for now, add backend URL later>
```

4. Click **Save**

### 3.5 Trigger Deploy
1. Go back to **Deployments**
2. Click **Trigger deploy** → **Deploy site**
3. Watch the build logs (should take 2-3 minutes)

**✅ Your frontend is now live!** 🎉

You'll see a URL like: `https://your-site-name.netlify.app`

---

## ✅ STEP 4: Deploy Backend (Choose One Option)

### OPTION A: Deploy to Heroku (Easier)

#### A.1 Create Heroku Account
1. Go to https://www.heroku.com
2. Click **Sign up**
3. Create account with email & password
4. Verify email

#### A.2 Install Heroku CLI
Download from: https://devcenter.heroku.com/articles/heroku-cli

Verify installation:
```bash
heroku --version
```

#### A.3 Deploy to Heroku
```bash
# Login to Heroku
heroku login

# Go to your project
cd c:\Users\CSS\OneDrive\Desktop\CSS\VCI

# Create Heroku app
heroku create your-app-name

# Set environment variables
heroku config:set SUPABASE_URL=<your-supabase-url>
heroku config:set SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
heroku config:set NODE_ENV=production
heroku config:set PORT=5000

# Deploy
git push heroku main

# See logs
heroku logs --tail
```

**Your backend is now live!** Backend URL will be: `https://your-app-name.herokuapp.com`

---

### OPTION B: Deploy to Railway (Simpler)

#### B.1 Create Railway Account
1. Go to https://railway.app
2. Click **Login**
3. Sign up with GitHub

#### B.2 Deploy
1. Click **New Project**
2. Select **Deploy from GitHub repo**
3. Choose your **virtual-checkin** repository
4. Click **Deploy**

#### B.3 Add Environment Variables
1. Click on your **Backend** service
2. Go to **Variables**
3. Add:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NODE_ENV=production`

**Your backend is now live!** You'll see a URL in Railway dashboard.

---

## ✅ STEP 5: Update Frontend with Backend URL

### 5.1 Update Environment Variables
1. Go to Netlify → **Site settings** → **Build & deploy** → **Environment**
2. Edit the `NEXT_PUBLIC_API_URL` variable
3. Set it to your backend URL:
   - Heroku: `https://your-app-name.herokuapp.com/api`
   - Railway: `https://your-railway-url/api`

### 5.2 Trigger Frontend Rebuild
1. In Netlify, go to **Deployments**
2. Click **Trigger deploy** → **Deploy site**
3. Wait for build to complete (2-3 minutes)

---

## ✅ STEP 6: Test Your Live Platform

### 6.1 Frontend Tests
1. Open your Netlify URL (https://your-site-name.netlify.app)
2. Test homepage loads
3. Try to register a new account
4. Create an event
5. Register for an event

### 6.2 Backend Tests
Test the API is working:
```bash
curl https://your-backend-url/api/health
```

Should return:
```json
{"status":"ok","timestamp":"..."}
```

### 6.3 Database Tests
In your app:
1. Register and login
2. Create an event
3. Check Supabase dashboard - see data in tables

---

## 🎯 COMMON ISSUES & FIXES

| Issue | Solution |
|-------|----------|
| Build fails | Check Netlify build logs, verify Node version is 18+ |
| API connection error | Verify `NEXT_PUBLIC_API_URL` is set correctly |
| Database errors | Check Supabase credentials in env vars |
| "Cannot find module" | Clear Netlify cache: Site settings → Deployments → Clear cache |
| Auth not working | Verify Supabase URL and keys are correct |

---

## ✅ FINAL CHECKLIST

- [ ] Created GitHub repository
- [ ] Pushed code to GitHub
- [ ] Created Supabase project
- [ ] Created database tables
- [ ] Deployed frontend to Netlify
- [ ] Set environment variables
- [ ] Deployed backend (Heroku or Railway)
- [ ] Updated backend URL in Netlify
- [ ] Tested registration/login
- [ ] Tested event creation
- [ ] Tested dashboard

---

## 🎉 YOU'RE LIVE!

Your Virtual Check In platform is now deployed and live!

**Frontend URL:** https://your-site-name.netlify.app  
**Backend URL:** https://your-backend-url/api  
**Database:** Your Supabase project

---

## 📊 NEXT STEPS

### Optional - Set Custom Domain
1. Netlify: Site settings → Domain management → Add custom domain
2. Follow DNS setup instructions

### Optional - Enable Auto-Deploy
1. Netlify automatically deploys when you push to main
2. No additional setup needed!

### Optional - Monitor Your Site
1. Netlify: Analytics
2. Monitor traffic and performance

---

**Deployed Successfully!** 🚀

