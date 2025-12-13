# My Virtual Check In - Event Management Platform

A complete, production-ready event management platform with event discovery, ticketing, QR code check-ins, and admin analytics.

## 🎯 Features

- **Event Discovery**: Browse and filter events by date, category, and location
- **User Accounts**: Separate attendee and organizer accounts with secure authentication
- **Event Creation**: Organizers can create events with images, descriptions, and ticket options
- **Ticketing System**: Support for free RSVPs and paid tickets with secure checkout
- **Digital QR Codes**: Generate shareable QR codes for events and tickets
- **Check-In System**: Fast check-in using QR codes or manual verification
- **Admin Dashboard**: Event analytics, attendee management, and revenue tracking
- **Payment Processing**: Stripe integration for secure payments
- **Responsive Design**: Mobile-first design with Tailwind CSS

## 📁 Project Structure

```
VCI/
├── frontend/              # Next.js React frontend
│   ├── pages/            # Page routes
│   ├── components/       # Reusable components
│   ├── lib/              # Utilities (Supabase client)
│   ├── styles/           # Global CSS
│   └── package.json
├── backend/              # Express.js API server
│   ├── src/
│   │   ├── routes/       # API route handlers
│   │   ├── middleware/   # Express middleware
│   │   ├── utils/        # Helper functions
│   │   └── index.ts      # Server entry point
│   └── package.json
├── package.json          # Monorepo root
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account
- Stripe account (for payments)

### Installation

1. **Clone and install dependencies**
```bash
cd c:\Users\CSS\OneDrive\Desktop\CSS\VCI
npm install
```

2. **Set up environment variables**

Frontend (`.env.local` in frontend/):
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Backend (`.env` in backend/):
```
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
STRIPE_SECRET_KEY=your_stripe_secret_key
PORT=5000
```

3. **Set up Supabase Database**

Run the SQL migrations in Supabase:

```sql
-- Profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY,
  full_name TEXT,
  user_type VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Events table
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  location VARCHAR(255),
  event_date TIMESTAMP,
  category VARCHAR(50),
  price DECIMAL(10, 2),
  capacity INTEGER,
  organizer_id UUID NOT NULL REFERENCES profiles(id),
  status VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tickets table
CREATE TABLE tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id),
  ticket_number VARCHAR(255) UNIQUE,
  price DECIMAL(10, 2),
  status VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Check-ins table
CREATE TABLE checkins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  ticket_id UUID NOT NULL REFERENCES tickets(id),
  user_id UUID NOT NULL REFERENCES profiles(id),
  checked_in_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_events_organizer_id ON events(organizer_id);
CREATE INDEX idx_events_event_date ON events(event_date);
CREATE INDEX idx_tickets_event_id ON tickets(event_id);
CREATE INDEX idx_tickets_user_id ON tickets(user_id);
CREATE INDEX idx_checkins_event_id ON checkins(event_id);
```

### Development

Run both frontend and backend concurrently:
```bash
npm run dev
```

Or run separately:
```bash
npm run frontend:dev    # Frontend on http://localhost:3000
npm run backend:dev     # Backend on http://localhost:5000
```

### Build

```bash
npm run build
```

This builds both frontend and backend for production.

## 🌐 Deployment

### Netlify Deployment

1. **Push to GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin your-repo-url
git push -u origin main
```

2. **Connect to Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Click "New site from Git"
   - Select your repository
   - Configure build settings

3. **Build Settings**
   - Build command: `npm run frontend:build`
   - Publish directory: `frontend/.next`
   - Environment variables: Add your Supabase keys

4. **Deploy Backend**
   - Backend can be deployed to Heroku, Railway, or any Node.js hosting
   - Set environment variables in your hosting platform
   - Update frontend API calls to point to your backend URL

## 📚 API Documentation

### Base URL
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:5000/api`

### Events
- `POST /events` - Create event
- `GET /events` - List events (with filters)
- `GET /events/:id` - Get event details
- `PUT /events/:id` - Update event
- `DELETE /events/:id` - Delete event

### Tickets
- `POST /tickets/register` - Register for event
- `GET /tickets/user/:user_id` - Get user's tickets
- `GET /tickets/event/:event_id` - Get event attendees
- `GET /tickets/validate/:ticket_id` - Validate ticket

### Check-In
- `POST /checkin/scan` - Check in attendee
- `GET /checkin/event/:event_id` - Get event check-ins
- `GET /checkin/stats/:event_id` - Get check-in statistics

### Analytics
- `GET /analytics/event/:event_id` - Event analytics
- `GET /analytics/organizer/:organizer_id` - Organizer dashboard

## 🔐 Security

- JWT authentication via Supabase Auth
- Secure password hashing
- CORS protection
- Helmet.js for security headers
- HTTPS enforced in production
- Rate limiting recommended

## 🛠️ Technology Stack

**Frontend:**
- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Supabase Client
- QR Code (qrcode.react)

**Backend:**
- Express.js
- TypeScript
- Supabase (Auth + Database)
- Stripe (Payments)
- Node.js

**Database:**
- PostgreSQL (via Supabase)
- Real-time capabilities enabled

**Deployment:**
- Netlify (Frontend)
- Node.js hosting (Backend)
- Supabase (Database)

## 📝 License

MIT License

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Submit a pull request

## 📞 Support

For issues and questions, please create an issue in the repository.
