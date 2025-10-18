"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/browser"
import { useUser } from "@/lib/supabase/client-hooks"

export default function IntakePage() {
  const { user, loading: userLoading } = useUser()
  const router = useRouter()
  const [systemName, setSystemName] = useState("")
  const [impactLevel, setImpactLevel] = useState("low")
  const [systemId, setSystemId] = useState<string | null>(null)
  const [intakeData, setIntakeData] = useState("")
  const [runId, setRunId] = useState<string | null>(null)
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!userLoading && !user) {
      router.push("/")
    }
  }, [user, userLoading, router])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
  }

  if (userLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const handleCreateSystem = async () => {
    if (!systemName) {
      setMessage("Please enter a system name")
      return
    }

    setLoading(true)
    setMessage("")

    try {
      const response = await fetch("/api/system", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: systemName,
          impact_level: impactLevel,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setMessage(`Error: ${data.error}`)
        return
      }

      setSystemId(data.id)
      setMessage(`System created! ID: ${data.id}`)
    } catch (error) {
      setMessage(`Error: ${error instanceof Error ? error.message : "Unknown error"}`)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveIntake = async () => {
    if (!systemId) {
      setMessage("Please create a system first")
      return
    }

    if (!intakeData) {
      setMessage("Please enter some intake data")
      return
    }

    setLoading(true)
    setMessage("")

    try {
      const response = await fetch("/api/intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_id: systemId,
          json: JSON.parse(intakeData),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setMessage(`Error: ${data.error}`)
        return
      }

      setMessage("Intake data saved successfully!")
    } catch (error) {
      setMessage(`Error: ${error instanceof Error ? error.message : "Unknown error"}`)
    } finally {
      setLoading(false)
    }
  }

  const handleGenerate = async () => {
    if (!systemId) {
      setMessage("Please create a system first")
      return
    }

    setLoading(true)
    setMessage("")

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_id: systemId,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setMessage(`Error: ${data.error}`)
        return
      }

      setRunId(data.run_id)
      setMessage(`Generation complete! Run ID: ${data.run_id}`)
    } catch (error) {
      setMessage(`Error: ${error instanceof Error ? error.message : "Unknown error"}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Kamstif API Test</h1>
            <p className="text-gray-600">Test the Supabase backend integration</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600 mb-2">
              Logged in as: <strong>{user.email}</strong>
            </p>
            <button
              onClick={handleLogout}
              className="text-sm text-red-600 hover:text-red-700 underline"
            >
              Sign out
            </button>
          </div>
        </div>

        {/* Create System */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">1. Create System</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">System Name</label>
              <input
                type="text"
                value={systemName}
                onChange={(e) => setSystemName(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2"
                placeholder="e.g., Customer Portal"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Impact Level</label>
              <select
                value={impactLevel}
                onChange={(e) => setImpactLevel(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2"
              >
                <option value="low">Low</option>
                <option value="moderate">Moderate</option>
                <option value="high">High</option>
              </select>
            </div>
            <button
              onClick={handleCreateSystem}
              disabled={loading}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create System"}
            </button>
          </div>
        </div>

        {/* Save Intake */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">2. Save Intake Data</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Intake JSON (must be valid JSON)
              </label>
              <textarea
                value={intakeData}
                onChange={(e) => setIntakeData(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 h-32 font-mono text-sm"
                placeholder='{"mfa": true, "rbac": true}'
              />
            </div>
            <button
              onClick={handleSaveIntake}
              disabled={loading || !systemId}
              className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Intake"}
            </button>
          </div>
        </div>

        {/* Generate */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">3. Generate (Stub)</h2>
          <button
            onClick={handleGenerate}
            disabled={loading || !systemId}
            className="w-full bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 disabled:opacity-50"
          >
            {loading ? "Generating..." : "Generate"}
          </button>
        </div>

        {/* Status Display */}
        {systemId && (
          <div className="bg-blue-50 p-4 rounded-lg mb-4">
            <p className="text-sm font-medium">Current System ID: {systemId}</p>
          </div>
        )}

        {runId && (
          <div className="bg-purple-50 p-4 rounded-lg mb-4">
            <p className="text-sm font-medium">Latest Run ID: {runId}</p>
          </div>
        )}

        {message && (
          <div
            className={`p-4 rounded-lg ${
              message.startsWith("Error") ? "bg-red-50 text-red-800" : "bg-green-50 text-green-800"
            }`}
          >
            <p className="text-sm">{message}</p>
          </div>
        )}
      </div>
    </div>
  )
}
