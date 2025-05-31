import OuraSleepDashboard from '@/components/OuraSleepDashboard'
import { getOuraClient, getDateRange } from '@/lib/oura-client'

export default async function Home() {
  const client = getOuraClient()
  const { startDate, endDate } = getDateRange(30)
  const sleepData = await client.getSleepData(startDate, endDate)
  
  return <OuraSleepDashboard sleepData={sleepData} />
}