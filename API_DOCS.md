# API Documentation - My Virtual Check In

## 🔌 Base URLs

- **Frontend:** https://yourdomain.netlify.app
- **Backend:** https://your-backend.herokuapp.com (or your hosting URL)
- **Database:** Supabase PostgreSQL

## 🔐 Authentication

All API requests (except public endpoints) require authentication via Supabase JWT token.

Header: `Authorization: Bearer {token}`

Get token:
```javascript
const { data } = await supabase.auth.getSession()
const token = data.session?.access_token
```

## 📋 API Endpoints

### Health & Status

#### Check API Health
```http
GET /api/health
```

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-12-13T21:00:00Z"
}
```

---

### 👥 Authentication

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "user_metadata": {}
  }
}
```

#### Logout
```http
POST /api/auth/logout
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "message": "Logged out"
}
```

---

### 📅 Events

#### Create Event
```http
POST /api/events
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Tech Conference 2025",
  "description": "Annual technology conference",
  "location": "San Francisco, CA",
  "event_date": "2025-06-15T09:00:00Z",
  "category": "tech",
  "price": 99.99,
  "capacity": 500,
  "organizer_id": "uuid"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "Tech Conference 2025",
    "description": "Annual technology conference",
    "location": "San Francisco, CA",
    "event_date": "2025-06-15T09:00:00Z",
    "category": "tech",
    "price": 99.99,
    "capacity": 500,
    "organizer_id": "uuid",
    "status": "published",
    "created_at": "2025-12-13T21:00:00Z"
  }
}
```

#### List Events
```http
GET /api/events?category=tech&search=conference&limit=20&offset=0
```

**Query Parameters:**
- `category` - Filter by category (optional)
- `search` - Search in title (optional)
- `organizer_id` - Filter by organizer (optional)
- `limit` - Results per page (default: 20)
- `offset` - Pagination offset (default: 0)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "Tech Conference 2025",
      "description": "Annual technology conference",
      "location": "San Francisco, CA",
      "event_date": "2025-06-15T09:00:00Z",
      "category": "tech",
      "price": 99.99,
      "capacity": 500,
      "status": "published",
      "created_at": "2025-12-13T21:00:00Z"
    }
  ],
  "pagination": {
    "limit": 20,
    "offset": 0,
    "total": 1
  }
}
```

#### Get Event Details
```http
GET /api/events/{event_id}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "Tech Conference 2025",
    "description": "Annual technology conference",
    "location": "San Francisco, CA",
    "event_date": "2025-06-15T09:00:00Z",
    "category": "tech",
    "price": 99.99,
    "capacity": 500,
    "organizer_id": "uuid",
    "status": "published",
    "created_at": "2025-12-13T21:00:00Z"
  }
}
```

#### Update Event
```http
PUT /api/events/{event_id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Tech Conference 2025 - Updated",
  "price": 79.99
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "Tech Conference 2025 - Updated",
    "price": 79.99,
    "...": "other fields"
  }
}
```

#### Delete Event
```http
DELETE /api/events/{event_id}
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "message": "Event deleted"
}
```

---

### 🎟️ Tickets

#### Register for Event
```http
POST /api/tickets/register
Authorization: Bearer {token}
Content-Type: application/json

{
  "event_id": "uuid",
  "user_id": "uuid",
  "quantity": 2,
  "price": 99.99
}
```

**Response (201):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "event_id": "uuid",
      "user_id": "uuid",
      "ticket_number": "TKT-1702509600000-abc123def",
      "price": 99.99,
      "status": "active",
      "created_at": "2025-12-13T21:00:00Z"
    }
  ]
}
```

#### Get User Tickets
```http
GET /api/tickets/user/{user_id}
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "event_id": "uuid",
      "user_id": "uuid",
      "ticket_number": "TKT-1702509600000-abc123def",
      "price": 99.99,
      "status": "active",
      "events": {
        "title": "Tech Conference 2025",
        "location": "San Francisco, CA",
        "event_date": "2025-06-15T09:00:00Z"
      },
      "created_at": "2025-12-13T21:00:00Z"
    }
  ]
}
```

#### Get Event Attendees
```http
GET /api/tickets/event/{event_id}
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "ticket_number": "TKT-1702509600000-abc123def",
      "price": 99.99,
      "status": "active",
      "profiles": {
        "full_name": "John Doe",
        "email": "john@example.com"
      },
      "created_at": "2025-12-13T21:00:00Z"
    }
  ]
}
```

