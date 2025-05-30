import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  BarChart,
  Bar,
} from "recharts";

const sleepData = [
  {
    day: "2025-05-21",
    bedtime_start: "01:21 AM",
    bedtime_end: "06:55 AM",
    total_sleep_duration: "4 hours, 43 minutes, 30 seconds",
    efficiency: 85,
    readiness_score: 63,
    deep_sleep_duration: "57 minutes",
    light_sleep_duration: "2 hours, 56 minutes, 30 seconds",
    rem_sleep_duration: "50 minutes",
    average_heart_rate: 65.625,
    average_hrv: 26,
  },
  {
    day: "2025-05-22",
    bedtime_start: "12:57 AM",
    bedtime_end: "06:44 AM",
    total_sleep_duration: "5 hours, 14 minutes, 30 seconds",
    efficiency: 91,
    readiness_score: 71,
    deep_sleep_duration: "24 minutes, 30 seconds",
    light_sleep_duration: "4 hours, 1 minute",
    rem_sleep_duration: "49 minutes",
    average_heart_rate: 64.625,
    average_hrv: 27,
  },
  {
    day: "2025-05-23",
    bedtime_start: "09:39 PM",
    bedtime_end: "06:13 AM",
    total_sleep_duration: "7 hours, 25 minutes, 30 seconds",
    efficiency: 87,
    readiness_score: 77,
    deep_sleep_duration: "1 hour, 4 minutes",
    light_sleep_duration: "5 hours, 11 minutes, 30 seconds",
    rem_sleep_duration: "1 hour, 10 minutes",
    average_heart_rate: 67.75,
    average_hrv: 26,
  },
  {
    day: "2025-05-24",
    bedtime_start: "09:35 PM",
    bedtime_end: "06:39 AM",
    total_sleep_duration: "7 hours, 47 minutes",
    efficiency: 86,
    readiness_score: 70,
    deep_sleep_duration: "49 minutes",
    light_sleep_duration: "5 hours, 27 minutes, 30 seconds",
    rem_sleep_duration: "1 hour, 30 minutes, 30 seconds",
    average_heart_rate: 64.75,
    average_hrv: 30,
  },
  {
    day: "2025-05-25",
    bedtime_start: "10:47 PM",
    bedtime_end: "07:00 AM",
    total_sleep_duration: "5 hours, 50 minutes",
    efficiency: 71,
    readiness_score: 70,
    deep_sleep_duration: "47 minutes",
    light_sleep_duration: "4 hours, 6 minutes",
    rem_sleep_duration: "57 minutes",
    average_heart_rate: 67.375,
    average_hrv: 29,
  },
  {
    day: "2025-05-26",
    bedtime_start: "11:57 PM",
    bedtime_end: "07:34 AM",
    total_sleep_duration: "6 hours, 41 minutes, 30 seconds",
    efficiency: 88,
    readiness_score: 75,
    deep_sleep_duration: "1 hour, 34 minutes, 30 seconds",
    light_sleep_duration: "3 hours, 24 minutes",
    rem_sleep_duration: "1 hour, 43 minutes",
    average_heart_rate: 62.875,
    average_hrv: 25,
  },
  {
    day: "2025-05-27",
    bedtime_start: "01:01 AM",
    bedtime_end: "06:44 AM",
    total_sleep_duration: "4 hours, 50 minutes",
    efficiency: 84,
    readiness_score: 56,
    deep_sleep_duration: "49 minutes, 30 seconds",
    light_sleep_duration: "3 hours, 36 minutes, 30 seconds",
    rem_sleep_duration: "24 minutes",
    average_heart_rate: 69.125,
    average_hrv: 27,
  },
];

// Helper function to parse a duration string into seconds.
function parseDuration(durationStr: string) {
  if (!durationStr) return 0;
  const parts = durationStr.split(",");
  let seconds = 0;
  parts.forEach((part) => {
    const trimmed = part.trim();
    const value = parseInt(trimmed);
    if (trimmed.includes("hour")) {
      seconds += value * 3600;
    } else if (trimmed.includes("minute")) {
      seconds += value * 60;
    } else if (trimmed.includes("second")) {
      seconds += value;
    }
  });
  return seconds;
}

