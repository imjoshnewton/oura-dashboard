const OURA_API_BASE = 'https://api.ouraring.com/v2';

export interface OuraSleepResponse {
  data: Array<{
    day: string;
    bedtime_start: string;
    bedtime_end: string;
    total_sleep_duration: number;
    efficiency: number;
    deep_sleep_duration: number;
    light_sleep_duration: number;
    rem_sleep_duration: number;
    awake_time: number;
    time_in_bed: number;
    latency: number;
    restless_periods: number;
    average_breath: number;
    average_heart_rate: number;
    average_hrv: number;
    lowest_heart_rate: number;
  }>;
}

export interface OuraReadinessResponse {
  data: Array<{
    day: string;
    score: number;
  }>;
}

export interface OuraActivityResponse {
  data: Array<{
    day: string;
    score: number;
    active_calories: number;
    average_met_minutes: number;
    equivalent_walking_distance: number;
    high_activity_met_minutes: number;
    high_activity_time: number;
    inactivity_alerts: number;
    low_activity_met_minutes: number;
    low_activity_time: number;
    medium_activity_met_minutes: number;
    medium_activity_time: number;
    meters_to_target: number;
    non_wear_time: number;
    resting_time: number;
    sedentary_met_minutes: number;
    sedentary_time: number;
    steps: number;
    target_calories: number;
    target_meters: number;
    total_calories: number;
    contributors?: {
      meet_daily_targets: number;
      move_every_hour: number;
      recovery_time: number;
      stay_active: number;
      training_frequency: number;
      training_volume: number;
    };
  }>;
}

function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  
  if (hours > 0) {
    if (remainingSeconds > 0) {
      return `${hours} hour${hours !== 1 ? 's' : ''}, ${minutes} minute${minutes !== 1 ? 's' : ''}, ${remainingSeconds} second${remainingSeconds !== 1 ? 's' : ''}`;
    } else {
      return `${hours} hour${hours !== 1 ? 's' : ''}, ${minutes} minute${minutes !== 1 ? 's' : ''}`;
    }
  } else {
    if (remainingSeconds > 0) {
      return `${minutes} minute${minutes !== 1 ? 's' : ''}, ${remainingSeconds} second${remainingSeconds !== 1 ? 's' : ''}`;
    } else {
      return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
    }
  }
}

function formatTime(timeString: string): string {
  const date = new Date(timeString);
  return date.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  });
}

export class OuraClient {
  private token: string;

  constructor(token: string) {
    this.token = token;
  }

  private async fetchOura<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
    const url = new URL(`${OURA_API_BASE}${endpoint}`);
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });

    const response = await fetch(url.toString(), {
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Oura API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async getSleepData(startDate: string, endDate: string) {
    const [sleepResponse, readinessResponse] = await Promise.all([
      this.fetchOura<OuraSleepResponse>('/usercollection/sleep', {
        start_date: startDate,
        end_date: endDate,
      }),
      this.fetchOura<OuraReadinessResponse>('/usercollection/daily_readiness', {
        start_date: startDate,
        end_date: endDate,
      })
    ]);

    // Create a map of readiness scores by date
    const readinessMap = new Map(
      readinessResponse.data.map(item => [item.day, item.score])
    );

    return sleepResponse.data.map(sleep => ({
      day: sleep.day,
      bedtime_start: formatTime(sleep.bedtime_start),
      bedtime_end: formatTime(sleep.bedtime_end),
      total_sleep_duration: formatDuration(sleep.total_sleep_duration),
      efficiency: sleep.efficiency,
      readiness_score: readinessMap.get(sleep.day) || 0,
      deep_sleep_duration: formatDuration(sleep.deep_sleep_duration),
      light_sleep_duration: formatDuration(sleep.light_sleep_duration),
      rem_sleep_duration: formatDuration(sleep.rem_sleep_duration),
      average_heart_rate: sleep.average_heart_rate,
      average_hrv: sleep.average_hrv,
      awake_time: formatDuration(sleep.awake_time),
      time_in_bed: formatDuration(sleep.time_in_bed),
      latency: sleep.latency,
      restless_periods: sleep.restless_periods,
      average_breath: sleep.average_breath,
      lowest_heart_rate: sleep.lowest_heart_rate,
    }));
  }

  async getActivityData(startDate: string, endDate: string) {
    const response = await this.fetchOura<OuraActivityResponse>('/usercollection/daily_activity', {
      start_date: startDate,
      end_date: endDate,
    });

    return response.data.map(activity => ({
      day: activity.day,
      score: activity.score,
      active_calories: activity.active_calories,
      average_met_minutes: activity.average_met_minutes,
      equivalent_walking_distance: activity.equivalent_walking_distance,
      high_activity_met_minutes: activity.high_activity_met_minutes,
      high_activity_time: activity.high_activity_time,
      inactivity_alerts: activity.inactivity_alerts,
      low_activity_met_minutes: activity.low_activity_met_minutes,
      low_activity_time: activity.low_activity_time,
      medium_activity_met_minutes: activity.medium_activity_met_minutes,
      medium_activity_time: activity.medium_activity_time,
      meters_to_target: activity.meters_to_target,
      non_wear_time: activity.non_wear_time,
      resting_time: activity.resting_time,
      sedentary_met_minutes: activity.sedentary_met_minutes,
      sedentary_time: activity.sedentary_time,
      steps: activity.steps,
      target_calories: activity.target_calories,
      target_meters: activity.target_meters,
      total_calories: activity.total_calories,
      total_calories_formatted: `${activity.total_calories} kcal`,
      steps_formatted: `${activity.steps} steps`,
      equivalent_walking_distance_formatted: `${activity.equivalent_walking_distance} m`,
      contributors: activity.contributors,
    }));
  }
}

export function getOuraClient(): OuraClient {
  const token = process.env.OURA_API_TOKEN;
  if (!token) {
    throw new Error('OURA_API_TOKEN environment variable is required');
  }
  return new OuraClient(token);
}

export function getDateRange(days: number = 30): { startDate: string; endDate: string } {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - days);
  
  return {
    startDate: startDate.toISOString().split('T')[0],
    endDate: endDate.toISOString().split('T')[0],
  };
}