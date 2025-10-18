import { HistoryTable } from "@/components/history-table"

export default function HistoryPage() {
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
        <div className="mb-8">
          <h2 className="text-3xl font-semibold text-foreground mb-2">Generation History</h2>
          <p className="text-muted-foreground leading-relaxed">
            View and download previous FedRAMP SSP generation runs.
          </p>
        </div>

        <HistoryTable />
      </div>
    </div>
  )
}
