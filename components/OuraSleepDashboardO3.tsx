"use client";

import React, { useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { format, parseISO } from "date-fns";

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
/*                                   dataset                                  */
/* -------------------------------------------------------------------------- */

const raw = [
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
  avgHr: avg(data.map((d) => d.average_heart_rate)),
  avgHrv: avg(data.map((d) => d.average_hrv)),
};

/* -------------------------------------------------------------------------- */
/*                               React component                              */
/* -------------------------------------------------------------------------- */

const SleepDashboard: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* ------------------------------------------------------------------ */}
      {/*                           stat summary cards                       */}
      {/* ------------------------------------------------------------------ */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader>
            <CardTitle>Avg Sleep</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            {stats.avgSleep.toFixed(1)} h
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Avg Efficiency</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            {stats.avgEfficiency.toFixed(0)}%
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Avg Readiness</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            {stats.avgReadiness.toFixed(0)}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Avg HR</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            {stats.avgHr.toFixed(0)} bpm
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Avg HRV</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            {stats.avgHrv.toFixed(0)} ms
          </CardContent>
        </Card>
      </div>

      <Separator />

      {/* ------------------------------------------------------------------ */}
      {/*                                tabs                                */}
      {/* ------------------------------------------------------------------ */}
      <Tabs defaultValue="sleep" className="space-y-4">
        <TabsList>
          <TabsTrigger value="sleep">Sleep vs Readiness</TabsTrigger>
          <TabsTrigger value="stages">Sleep Stages</TabsTrigger>
          <TabsTrigger value="vitals">Vitals</TabsTrigger>
          <TabsTrigger value="table">Table</TabsTrigger>
        </TabsList>

        {/* ------------------------- Sleep vs Readiness ------------------------ */}
        <TabsContent value="sleep">
          <Card>
            <CardHeader>
              <CardTitle>Total Sleep &amp; Readiness</CardTitle>
            </CardHeader>
            <CardContent className="h-[350px] p-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="shortDate" />
                  <YAxis
                    yAxisId="left"
                    orientation="left"
                    domain={[0, (dataMax: number) => dataMax + 1]}
                    label={{ value: "Hours", position: "insideLeft", angle: -90 }}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    domain={[50, 100]}
                    label={{ value: "Score", position: "insideRight", angle: 90 }}
                  />
                  <Tooltip />
                  <Legend />
                  <Bar
                    yAxisId="left"
                    dataKey="totalSleepHours"
                    name="Sleep (h)"
                    fill="#6366f1"
                    radius={[4, 4, 0, 0]}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="readiness_score"
                    name="Readiness"
                    stroke="#22c55e"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="efficiency"
                    name="Efficiency"
                    stroke="#f59e0b"
                    strokeDasharray="3 3"
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ----------------------------- Stages ------------------------------- */}
        <TabsContent value="stages">
          <Card>
            <CardHeader>
              <CardTitle>Sleep Stage Distribution</CardTitle>
            </CardHeader>
            <CardContent className="h-[350px] p-0">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} stackOffset="expand">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="shortDate" />
                  <YAxis
                    tickFormatter={(v) => `${(v * 100).toFixed(0)}%`}
                  />
                  <Tooltip
                    formatter={(value: number) =>
                      `${(value * 100).toFixed(0)}%`
                    }
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="deepHours"
                    name="Deep"
                    stackId="1"
                    stroke="#4f46e5"
                    fill="#818cf8"
                  />
                  <Area
                    type="monotone"
                    dataKey="remHours"
                    name="REM"
                    stackId="1"
                    stroke="#be123c"
                    fill="#f87171"
                  />
                  <Area
                    type="monotone"
                    dataKey="lightHours"
                    name="Light"
                    stackId="1"
                    stroke="#0f766e"
                    fill="#34d399"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ----------------------------- Vitals ------------------------------- */}
        <TabsContent value="vitals">
          <Card>
            <CardHeader>
              <CardTitle>Average Heart Rate &amp; HRV</CardTitle>
            </CardHeader>
            <CardContent className="h-[350px] p-0">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="shortDate" />
                  <YAxis
                    yAxisId="left"
                    orientation="left"
                    label={{ value: "HR (bpm)", angle: -90, position: "insideLeft" }}
                    domain={[50, (dataMax: number) => dataMax + 10]}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    label={{ value: "HRV (ms)", angle: 90, position: "insideRight" }}
                    domain={[20, (dataMax: number) => dataMax + 10]}
                  />
                  <Tooltip />
                  <Legend />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="average_heart_rate"
                    name="Avg HR"
                    stroke="#ef4444"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="average_hrv"
                    name="Avg HRV"
                    stroke="#06b6d4"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ------------------------------ Table ------------------------------- */}
        <TabsContent value="table">
          <Card>
            <CardHeader>
              <CardTitle>Raw Sleep Records</CardTitle>
            </CardHeader>
            <CardContent className="overflow-auto p-0">
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
                    <TableHead>Avg HR</TableHead>
                    <TableHead>Avg HRV</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.map((d) => (
                    <TableRow key={d.day}>
                      <TableCell>{d.day}</TableCell>
                      <TableCell>{d.totalSleepHours.toFixed(2)}</TableCell>
                      <TableCell>{d.efficiency}</TableCell>
                      <TableCell>{d.readiness_score}</TableCell>
                      <TableCell>{d.deepHours.toFixed(2)}</TableCell>
                      <TableCell>{d.lightHours.toFixed(2)}</TableCell>
                      <TableCell>{d.remHours.toFixed(2)}</TableCell>
                      <TableCell>{d.average_heart_rate.toFixed(0)}</TableCell>
                      <TableCell>{d.average_hrv}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SleepDashboard;