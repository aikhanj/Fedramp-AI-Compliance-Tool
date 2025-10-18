"use client"

import { Suspense, useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { createClient } from "@/lib/supabase/browser"
import { useUser } from "@/lib/supabase/client-hooks"
import { ControlCard } from "@/components/control-card"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Download, Loader2, AlertCircle, ArrowLeft } from "lucide-react"
import Link from "next/link"

interface Section {
  id: string
  control_id: string
  narrative: string
  evidence: string[]
  citations: string[]
}

interface Run {
  id: string
  status: string
  error: string | null
  created_at: string
}

interface System {
  name: string
  impact_level: string
}

function ResultsContent() {
  const { user, loading: userLoading } = useUser()
  const router = useRouter()
  const searchParams = useSearchParams()
  const runId = searchParams.get("run_id")

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [run, setRun] = useState<Run | null>(null)
  const [system, setSystem] = useState<System | null>(null)
  const [sections, setSections] = useState<Section[]>([])

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!userLoading && !user) {
      router.push("/")
    }
  }, [user, userLoading, router])

  // Fetch data
  useEffect(() => {
    if (!runId || !user) return

    const fetchData = async () => {
      try {
        setLoading(true)
        setError("")

        const supabase = createClient()

        // Fetch run details
        const { data: runData, error: runError } = await supabase
          .from("runs")
          .select("*")
          .eq("id", runId)
          .single()

        if (runError || !runData) {
          throw new Error("Run not found or access denied")
        }

        setRun(runData)

        // Fetch system details
        const { data: systemData, error: systemError } = await supabase
          .from("systems")
          .select("name, impact_level")
          .eq("id", runData.system_id)
          .single()

        if (systemError || !systemData) {
          throw new Error("System not found")
        }

        setSystem(systemData)

        // Fetch sections for this run
        const { data: sectionsData, error: sectionsError } = await supabase
          .from("sections")
          .select("*")
          .eq("run_id", runId)
          .order("control_id")

        if (sectionsError) {
          throw new Error("Failed to load sections")
        }

        setSections(sectionsData || [])
      } catch (err) {
        console.error("Error fetching results:", err)
        setError(err instanceof Error ? err.message : "Failed to load results")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [runId, user])

  if (userLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading results...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  // No run_id provided
  if (!runId) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="p-8 max-w-md text-center">
          <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">No Results Selected</h2>
          <p className="text-muted-foreground mb-6">
            Please generate an SSP from the intake page first.
          </p>
          <Link href="/intake">
            <Button className="gradient-primary text-white">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go to Intake
            </Button>
          </Link>
        </Card>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="p-8 max-w-md text-center border-destructive">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Error Loading Results</h2>
          <p className="text-muted-foreground mb-6">{error}</p>
          <div className="flex gap-3 justify-center">
            <Link href="/intake">
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Intake
              </Button>
            </Link>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  // Run is still processing
  if (run?.status === "running") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="p-8 max-w-md text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Generating SSP...</h2>
          <p className="text-muted-foreground mb-4">
            Kamstif is analyzing your controls and generating compliance documentation.
            This may take a minute.
          </p>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Refresh
          </Button>
        </Card>
      </div>
    )
  }

  // Run failed
  if (run?.status === "failed") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="p-8 max-w-md text-center border-destructive">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Generation Failed</h2>
          <p className="text-muted-foreground mb-2">
            {run.error || "An error occurred during SSP generation"}
          </p>
          <p className="text-sm text-muted-foreground mb-6">
            Please try generating again from the intake page.
          </p>
          <Link href="/intake">
            <Button className="gradient-primary text-white">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Intake
            </Button>
          </Link>
        </Card>
      </div>
    )
  }

  // Success - display results
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-light tracking-tight">
              <span className="font-serif">Kamstif</span>
            </h1>
            <Link href="/intake">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                New Generation
              </Button>
            </Link>
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-foreground mb-1">
              FedRAMP SSP Draft — {system?.name}
            </h2>
            <p className="text-sm text-muted-foreground">
              Impact Level: <span className="capitalize">{system?.impact_level}</span> • Generated on{" "}
              {new Date(run?.created_at || "").toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        {sections.length === 0 ? (
          <Card className="p-8 text-center">
            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Sections Generated</h3>
            <p className="text-muted-foreground">
              No control sections were generated for this run.
            </p>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {sections.map((section) => (
              <ControlCard
                key={section.id}
                id={section.control_id}
                title={getControlTitle(section.control_id)}
                narrative={section.narrative || "No narrative generated"}
                evidence={section.evidence || []}
                status="complete"
              />
            ))}
          </div>
        )}
      </div>

      {/* Fixed Download Button */}
      {sections.length > 0 && (
        <div className="fixed bottom-8 right-8">
          <Button
            size="lg"
            className="gradient-primary text-white shadow-xl hover:shadow-2xl transition-all h-14 px-8 text-base font-medium"
            onClick={() => alert("Download feature coming soon!")}
          >
            <Download className="mr-2 h-5 w-5" />
            Download .docx
          </Button>
        </div>
      )}
    </div>
  )
}

// Helper function to get control titles
function getControlTitle(controlId: string): string {
  const controlTitles: Record<string, string> = {
    "AC-2": "Account Management",
    "AC-17": "Remote Access",
    "AU-2": "Audit Events",
    "SC-7": "Boundary Protection",
    "SC-13": "Cryptographic Protection",
    "IA-2": "Identification and Authentication",
    "CP-9": "Information System Backup",
    "IR-4": "Incident Handling",
  }
  return controlTitles[controlId] || controlId
}

// Main page component wrapped in Suspense
export default function ResultsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading results...</p>
        </div>
      </div>
    }>
      <ResultsContent />
    </Suspense>
  )
}
