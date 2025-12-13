# Quick Start Guide - My Virtual Check In

Get up and running in 5 minutes!

## ⚡ Prerequisites

- Node.js 18+ installed
- npm or yarn
- Git
- A code editor (VS Code recommended)

## 🚀 Local Development Setup

### 1. Clone the Repository
```bash
cd c:\Users\CSS\OneDrive\Desktop\CSS\VCI
npm install
```

### 2. Set Up Environment Variables

**Frontend** (`frontend/.env.local`):
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

**Backend** (`backend/.env`):
```env
NODE_ENV=development
PORT=5000
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
STRIPE_SECRET_KEY=sk_test_your_stripe_key
```

### 3. Set Up Supabase (Free)

1. Go to [supabase.com](https://supabase.com/dashboard)
2. Create a new project (it's free!)
3. Get your URL and keys from Settings → API
4. Paste them in your `.env` files above

### 4. Run the Development Servers

**Both frontend and backend together:**
```bash
npm run dev
```

**Or separately:**
```bash
npm run frontend:dev   # Runs on http://localhost:3000
npm run backend:dev    # Runs on http://localhost:5000
```

## 🎯 Common Commands

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Frontend only
npm run frontend:dev
npm run frontend:build

# Backend only
npm run backend:dev
npm run backend:build

# Lint code
npm run lint
```

## 🧑‍💻 Project Structure

```
VCI/
├── frontend/              # Next.js React app
│   ├── pages/            # Routes (auto-generated URLs)
│   ├── components/       # Reusable components
│   ├── lib/              # Utilities
│   └── styles/           # CSS
│
├── backend/              # Express API server
│   ├── src/
│   │   ├── routes/       # API endpoints
│   │   ├── middleware/   # Express middleware
│   │   └── index.ts      # Server entry
│   
└── README.md             # Full documentation
```

## 📝 Making Your First Change

### 1. Add a New Page (Frontend)

Create `frontend/pages/about.tsx`:

```typescript
export default function About() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold">About Us</h1>
      <p className="mt-4 text-gray-600">Welcome to Virtual Check In!</p>
    </div>
  )
}
```

Now visit `http://localhost:3000/about` - it works automatically!

### 2. Add a New API Endpoint (Backend)

Create `backend/src/routes/custom.ts`:

```typescript
import { Router, Request, Response } from 'express'

const router = Router()

router.get('/hello', (req: Request, res: Response) => {
  res.json({ message: 'Hello World!' })
})

export default router
```

Then import in `backend/src/index.ts`:

```typescript
import customRoutes from './routes/custom'
app.use('/api/custom', customRoutes)
```

Visit `http://localhost:5000/api/custom/hello` to test it!

## 🔌 Using the Supabase Client

### Frontend Example
```typescript
import { supabase } from '@/lib/supabase'

// Get data
const { data, error } = await supabase
  .from('events')
  .select('*')
  .limit(10)

// Insert data
const { data, error } = await supabase
  .from('events')
  .insert([{ title: 'My Event', ... }])
  .select()

// Auth
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password123',
})
```

### Backend Example
```typescript
import { supabase } from '../index'

const { data, error } = await supabase
  .from('events')
  .select('*')
  .order('created_at', { ascending: false })
```

## 🎨 Styling with Tailwind CSS

The project uses **Tailwind CSS** for styling. No need to write CSS files!

```jsx
<div className="bg-blue-500 text-white p-4 rounded-lg hover:bg-blue-600">
  <h1 className="text-2xl font-bold mb-2">Hello</h1>
  <p className="text-sm">Styled with Tailwind!</p>
</div>
```

[Tailwind CSS Classes Reference](https://tailwindcss.com/docs/utility-first)

## 🔑 Authentication Flow

### Sign Up
```typescript
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password123',
})
```

### Login
```typescript
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password123',
})
```

### Get Current User
```typescript
const { data } = await supabase.auth.getSession()
const user = data.session?.user
```

### Logout
```typescript
await supabase.auth.signOut()
```

## 🐛 Debugging

### Browser DevTools
1. Open http://localhost:3000
2. Press `F12` to open DevTools
3. Check Console for errors
4. Use Network tab to monitor API calls

### VS Code Debugging

Create `.vscode/launch.json`:
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Backend",
      "program": "${workspaceFolder}/backend/src/index.ts",
      "preLaunchTask": "build",
      "outFiles": ["${workspaceFolder}/backend/dist/**/*.js"]
    }
  ]
}
```

## 📚 Useful Resources

- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Supabase Docs](https://supabase.com/docs)
- [Express.js Guide](https://expressjs.com)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## 🆘 Common Issues

### "EADDRINUSE: Port 5000 already in use"
Kill the process using port 5000:
```bash
# On Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# On Mac/Linux
lsof -i :5000
kill -9 <PID>
```

### Supabase connection errors
1. Check your `.env` files have the correct keys
2. Verify Supabase project is active
3. Try restarting the dev servers

### TypeScript errors
- Usually caused by missing type definitions
- Try: `npm install --save-dev @types/package-name`
- Check `tsconfig.json` settings

### "Cannot find module" errors
- Run `npm install` to ensure all dependencies are installed
- Clear node_modules: `rm -rf node_modules && npm install`

## 🚢 Ready to Deploy?

See [DEPLOYMENT.md](./DEPLOYMENT.md) for step-by-step deployment guide to Netlify and Heroku.

## 📞 Need Help?

Check these docs:
- [README.md](./README.md) - Full project overview
- [API_DOCS.md](./API_DOCS.md) - API reference
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Deployment guide
- [frontend/README.md](./frontend/README.md) - Frontend setup
- [backend/README.md](./backend/README.md) - Backend setup

---

**Happy coding! 🎉**
