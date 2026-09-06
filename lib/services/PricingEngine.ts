import { PricingRule } from "../models/PricingRule"
import { IRequestService } from "../models/RequestService"

export interface SuggestedPrice {
  serviceId: string
  serviceKey: string
  suggestedPrice: number | null
  currency: string
  pricingType: string
  notes?: string
}

export class PricingEngine {
  static async calculateSuggestedPrice(requestService: IRequestService): Promise<SuggestedPrice> {
    const defaultResponse: SuggestedPrice = {
      serviceId: requestService._id.toString(),
      serviceKey: requestService.serviceKey,
      suggestedPrice: null,
      currency: "EGP",
      pricingType: "manual",
    }

    try {
      // Find active rules for this service key
      const rules = await PricingRule.find({
        serviceKey: requestService.serviceKey,
        isActive: true,
      })

      if (!rules || rules.length === 0) {
        return defaultResponse
      }

      // Try to find a route-based rule first if the service has origin/destination
      if (requestService.details?.origin && requestService.details?.destination) {
        const routeRule = rules.find((r) => {
          return (
            r.pricingType === "route_based" &&
            r.routeInfo?.origin?.toLowerCase() === requestService.details.origin.toLowerCase() &&
            r.routeInfo?.destination?.toLowerCase() === requestService.details.destination.toLowerCase()
          )
        })

        if (routeRule) {
          return {
            serviceId: requestService._id.toString(),
            serviceKey: requestService.serviceKey,
            suggestedPrice: routeRule.defaultPrice,
            currency: routeRule.currency,
            pricingType: "route_based",
            notes: routeRule.notes,
          }
        }
      }

      // Fallback to fixed rule if it exists
      const fixedRule = rules.find((r) => r.pricingType === "fixed")
      if (fixedRule) {
        return {
          serviceId: requestService._id.toString(),
          serviceKey: requestService.serviceKey,
          suggestedPrice: fixedRule.defaultPrice,
          currency: fixedRule.currency,
          pricingType: "fixed",
          notes: fixedRule.notes,
        }
      }

      return defaultResponse
    } catch (error) {
      console.error("PricingEngine Error:", error)
      return defaultResponse
    }
  }

  static async calculateAll(services: IRequestService[]): Promise<SuggestedPrice[]> {
    const results = []
    for (const service of services) {
      const price = await this.calculateSuggestedPrice(service)
      results.push(price)
    }
    return results
  }
}
