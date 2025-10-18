"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Lock, Mail, CheckCircle } from "lucide-react"
import { createClient } from "@/lib/supabase/browser"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email) {
      setError("Please enter your email address")
      return
    }

    setLoading(true)
    setError("")
    setSent(false)

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        setError(error.message)
      } else {
        setSent(true)
      }
    } catch (err) {
      setError("An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen lock-pattern flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 shadow-lg">
        <div className="flex flex-col items-center space-y-8">
          {/* Logo */}
          <div className="text-center">
            <h1 className="text-3xl font-light tracking-tight">
              <span className="font-serif">Kamstif</span>
            </h1>
          </div>

          {/* Tagline */}
          <p className="text-center text-muted-foreground text-sm leading-relaxed">
            Automate your FedRAMP compliance, securely.
          </p>

          {sent ? (
            // Success message
            <div className="w-full space-y-4 text-center">
              <div className="flex justify-center">
                <div className="rounded-full bg-green-100 p-3">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">Check your email</h3>
                <p className="text-sm text-muted-foreground">
                  We've sent a magic link to <strong>{email}</strong>
                </p>
                <p className="text-sm text-muted-foreground">
                  Click the link in the email to sign in.
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => {
                  setSent(false)
                  setEmail("")
                }}
                className="w-full"
              >
                Use a different email
              </Button>
            </div>
          ) : (
            // Login Form
            <form onSubmit={handleLogin} className="w-full space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-foreground">
                  Email address
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="h-11"
                  disabled={loading}
                />
              </div>

              {error && (
                <div className="bg-red-50 text-red-800 text-sm p-3 rounded-md">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-11 gradient-primary text-white font-medium shadow-md hover:shadow-lg transition-all"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Mail className="h-4 w-4 animate-pulse" />
                    Sending magic link...
                  </span>
                ) : (
                  "Continue with Magic Link"
                )}
              </Button>
            </form>
          )}

          {/* Security Badge */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Lock className="h-3 w-3" />
            <span>Enterprise-grade security</span>
          </div>
        </div>
      </Card>
    </div>
  )
}
