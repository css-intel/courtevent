import { Router, Request, Response } from 'express'
import { supabase } from '../index'

const router = Router()

// Check auth status
router.get('/me', async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '')
    if (!token) {
      return res.status(401).json({ error: 'No token provided' })
    }

    const { data, error } = await supabase.auth.getUser(token)

    if (error) throw error

    res.json({ success: true, user: data.user })
  } catch (error: any) {
    res.status(401).json({ error: 'Unauthorized' })
  }
})

// Logout (client-side mainly, but can be used for cleanup)
router.post('/logout', async (req: Request, res: Response) => {
  try {
    res.json({ success: true, message: 'Logged out' })
  } catch (error: any) {
    res.status(400).json({ error: error.message })
  }
})

export default router
