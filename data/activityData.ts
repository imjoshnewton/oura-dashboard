export interface ActivityData {
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
  // Formatted fields
  total_calories_formatted?: string;
  steps_formatted?: string;
  equivalent_walking_distance_formatted?: string;
  // Contributors
  contributors?: {
    meet_daily_targets: number;
    move_every_hour: number;
    recovery_time: number;
    stay_active: number;
    training_frequency: number;
    training_volume: number;
  };
}

// Real Oura activity data from API (April 28 - May 29, 2025)
export const activityData: ActivityData[] = [
  {
    "day": "2025-04-28",
    "score": 92,
    "active_calories": 2482,
    "average_met_minutes": 2.5,
    "equivalent_walking_distance": 35038,
    "high_activity_met_minutes": 1372,
    "high_activity_time": 9420,
    "inactivity_alerts": 0,
    "low_activity_met_minutes": 274,
    "low_activity_time": 26460,
    "medium_activity_met_minutes": 98,
    "medium_activity_time": 1500,
    "meters_to_target": -30600,
    "non_wear_time": 0,
    "resting_time": 23160,
    "sedentary_met_minutes": 7,
    "sedentary_time": 25860,
    "steps": 13299,
    "target_calories": 650,
    "target_meters": 11000,
    "total_calories": 5040,
    "total_calories_formatted": "5040 kcal",
    "steps_formatted": "13299 steps",
    "equivalent_walking_distance_formatted": "35038 m",
    "contributors": {
      "meet_daily_targets": 78,
      "move_every_hour": 100,
      "recovery_time": 97,
      "stay_active": 92,
      "training_frequency": 96,
      "training_volume": 100
    }
  },
  {
    "day": "2025-04-29",
    "score": 84,
    "active_calories": 476,
    "average_met_minutes": 1.46875,
    "equivalent_walking_distance": 7328,
    "high_activity_met_minutes": 0,
    "high_activity_time": 0,
    "inactivity_alerts": 0,
    "low_activity_met_minutes": 209,
    "low_activity_time": 19500,
    "medium_activity_met_minutes": 117,
    "medium_activity_time": 1680,
    "meters_to_target": -2000,
    "non_wear_time": 5820,
    "resting_time": 25320,
    "sedentary_met_minutes": 10,
    "sedentary_time": 34080,
    "steps": 7724,
    "target_calories": 350,
    "target_meters": 6000,
    "total_calories": 2942,
    "total_calories_formatted": "2942 kcal",
    "steps_formatted": "7724 steps",
    "equivalent_walking_distance_formatted": "7328 m",
    "contributors": {
      "meet_daily_targets": 78,
      "move_every_hour": 100,
      "recovery_time": 87,
      "stay_active": 74,
      "training_frequency": 71,
      "training_volume": 100
    }
  },
  {
    "day": "2025-05-01",
    "score": 87,
    "active_calories": 450,
    "average_met_minutes": 1.46875,
    "equivalent_walking_distance": 6949,
    "high_activity_met_minutes": 0,
    "high_activity_time": 0,
    "inactivity_alerts": 0,
    "low_activity_met_minutes": 273,
    "low_activity_time": 24420,
    "medium_activity_met_minutes": 33,
    "medium_activity_time": 480,
    "meters_to_target": 900,
    "non_wear_time": 0,
    "resting_time": 24600,
    "sedentary_met_minutes": 12,
    "sedentary_time": 36900,
    "steps": 9006,
    "target_calories": 500,
    "target_meters": 9000,
    "total_calories": 2979,
    "total_calories_formatted": "2979 kcal",
    "steps_formatted": "9006 steps",
    "equivalent_walking_distance_formatted": "6949 m",
    "contributors": {
      "meet_daily_targets": 78,
      "move_every_hour": 100,
      "recovery_time": 100,
      "stay_active": 68,
      "training_frequency": 71,
      "training_volume": 100
    }
  },
  {
    "day": "2025-05-02",
    "score": 77,
    "active_calories": 223,
    "average_met_minutes": 1.375,
    "equivalent_walking_distance": 2972,
    "high_activity_met_minutes": 7,
    "high_activity_time": 60,
    "inactivity_alerts": 3,
    "low_activity_met_minutes": 120,
    "low_activity_time": 13680,
    "medium_activity_met_minutes": 21,
    "medium_activity_time": 420,
    "meters_to_target": 4700,
    "non_wear_time": 0,
    "resting_time": 17640,
    "sedentary_met_minutes": 10,
    "sedentary_time": 54600,
    "steps": 5081,
    "target_calories": 500,
    "target_meters": 9000,
    "total_calories": 2731,
    "total_calories_formatted": "2731 kcal",
    "steps_formatted": "5081 steps",
    "equivalent_walking_distance_formatted": "2972 m",
    "contributors": {
      "meet_daily_targets": 78,
      "move_every_hour": 60,
      "recovery_time": 100,
      "stay_active": 31,
      "training_frequency": 71,
      "training_volume": 98
    }
  },
  {
    "day": "2025-05-04",
    "score": 62,
    "active_calories": 129,
    "average_met_minutes": 1.21875,
    "equivalent_walking_distance": 1893,
    "high_activity_met_minutes": 0,
    "high_activity_time": 0,
    "inactivity_alerts": 3,
    "low_activity_met_minutes": 67,
    "low_activity_time": 7140,
    "medium_activity_met_minutes": 17,
    "medium_activity_time": 360,
    "meters_to_target": 6300,
    "non_wear_time": 0,
    "resting_time": 31380,
    "sedentary_met_minutes": 7,
    "sedentary_time": 47520,
    "steps": 4297,
    "target_calories": 500,
    "target_meters": 9000,
    "total_calories": 2486,
    "total_calories_formatted": "2486 kcal",
    "steps_formatted": "4297 steps",
    "equivalent_walking_distance_formatted": "1893 m",
    "contributors": {
      "meet_daily_targets": 43,
      "move_every_hour": 60,
      "recovery_time": 100,
      "stay_active": 46,
      "training_frequency": 40,
      "training_volume": 62
    }
  },
  {
    "day": "2025-05-05",
    "score": 56,
    "active_calories": 363,
    "average_met_minutes": 1.40625,
    "equivalent_walking_distance": 5265,
    "high_activity_met_minutes": 0,
    "high_activity_time": 0,
    "inactivity_alerts": 0,
    "low_activity_met_minutes": 193,
    "low_activity_time": 19140,
    "medium_activity_met_minutes": 52,
    "medium_activity_time": 900,
    "meters_to_target": 2400,
    "non_wear_time": 0,
    "resting_time": 26580,
    "sedentary_met_minutes": 11,
    "sedentary_time": 39780,
    "steps": 7215,
    "target_calories": 500,
    "target_meters": 9000,
    "total_calories": 2851,
    "total_calories_formatted": "2851 kcal",
    "steps_formatted": "7215 steps",
    "equivalent_walking_distance_formatted": "5265 m",
    "contributors": {
      "meet_daily_targets": 25,
      "move_every_hour": 100,
      "recovery_time": 100,
      "stay_active": 62,
      "training_frequency": 1,
      "training_volume": 35
    }
  },
  {
    "day": "2025-05-07",
    "score": 60,
    "active_calories": 347,
    "average_met_minutes": 1.4375,
    "equivalent_walking_distance": 5140,
    "high_activity_met_minutes": 0,
    "high_activity_time": 0,
    "inactivity_alerts": 3,
    "low_activity_met_minutes": 194,
    "low_activity_time": 17520,
    "medium_activity_met_minutes": 37,
    "medium_activity_time": 660,
    "meters_to_target": 2600,
    "non_wear_time": 0,
    "resting_time": 22500,
    "sedentary_met_minutes": 14,
    "sedentary_time": 45720,
    "steps": 5572,
    "target_calories": 500,
    "target_meters": 9000,
    "total_calories": 2871,
    "total_calories_formatted": "2871 kcal",
    "steps_formatted": "5572 steps",
    "equivalent_walking_distance_formatted": "5140 m",
    "contributors": {
      "meet_daily_targets": 25,
      "move_every_hour": 60,
      "recovery_time": 100,
      "stay_active": 49,
      "training_frequency": 40,
      "training_volume": 76
    }
  },
  {
    "day": "2025-05-08",
    "score": 65,
    "active_calories": 285,
    "average_met_minutes": 1.34375,
    "equivalent_walking_distance": 4088,
    "high_activity_met_minutes": 0,
    "high_activity_time": 0,
    "inactivity_alerts": 1,
    "low_activity_met_minutes": 175,
    "low_activity_time": 17940,
    "medium_activity_met_minutes": 15,
    "medium_activity_time": 240,
    "meters_to_target": 3700,
    "non_wear_time": 0,
    "resting_time": 31560,
    "sedentary_met_minutes": 11,
    "sedentary_time": 36660,
    "steps": 6395,
    "target_calories": 500,
    "target_meters": 9000,
    "total_calories": 2730,
    "total_calories_formatted": "2730 kcal",
    "steps_formatted": "6395 steps",
    "equivalent_walking_distance_formatted": "4088 m",
    "contributors": {
      "meet_daily_targets": 25,
      "move_every_hour": 95,
      "recovery_time": 100,
      "stay_active": 68,
      "training_frequency": 40,
      "training_volume": 68
    }
  },
  {
    "day": "2025-05-09",
    "score": 63,
    "active_calories": 398,
    "average_met_minutes": 1.5,
    "equivalent_walking_distance": 5314,
    "high_activity_met_minutes": 8,
    "high_activity_time": 60,
    "inactivity_alerts": 0,
    "low_activity_met_minutes": 215,
    "low_activity_time": 24660,
    "medium_activity_met_minutes": 42,
    "medium_activity_time": 780,
    "meters_to_target": 1800,
    "non_wear_time": 3060,
    "resting_time": 14100,
    "sedentary_met_minutes": 16,
    "sedentary_time": 43740,
    "steps": 8215,
    "target_calories": 500,
    "target_meters": 9000,
    "total_calories": 2978,
    "total_calories_formatted": "2978 kcal",
    "steps_formatted": "8215 steps",
    "equivalent_walking_distance_formatted": "5314 m",
    "contributors": {
      "meet_daily_targets": 25,
      "move_every_hour": 100,
      "recovery_time": 100,
      "stay_active": 57,
      "training_frequency": 40,
      "training_volume": 64
    }
  },
  {
    "day": "2025-05-10",
    "score": 72,
    "active_calories": 573,
    "average_met_minutes": 1.53125,
    "equivalent_walking_distance": 9229,
    "high_activity_met_minutes": 0,
    "high_activity_time": 0,
    "inactivity_alerts": 0,
    "low_activity_met_minutes": 358,
    "low_activity_time": 29640,
    "medium_activity_met_minutes": 33,
    "medium_activity_time": 600,
    "meters_to_target": -1100,
    "non_wear_time": 0,
    "resting_time": 30540,
    "sedentary_met_minutes": 13,
    "sedentary_time": 25620,
    "steps": 10737,
    "target_calories": 500,
    "target_meters": 9000,
    "total_calories": 3084,
    "total_calories_formatted": "3084 kcal",
    "steps_formatted": "10737 steps",
    "equivalent_walking_distance_formatted": "9229 m",
    "contributors": {
      "meet_daily_targets": 43,
      "move_every_hour": 100,
      "recovery_time": 100,
      "stay_active": 92,
      "training_frequency": 40,
      "training_volume": 55
    }
  },
  {
    "day": "2025-05-26",
    "score": 96,
    "active_calories": 1825,
    "average_met_minutes": 2.1875,
    "equivalent_walking_distance": 26355,
    "high_activity_met_minutes": 668,
    "high_activity_time": 4020,
    "inactivity_alerts": 0,
    "low_activity_met_minutes": 315,
    "low_activity_time": 29700,
    "medium_activity_met_minutes": 300,
    "medium_activity_time": 4200,
    "meters_to_target": -22200,
    "non_wear_time": 0,
    "resting_time": 26340,
    "sedentary_met_minutes": 12,
    "sedentary_time": 22140,
    "steps": 13254,
    "target_calories": 500,
    "target_meters": 9000,
    "total_calories": 4380,
    "total_calories_formatted": "4380 kcal",
    "steps_formatted": "13254 steps",
    "equivalent_walking_distance_formatted": "26355 m",
    "contributors": {
      "meet_daily_targets": 100,
      "move_every_hour": 100,
      "recovery_time": 87,
      "stay_active": 97,
      "training_frequency": 96,
      "training_volume": 100
    }
  },
  {
    "day": "2025-05-27",
    "score": 83,
    "active_calories": 245,
    "average_met_minutes": 1.34375,
    "equivalent_walking_distance": 3102,
    "high_activity_met_minutes": 7,
    "high_activity_time": 60,
    "inactivity_alerts": 1,
    "low_activity_met_minutes": 137,
    "low_activity_time": 15540,
    "medium_activity_met_minutes": 12,
    "medium_activity_time": 240,
    "meters_to_target": 1000,
    "non_wear_time": 0,
    "resting_time": 28380,
    "sedentary_met_minutes": 16,
    "sedentary_time": 42180,
    "steps": 2468,
    "target_calories": 300,
    "target_meters": 5000,
    "total_calories": 2708,
    "total_calories_formatted": "2708 kcal",
    "steps_formatted": "2468 steps",
    "equivalent_walking_distance_formatted": "3102 m",
    "contributors": {
      "meet_daily_targets": 95,
      "move_every_hour": 95,
      "recovery_time": 76,
      "stay_active": 57,
      "training_frequency": 71,
      "training_volume": 100
    }
  },
  {
    "day": "2025-05-28",
    "score": 81,
    "active_calories": 167,
    "average_met_minutes": 1.3125,
    "equivalent_walking_distance": 2275,
    "high_activity_met_minutes": 0,
    "high_activity_time": 0,
    "inactivity_alerts": 1,
    "low_activity_met_minutes": 103,
    "low_activity_time": 11040,
    "medium_activity_met_minutes": 6,
    "medium_activity_time": 120,
    "meters_to_target": 5600,
    "non_wear_time": 0,
    "resting_time": 22500,
    "sedentary_met_minutes": 9,
    "sedentary_time": 52740,
    "steps": 3159,
    "target_calories": 500,
    "target_meters": 9000,
    "total_calories": 2616,
    "total_calories_formatted": "2616 kcal",
    "steps_formatted": "3159 steps",
    "equivalent_walking_distance_formatted": "2275 m",
    "contributors": {
      "meet_daily_targets": 78,
      "move_every_hour": 95,
      "recovery_time": 100,
      "stay_active": 35,
      "training_frequency": 71,
      "training_volume": 99
    }
  }
];

// Helper function to get last N days of activity data
export function getLastNDaysActivityData(days: number): ActivityData[] {
  return activityData.slice(-days);
}