"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"

export function IntakeForm() {
  const router = useRouter()
  const [isGenerating, setIsGenerating] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsGenerating(true)

    // Simulate generation
    setTimeout(() => {
      router.push("/results")
    }, 2000)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* System Info */}
      <Card className="p-6 space-y-6">
        <h3 className="text-lg font-semibold text-foreground">System Information</h3>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="system-name">System Name</Label>
            <Input id="system-name" placeholder="e.g., Customer Portal" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="system-type">System Type</Label>
            <Select>
              <SelectTrigger id="system-type">
                <SelectValue placeholder="Select system type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="saas">SaaS Application</SelectItem>
                <SelectItem value="paas">Platform as a Service</SelectItem>
                <SelectItem value="iaas">Infrastructure as a Service</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="impact-level">Impact Level</Label>
            <Select>
              <SelectTrigger id="impact-level">
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

      {/* Access Control */}
      <Card className="p-6 space-y-6">
        <h3 className="text-lg font-semibold text-foreground">Access Control</h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="mfa">Multi-Factor Authentication</Label>
              <p className="text-sm text-muted-foreground">Required for all users</p>
            </div>
            <Switch id="mfa" />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="rbac">Role-Based Access Control</Label>
              <p className="text-sm text-muted-foreground">Implement RBAC policies</p>
            </div>
            <Switch id="rbac" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="access-review">Access Review Frequency</Label>
            <Select>
              <SelectTrigger id="access-review">
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="quarterly">Quarterly</SelectItem>
                <SelectItem value="annually">Annually</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Encryption */}
      <Card className="p-6 space-y-6">
        <h3 className="text-lg font-semibold text-foreground">Encryption</h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="data-at-rest">Data at Rest Encryption</Label>
              <p className="text-sm text-muted-foreground">AES-256 encryption</p>
            </div>
            <Switch id="data-at-rest" />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="data-in-transit">Data in Transit Encryption</Label>
              <p className="text-sm text-muted-foreground">TLS 1.3 or higher</p>
            </div>
            <Switch id="data-in-transit" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="key-management">Key Management System</Label>
            <Input id="key-management" placeholder="e.g., AWS KMS, Azure Key Vault" />
          </div>
        </div>
      </Card>

      {/* Logging */}
      <Card className="p-6 space-y-6">
        <h3 className="text-lg font-semibold text-foreground">Logging & Monitoring</h3>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="siem">SIEM Solution</Label>
            <Input id="siem" placeholder="e.g., Splunk, Datadog" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="log-retention">Log Retention Period</Label>
            <Select>
              <SelectTrigger id="log-retention">
                <SelectValue placeholder="Select retention period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="90">90 days</SelectItem>
                <SelectItem value="180">180 days</SelectItem>
                <SelectItem value="365">1 year</SelectItem>
                <SelectItem value="730">2 years</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="real-time-alerts">Real-time Security Alerts</Label>
              <p className="text-sm text-muted-foreground">Automated incident detection</p>
            </div>
            <Switch id="real-time-alerts" />
          </div>
        </div>
      </Card>

      {/* Incident Response */}
      <Card className="p-6 space-y-6">
        <h3 className="text-lg font-semibold text-foreground">Incident Response</h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="ir-plan">Incident Response Plan</Label>
              <p className="text-sm text-muted-foreground">Documented and tested</p>
            </div>
            <Switch id="ir-plan" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ir-team">Incident Response Team</Label>
            <Textarea id="ir-team" placeholder="List team members and their roles" className="min-h-[100px]" />
          </div>
        </div>
      </Card>

      {/* Backup & Recovery */}
      <Card className="p-6 space-y-6">
        <h3 className="text-lg font-semibold text-foreground">Backup & Recovery</h3>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="backup-frequency">Backup Frequency</Label>
            <Select>
              <SelectTrigger id="backup-frequency">
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hourly">Hourly</SelectItem>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="rto">Recovery Time Objective (RTO)</Label>
            <Input id="rto" placeholder="e.g., 4 hours" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="rpo">Recovery Point Objective (RPO)</Label>
            <Input id="rpo" placeholder="e.g., 1 hour" />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="backup-testing">Regular Backup Testing</Label>
              <p className="text-sm text-muted-foreground">Quarterly recovery drills</p>
            </div>
            <Switch id="backup-testing" />
          </div>
        </div>
      </Card>

      {/* Submit Button */}
      <div className="flex justify-end pt-4">
        <Button
          type="submit"
          size="lg"
          disabled={isGenerating}
          className="gradient-primary text-white shadow-md hover:shadow-lg transition-all h-12 px-8 text-base font-medium"
        >
          {isGenerating ? "Specter is reviewing your controls…" : "Generate SSP Draft"}
        </Button>
      </div>
    </form>
  )
}
