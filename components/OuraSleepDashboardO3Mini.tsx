"use client";

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
import { sleepData } from "@/data/sleepData";

const raw = sleepData.slice(-7).map(item => ({
  day: item.day,
  bedtime_start: item.bedtime_start,
  bedtime_end: item.bedtime_end,
  total_sleep_duration: item.total_sleep_duration,
  efficiency: item.efficiency,
  readiness_score: item.readiness_score,
  deep_sleep_duration: item.deep_sleep_duration,
  light_sleep_duration: item.light_sleep_duration,
  rem_sleep_duration: item.rem_sleep_duration,
  average_heart_rate: item.average_heart_rate,
  average_hrv: item.average_hrv || 0,
  awake_time: item.awake_time || "0 minutes",
  time_in_bed: item.time_in_bed || item.total_sleep_duration,
  latency: item.latency || 0,
  restless_periods: item.restless_periods || 0,
  average_breath: item.average_breath || 12,
  lowest_heart_rate: item.lowest_heart_rate || item.average_heart_rate
}));

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
const processedData = raw.map((item) => ({
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