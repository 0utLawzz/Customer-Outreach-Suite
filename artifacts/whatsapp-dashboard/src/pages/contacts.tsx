import * as React from "react"
import { useQueryClient } from "@tanstack/react-query"
import {
  useListContacts,
  useCreateContact,
  useUpdateContact,
  useDeleteContact,
  useImportContacts,
  getListContactsQueryKey,
  getGetStatsQueryKey,
  Contact,
  ContactStatus,
  ListContactsStatus
} from "@workspace/api-client-react"
import { getWhatsAppUrl, getVariationMessage } from "@/lib/messages"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  Search,
  Plus,
  Upload,
  Send as SendIcon,
  CheckCircle2,
  XCircle,
  Clock,
  MoreVertical,
  Trash2,
  RefreshCw,
  Loader2,
  Phone
} from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z.string().min(1, "Phone is required"),
  notes: z.string().optional(),
})

export default function Contacts() {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  
  const [search, setSearch] = React.useState("")
  const [debouncedSearch, setDebouncedSearch] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState<string>("all")
  
  const [isAddOpen, setIsAddOpen] = React.useState(false)
  const [isImportOpen, setIsImportOpen] = React.useState(false)
  const [csvContent, setCsvContent] = React.useState("")
  const [parsedPreview, setParsedPreview] = React.useState<{name: string, phone: string}[]>([])

  // Search debounce
  React.useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300)
    return () => clearTimeout(timer)
  }, [search])

  const { data: contacts, isLoading } = useListContacts(
    { 
      search: debouncedSearch || undefined, 
      status: statusFilter !== "all" ? statusFilter as ListContactsStatus : undefined 
    },
    { query: { queryKey: getListContactsQueryKey({ search: debouncedSearch, status: statusFilter !== "all" ? statusFilter as ListContactsStatus : undefined }) } }
  )

  const createContact = useCreateContact()
  const updateContact = useUpdateContact()
  const deleteContact = useDeleteContact()
  const importContacts = useImportContacts()

  const addForm = useForm<z.infer<typeof contactSchema>>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", phone: "", notes: "" },
  })

  const onAddSubmit = (values: z.infer<typeof contactSchema>) => {
    createContact.mutate(
      { data: values },
      {
        onSuccess: () => {
          toast({ title: "Contact Added", description: "Successfully added to the dispatch queue." })
          setIsAddOpen(false)
          addForm.reset()
          queryClient.invalidateQueries({ queryKey: getListContactsQueryKey() })
          queryClient.invalidateQueries({ queryKey: getGetStatsQueryKey() })
        },
        onError: () => {
          toast({ title: "Error", description: "Failed to add contact.", variant: "destructive" })
        }
      }
    )
  }

  const handleStatusChange = (id: number, status: ContactStatus) => {
    updateContact.mutate(
      { id, data: { status } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListContactsQueryKey() })
          queryClient.invalidateQueries({ queryKey: getGetStatsQueryKey() })
        }
      }
    )
  }

  const handleDelete = (id: number) => {
    if (confirm("Remove this contact from the campaign?")) {
      deleteContact.mutate(
        { id },
        {
          onSuccess: () => {
            toast({ title: "Contact Removed" })
            queryClient.invalidateQueries({ queryKey: getListContactsQueryKey() })
            queryClient.invalidateQueries({ queryKey: getGetStatsQueryKey() })
          }
        }
      )
    }
  }

  const handleSendWhatsApp = (contact: Contact) => {
    const msg = getVariationMessage(contact.variationIndex)
    const url = getWhatsAppUrl(contact.phone, msg)
    window.open(url, '_blank')
    
    // Auto-mark as sent
    if (contact.status !== 'sent') {
      handleStatusChange(contact.id, 'sent')
    }
  }

  const handleCsvParse = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const content = e.target.value
    setCsvContent(content)
    
    if (!content.trim()) {
      setParsedPreview([])
      return
    }

    const lines = content.split('\n').filter(l => l.trim())
    const parsed = lines.map(line => {
      const parts = line.split(',')
      return {
        name: parts[0]?.trim() || 'Unknown',
        phone: parts[1]?.trim() || ''
      }
    }).filter(item => item.phone)
    
    setParsedPreview(parsed)
  }

  const handleImportSubmit = () => {
    if (parsedPreview.length === 0) return

    importContacts.mutate(
      { data: { contacts: parsedPreview } },
      {
        onSuccess: (res) => {
          toast({ 
            title: "Import Complete", 
            description: `Imported ${res.imported} contacts. ${res.skipped > 0 ? `Skipped ${res.skipped} duplicates.` : ''}` 
          })
          setIsImportOpen(false)
          setCsvContent("")
          setParsedPreview([])
          queryClient.invalidateQueries({ queryKey: getListContactsQueryKey() })
          queryClient.invalidateQueries({ queryKey: getGetStatsQueryKey() })
        },
        onError: () => {
          toast({ title: "Import Failed", description: "Could not process the contacts list.", variant: "destructive" })
        }
      }
    )
  }

  return (
    <div className="flex-1 flex flex-col h-[100dvh] overflow-hidden bg-background">
      <div className="p-6 border-b flex-shrink-0 bg-card">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Contacts & Dispatch</h1>
            <p className="text-sm text-muted-foreground">Manage your outreach targets and send messages.</p>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Dialog open={isImportOpen} onOpenChange={setIsImportOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="flex-1 sm:flex-none gap-2">
                  <Upload className="w-4 h-4" /> Import CSV
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Import Contacts</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <FormLabel>CSV Data (Name, Phone)</FormLabel>
                    <Textarea 
                      placeholder="John Doe, 03001234567&#10;Jane Smith, 03339876543" 
                      className="font-mono text-sm h-[200px]"
                      value={csvContent}
                      onChange={handleCsvParse}
                    />
                    <p className="text-xs text-muted-foreground">
                      Paste rows formatted as <code className="bg-muted px-1 rounded">Name, Phone</code>. Each contact on a new line.
                    </p>
                  </div>
                  
                  {parsedPreview.length > 0 && (
                    <div className="bg-muted/30 rounded-md border p-4 max-h-[200px] overflow-auto">
                      <p className="text-sm font-medium mb-2 border-b pb-2 sticky top-0 bg-background/95 backdrop-blur">
                        Preview: {parsedPreview.length} contacts found
                      </p>
                      <div className="space-y-1">
                        {parsedPreview.slice(0, 5).map((p, i) => (
                          <div key={i} className="text-sm flex gap-4">
                            <span className="font-medium min-w-[150px] truncate">{p.name}</span>
                            <span className="font-mono text-muted-foreground">{p.phone}</span>
                          </div>
                        ))}
                        {parsedPreview.length > 5 && (
                          <div className="text-xs text-muted-foreground italic pt-2">
                            + {parsedPreview.length - 5} more...
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsImportOpen(false)}>Cancel</Button>
                  <Button 
                    onClick={handleImportSubmit} 
                    disabled={parsedPreview.length === 0 || importContacts.isPending}
                  >
                    {importContacts.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Upload className="w-4 h-4 mr-2" />}
                    Import {parsedPreview.length} Contacts
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
              <DialogTrigger asChild>
                <Button className="flex-1 sm:flex-none gap-2">
                  <Plus className="w-4 h-4" /> Add Manual
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Contact</DialogTitle>
                </DialogHeader>
                <Form {...addForm}>
                  <form onSubmit={addForm.handleSubmit(onAddSubmit)} className="space-y-4 py-4">
                    <FormField
                      control={addForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Client Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Muhammad Ali" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={addForm.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>WhatsApp Number</FormLabel>
                          <FormControl>
                            <Input placeholder="03XXXXXXXXX" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={addForm.control}
                      name="notes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Internal Notes (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="High net worth..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <DialogFooter className="pt-4">
                      <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
                      <Button type="submit" disabled={createContact.isPending}>
                        {createContact.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                        Save Contact
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search by name or phone..." 
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="w-full sm:w-[200px]">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="sent">Sent</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="skipped">Skipped</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="border rounded-md bg-card shadow-sm">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="w-[250px]">Contact</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden md:table-cell">Variation</TableHead>
                <TableHead className="hidden lg:table-cell">Added</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center">
                    <Loader2 className="w-6 h-6 animate-spin text-muted-foreground mx-auto" />
                  </TableCell>
                </TableRow>
              ) : contacts?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                    No contacts found matching the criteria.
                  </TableCell>
                </TableRow>
              ) : (
                contacts?.map((contact) => (
                  <TableRow key={contact.id} className="group">
                    <TableCell>
                      <div className="font-medium text-foreground">{contact.name}</div>
                      <div className="text-sm font-mono text-muted-foreground flex items-center gap-1 mt-1">
                        <Phone className="w-3 h-3" />
                        {contact.phone}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={contact.status as any} className="capitalize tracking-wider text-[10px]">
                        {contact.status === 'pending' && <Clock className="w-3 h-3 mr-1 inline" />}
                        {contact.status === 'sent' && <CheckCircle2 className="w-3 h-3 mr-1 inline" />}
                        {contact.status === 'failed' && <XCircle className="w-3 h-3 mr-1 inline" />}
                        {contact.status === 'skipped' && <RefreshCw className="w-3 h-3 mr-1 inline" />}
                        {contact.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="font-mono text-xs text-muted-foreground bg-muted inline-block px-2 py-1 rounded">
                        #{contact.variationIndex.toString().padStart(3, '0')}
                      </div>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                      {new Date(contact.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button 
                        size="sm" 
                        variant="default"
                        className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                        onClick={() => handleSendWhatsApp(contact)}
                      >
                        <SendIcon className="w-3.5 h-3.5 mr-2" />
                        Send
                      </Button>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleStatusChange(contact.id, 'sent')}>
                            <CheckCircle2 className="w-4 h-4 mr-2 text-green-500" /> Mark as Sent
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleStatusChange(contact.id, 'failed')}>
                            <XCircle className="w-4 h-4 mr-2 text-red-500" /> Mark as Failed
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleStatusChange(contact.id, 'skipped')}>
                            <RefreshCw className="w-4 h-4 mr-2 text-gray-500" /> Mark as Skipped
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleStatusChange(contact.id, 'pending')}>
                            <Clock className="w-4 h-4 mr-2 text-yellow-500" /> Reset to Pending
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDelete(contact.id)}
                            className="text-destructive focus:text-destructive focus:bg-destructive/10"
                          >
                            <Trash2 className="w-4 h-4 mr-2" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