#### Validate Ticket
```http
GET /api/tickets/validate/{ticket_id}
```

**Response:**
```json
{
  "success": true,
  "valid": true,
  "data": {
    "id": "uuid",
    "ticket_number": "TKT-1702509600000-abc123def",
    "status": "active",
    "event_id": "uuid"
  }
}
```

---

### ✅ Check-In

#### Check In Attendee
```http
POST /api/checkin/scan
Authorization: Bearer {token}
Content-Type: application/json

{
  "ticket_id": "uuid",
  "event_id": "uuid"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Check-in successful",
  "data": {
    "id": "uuid",
    "event_id": "uuid",
    "ticket_id": "uuid",
    "user_id": "uuid",
    "checked_in_at": "2025-12-13T21:00:00Z"
  }
}
```

**Error (400):**
```json
{
  "error": "Ticket already checked in"
}
```

#### Get Event Check-Ins
```http
GET /api/checkin/event/{event_id}
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "event_id": "uuid",
      "ticket_id": "uuid",
      "user_id": "uuid",
      "profiles": {
        "full_name": "John Doe",
        "email": "john@example.com"
      },
      "tickets": {
        "ticket_number": "TKT-1702509600000-abc123def"
      },
      "checked_in_at": "2025-12-13T21:00:00Z"
    }
  ],
  "total": 1
}
```

#### Get Check-In Statistics
```http
GET /api/checkin/stats/{event_id}
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "stats": {
    "total_tickets": 100,
    "checked_in": 87,
    "pending": 13,
    "checkin_rate": 87.0
  }
}
```

---

### 📊 Analytics

#### Get Event Analytics
```http
GET /api/analytics/event/{event_id}
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "analytics": {
    "event": {
      "id": "uuid",
      "title": "Tech Conference 2025",
      "status": "published"
    },
    "attendance": {
      "total_registered": 100,
      "total_checked_in": 87,
      "pending": 13,
      "checkin_rate": 87.0
    },
    "revenue": {
      "total": 9999.00,
      "currency": "USD"
    }
  }
}
```

#### Get Organizer Dashboard Stats
```http
GET /api/analytics/organizer/{organizer_id}
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "stats": {
    "total_events": 5,
    "total_attendees": 450,
    "events": [
      {
        "id": "uuid",
        "title": "Tech Conference 2025",
        "status": "published"
      }
    ]
  }
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "Invalid request parameters"
}
```

### 401 Unauthorized
```json
{
  "error": "Unauthorized"
}
```

### 404 Not Found
```json
{
  "error": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error"
}
```

---

## Rate Limiting

- **Requests per minute:** 60 per IP
- **Burst limit:** 10 requests
- **Headers:** X-RateLimit-Limit, X-RateLimit-Remaining

---

## Pagination

Use `limit` and `offset` for pagination:

```http
GET /api/events?limit=20&offset=0
```

**Response includes pagination metadata:**
```json
{
  "pagination": {
    "limit": 20,
    "offset": 0,
    "total": 150
  }
}
```

---

## WebSocket Events (Future)

Real-time updates can be added via WebSocket:

```javascript
const socket = io('wss://your-backend.herokuapp.com')

// Listen for check-in events
socket.on('checkin:success', (data) => {
  console.log('Attendee checked in:', data)
})
```

---

## SDKs & Client Libraries

### JavaScript/TypeScript
```typescript
import axios from 'axios'

const api = axios.create({
  baseURL: 'https://your-api.herokuapp.com/api'
})

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Get events
const events = await api.get('/events')
```

---

## Testing with cURL

```bash
# Get events
curl -X GET 'https://your-api.herokuapp.com/api/events' \
  -H 'Content-Type: application/json'

# Create event (requires auth)
curl -X POST 'https://your-api.herokuapp.com/api/events' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -d '{
    "title": "My Event",
    "description": "Event description",
    "location": "San Francisco",
    "event_date": "2025-06-15T09:00:00Z",
    "category": "tech",
    "price": 99.99,
    "capacity": 100,
    "organizer_id": "uuid"
  }'
```

---

## Changelog

### v1.0.0 (Dec 2025)
- Initial API release
- Events CRUD
- Ticketing system
- Check-in functionality
- Analytics endpoints

---

**Last Updated:** December 2025  
**API Version:** 1.0.0
