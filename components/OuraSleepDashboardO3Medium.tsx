/* ==========================================================================
   SleepDashboard.tsx
   A modern Oura-sleep dashboard built with shadcn/ui + Recharts
   ========================================================================== */

import React from "react"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card"
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs"
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  ScatterChart,
  Scatter,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts"

/* --------------------------------------------------------------------------
   Helpers
   -------------------------------------------------------------------------- */
const durationToMinutes = (str: string): number => {
  const parts = str.split(",").map((p) => p.trim())
  let min = 0
  parts.forEach((p) => {
    if (p.includes("hour")) min += parseFloat(p) * 60
    else if (p.includes("minute")) min += parseFloat(p)
    else if (p.includes("second")) min += parseFloat(p) / 60
  })
  return min
}

const formatHours = (m: number) => (m / 60).toFixed(1)

/* --------------------------------------------------------------------------
   Raw Data ‑ last 7 days (would normally come from an API)
   -------------------------------------------------------------------------- */
const rawData = [
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
]

/* --------------------------------------------------------------------------
   Transform for Recharts
   -------------------------------------------------------------------------- */
const data = rawData.map((d) => ({
  ...d,
  totalMin: durationToMinutes(d.total_sleep_duration),
  deepMin: durationToMinutes(d.deep_sleep_duration),
  lightMin: durationToMinutes(d.light_sleep_duration),
  remMin: durationToMinutes(d.rem_sleep_duration),
}))

/* ==========================================================================
   Dashboard Component
   ========================================================================== */
const SleepDashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Heading */}
      <div>
        <h1 className="text-2xl font-bold">🛌 Oura Sleep Dashboard</h1>
        <p className="text-muted-foreground">
          Last 7 nights · All times are shown in your local timezone
        </p>
      </div>

      {/* Top KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Average Sleep</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-4">
            <span className="text-4xl font-semibold">
              {formatHours(
                data.reduce((s, d) => s + d.totalMin, 0) / data.length
              )}
            </span>
            <span className="text-sm text-muted-foreground">hrs / night</span>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Avg Efficiency</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-4">
            <span className="text-4xl font-semibold">
              {(
                data.reduce((s, d) => s + d.efficiency, 0) / data.length
              ).toFixed(0)}
              %
            </span>
            <Progress
              value={
                data.reduce((s, d) => s + d.efficiency, 0) / data.length
              }
              className="flex-1"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Avg Readiness</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-4">
            <span className="text-4xl font-semibold">
              {(
                data.reduce((s, d) => s + d.readiness_score, 0) / data.length
              ).toFixed(0)}
            </span>
            <Badge
              variant="secondary"
              className="capitalize"
            >
              {(() => {
                const r =
                  data.reduce((s, d) => s + d.readiness_score, 0) /
                  data.length
                if (r >= 80) return "Great"
                if (r >= 60) return "Good"
                return "Pay attention"
              })()}
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Tabbed analytics */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="stages">Sleep Stages</TabsTrigger>
          <TabsTrigger value="metrics">Vitals</TabsTrigger>
          <TabsTrigger value="table">Raw Table</TabsTrigger>
        </TabsList>

        {/* ------------------------------------------------------------------ */}
        {/* OVERVIEW TAB */}
        {/* ------------------------------------------------------------------ */}
        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Total sleep duration</CardTitle>
            </CardHeader>
            <CardContent style={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis
                    label={{ value: "hours", angle: -90, position: "insideLeft" }}
                    tickFormatter={(v) => formatHours(v)}
                  />
                  <Tooltip
                    formatter={(v: number) => `${formatHours(v)} h`}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="totalMin"
                    stroke="#6366f1"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    name="Sleep (hrs)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Readiness vs Efficiency</CardTitle>
            </CardHeader>
            <CardContent style={{ height: 260 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="readiness_score" fill="#10b981" name="Readiness" />
                  <Bar dataKey="efficiency" fill="#3b82f6" name="Efficiency" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ------------------------------------------------------------------ */}
        {/* SLEEP STAGES TAB */}
        {/* ------------------------------------------------------------------ */}
        <TabsContent value="stages">
          <Card>
            <CardHeader>
              <CardTitle>Stage composition (hours)</CardTitle>
            </CardHeader>
            <CardContent style={{ height: 350 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} stackOffset="expand">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis
                    tickFormatter={(v) => `${(v * 100).toFixed(0)}%`}
                  />
                  <Tooltip
                    formatter={(value: number) =>
                      `${(value * 100).toFixed(1)} %`
                    }
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey={(d) => d.deepMin}
                    name="Deep"
                    stackId="1"
                    stroke="#8b5cf6"
                    fill="#8b5cf6"
                  />
                  <Area
                    type="monotone"
                    dataKey={(d) => d.lightMin}
                    name="Light"
                    stackId="1"
                    stroke="#22d3ee"
                    fill="#22d3ee"
                  />
                  <Area
                    type="monotone"
                    dataKey={(d) => d.remMin}
                    name="REM"
                    stackId="1"
                    stroke="#f97316"
                    fill="#f97316"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ------------------------------------------------------------------ */}
        {/* VITALS TAB */}
        {/* ------------------------------------------------------------------ */}
        <TabsContent value="metrics">
          <Card>
            <CardHeader>
              <CardTitle>HRV vs Avg Heart Rate</CardTitle>
            </CardHeader>
            <CardContent style={{ height: 350 }}>
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    type="number"
                    dataKey="average_hrv"
                    name="HRV"
                    unit=" ms"
                  />
                  <YAxis
                    type="number"
                    dataKey="average_heart_rate"
                    name="BPM"
                    unit=" bpm"
                  />
                  <Tooltip
                    cursor={{ strokeDasharray: "3 3" }}
                    formatter={(v, n) =>
                      n === "HRV" ? `${v} ms` : `${v} bpm`
                    }
                    labelFormatter={(idx) => data[idx].day}
                  />
                  <Legend />
                  <Scatter
                    name="Night"
                    data={data}
                    fill="#e11d48"
                    line={{ stroke: "#e11d48" }}
                  />
                </ScatterChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ------------------------------------------------------------------ */}
        {/* RAW TABLE TAB */}
        {/* ------------------------------------------------------------------ */}
        <TabsContent value="table">
          <Card>
            <CardHeader>
              <CardTitle>Raw Oura data</CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Total (h)</TableHead>
                    <TableHead>Deep (h)</TableHead>
                    <TableHead>Light (h)</TableHead>
                    <TableHead>REM (h)</TableHead>
                    <TableHead>Efficiency</TableHead>
                    <TableHead>Readiness</TableHead>
                    <TableHead>HRV</TableHead>
                    <TableHead>BPM</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.map((d) => (
                    <TableRow key={d.day}>
                      <TableCell>{d.day}</TableCell>
                      <TableCell>{formatHours(d.totalMin)}</TableCell>
                      <TableCell>{formatHours(d.deepMin)}</TableCell>
                      <TableCell>{formatHours(d.lightMin)}</TableCell>
                      <TableCell>{formatHours(d.remMin)}</TableCell>
                      <TableCell>{d.efficiency}%</TableCell>
                      <TableCell>{d.readiness_score}</TableCell>
                      <TableCell>{d.average_hrv} ms</TableCell>
                      <TableCell>{d.average_heart_rate} bpm</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default SleepDashboard