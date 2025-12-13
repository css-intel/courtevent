# Deployment Guide - My Virtual Check In

This guide covers deploying your Virtual Check In platform to production using Netlify and other services.

## 📋 Pre-Deployment Checklist

- [ ] Supabase project created and configured
- [ ] Database migrations applied
- [ ] Environment variables configured in Netlify
- [ ] Stripe account set up (optional but recommended)
- [ ] GitHub repository created and pushed
- [ ] Netlify account created

## 🚀 Step 1: Set Up Supabase

### Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Fill in project details
4. Wait for project initialization

### Get Credentials
1. Go to Settings → API
2. Copy your `Project URL` (SUPABASE_URL)
3. Copy `anon` key (NEXT_PUBLIC_SUPABASE_ANON_KEY)
4. Copy `service_role` key (SUPABASE_SERVICE_ROLE_KEY)

### Create Tables

Go to the SQL Editor in Supabase and run:

```sql
-- Auth setup (Supabase handles this automatically with Auth)

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  user_type VARCHAR(50) CHECK (user_type IN ('attendee', 'organizer')),
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Events table
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  location VARCHAR(255),
  event_date TIMESTAMP WITH TIME ZONE,
  category VARCHAR(50),
  price DECIMAL(10, 2) DEFAULT 0,
  capacity INTEGER,
  organizer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status VARCHAR(50) DEFAULT 'published' CHECK (status IN ('draft', 'published', 'cancelled')),
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tickets table
CREATE TABLE IF NOT EXISTS tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  ticket_number VARCHAR(255) UNIQUE NOT NULL,
  price DECIMAL(10, 2),
  status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'used', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Check-ins table
CREATE TABLE IF NOT EXISTS checkins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  ticket_id UUID NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  checked_in_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_events_organizer_id ON events(organizer_id);
CREATE INDEX IF NOT EXISTS idx_events_event_date ON events(event_date);
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);
CREATE INDEX IF NOT EXISTS idx_tickets_event_id ON tickets(event_id);
CREATE INDEX IF NOT EXISTS idx_tickets_user_id ON tickets(user_id);
CREATE INDEX IF NOT EXISTS idx_tickets_status ON tickets(status);
CREATE INDEX IF NOT EXISTS idx_checkins_event_id ON checkins(event_id);
CREATE INDEX IF NOT EXISTS idx_checkins_ticket_id ON checkins(ticket_id);
CREATE INDEX IF NOT EXISTS idx_checkins_user_id ON checkins(user_id);

-- Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE checkins ENABLE ROW LEVEL SECURITY;

-- RLS Policies - Profiles
CREATE POLICY "Public profiles are viewable by everyone" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- RLS Policies - Events
CREATE POLICY "Events are viewable by everyone" ON events
  FOR SELECT USING (true);

CREATE POLICY "Users can create events" ON events
  FOR INSERT WITH CHECK (auth.uid() = organizer_id);

CREATE POLICY "Organizers can update their events" ON events
  FOR UPDATE USING (auth.uid() = organizer_id);

CREATE POLICY "Organizers can delete their events" ON events
  FOR DELETE USING (auth.uid() = organizer_id);

-- RLS Policies - Tickets
CREATE POLICY "Users can view their tickets" ON tickets
  FOR SELECT USING (auth.uid() = user_id OR auth.uid() IN (SELECT organizer_id FROM events WHERE id = event_id));

CREATE POLICY "Users can create tickets" ON tickets
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies - Check-ins
CREATE POLICY "Organizers can view check-ins for their events" ON checkins
  FOR SELECT USING (auth.uid() IN (SELECT organizer_id FROM events WHERE id = event_id));

CREATE POLICY "Users can check in to events they registered for" ON checkins
  FOR INSERT WITH CHECK (auth.uid() = user_id AND ticket_id IN (SELECT id FROM tickets WHERE user_id = auth.uid()));
```

### Enable Authentication

1. Go to Authentication → Providers
2. Enable Email/Password
3. Configure email templates
4. Set up redirect URLs:
   - Production: `https://yourdomain.com/auth/callback`
   - Development: `http://localhost:3000/auth/callback`

## 🌐 Step 2: Deploy to Netlify

### Connect Repository

