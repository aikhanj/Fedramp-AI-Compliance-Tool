import { ResultsHeader } from "@/components/results-header"
import { ControlCard } from "@/components/control-card"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

const controls = [
  {
    id: "AC-2",
    title: "Account Management",
    narrative:
      "The organization manages information system accounts, including establishing, activating, modifying, reviewing, disabling, and removing accounts. Account management includes the identification of account types (individual, group, system, application, guest/anonymous, and temporary), establishment of conditions for group membership, and assignment of associated authorizations.",
    evidence: [
      "User provisioning workflow documentation",
      "Access control policy document",
      "Quarterly access review reports",
      "Role-based access control (RBAC) matrix",
    ],
    status: "complete" as const,
  },
  {
    id: "AC-17",
    title: "Remote Access",
    narrative:
      "The organization establishes usage restrictions, configuration requirements, connection requirements, and implementation guidance for each type of remote access allowed. Remote access is access to organizational information systems by users (or processes acting on behalf of users) communicating through external networks.",
    evidence: [
      "VPN configuration documentation",
      "Multi-factor authentication logs",
      "Remote access policy",
      "Endpoint security requirements",
    ],
    status: "complete" as const,
  },
  {
    id: "AU-2",
    title: "Audit Events",
    narrative:
      "The organization determines that the information system is capable of auditing specific events and coordinates the security audit function with other organizational entities requiring audit-related information. Auditable events include password changes, failed logons or failed accesses related to information systems, security policy changes, and system administrator or root-level access.",
    evidence: [
      "Audit logging configuration",
      "SIEM integration documentation",
      "Log retention policy",
      "Audit event definitions",
    ],
    status: "needs-info" as const,
  },
  {
    id: "SC-7",
    title: "Boundary Protection",
    narrative:
      "The information system monitors and controls communications at the external boundary of the system and at key internal boundaries within the system. The organization implements subnetworks for publicly accessible system components that are physically or logically separated from internal organizational networks.",
    evidence: [
      "Network architecture diagram",
      "Firewall rule documentation",
      "DMZ configuration",
      "Network segmentation policy",
    ],
    status: "complete" as const,
  },
  {
    id: "SC-13",
    title: "Cryptographic Protection",
    narrative:
      "The information system implements FIPS-validated or NSA-approved cryptography in accordance with applicable federal laws, Executive Orders, directives, policies, regulations, and standards. The organization employs cryptographic mechanisms to prevent unauthorized disclosure of information and detect changes to information during transmission.",
    evidence: [
      "Encryption standards documentation",
      "TLS/SSL certificate inventory",
      "Data-at-rest encryption configuration",
      "Key management procedures",
    ],
    status: "complete" as const,
  },
  {
    id: "IA-2",
    title: "Identification and Authentication",
    narrative:
      "The information system uniquely identifies and authenticates organizational users (or processes acting on behalf of organizational users). The organization requires multi-factor authentication for network access to privileged accounts and for network access to non-privileged accounts.",
    evidence: [
      "Authentication mechanism documentation",
      "MFA implementation guide",
      "Password policy",
      "Identity provider integration",
    ],
    status: "needs-info" as const,
  },
  {
    id: "CP-9",
    title: "Information System Backup",
    narrative:
      "The organization conducts backups of user-level information, system-level information, and information system documentation including security-related documentation. The organization protects the confidentiality, integrity, and availability of backup information at storage locations.",
    evidence: [
      "Backup and recovery procedures",
      "Backup schedule documentation",
      "Recovery time objective (RTO) analysis",
      "Backup testing results",
    ],
    status: "missing" as const,
  },
  {
    id: "IR-4",
    title: "Incident Handling",
    narrative:
      "The organization implements an incident handling capability for security incidents that includes preparation, detection and analysis, containment, eradication, and recovery. The organization coordinates incident handling activities with contingency planning activities.",
    evidence: [
      "Incident response plan",
      "Incident handling procedures",
      "Security incident log",
      "Post-incident review reports",
    ],
    status: "complete" as const,
  },
]

export default function ResultsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <ResultsHeader />

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="grid md:grid-cols-2 gap-6">
          {controls.map((control) => (
            <ControlCard key={control.id} {...control} />
          ))}
        </div>
      </div>

      {/* Fixed Download Button */}
      <div className="fixed bottom-8 right-8">
        <Button
          size="lg"
          className="gradient-primary text-white shadow-xl hover:shadow-2xl transition-all h-14 px-8 text-base font-medium"
        >
          <Download className="mr-2 h-5 w-5" />
          Download .docx
        </Button>
      </div>
    </div>
  )
}
