import * as React from "react"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Hash } from "lucide-react"
import { ALL_VARIATIONS } from "@/lib/messages"

export default function Messages() {
  const [search, setSearch] = React.useState("")

  const filteredVariations = React.useMemo(() => {
    if (!search.trim()) return ALL_VARIATIONS.map((msg, index) => ({ msg, index }))
    
    const query = search.toLowerCase()
    return ALL_VARIATIONS
      .map((msg, index) => ({ msg, index }))
      .filter(item => item.msg.toLowerCase().includes(query))
  }, [search])

  return (
    <div className="flex-1 flex flex-col h-[100dvh] overflow-hidden bg-background">
      <div className="p-6 border-b flex-shrink-0 bg-card">
        <h1 className="text-2xl font-bold tracking-tight text-foreground mb-1">Message Variations</h1>
        <p className="text-sm text-muted-foreground mb-6">
          Review the {ALL_VARIATIONS.length} unique personalized message structures generated for this campaign.
        </p>
        
        <div className="relative max-w-xl">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search within messages..." 
            className="pl-9 font-mono text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        {filteredVariations.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground font-mono">NO_MATCHES_FOUND</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredVariations.map(({ msg, index }) => (
              <Card key={index} className="flex flex-col overflow-hidden transition-all hover:border-primary/50">
                <div className="px-4 py-2 border-b bg-muted/50 flex justify-between items-center">
                  <Badge variant="outline" className="font-mono text-xs text-muted-foreground flex items-center gap-1 border-muted-foreground/20">
                    <Hash className="w-3 h-3" />
                    {index.toString().padStart(3, '0')}
                  </Badge>
                  <span className="text-[10px] text-muted-foreground uppercase tracking-widest">Template</span>
                </div>
                <CardContent className="p-4 flex-1">
                  <p className="text-sm whitespace-pre-wrap font-sans text-foreground/90 leading-relaxed">
                    {msg}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
