import { Router, Request, Response } from 'express'
import { supabase } from '../index'
import { v4 as uuidv4 } from 'uuid'

const router = Router()

// Check in attendee
router.post('/scan', async (req: Request, res: Response) => {
  try {
    const { ticket_id, event_id } = req.body

    // Get ticket
    const { data: ticket, error: ticketError } = await supabase
      .from('tickets')
      .select('*')
      .eq('id', ticket_id)
      .single()

    if (ticketError || !ticket) {
      return res.status(404).json({ error: 'Ticket not found' })
    }

    if (ticket.status === 'used') {
      return res.status(400).json({ error: 'Ticket already checked in' })
    }

    // Create check-in record
    const { data: checkin, error: checkinError } = await supabase
      .from('checkins')
      .insert([
        {
          id: uuidv4(),
          event_id,
          ticket_id,
          user_id: ticket.user_id,
          checked_in_at: new Date().toISOString(),
        },
      ])
      .select()

    if (checkinError) throw checkinError

    // Update ticket status
    await supabase.from('tickets').update({ status: 'used' }).eq('id', ticket_id)

    res.json({
      success: true,
      message: 'Check-in successful',
      data: checkin[0],
    })
  } catch (error: any) {
    res.status(400).json({ error: error.message })
  }
})

// Get event check-ins
router.get('/event/:event_id', async (req: Request, res: Response) => {
  try {
    const { event_id } = req.params

    const { data, error } = await supabase
      .from('checkins')
      .select('*, profiles(full_name, email), tickets(ticket_number)')
      .eq('event_id', event_id)
      .order('checked_in_at', { ascending: false })

    if (error) throw error

    res.json({
      success: true,
      data,
      total: data?.length || 0,
    })
  } catch (error: any) {
    res.status(400).json({ error: error.message })
  }
})

// Get check-in statistics
router.get('/stats/:event_id', async (req: Request, res: Response) => {
  try {
    const { event_id } = req.params

    // Total tickets
    const { count: totalTickets } = await supabase
      .from('tickets')
      .select('*', { count: 'exact' })
      .eq('event_id', event_id)

    // Checked in
    const { count: checkedIn } = await supabase
      .from('checkins')
      .select('*', { count: 'exact' })
      .eq('event_id', event_id)

    res.json({
      success: true,
      stats: {
        total_tickets: totalTickets || 0,
        checked_in: checkedIn || 0,
        pending: (totalTickets || 0) - (checkedIn || 0),
        checkin_rate: ((checkedIn || 0) / (totalTickets || 1)) * 100,
      },
    })
  } catch (error: any) {
    res.status(400).json({ error: error.message })
  }
})

export default router
