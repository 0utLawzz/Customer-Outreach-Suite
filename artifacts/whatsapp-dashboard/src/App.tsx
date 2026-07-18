import * as React from "react"
import { Route, Switch, Router as WouterRouter } from "wouter"
import { AppLayout } from "@/components/layout"
import Dashboard from "@/pages/dashboard"
import Messages from "@/pages/messages"
import Contacts from "@/pages/contacts"
import NotFound from "@/pages/not-found"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from '@/components/ui/toaster'
import { TooltipProvider } from '@/components/ui/tooltip'

const queryClient = new QueryClient()

function Router() {
  return (
    <AppLayout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/contacts" component={Contacts} />
        <Route path="/messages" component={Messages} />
        <Route component={NotFound} />
      </Switch>
    </AppLayout>
  )
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  )
}

export default App
