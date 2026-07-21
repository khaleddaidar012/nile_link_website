import { AnalyticsProvider } from "./provider"
import { AnalyticsDataSet, AnalyticsFilter } from "./types"

/**
 * Google Analytics 4 Provider
 * 
 * Uses the Google Analytics Data API (v1) to fetch real analytics data.
 * 
 * Requirements:
 * - NEXT_PUBLIC_GA_MEASUREMENT_ID env variable
 * - GA4 service account credentials (GOOGLE_APPLICATION_CREDENTIALS or explicit key file)
 * - Google Analytics Data API enabled in GCP
 * 
 * Setup:
 * 1. Create a service account in Google Cloud Console
 * 2. Enable the Analytics Data API
 * 3. Add the service account email as a viewer in GA4 property settings
 * 4. Set NEXT_PUBLIC_ANALYTICS_PROVIDER=ga4
 * 5. Provide credentials via GOOGLE_APPLICATION_CREDENTIALS or a JSON key file path
 */

// TODO: Install @google-analytics/data when ready to connect
// import { BetaAnalyticsDataClient } from "@google-analytics/data"

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID
const GA_PROPERTY_ID = process.env.GA_PROPERTY_ID

export function createGA4Provider(): AnalyticsProvider {
  if (!GA_MEASUREMENT_ID) {
    console.warn(
      "[GA4 Provider] NEXT_PUBLIC_GA_MEASUREMENT_ID is not set. " +
      "Set it in .env.local to connect Google Analytics 4."
    )
  }

  if (!GA_PROPERTY_ID) {
    console.warn(
      "[GA4 Provider] GA_PROPERTY_ID is not set. " +
      "Set the numeric GA4 property ID in .env.local (e.g., GA_PROPERTY_ID=123456789)."
    )
  }

  return {
    name: "ga4",

    async fetchData(filter: AnalyticsFilter): Promise<AnalyticsDataSet> {
      // TODO: Replace with actual Google Analytics Data API calls
      // 
      // Example API usage:
      // const client = new BetaAnalyticsDataClient()
      // const [response] = await client.runReport({
      //   property: `properties/${GA_PROPERTY_ID}`,
      //   dateRanges: [{ startDate: "...", endDate: "..." }],
      //   metrics: [{ name: "activeUsers" }, { name: "newUsers" }, ...],
      //   dimensions: [{ name: "date" }, { name: "country" }, ...],
      // })
      //
      // Then map the response to AnalyticsDataSet

      throw new Error(
        "GA4 provider is not fully implemented yet. " +
        "To complete the integration:\n" +
        "1. Run: npm install @google-analytics/data\n" +
        "2. Create a service account and download the JSON key\n" +
        "3. Set GOOGLE_APPLICATION_CREDENTIALS or implement a custom auth flow\n" +
        "4. Set GA_PROPERTY_ID in .env.local\n" +
        "5. Implement the fetchData method in lib/analytics/ga4-provider.ts\n" +
        "6. Map the GA4 API response to the AnalyticsDataSet interface"
      )
    },
  }
}
