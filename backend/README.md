# My Virtual Check In - Backend API

Express.js API server for the event management platform.

## Setup

```bash
npm install
```

## Environment Variables

Create a `.env` file (copy from `.env.example`):

```
NODE_ENV=production
PORT=5000
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
STRIPE_SECRET_KEY=your_stripe_secret_key
```

## Development

```bash
npm run dev
```

Server runs on `http://localhost:5000`

## Build

```bash
npm run build
npm start
```

## API Endpoints

### Events
- `POST /api/events` - Create event
- `GET /api/events` - List events
- `GET /api/events/:id` - Get event
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event

### Tickets
- `POST /api/tickets/register` - Register for event
- `GET /api/tickets/user/:user_id` - Get user tickets
- `GET /api/tickets/event/:event_id` - Get event tickets
- `GET /api/tickets/validate/:ticket_id` - Validate ticket

### Check-In
- `POST /api/checkin/scan` - Check in attendee
- `GET /api/checkin/event/:event_id` - Get event check-ins
- `GET /api/checkin/stats/:event_id` - Get check-in stats

### Analytics
- `GET /api/analytics/event/:event_id` - Event analytics
- `GET /api/analytics/organizer/:organizer_id` - Organizer stats
