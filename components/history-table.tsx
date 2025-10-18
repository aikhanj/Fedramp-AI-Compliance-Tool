import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

const historyData = [
  {
    runId: "SSP-2025-001",
    date: "2025-01-15",
    controlsCompleted: 8,
    totalControls: 8,
    reviewer: "Sarah Chen",
  },
  {
    runId: "SSP-2025-002",
    date: "2025-01-10",
    controlsCompleted: 7,
    totalControls: 8,
    reviewer: "Michael Rodriguez",
  },
  {
    runId: "SSP-2024-089",
    date: "2024-12-28",
    controlsCompleted: 8,
    totalControls: 8,
    reviewer: "Sarah Chen",
  },
  {
    runId: "SSP-2024-088",
    date: "2024-12-20",
    controlsCompleted: 6,
    totalControls: 8,
    reviewer: "David Kim",
  },
  {
    runId: "SSP-2024-087",
    date: "2024-12-15",
    controlsCompleted: 8,
    totalControls: 8,
    reviewer: "Sarah Chen",
  },
]

export function HistoryTable() {
  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Run ID</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Date</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Controls Completed</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Reviewer</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Download</th>
            </tr>
          </thead>
          <tbody>
            {historyData.map((row, index) => (
              <tr key={row.runId} className={index % 2 === 0 ? "bg-card" : "bg-muted/20"}>
                <td className="px-6 py-4">
                  <span className="font-mono text-sm text-primary font-medium">{row.runId}</span>
                </td>
                <td className="px-6 py-4 text-sm text-muted-foreground">
                  {new Date(row.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </td>
                <td className="px-6 py-4 text-sm text-foreground">
                  {row.controlsCompleted} / {row.totalControls}
                </td>
                <td className="px-6 py-4 text-sm text-muted-foreground">{row.reviewer}</td>
                <td className="px-6 py-4">
                  <Button variant="ghost" size="sm" className="h-8">
                    <Download className="h-4 w-4 mr-2" />
                    .docx
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
