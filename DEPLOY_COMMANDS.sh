#!/bin/bash
# NETLIFY DEPLOYMENT - QUICK COMMANDS

# ============================================================
# STEP 1: PREPARE GITHUB (Do this first!)
# ============================================================

# 1. Create a GitHub account at https://github.com (if you don't have one)
# 2. Create a new repository called "virtual-checkin"
# 3. Then run these commands:

cd c:\Users\CSS\OneDrive\Desktop\CSS\VCI

# Add your GitHub repository (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/virtual-checkin.git

# Push code to GitHub
git branch -M main
git push -u origin main

# ============================================================
# STEP 2: SETUP SUPABASE
# ============================================================

# 1. Go to https://supabase.com/dashboard
# 2. Create a new project
# 3. Get your credentials from Settings → API:
#    - NEXT_PUBLIC_SUPABASE_URL = Project URL
#    - NEXT_PUBLIC_SUPABASE_ANON_KEY = Anon Key
#    - SUPABASE_SERVICE_ROLE_KEY = Service Role Key
#
# 4. Run SQL migrations in Supabase SQL Editor
#    (Copy the CREATE TABLE statements from DEPLOYMENT.md)

# ============================================================
# STEP 3: DEPLOY FRONTEND TO NETLIFY
# ============================================================

# 1. Go to https://netlify.com
# 2. Click "Sign up with GitHub"
# 3. Authorize Netlify
# 4. Click "Add new site" → "Import an existing project"
# 5. Select your "virtual-checkin" repository
# 6. Netlify shows deployment settings (should be auto-correct):
#    Build command: npm run frontend:build
#    Publish directory: frontend/.next
#
# 7. Click "Deploy site"
# 8. Go to "Build & deploy" → "Environment"
# 9. Click "Edit variables" and add:
#    NEXT_PUBLIC_SUPABASE_URL=<your-supabase-url>
#    NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
#
# 10. Click "Trigger deploy" to rebuild with env vars
# 11. Wait 2-3 minutes for deployment

# ============================================================
# STEP 4: DEPLOY BACKEND TO HEROKU (Option A - Simpler)
# ============================================================

# Prerequisites: Install Heroku CLI from https://devcenter.heroku.com/articles/heroku-cli

# Login to Heroku
heroku login

# Go to your project
cd c:\Users\CSS\OneDrive\Desktop\CSS\VCI

# Create app on Heroku (replace your-app-name)
heroku create your-app-name

# Set environment variables
heroku config:set SUPABASE_URL=<your-supabase-url>
heroku config:set SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
heroku config:set NODE_ENV=production
heroku config:set PORT=5000

# Deploy code to Heroku
git push heroku main

# Check deployment status
heroku logs --tail

# Your backend URL: https://your-app-name.herokuapp.com

# ============================================================
# STEP 4 ALTERNATIVE: DEPLOY BACKEND TO RAILWAY (Option B)
# ============================================================

# 1. Go to https://railway.app
# 2. Click "Login"
# 3. Sign up/login with GitHub
# 4. Click "New Project"
# 5. Select "Deploy from GitHub repo"
# 6. Choose "virtual-checkin" repository
# 7. Railway will auto-detect it's a Node.js project
# 8. Go to Variables and add:
#    SUPABASE_URL=<your-url>
#    SUPABASE_SERVICE_ROLE_KEY=<your-key>
#    NODE_ENV=production
# 9. Railway auto-deploys
# 10. Copy your Railway URL from the dashboard

# ============================================================
# STEP 5: UPDATE NETLIFY WITH BACKEND URL
# ============================================================

# 1. Go to Netlify → Site settings → Build & deploy → Environment
# 2. Click "Edit variables"
# 3. Update NEXT_PUBLIC_API_URL with your backend URL:
#    Heroku: https://your-app-name.herokuapp.com/api
#    Railway: https://your-railway-url/api
#
# 4. Click "Deploy site" to rebuild with new URL
# 5. Wait 2-3 minutes

# ============================================================
# STEP 6: TEST YOUR DEPLOYMENT
# ============================================================

# Test that everything works:

# 1. Open your Netlify URL in browser
#    Should load the home page
#
# 2. Test registration:
#    - Click "Get Started"
#    - Fill in registration form
#    - Should create account
#
# 3. Test event creation:
#    - Go to Dashboard
#    - Click "Create Event"
#    - Fill in details
#    - Should create event
#
# 4. Test API:
#    curl https://your-backend-url/api/health
#    Should return: {"status":"ok","timestamp":"..."}

# ============================================================
# ALL DONE! 🎉
# ============================================================

# Your platform is now live!
# Frontend: https://your-site.netlify.app
# Backend: https://your-app-name.herokuapp.com/api

# ============================================================
# USEFUL COMMANDS
# ============================================================

# View Heroku logs
heroku logs --tail

# Check Heroku app status
heroku apps

# Add environment variable
heroku config:set VARIABLE_NAME=value

# View all environment variables
heroku config

# Delete app (if needed)
heroku apps:destroy --app your-app-name

# Push updates to GitHub (auto-deploys)
git add .
git commit -m "Update message"
git push origin main

# ============================================================
# TROUBLESHOOTING
# ============================================================

# If Netlify build fails:
# 1. Check build logs in Netlify dashboard
# 2. Click "Clear cache and redeploy"
# 3. Check Node version is 18+

# If backend won't deploy to Heroku:
# 1. Check heroku logs --tail
# 2. Verify all env variables are set
# 3. Ensure git push heroku main is correct

# If API connection fails:
# 1. Verify NEXT_PUBLIC_API_URL is set in Netlify
# 2. Check SUPABASE credentials are correct
# 3. Test backend with: curl backend-url/api/health
