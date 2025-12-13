import { Router, Request, Response } from 'express'
import { supabase } from '../index'
import { v4 as uuidv4 } from 'uuid'

const router = Router()

// Create event
router.post('/', async (req: Request, res: Response) => {
  try {
    const {
      title,
      description,
      location,
      event_date,
      category,
      price,
      capacity,
      organizer_id,
    } = req.body

    const eventId = uuidv4()

    const { data, error } = await supabase
      .from('events')
      .insert([
        {
          id: eventId,
          title,
          description,
          location,
          event_date,
          category,
          price: price || 0,
          capacity: capacity || null,
          organizer_id,
          created_at: new Date().toISOString(),
          status: 'published',
        },
      ])
      .select()

    if (error) throw error

    res.status(201).json({ success: true, data: data[0] })
  } catch (error: any) {
    res.status(400).json({ error: error.message })
  }
})

// Get events with filters
router.get('/', async (req: Request, res: Response) => {
  try {
    const { category, search, organizer_id, limit = 20, offset = 0 } = req.query

    let query = supabase.from('events').select('*')

    if (category && category !== 'all') {
      query = query.eq('category', category)
    }

    if (search) {
      query = query.ilike('title', `%${search}%`)
    }

    if (organizer_id) {
      query = query.eq('organizer_id', organizer_id)
    }

    const { data, error, count } = await query
      .order('event_date', { ascending: true })
      .range(Number(offset), Number(offset) + Number(limit) - 1)

    if (error) throw error

    res.json({
      success: true,
      data,
      pagination: { limit: Number(limit), offset: Number(offset), total: count },
    })
  } catch (error: any) {
    res.status(400).json({ error: error.message })
  }
})

// Get single event
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error

    res.json({ success: true, data })
  } catch (error: any) {
    res.status(404).json({ error: 'Event not found' })
  }
})

// Update event
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const updates = req.body

    const { data, error } = await supabase
      .from('events')
      .update(updates)
      .eq('id', id)
      .select()

    if (error) throw error

    res.json({ success: true, data: data[0] })
  } catch (error: any) {
    res.status(400).json({ error: error.message })
  }
})

// Delete event
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    const { error } = await supabase.from('events').delete().eq('id', id)

    if (error) throw error

    res.json({ success: true, message: 'Event deleted' })
  } catch (error: any) {
    res.status(400).json({ error: error.message })
  }
})

export default router
