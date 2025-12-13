import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '@/lib/supabase'

export default function EventDetail() {
  const router = useRouter()
  const { id } = router.query
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)
  const [registering, setRegistering] = useState(false)

  useEffect(() => {
    if (!id) return

    fetchEvent()
    checkUser()
  }, [id])

  const fetchEvent = async () => {
    try {
      const { data, error } = await supabase.from('events').select('*').eq('id', id).single()

      if (error) throw error
      setEvent(data)
    } catch (error) {
      console.error('Error fetching event:', error)
    } finally {
      setLoading(false)
    }
  }

  const checkUser = async () => {
    const { data } = await supabase.auth.getSession()
    setUser(data?.session?.user || null)
  }

  const handleRegister = async () => {
    if (!user) {
      router.push('/auth/login')
      return
    }

    try {
      setRegistering(true)
      const { data, error } = await supabase.from('registrations').insert([
        {
          event_id: id,
          user_id: user.id,
          registered_at: new Date().toISOString(),
          status: 'registered',
        },
      ])

      if (error) throw error
      alert('Successfully registered for the event!')
    } catch (error) {
      console.error('Error registering:', error)
      alert('Failed to register. Please try again.')
    } finally {
      setRegistering(false)
    }
  }

  if (loading) return <div className="text-center py-12">Loading event...</div>
  if (!event) return <div className="text-center py-12">Event not found.</div>

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <button
          onClick={() => router.back()}
          className="mb-6 text-blue-600 hover:text-blue-800 font-semibold"
        >
          ← Back to Events
        </button>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-400 to-blue-600 h-48 flex items-center justify-center">
            <span className="text-white text-6xl">📅</span>
          </div>

          <div className="p-8">
            <div className="mb-6">
              <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold mb-4">
                {event.category}
              </span>
              <h1 className="text-4xl font-bold mb-4">{event.title}</h1>
              <p className="text-gray-600 text-lg">{event.description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="font-bold text-xl mb-4">Event Details</h3>
                <div className="space-y-3">
                  <p>
                    <span className="font-semibold">📍 Location:</span> {event.location}
                  </p>
                  <p>
                    <span className="font-semibold">📅 Date & Time:</span>{' '}
                    {new Date(event.event_date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                  <p>
                    <span className="font-semibold">👥 Capacity:</span> {event.capacity || 'Unlimited'}
                  </p>
                  <p>
                    <span className="font-semibold">💵 Price:</span> ${event.price || '0.00'} {event.price ? 'per ticket' : 'Free'}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-xl mb-4">Event QR Code</h3>
                <div className="flex justify-center p-4 bg-gray-100 rounded-lg">
                  <div className="bg-white p-4 rounded">QR Code: {id?.toString().substring(0, 8)}</div>
                </div>
              </div>
            </div>

            <button
              onClick={handleRegister}
              disabled={registering}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold text-lg hover:bg-blue-700 disabled:bg-gray-400"
            >
              {registering ? 'Registering...' : user ? 'Register for Event' : 'Login to Register'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
