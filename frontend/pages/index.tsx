import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default function Home() {
  const [upcomingEvents, setUpcomingEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUpcomingEvents()
  }, [])

  const fetchUpcomingEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .gte('event_date', new Date().toISOString())
        .order('event_date', { ascending: true })
        .limit(6)

      if (error) throw error
      setUpcomingEvents(data || [])
    } catch (error) {
      console.error('Error fetching events:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">My Virtual Check In</h1>
          <p className="text-2xl mb-8">Discover, Manage & Check In to Events</p>
          <div className="flex gap-4 justify-center">
            <Link href="/events" className="bg-white text-blue-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100">
              Browse Events
            </Link>
            <Link href="/auth/register" className="bg-blue-500 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-400">
              Get Started
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Core Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'Event Discovery', description: 'Browse upcoming events filtered by date, category, and location' },
              { title: 'Easy Registration', description: 'Quick RSVP and ticket purchase with secure payment' },
              { title: 'QR Code Check-In', description: 'Fast check-ins using QR codes or manual verification' },
              { title: 'Event Management', description: 'Create and manage your own events with full analytics' },
              { title: 'Digital Tickets', description: 'Secure digital tickets delivered to attendees' },
              { title: 'Admin Dashboard', description: 'Complete event metrics and attendee management' },
            ].map((feature, i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
                <h3 className="text-xl font-bold mb-2 text-blue-600">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Upcoming Events</h2>
          {loading ? (
            <div className="text-center text-gray-500">Loading events...</div>
          ) : upcomingEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {upcomingEvents.map((event) => (
                <Link key={event.id} href={`/events/${event.id}`}>
                  <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition cursor-pointer overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-400 to-blue-600 h-32"></div>
                    <div className="p-4">
                      <h3 className="font-bold text-lg mb-2">{event.title}</h3>
                      <p className="text-gray-600 text-sm mb-2">{event.location}</p>
                      <p className="text-gray-500 text-sm">{new Date(event.event_date).toLocaleDateString()}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500">No upcoming events available</div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Organize an Event?</h2>
          <p className="mb-8 text-xl">Create and manage your events easily with our platform</p>
          <Link href="/auth/register" className="bg-white text-blue-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 inline-block">
            Submit Your First Event
          </Link>
        </div>
      </section>
    </main>
  )
}
