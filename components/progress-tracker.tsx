"use client"

import { Card } from "@/components/ui/card"
import { CheckCircle2, Circle } from "lucide-react"

const sections = [
  { name: "System Info", completed: true },
  { name: "Access Control", completed: true },
  { name: "Encryption", completed: true },
  { name: "Logging", completed: false },
  { name: "Incident Response", completed: false },
  { name: "Backup & Recovery", completed: false },
]

export function ProgressTracker() {
  const completedCount = sections.filter((s) => s.completed).length
  const totalCount = sections.length

  return (
    <Card className="p-6 space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-2">Progress</h3>
        <p className="text-2xl font-semibold text-primary">
          {completedCount} of {totalCount}
        </p>
        <p className="text-sm text-muted-foreground">sections completed</p>
      </div>

      <div className="space-y-3">
        {sections.map((section, index) => (
          <div key={index} className="flex items-center gap-3">
            {section.completed ? (
              <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0" />
            ) : (
              <Circle className="h-5 w-5 text-muted-foreground flex-shrink-0" />
            )}
            <span className={section.completed ? "text-foreground" : "text-muted-foreground"}>{section.name}</span>
          </div>
        ))}
      </div>

      <div className="pt-4 border-t border-border">
        <div className="h-2 bg-secondary rounded-full overflow-hidden">
          <div
            className="h-full gradient-primary transition-all duration-500"
            style={{ width: `${(completedCount / totalCount) * 100}%` }}
          />
        </div>
      </div>
    </Card>
  )
}
