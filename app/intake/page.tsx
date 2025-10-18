import { IntakeForm } from "@/components/intake-form"
import { ProgressTracker } from "@/components/progress-tracker"

export default function IntakePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-4">
          <h1 className="text-xl font-light tracking-tight">
            <span className="font-serif">Specter</span>
            <span className="font-sans">.Ai</span>
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-[1fr_320px] gap-12">
          {/* Left Column - Form */}
          <div>
            <div className="mb-8">
              <h2 className="text-3xl font-semibold text-foreground mb-2">FedRAMP Compliance Intake</h2>
              <p className="text-muted-foreground leading-relaxed">
                Answer the following questions to generate your System Security Plan (SSP) draft.
              </p>
            </div>
            <IntakeForm />
          </div>

          {/* Right Column - Progress */}
          <div className="lg:sticky lg:top-6 h-fit">
            <ProgressTracker />
          </div>
        </div>
      </div>
    </div>
  )
}
