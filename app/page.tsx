import DashboardSelector from '@/components/DashboardSelector';
import { getOuraClient, getDateRange } from '@/lib/oura-client';
import { getLastNDaysData } from '@/data/sleepData';

async function getSleepData() {
  try {
    const client = getOuraClient();
    const { startDate, endDate } = getDateRange(30); // Fetch 30 days to support all timeframe options
    const data = await client.getSleepData(startDate, endDate);
    return { data, source: 'live' as const };
  } catch (error) {
    console.error('Failed to fetch live sleep data, using sample data:', error);
    const sampleData = getLastNDaysData(30); // Get 30 days of sample data too
    return { data: sampleData, source: 'sample' as const };
  }
}

export default async function Home() {
  const { data: sleepData, source: dataSource } = await getSleepData();
  
  return <DashboardSelector sleepData={sleepData} dataSource={dataSource} />;
}