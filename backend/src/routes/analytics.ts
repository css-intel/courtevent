import { Router, Request, Response } from 'express'
import { supabase } from '../index'

const router = Router()

// Get event analytics
router.get('/event/:event_id', async (req: Request, res: Response) => {
  try {
    const { event_id } = req.params

    // Event details
    const { data: event } = await supabase
      .from('events')
      .select('*')
      .eq('id', event_id)
      .single()

    // Ticket stats
    const { count: totalTickets } = await supabase
      .from('tickets')
      .select('*', { count: 'exact' })
      .eq('event_id', event_id)

    const { count: checkedIn } = await supabase
      .from('checkins')
      .select('*', { count: 'exact' })
      .eq('event_id', event_id)

    // Revenue
    const { data: tickets } = await supabase
      .from('tickets')
      .select('price')
      .eq('event_id', event_id)

    const revenue = (tickets || []).reduce((sum, t) => sum + (t.price || 0), 0)

    res.json({
      success: true,
      analytics: {
        event: event,
        attendance: {
          total_registered: totalTickets || 0,
          total_checked_in: checkedIn || 0,
          pending: (totalTickets || 0) - (checkedIn || 0),
          checkin_rate: ((checkedIn || 0) / (totalTickets || 1)) * 100,
        },
        revenue: {
          total: revenue,
          currency: 'USD',
        },
      },
    })
  } catch (error: any) {
    res.status(400).json({ error: error.message })
  }
})

// Get organizer dashboard stats
router.get('/organizer/:organizer_id', async (req: Request, res: Response) => {
  try {
    const { organizer_id } = req.params

    // Events
    const { data: events, count: eventCount } = await supabase
      .from('events')
      .select('*', { count: 'exact' })
      .eq('organizer_id', organizer_id)

    // Total attendees
    const { count: totalAttendees } = await supabase
      .from('tickets')
      .select('*', { count: 'exact' })
      .in('event_id', (events || []).map((e) => e.id))

    res.json({
      success: true,
      stats: {
        total_events: eventCount || 0,
        total_attendees: totalAttendees || 0,
        events: events || [],
      },
    })
  } catch (error: any) {
    res.status(400).json({ error: error.message })
  }
})

export default router