// Helper to format seconds into "Xh Ym" format
function formatDuration(seconds: number) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.round((seconds % 3600) / 60);
  return `${hours}h ${minutes}m`;
}

// Process the raw data to include numeric values.
const processedData = sleepData.map((item) => ({
  day: item.day,
  totalSleep: parseDuration(item.total_sleep_duration),
  efficiency: item.efficiency,
  readiness: item.readiness_score,
  deepSleep: parseDuration(item.deep_sleep_duration),
  lightSleep: parseDuration(item.light_sleep_duration),
  remSleep: parseDuration(item.rem_sleep_duration),
  averageHR: item.average_heart_rate,
  averageHRV: item.average_hrv,
  bedtimeStart: item.bedtime_start,
  bedtimeEnd: item.bedtime_end,
}));

export default function SleepDashboard() {
  const totalDays = processedData.length;

  const sumTotalSleep = processedData.reduce((sum, rec) => sum + rec.totalSleep, 0);
  const avgTotalSleep = sumTotalSleep / totalDays;

  const avgEfficiency =
    processedData.reduce((sum, rec) => sum + rec.efficiency, 0) / totalDays;

  const avgReadiness =
    processedData.reduce((sum, rec) => sum + rec.readiness, 0) / totalDays;

  const avgHR =
    processedData.reduce((sum, rec) => sum + rec.averageHR, 0) / totalDays;

  const avgHRV =
    processedData.reduce((sum, rec) => sum + rec.averageHRV, 0) / totalDays;

  return (
    <div className="container mx-auto p-4 space-y-8">
      <header className="text-center">
        <h1 className="text-3xl font-bold">Oura Sleep Dashboard</h1>
        <p className="text-gray-600 mt-2">
          A 7-day overview of your sleep trends and insights.
        </p>
      </header>

      {/* Summary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Sleep</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">
              {formatDuration(avgTotalSleep)}
            </div>
            <div className="text-sm text-gray-500 mt-1">
              Average per night
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Efficiency</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">
              {avgEfficiency.toFixed(1)}%
            </div>
            <div className="text-sm text-gray-500 mt-1">
              Sleep Efficiency
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Readiness</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">
              {avgReadiness.toFixed(1)}
            </div>
            <div className="text-sm text-gray-500 mt-1">
              Readiness Score
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Average HR</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">
              {avgHR.toFixed(1)} bpm
            </div>
            <div className="text-sm text-gray-500 mt-1">
              Heart Rate
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Average HRV</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">
              {avgHRV.toFixed(1)}
            </div>
            <div className="text-sm text-gray-500 mt-1">
              HRV
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="space-y-8">
        {/* Line Chart: Total Sleep Duration Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Total Sleep Duration Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={processedData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis
                  tickFormatter={(sec) => `${(sec / 3600).toFixed(1)}h`}
                  label={{ value: "Hours", angle: -90, position: "insideLeft" }}
                />
                <Tooltip
                  formatter={(value) => `${((value as number) / 3600).toFixed(2)}h`}
                  labelFormatter={(label) => `Date: ${label}`}
                />
                <Line
                  type="monotone"
                  dataKey="totalSleep"
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                  name="Total Sleep (sec)"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Stacked Bar Chart: Sleep Stage Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Sleep Stage Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={processedData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis
                  tickFormatter={(sec) => `${Math.round(sec / 60)}m`}
                  label={{ value: "Minutes", angle: -90, position: "insideLeft" }}
                />
                <Tooltip
                  formatter={(value, name) =>
                    name === "Deep Sleep" || name === "Light Sleep" || name === "REM Sleep"
                      ? [`${Math.round((value as number) / 60)}m`, name]
                      : [value, name]
                  }
                />
                <Legend />
                <Bar dataKey="deepSleep" stackId="a" fill="#82ca9d" name="Deep Sleep" />
                <Bar dataKey="lightSleep" stackId="a" fill="#8884d8" name="Light Sleep" />
                <Bar dataKey="remSleep" stackId="a" fill="#ffc658" name="REM Sleep" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}