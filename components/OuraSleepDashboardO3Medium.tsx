"use client";

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
import { SleepData } from "@/data/sleepData"

interface OuraSleepDashboardO3MediumProps {
  sleepData: SleepData[];
}

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
const OuraSleepDashboardO3Medium: React.FC<OuraSleepDashboardO3MediumProps> = ({ sleepData }) => {
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

/* --------------------------------------------------------------------------
   Transform for Recharts
   -------------------------------------------------------------------------- */
const data = raw.map((d) => ({
  ...d,
  totalMin: durationToMinutes(d.total_sleep_duration),
  deepMin: durationToMinutes(d.deep_sleep_duration),
  lightMin: durationToMinutes(d.light_sleep_duration),
  remMin: durationToMinutes(d.rem_sleep_duration),
}))

/* ==========================================================================
   Dashboard Component
   ========================================================================== */
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

export default OuraSleepDashboardO3Medium