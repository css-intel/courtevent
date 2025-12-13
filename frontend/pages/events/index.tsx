import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

interface Event {
  id: string
  title: string
  description: string
  location: string
  event_date: string
  category: string
  image_url?: string
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState({ category: 'all', search: '' })

  useEffect(() => {
    fetchEvents()
  }, [filter])

  const fetchEvents = async () => {
    try {
      setLoading(true)
      let query = supabase.from('events').select('*')

      if (filter.category !== 'all') {
        query = query.eq('category', filter.category)
      }

      if (filter.search) {
        query = query.ilike('title', `%${filter.search}%`)
      }

      const { data, error } = await query.order('event_date', { ascending: true })

      if (error) throw error
      setEvents(data || [])
    } catch (error) {
      console.error('Error fetching events:', error)
    } finally {
      setLoading(false)
    }
  }

  const categories = ['all', 'music', 'tech', 'business', 'sports', 'arts', 'other']

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-6">Discover Events</h1>

          {/* Filters */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Search events..."
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filter.search}
                onChange={(e) => setFilter({ ...filter, search: e.target.value })}
              />
              <select
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filter.category}
                onChange={(e) => setFilter({ ...filter, category: e.target.value })}
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Events Grid */}
          {loading ? (
            <div className="text-center text-gray-500 py-12">Loading events...</div>
          ) : events.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {events.map((event) => (
                <Link key={event.id} href={`/events/${event.id}`}>
                  <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition overflow-hidden cursor-pointer">
                    <div className="bg-gradient-to-r from-blue-400 to-blue-600 h-40 flex items-center justify-center">
                      <span className="text-white text-4xl">📅</span>
                    </div>
                    <div className="p-4">
                      <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mb-2">
                        {event.category}
                      </span>
                      <h3 className="font-bold text-lg mb-2 line-clamp-2">{event.title}</h3>
                      <p className="text-gray-600 text-sm mb-2">{event.location}</p>
                      <p className="text-gray-500 text-sm">
                        {new Date(event.event_date).toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-12">No events found. Try adjusting your filters.</div>
          )}
        </div>
      </div>
    </div>
  )
}
