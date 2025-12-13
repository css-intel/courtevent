import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { supabase } from '@/lib/supabase'

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [events, setEvents] = useState([])
  const [view, setView] = useState('my-events')

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    const { data } = await supabase.auth.getSession()
    if (!data.session) {
      router.push('/auth/login')
      return
    }
    setUser(data.session.user)
    fetchUserEvents(data.session.user.id)
  }

  const fetchUserEvents = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('organizer_id', userId)
        .order('event_date', { ascending: true })

      if (error) throw error
      setEvents(data || [])
    } catch (error) {
      console.error('Error fetching events:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-blue-600 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold">
            VCI
          </Link>
          <button
            onClick={handleLogout}
            className="bg-blue-700 px-4 py-2 rounded hover:bg-blue-800"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Dashboard</h1>
        <p className="text-gray-600 mb-6">Welcome, {user?.email}</p>

        {/* Tabs */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setView('my-events')}
            className={`px-6 py-2 rounded font-semibold ${
              view === 'my-events' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'
            }`}
          >
            My Events
          </button>
          <button
            onClick={() => setView('create-event')}
            className={`px-6 py-2 rounded font-semibold ${
              view === 'create-event' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'
            }`}
          >
            Create Event
          </button>
          <button
            onClick={() => setView('analytics')}
            className={`px-6 py-2 rounded font-semibold ${
              view === 'analytics' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'
            }`}
          >
            Analytics
          </button>
        </div>

        {/* My Events View */}
        {view === 'my-events' && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Your Events</h2>
            {loading ? (
              <div className="text-gray-500">Loading...</div>
            ) : events.length > 0 ? (
              <div className="grid gap-4">
                {events.map((event) => (
                  <div key={event.id} className="bg-white p-6 rounded-lg shadow">
                    <h3 className="font-bold text-lg mb-2">{event.title}</h3>
                    <p className="text-gray-600 mb-2">{event.location}</p>
                    <p className="text-gray-500 mb-4">
                      {new Date(event.event_date).toLocaleDateString()}
                    </p>
                    <div className="flex gap-2">
                      <Link href={`/events/${event.id}`} className="bg-blue-600 text-white px-4 py-2 rounded">
                        View Event
                      </Link>
                      <button className="bg-gray-300 px-4 py-2 rounded">Edit</button>
                      <button className="bg-red-500 text-white px-4 py-2 rounded">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-gray-500">No events created yet.</div>
            )}
          </div>
        )}

        {/* Create Event View */}
        {view === 'create-event' && <CreateEventForm onSuccess={() => setView('my-events')} />}

        {/* Analytics View */}
        {view === 'analytics' && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-4">Analytics</h2>
            <p className="text-gray-600">Event analytics and statistics will appear here.</p>
          </div>
        )}
      </div>
    </div>
  )
}

function CreateEventForm({ onSuccess }: { onSuccess: () => void }) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    event_date: '',
    category: 'other',
    price: '0',
    capacity: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      setLoading(true)
      const { data } = await supabase.auth.getSession()

      const { error } = await supabase.from('events').insert([
        {
          ...formData,
          organizer_id: data.session.user.id,
          created_at: new Date().toISOString(),
        },
      ])

      if (error) throw error
      alert('Event created successfully!')
      onSuccess()
    } catch (error) {
      alert('Error creating event: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow max-w-2xl">
      <h2 className="text-2xl font-bold mb-4">Create New Event</h2>

      <div className="mb-4">
        <label className="block text-sm font-semibold mb-2">Event Title</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-semibold mb-2">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg"
          rows={4}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-semibold mb-2">Location</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-2">Date & Time</label>
          <input
            type="datetime-local"
            name="event_date"
            value={formData.event_date}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block text-sm font-semibold mb-2">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
          >
            <option value="music">Music</option>
            <option value="tech">Tech</option>
            <option value="business">Business</option>
            <option value="sports">Sports</option>
            <option value="arts">Arts</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold mb-2">Ticket Price ($)</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
            step="0.01"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-2">Capacity</label>
          <input
            type="number"
            name="capacity"
            value={formData.capacity}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
            placeholder="Leave empty for unlimited"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded-lg font-bold hover:bg-blue-700 disabled:bg-gray-400"
      >
        {loading ? 'Creating...' : 'Create Event'}
      </button>
    </form>
  )
}
