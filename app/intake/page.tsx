"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/browser"
import { useUser } from "@/lib/supabase/client-hooks"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react"

type ProcessingStep = "idle" | "creating-system" | "saving-intake" | "generating" | "complete" | "error"

export default function IntakePage() {
  const { user, loading: userLoading } = useUser()
  const router = useRouter()

  // Form fields
  const [systemName, setSystemName] = useState("")
  const [impactLevel, setImpactLevel] = useState("")
  const [hasMFA, setHasMFA] = useState(false)
  const [accessReviewFrequency, setAccessReviewFrequency] = useState("")
  const [hasEncryptionAtRest, setHasEncryptionAtRest] = useState(false)

  // Processing state
  const [processingStep, setProcessingStep] = useState<ProcessingStep>("idle")
  const [errorMessage, setErrorMessage] = useState("")

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

  const isFormValid = () => {
    return systemName.trim() !== "" && impactLevel !== "" && accessReviewFrequency !== ""
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!isFormValid()) {
      setErrorMessage("Please fill out all required fields")
      return
    }

    setErrorMessage("")

    try {
      // Step 1: Create System
      setProcessingStep("creating-system")
      const systemResponse = await fetch("/api/system", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: systemName,
          impact_level: impactLevel,
        }),
      })

      if (!systemResponse.ok) {
        const error = await systemResponse.json()
        throw new Error(error.error || "Failed to create system")
      }

      const { id: systemId } = await systemResponse.json()

      // Step 2: Save Intake Data
      setProcessingStep("saving-intake")
      const intakeResponse = await fetch("/api/intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_id: systemId,
          json: {
            mfa: hasMFA,
            accessReviewFrequency,
            encryptionAtRest: hasEncryptionAtRest,
          },
        }),
      })

      if (!intakeResponse.ok) {
        const error = await intakeResponse.json()
        throw new Error(error.error || "Failed to save intake data")
      }

      // Step 3: Generate SSP
      setProcessingStep("generating")
      const generateResponse = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_id: systemId,
        }),
      })

      if (!generateResponse.ok) {
        const error = await generateResponse.json()
        throw new Error(error.error || "Failed to generate SSP")
      }

      const { run_id } = await generateResponse.json()

      // Step 4: Complete and redirect
      setProcessingStep("complete")
      
      // Redirect to results page after a brief success message
      setTimeout(() => {
        router.push(`/results?run_id=${run_id}`)
      }, 1000)

    } catch (error) {
      setProcessingStep("error")
      setErrorMessage(error instanceof Error ? error.message : "An unexpected error occurred")
    }
  }

  if (userLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  const isProcessing = processingStep !== "idle" && processingStep !== "error"

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-light tracking-tight">
              <span className="font-serif">Kamstif</span>
            </h1>
            <div className="text-right">
              <p className="text-sm text-muted-foreground mb-1">
                {user.email}
              </p>
              <button
                onClick={handleLogout}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors underline"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12 max-w-3xl">
        <div className="mb-8">
          <h2 className="text-3xl font-semibold text-foreground mb-2">
            FedRAMP Compliance Questionnaire
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Answer a few questions to generate your System Security Plan (SSP) automatically.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* System Information */}
          <Card className="p-6 space-y-6">
            <h3 className="text-lg font-semibold text-foreground">System Information</h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="system-name">
                  System Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="system-name"
                  value={systemName}
                  onChange={(e) => setSystemName(e.target.value)}
                  placeholder="e.g., Customer Portal"
                  disabled={isProcessing}
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="impact-level">
                  FIPS 199 Impact Level <span className="text-destructive">*</span>
                </Label>
                <Select value={impactLevel} onValueChange={setImpactLevel} disabled={isProcessing}>
                  <SelectTrigger id="impact-level" className="h-11">
                    <SelectValue placeholder="Select impact level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="moderate">Moderate</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>

          {/* Security Controls */}
          <Card className="p-6 space-y-6">
            <h3 className="text-lg font-semibold text-foreground">Security Controls</h3>
            
            <div className="space-y-6">
              {/* Question 1: MFA */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="mfa" className="text-base">
                    Multi-Factor Authentication (MFA)
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Does your system require MFA for all users?
                  </p>
                </div>
                <Switch
                  id="mfa"
                  checked={hasMFA}
                  onCheckedChange={setHasMFA}
                  disabled={isProcessing}
                />
              </div>

              {/* Question 2: Access Review */}
              <div className="space-y-2">
                <Label htmlFor="access-review">
                  Access Review Frequency <span className="text-destructive">*</span>
                </Label>
                <p className="text-sm text-muted-foreground mb-2">
                  How often do you review user access privileges?
                </p>
                <Select 
                  value={accessReviewFrequency} 
                  onValueChange={setAccessReviewFrequency}
                  disabled={isProcessing}
                >
                  <SelectTrigger id="access-review" className="h-11">
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                    <SelectItem value="annually">Annually</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Question 3: Encryption */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="encryption" className="text-base">
                    Data Encryption at Rest
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Is sensitive data encrypted when stored?
                  </p>
                </div>
                <Switch
                  id="encryption"
                  checked={hasEncryptionAtRest}
                  onCheckedChange={setHasEncryptionAtRest}
                  disabled={isProcessing}
                />
              </div>
            </div>
          </Card>

          {/* Processing Status */}
          {isProcessing && (
            <Card className="p-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  {processingStep === "creating-system" && (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin text-primary" />
                      <p className="text-sm font-medium">Creating system...</p>
                    </>
                  )}
                  {processingStep === "saving-intake" && (
                    <>
                      <CheckCircle2 className="h-5 w-5 text-success" />
                      <p className="text-sm font-medium">System created! Saving intake data...</p>
                    </>
                  )}
                  {processingStep === "generating" && (
                    <>
                      <CheckCircle2 className="h-5 w-5 text-success" />
                      <p className="text-sm font-medium">Generating SSP with AI... This may take a minute.</p>
                    </>
                  )}
                  {processingStep === "complete" && (
                    <>
                      <CheckCircle2 className="h-5 w-5 text-success" />
                      <p className="text-sm font-medium">Complete! Redirecting to results...</p>
                    </>
                  )}
                </div>
              </div>
            </Card>
          )}

          {/* Error Message */}
          {processingStep === "error" && errorMessage && (
            <Card className="p-6 border-destructive">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-destructive mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-destructive">Error</p>
                  <p className="text-sm text-muted-foreground mt-1">{errorMessage}</p>
                </div>
              </div>
            </Card>
          )}

          {/* Submit Button */}
          <div className="flex justify-end pt-4">
            <Button
              type="submit"
              size="lg"
              disabled={!isFormValid() || isProcessing}
              className="gradient-primary text-white shadow-md hover:shadow-lg transition-all h-12 px-8 text-base font-medium"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Processing...
                </>
              ) : (
                "Generate SSP"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
