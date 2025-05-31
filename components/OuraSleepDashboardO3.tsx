"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SleepData } from "@/data/sleepData";
import { format, parseISO } from "date-fns";
import React from "react";

interface OuraSleepDashboardO3Props {
  sleepData: SleepData[];
}
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

/* -------------------------------------------------------------------------- */
/*                                   helpers                                  */
/* -------------------------------------------------------------------------- */

const parseDurationToHours = (str: string): number => {
  /**
   * Accepts variants such as:
   *   "4 hours, 13 minutes, 30 seconds"
   *   "1 hour, 4 minutes"
   *   "49 minutes, 30 seconds"
   *   "57 minutes"
   */
  const regex =
    /(?:(\d+)\s*hours?)?\s*,?\s*(?:(\d+)\s*minutes?)?\s*,?\s*(?:(\d+)\s*seconds?)?/i;
  const [_full, h, m, s] = (str.match(regex) ?? []).map(Number);
  return (h || 0) + (m || 0) / 60 + (s || 0) / 3600;
};

/* -------------------------------------------------------------------------- */
/*                                   component                                */
/* -------------------------------------------------------------------------- */

const OuraSleepDashboardO3 = ({ sleepData }: OuraSleepDashboardO3Props) => {
/* -------------------------------------------------------------------------- */
/*                                   dataset                                  */
/* -------------------------------------------------------------------------- */

const raw = sleepData.slice(-7).map((item) => ({
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
  lowest_heart_rate: item.lowest_heart_rate || item.average_heart_rate,
}));

/* -------------------------------------------------------------------------- */
/*                              transformed data                              */
/* -------------------------------------------------------------------------- */

const data = raw.map((d) => {
  const totalSleepHours = parseDurationToHours(d.total_sleep_duration);
  const deepHours = parseDurationToHours(d.deep_sleep_duration);
  const lightHours = parseDurationToHours(d.light_sleep_duration);
  const remHours = parseDurationToHours(d.rem_sleep_duration);

  return {
    ...d,
    shortDate: format(parseISO(d.day), "MM-dd"),
    totalSleepHours,
    deepHours,
    lightHours,
    remHours,
  };
});

/* -------------------------------------------------------------------------- */
/*                            statistics (averages)                           */
/* -------------------------------------------------------------------------- */

const avg = <T extends number>(arr: T[]): number =>
  arr.reduce((a, b) => a + b, 0) / arr.length;

const stats = {
  avgSleep: avg(data.map((d) => d.totalSleepHours)),
  avgEfficiency: avg(data.map((d) => d.efficiency)),
  avgReadiness: avg(data.map((d) => d.readiness_score)),
  avgHeartRate: avg(data.map((d) => d.average_heart_rate)),
  avgHRV: avg(data.map((d) => d.average_hrv)),
  avgDeep: avg(data.map((d) => d.deepHours)),
  avgLight: avg(data.map((d) => d.lightHours)),
  avgREM: avg(data.map((d) => d.remHours)),
};

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Sleep Dashboard</h1>
        <p className="text-gray-600">Last 7 nights of sleep data</p>
      </div>

      {/* ------------------------------ Summary Cards ------------------------------ */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Avg Sleep
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.avgSleep.toFixed(1)}h
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Efficiency
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.avgEfficiency.toFixed(0)}%
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Readiness
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.avgReadiness.toFixed(0)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Heart Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.avgHeartRate.toFixed(0)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              HRV
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgHRV.toFixed(0)}</div>
          </CardContent>
        </Card>
      </div>

      {/* ------------------------------ Tabs ------------------------------ */}
      <Tabs defaultValue="trends" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="trends">Sleep Trends</TabsTrigger>
          <TabsTrigger value="stages">Sleep Stages</TabsTrigger>
          <TabsTrigger value="table">Data Table</TabsTrigger>
        </TabsList>

        {/* ------------------------------ Trends Chart ------------------------------ */}
        <TabsContent value="trends">
          <Card>
            <CardHeader>
              <CardTitle>Sleep Trends Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  data={data}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="shortDate" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="totalSleepHours"
                    stroke="#8884d8"
                    name="Sleep Hours"
                  />
                  <Line
                    type="monotone"
                    dataKey="efficiency"
                    stroke="#82ca9d"
                    name="Efficiency %"
                  />
                  <Line
                    type="monotone"
                    dataKey="readiness_score"
                    stroke="#ffc658"
                    name="Readiness"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ------------------------------ Sleep Stages ------------------------------ */}
        <TabsContent value="stages">
          <Card>
            <CardHeader>
              <CardTitle>Sleep Stages Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart
                  data={data}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="shortDate" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="deepHours"
                    stackId="1"
                    stroke="#8884d8"
                    fill="#8884d8"
                    name="Deep Sleep"
                  />
                  <Area
                    type="monotone"
                    dataKey="lightHours"
                    stackId="1"
                    stroke="#82ca9d"
                    fill="#82ca9d"
                    name="Light Sleep"
                  />
                  <Area
                    type="monotone"
                    dataKey="remHours"
                    stackId="1"
                    stroke="#ffc658"
                    fill="#ffc658"
                    name="REM Sleep"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ------------------------------ Table ------------------------------ */}
        <TabsContent value="table">
          <Card>
            <CardHeader>
              <CardTitle>Raw Sleep Records</CardTitle>
            </CardHeader>
            <CardContent className="overflow-auto p-0 pb-4">
              <ResponsiveContainer
                width="100%"
                height={300}
                className="p-4 pt-0"
              >
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Sleep (h)</TableHead>
                      <TableHead>Efficiency</TableHead>
                      <TableHead>Readiness</TableHead>
                      <TableHead>Deep (h)</TableHead>
                      <TableHead>Light (h)</TableHead>
                      <TableHead>REM (h)</TableHead>
                      <TableHead>HR</TableHead>
                      <TableHead>HRV</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.map((row) => (
                      <TableRow key={row.day}>
                        <TableCell className="font-medium">
                          {row.shortDate}
                        </TableCell>
                        <TableCell>{row.totalSleepHours.toFixed(1)}</TableCell>
                        <TableCell>{row.efficiency}%</TableCell>
                        <TableCell>{row.readiness_score}</TableCell>
                        <TableCell>{row.deepHours.toFixed(1)}</TableCell>
                        <TableCell>{row.lightHours.toFixed(1)}</TableCell>
                        <TableCell>{row.remHours.toFixed(1)}</TableCell>
                        <TableCell>{row.average_heart_rate}</TableCell>
                        <TableCell>{row.average_hrv}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OuraSleepDashboardO3;