1. Go to [netlify.com](https://netlify.com)
2. Click "New site from Git"
3. Connect your GitHub account
4. Select your repository

### Configure Build Settings

**Build Command:** `npm run frontend:build`  
**Publish Directory:** `frontend/.next`  
**Node Version:** `18.x`

### Set Environment Variables

In Netlify Site Settings → Build & Deploy → Environment:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Configure Redirects

Create or update `netlify.toml`:

```toml
[build]
command = "npm run frontend:build"
publish = "frontend/.next"

[build.environment]
NODE_VERSION = "18"

[[redirects]]
from = "/api/*"
to = "https://your-backend-url/api/:splat"
status = 200
force = true

[[headers]]
for = "/*"
[headers.values]
X-Frame-Options = "SAMEORIGIN"
X-Content-Type-Options = "nosniff"
X-XSS-Protection = "1; mode=block"
```

### Deploy

Push to main branch:
```bash
git push origin main
```

Netlify will automatically deploy!

## 🖥️ Step 3: Deploy Backend

### Option A: Deploy to Heroku

1. Create Heroku account at [heroku.com](https://heroku.com)
2. Install Heroku CLI
3. Create app: `heroku create your-app-name`
4. Set environment variables:
   ```bash
   heroku config:set SUPABASE_URL=your_supabase_url
   heroku config:set SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   heroku config:set STRIPE_SECRET_KEY=your_stripe_key
   ```
5. Deploy: `git push heroku main`

### Option B: Deploy to Railway

1. Go to [railway.app](https://railway.app)
2. Create new project
3. Connect GitHub
4. Select repository
5. Set environment variables
6. Deploy

### Option C: Deploy to AWS/DigitalOcean

1. Create server/instance
2. Install Node.js
3. Clone repository
4. Install dependencies
5. Set environment variables
6. Start server: `npm start -w backend`
7. Use PM2 or systemd for process management

## 📝 Step 4: Update Frontend API Calls

Update your frontend to use the deployed backend URL:

In `frontend/lib/supabase.ts` or create an env variable:

```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'
```

## 🔐 Step 5: Configure Custom Domain

### On Netlify
1. Domain Settings → Custom Domain
2. Add your domain
3. Follow DNS configuration instructions

### DNS Setup
Point your domain to Netlify's nameservers or add CNAME records.

## 🛠️ Maintenance & Monitoring

### Monitoring
- Netlify: Analytics & Performance in dashboard
- Backend: Set up error tracking (Sentry, LogRocket, etc.)
- Database: Monitor Supabase metrics

### Backups
- Enable Supabase automated backups
- Export database regularly

### Updates
- Keep dependencies updated: `npm update`
- Monitor security advisories: `npm audit`

## 🔄 CI/CD Pipeline

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - run: npm install --legacy-peer-deps
      
      - run: npm run build
      
      - name: Deploy to Netlify
        uses: netlify/actions/cli@master
        with:
          args: deploy --prod --dir=frontend/.next
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

## 📊 Environment Variables Summary

### Frontend (.env.local or Netlify)
```
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx_anon_key
NEXT_PUBLIC_API_URL=https://your-api.herokuapp.com
```

### Backend (.env)
```
NODE_ENV=production
PORT=5000
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=xxx_service_role_key
STRIPE_SECRET_KEY=sk_live_xxx
```

## ✅ Verification Checklist

After deployment:

- [ ] Frontend loads without errors
- [ ] Can register new account
- [ ] Can log in with email/password
- [ ] Can view events
- [ ] Can create event (as organizer)
- [ ] Can register for event (as attendee)
- [ ] Check-in functionality works
- [ ] Admin dashboard loads
- [ ] No console errors in browser
- [ ] All API endpoints respond correctly
- [ ] Database queries are fast
- [ ] Mobile responsive design works

## 🆘 Troubleshooting

### Build Fails
- Clear cache: Netlify Settings → Deployments → Clear cache & redeploy
- Check environment variables are set
- Verify Node version matches

### API Connection Issues
- Check CORS headers in backend
- Verify backend URL in frontend
- Check network tab in browser DevTools

### Database Issues
- Check Supabase connection string
- Verify RLS policies aren't blocking queries
- Check database logs in Supabase

## 📞 Support Resources

- [Netlify Documentation](https://docs.netlify.com)
- [Supabase Documentation](https://supabase.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Express.js Guide](https://expressjs.com)

---

**Deployment Date:** _________________  
**Version:** 1.0.0  
**Last Updated:** December 2025
