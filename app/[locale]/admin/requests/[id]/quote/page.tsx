"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { AdminHeader } from "@/components/admin/AdminHeader"
import { ArrowLeft, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { toast } from "sonner"
import { Link } from "@/navigation"

export default function AdminGenerateQuotePage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const [request, setRequest] = useState<any>(null)
  const [suggestedPrices, setSuggestedPrices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form State
  const [currency, setCurrency] = useState("USD")
  const [validUntil, setValidUntil] = useState("")
  const [notes, setNotes] = useState("")
  
  // Quote Items state keyed by serviceId
  const [quoteItems, setQuoteItems] = useState<Record<string, any>>({})

  useEffect(() => {
    if (id) fetchRequestAndPrices()
  }, [id])

  const fetchRequestAndPrices = async () => {
    try {
      const res = await fetch(`/api/admin/requests/${id}`)
      const data = await res.json()
      
      const priceRes = await fetch(`/api/admin/requests/${id}/price`)
      const priceData = await priceRes.json()

      if (data.request) {
        setRequest(data.request)
        
        // Initialize quote items
        const initialItems: Record<string, any> = {}
        data.request.services.forEach((service: any) => {
          const match = priceData.data?.find((p: any) => p.serviceId === service._id)
          const base = match?.suggestedPrice || 0
          initialItems[service._id] = {
            requestServiceId: service._id,
            serviceKey: service.serviceKey,
            basePrice: base,
            additionalCharges: 0,
            discount: 0,
            finalPrice: base,
          }
        })
        setQuoteItems(initialItems)
      }
    } catch (err) {
      toast.error("Failed to load data")
    } finally {
      setLoading(false)
    }
  }

  const handleItemChange = (serviceId: string, field: string, value: number) => {
    setQuoteItems((prev) => {
      const item = { ...prev[serviceId], [field]: value }
      item.finalPrice = Number(item.basePrice) + Number(item.additionalCharges) - Number(item.discount)
      return { ...prev, [serviceId]: item }
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      const itemsArray = Object.values(quoteItems)
      const payload = {
        requestId: request._id,
        customerId: request.customerId._id,
        currency,
        validUntil,
        notes,
        items: itemsArray,
      }

      const res = await fetch("/api/admin/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const data = await res.json()
      if (data.success) {
        toast.success("Quote generated and sent to customer!")
        router.push(`/admin/requests/${id}`)
      } else {
        toast.error(data.error || "Failed to generate quote")
      }
    } catch (err) {
      toast.error("Network error")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) return <div className="p-8 text-center">Loading...</div>

  const totalAmount = Object.values(quoteItems).reduce((sum, item) => sum + item.finalPrice, 0)

  return (
    <div className="flex flex-col pb-12">
      <AdminHeader
        title={`Generate Quote for ${request?.trackingNumber}`}
        subtitle="Review suggested prices and finalize the quote."
      />

      <form onSubmit={handleSubmit} className="p-6 sm:p-8 max-w-5xl mx-auto w-full space-y-6">
        <Link href={`/admin/requests/${id}`}>
          <Button type="button" variant="outline" className="rounded-xl text-xs mb-4">
            <ArrowLeft className="mr-1.5 h-3.5 w-3.5" /> Back to Request
          </Button>
        </Link>

        {/* Global Settings */}
        <div className="bg-white dark:bg-secondary-900 rounded-xl border border-gray-200 dark:border-secondary-800 p-6 shadow-sm">
          <h2 className="text-lg font-bold mb-4">Quote Settings</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Currency</label>
              <select 
                value={currency} 
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full p-2.5 border rounded-lg dark:bg-secondary-800 dark:border-secondary-700"
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="EGP">EGP</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Valid Until *</label>
              <input 
                type="date" 
                required 
                value={validUntil} 
                onChange={(e) => setValidUntil(e.target.value)}
                className="w-full p-2.5 border rounded-lg dark:bg-secondary-800 dark:border-secondary-700"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium mb-1">Notes for Customer</label>
              <textarea 
                value={notes} 
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="w-full p-2.5 border rounded-lg dark:bg-secondary-800 dark:border-secondary-700"
                placeholder="Any special terms or conditions..."
              />
            </div>
          </div>
        </div>

        {/* Line Items */}
        <div className="bg-white dark:bg-secondary-900 rounded-xl border border-gray-200 dark:border-secondary-800 p-6 shadow-sm">
          <h2 className="text-lg font-bold mb-4">Service Line Items</h2>
          
          <div className="space-y-4">
            {request?.services.map((service: any) => {
              const item = quoteItems[service._id]
              if (!item) return null

              return (
                <div key={service._id} className="p-4 border rounded-lg bg-gray-50 dark:bg-secondary-800/50 dark:border-secondary-700">
                  <h3 className="font-bold capitalize text-primary-700 mb-3">{service.serviceKey.replace("_", " ")}</h3>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-xs font-medium mb-1 text-secondary-500">Base Price</label>
                      <input 
                        type="number" 
                        required 
                        value={item.basePrice} 
                        onChange={(e) => handleItemChange(service._id, "basePrice", Number(e.target.value))}
                        className="w-full p-2 border rounded-lg dark:bg-secondary-900 dark:border-secondary-700 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1 text-secondary-500">Additions (+)</label>
                      <input 
                        type="number" 
                        value={item.additionalCharges} 
                        onChange={(e) => handleItemChange(service._id, "additionalCharges", Number(e.target.value))}
                        className="w-full p-2 border rounded-lg dark:bg-secondary-900 dark:border-secondary-700 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1 text-secondary-500">Discount (-)</label>
                      <input 
                        type="number" 
                        value={item.discount} 
                        onChange={(e) => handleItemChange(service._id, "discount", Number(e.target.value))}
                        className="w-full p-2 border rounded-lg dark:bg-secondary-900 dark:border-secondary-700 text-sm"
                      />
                    </div>
                    <div className="flex flex-col justify-end">
                      <label className="block text-xs font-medium mb-1 text-secondary-500">Final Price</label>
                      <div className="p-2 font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg text-sm text-center">
                        {item.finalPrice} {currency}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="mt-8 pt-4 border-t border-gray-200 dark:border-secondary-700 flex justify-between items-center">
            <h3 className="text-xl font-bold">Total Quote Amount:</h3>
            <span className="text-2xl font-bold text-primary-600">{totalAmount} {currency}</span>
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting} className="bg-primary-600 text-white px-8 py-4 rounded-xl text-lg hover:bg-primary-700">
            {isSubmitting ? "Generating..." : "Generate & Send Quote"}
          </Button>
        </div>
      </form>
    </div>
  )
}
