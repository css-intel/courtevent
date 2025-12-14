import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '@/lib/supabase'

export default function Register() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [userType, setUserType] = useState('attendee')
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    confirmPassword: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    try {
      setLoading(true)
      const { data, error: signupError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      })

      if (signupError) {
        throw signupError
      }

      // Create user profile
      if (data.user) {
        const { error: profileError } = await supabase.from('profiles').insert([
          {
            id: data.user.id,
            full_name: formData.fullName,
            user_type: userType,
            created_at: new Date().toISOString(),
          },
        ])

        if (profileError) {
          console.warn('Profile creation warning:', profileError)
        }
      }

      setSuccess('Account created successfully! Logging you in...')
      
      // Auto-login after signup
      const { error: loginError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      })

      if (loginError) {
        // Email confirmation is likely required
        setSuccess('Account created! Please check your email to confirm, then log in.')
        setTimeout(() => {
          router.push('/auth/login')
        }, 3000)
      } else {
        setTimeout(() => {
          router.push('/dashboard')
        }, 1500)
      }
    } catch (error: any) {
      console.error('Sign up error:', error)
      setError(error.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }



  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-2">Create Account</h1>
        <p className="text-center text-gray-600 mb-6">Join My Virtual Check In</p>

        <form onSubmit={handleSubmit}>
          {error && <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">{error}</div>}
          {success && <div className="bg-green-100 text-green-700 p-3 rounded-lg mb-4">{success}</div>}

          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">I am a:</label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="userType"
                  value="attendee"
                  checked={userType === 'attendee'}
                  onChange={(e) => setUserType(e.target.value)}
                  className="mr-2"
                />
                Attendee
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="userType"
                  value="organizer"
                  checked={userType === 'organizer'}
                  onChange={(e) => setUserType(e.target.value)}
                  className="mr-2"
                />
                Event Organizer
              </label>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your@email.com"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <p className="text-xs text-gray-500 mt-1">Use a valid email (gmail.com, outlook.com, etc.)</p>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold mb-2">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-bold hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-gray-600 mt-6">
          Already have an account?{' '}
          <a href="/auth/login" className="text-blue-600 font-bold hover:underline">
            Log In
          </a>
        </p>
      </div>
    </div>
  )
}
