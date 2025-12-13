import { Router, Request, Response } from 'express'
import { supabase } from '../index'
import { v4 as uuidv4 } from 'uuid'

const router = Router()

// Register for event / Create ticket
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { event_id, user_id, quantity = 1, price } = req.body

    const tickets = Array.from({ length: quantity }, () => ({
      id: uuidv4(),
      event_id,
      user_id,
      ticket_number: `TKT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      price: price || 0,
      status: 'active',
      created_at: new Date().toISOString(),
    }))

    const { data, error } = await supabase
      .from('tickets')
      .insert(tickets)
      .select()

    if (error) throw error

    res.status(201).json({ success: true, data })
  } catch (error: any) {
    res.status(400).json({ error: error.message })
  }
})

// Get user tickets
router.get('/user/:user_id', async (req: Request, res: Response) => {
  try {
    const { user_id } = req.params

    const { data, error } = await supabase
      .from('tickets')
      .select('*, events(title, location, event_date)')
      .eq('user_id', user_id)
      .order('created_at', { ascending: false })

    if (error) throw error

    res.json({ success: true, data })
  } catch (error: any) {
    res.status(400).json({ error: error.message })
  }
})

// Get event tickets (organizer)
router.get('/event/:event_id', async (req: Request, res: Response) => {
  try {
    const { event_id } = req.params

    const { data, error } = await supabase
      .from('tickets')
      .select('*, profiles(full_name, email)')
      .eq('event_id', event_id)
      .order('created_at', { ascending: false })

    if (error) throw error

    res.json({ success: true, data })
  } catch (error: any) {
    res.status(400).json({ error: error.message })
  }
})

// Validate ticket
router.get('/validate/:ticket_id', async (req: Request, res: Response) => {
  try {
    const { ticket_id } = req.params

    const { data, error } = await supabase
      .from('tickets')
      .select('*')
      .eq('id', ticket_id)
      .single()

    if (error) throw error

    res.json({
      success: true,
      valid: data.status === 'active',
      data,
    })
  } catch (error: any) {
    res.status(404).json({ error: 'Ticket not found' })
  }
})

export default router
