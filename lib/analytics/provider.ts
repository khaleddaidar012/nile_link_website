import { AnalyticsDataSet, AnalyticsFilter } from "./types"

export interface AnalyticsProvider {
  fetchData(filter: AnalyticsFilter): Promise<AnalyticsDataSet>
  name: string
}
