import * as React from "react"
import { useGetStats } from "@workspace/api-client-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { 
  Users, 
  Send, 
  Clock, 
  AlertCircle, 
  Ban,
  Activity,
  Loader2
} from "lucide-react"

export default function Dashboard() {
  const { data: stats, isLoading } = useGetStats()

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center h-full">
        <div className="flex flex-col items-center gap-4 text-muted-foreground">
          <Loader2 className="w-8 h-8 animate-spin" />
          <p className="font-mono text-sm">LOADING_TELEMETRY...</p>
        </div>
      </div>
    )
  }

  const completionPercentage = stats?.total 
    ? Math.round(((stats.sent + stats.skipped + stats.failed) / stats.total) * 100) 
    : 0

  return (
    <div className="flex-1 overflow-auto p-8 space-y-8 bg-background">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Mission Control</h1>
        <p className="text-muted-foreground mt-1">Tax Year 2026 Reminders Campaign</p>
      </div>

      <Card className="bg-card border-card-border overflow-hidden relative">
        <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
            Campaign Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-end mb-2">
            <span className="text-4xl font-bold font-mono tracking-tighter">
              {completionPercentage}%
            </span>
            <span className="text-sm text-muted-foreground font-mono">
              {stats?.sent ?? 0} / {stats?.total ?? 0} dispatched
            </span>
          </div>
          <Progress value={completionPercentage} className="h-3 shadow-inner" />
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Contacts</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">{stats?.total ?? 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Registered targets
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Successfully Sent</CardTitle>
            <Send className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-green-600 dark:text-green-400">
              {stats?.sent ?? 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Messages delivered
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-yellow-600 dark:text-yellow-400">
              {stats?.pending ?? 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Awaiting dispatch
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Issues</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div>
                <div className="text-2xl font-bold font-mono text-red-600 dark:text-red-400">
                  {stats?.failed ?? 0}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Failed</p>
              </div>
              <div>
                <div className="text-2xl font-bold font-mono text-gray-500 dark:text-gray-400">
                  {stats?.skipped ?? 0}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Skipped</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              System Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b pb-4">
                <span className="text-sm font-medium text-muted-foreground">API Connection</span>
                <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-200 dark:border-green-900">Online</Badge>
              </div>
              <div className="flex items-center justify-between border-b pb-4">
                <span className="text-sm font-medium text-muted-foreground">Message Variations Engine</span>
                <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-200 dark:border-green-900">327 Loaded</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">WhatsApp Gateway</span>
                <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-200 dark:border-green-900">Ready</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
