import { getOuraClient, getDateRange } from '@/lib/oura-client';
import OuraActivityDashboardVercel from '@/components/OuraActivityDashboardVercel';

async function getActivityData() {
  try {
    const client = getOuraClient();
    const { startDate, endDate } = getDateRange(30); // Get 30 days of activity data
    console.log('Fetching activity data from', startDate, 'to', endDate);
    const data = await client.getActivityData(startDate, endDate);
    console.log('Received', data.length, 'days of activity data');
    if (data.length > 0) {
      console.log('Latest data is for:', data[data.length - 1].day);
    }
    return { data, source: 'live' as const };
  } catch (error) {
    console.error('Failed to fetch live activity data, using sample data:', error);
    // Sample activity data for fallback
    const sampleData = [
      {
        day: '2025-06-01',
        score: 88,
        active_calories: 718,
        steps: 10760,
        equivalent_walking_distance: 11643,
        total_calories: 3166,
        high_activity_time: 0,
        medium_activity_time: 220,
        low_activity_time: 279,
        sedentary_time: 360,
        resting_time: 610,
        inactivity_alerts: 0,
        contributors: {
          meet_daily_targets: 60,
          move_every_hour: 100,
          recovery_time: 100,
          stay_active: 97,
          training_frequency: 96,
          training_volume: 92
        },
        target_calories: 650,
        target_meters: 11000,
        meters_to_target: -1000,
        timestamp: '2025-06-01T04:00:00-04:00'
      },
      {
        day: '2025-06-02',
        score: 78,
        active_calories: 557,
        steps: 8191,
        equivalent_walking_distance: 8708,
        total_calories: 3029,
        high_activity_time: 0,
        medium_activity_time: 141,
        low_activity_time: 241,
        sedentary_time: 472,
        resting_time: 554,
        inactivity_alerts: 1,
        contributors: {
          meet_daily_targets: 43,
          move_every_hour: 95,
          recovery_time: 100,
          stay_active: 86,
          training_frequency: 71,
          training_volume: 86
        },
        target_calories: 650,
        target_meters: 11000,
        meters_to_target: 1600,
        timestamp: '2025-06-02T04:00:00-04:00'
      }
    ];
    return { data: sampleData, source: 'sample' as const };
  }
}

export default async function ActivityPage() {
  const { data: activityData, source: dataSource } = await getActivityData();

  const getDataSourceInfo = () => {
    if (dataSource === 'live') {
      return {
        label: '🟢 Live Data',
        description: 'Current data from Oura API',
        className: 'bg-green-100 text-green-800 border-green-200'
      };
    } else {
      return {
        label: '🟡 Sample Data',
        description: 'Sample activity data from June 1-2, 2025',
        className: 'bg-yellow-100 text-yellow-800 border-yellow-200'
      };
    }
  };

  const dataInfo = getDataSourceInfo();

  return (
    <>
      <div className={`w-full px-4 py-2 text-center text-sm font-medium ${dataInfo.className} border-b`}>
        <span>{dataInfo.label}</span>
        <span className="text-xs opacity-75 ml-2">({dataInfo.description})</span>
      </div>
      
      <OuraActivityDashboardVercel activityData={activityData} />
    </>
  );
}