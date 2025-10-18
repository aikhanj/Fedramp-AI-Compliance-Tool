import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Lock } from "lucide-react"

export default function LoginPage() {
  return (
    <div className="min-h-screen lock-pattern flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 shadow-lg">
        <div className="flex flex-col items-center space-y-8">
          {/* Logo */}
          <div className="text-center">
            <h1 className="text-3xl font-light tracking-tight">
              <span className="font-serif">Kamstif</span>
            </h1>
          </div>

          {/* Tagline */}
          <p className="text-center text-muted-foreground text-sm leading-relaxed">
            Automate your FedRAMP compliance, securely.
          </p>

          {/* Login Form */}
          <div className="w-full space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-foreground">
                Email address
              </label>
              <Input id="email" type="email" placeholder="you@company.com" className="h-11" />
            </div>

            <Link href="/intake" className="block">
              <Button className="w-full h-11 gradient-primary text-white font-medium shadow-md hover:shadow-lg transition-all">
                Continue with Magic Link
              </Button>
            </Link>
          </div>

          {/* Security Badge */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Lock className="h-3 w-3" />
            <span>Enterprise-grade security</span>
          </div>
        </div>
      </Card>
    </div>
  )
}
