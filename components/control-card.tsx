import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Edit, Download, CheckCircle2, AlertCircle, XCircle } from "lucide-react"

interface ControlCardProps {
  id: string
  title: string
  narrative: string
  evidence: string[]
  status: "complete" | "needs-info" | "missing"
}

const statusConfig = {
  complete: {
    label: "Complete",
    variant: "default" as const,
    icon: CheckCircle2,
    className: "bg-success text-success-foreground hover:bg-success/90",
  },
  "needs-info": {
    label: "Needs Info",
    variant: "secondary" as const,
    icon: AlertCircle,
    className: "bg-warning text-warning-foreground hover:bg-warning/90",
  },
  missing: {
    label: "Missing",
    variant: "destructive" as const,
    icon: XCircle,
    className: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
  },
}

export function ControlCard({ id, title, narrative, evidence, status }: ControlCardProps) {
  const config = statusConfig[status]
  const StatusIcon = config.icon

  return (
    <Card className="p-6 space-y-4 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-sm font-semibold text-primary">{id}</span>
            <Badge className={config.className}>
              <StatusIcon className="h-3 w-3 mr-1" />
              {config.label}
            </Badge>
          </div>
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        </div>
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Narrative */}
      <div>
        <h4 className="text-sm font-medium text-foreground mb-2">Control Narrative</h4>
        <p className="text-sm text-muted-foreground leading-relaxed">{narrative}</p>
      </div>

      {/* Evidence */}
      <div>
        <h4 className="text-sm font-medium text-foreground mb-2">Required Evidence</h4>
        <ul className="space-y-1.5">
          {evidence.map((item, index) => (
            <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
              <span className="text-primary mt-1">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  )
}
