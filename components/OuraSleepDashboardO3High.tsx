"use client";

/* eslint-disable react-hooks/exhaustive-deps */

import React, { useMemo, useState } from "react"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import {
  ResponsiveContainer,
  LineChart,
  BarChart,
  PieChart,
  Pie,
  Line,
  Bar,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts"
import { sleepData } from "@/data/sleepData"

/* -------------------------------------------------------------------------- */
/*                                Helper utils                                */
/* -------------------------------------------------------------------------- */

const COLORS = {
  deep: "#5850ec",
  light: "#60a5fa",
  rem: "#f59e0b",
}

const DOW = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

interface SleepData {
  day: string;
  bedtime_start: string;
  bedtime_end: string;
  total_sleep_duration: string;
  efficiency: number;
  readiness_score: number;
  deep_sleep_duration: string;
  light_sleep_duration: string;
  rem_sleep_duration: string;
  average_heart_rate: number;
  average_hrv: number;
}

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

const durationToMinutes = (str: string): number => {
  const regex =
    /(?:(\d+)\s*hours?)?\s*,?\s*(?:(\d+)\s*minutes?)?\s*,?\s*(?:(\d+)\s*seconds?)?/
  const [, h = "0", m = "0", s = "0"] = str.match(regex) || []
  return +h * 60 + +m + +s / 60
}

const minutesToHM = (mins: number) => {
  const h = Math.floor(mins / 60)
  const m = Math.round(mins % 60)
  return `${h}h ${m}m`
}

/* -------------------------------------------------------------------------- */
/*                         Data shaping for the dashboard                     */
/* -------------------------------------------------------------------------- */

const processed = raw.map((d) => {
  const total = durationToMinutes(d.total_sleep_duration)
  const deep = durationToMinutes(d.deep_sleep_duration)
  const light = durationToMinutes(d.light_sleep_duration)
  const rem = durationToMinutes(d.rem_sleep_duration)

  return {
    ...d,
    dateObj: new Date(d.day),
    dayShort: DOW[new Date(d.day).getDay()],
    total,
    deep,
    light,
    rem,
  }
})

/* -------------------------------------------------------------------------- */
/*                               Main Component                               */
/* -------------------------------------------------------------------------- */

const SleepDashboard: React.FC = () => {
  const [selectedIdx, setSelectedIdx] = useState(processed.length - 1)

  const selected = processed[selectedIdx]

  const barData = useMemo(
    () =>
      processed.map((d, idx) => ({
        name: d.dayShort,
        total: +(d.total / 60).toFixed(2),
        readiness: d.readiness_score,
        idx,
      })),
    [],
  )

  const stagePie = useMemo(
    () => [
      { name: "Deep", value: selected.deep, color: COLORS.deep },
      { name: "Light", value: selected.light, color: COLORS.light },
      { name: "REM", value: selected.rem, color: COLORS.rem },
    ],
    [selected],
  )

  /* -------------------------------- Tooltip -------------------------------- */

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: any[] }) => {
    if (active && payload && payload.length) {
      const p = payload[0].payload
      return (
        <Card className="p-2 text-xs">
          <p className="font-medium">{p.name}</p>
          <p>Total: {p.total} h</p>
          <p>Readiness: {p.readiness}</p>
        </Card>
      )
    }
    return null
  }

  /* -------------------------------------------------------------------------- */

  return (
    <div className="grid gap-6 lg:grid-cols-12">
      {/* ---------- SUMMARY CHART CARD ---------- */}
      <Card className="lg:col-span-8">
        <CardHeader>
          <CardTitle>Sleep vs Readiness (last 7 days)</CardTitle>
        </CardHeader>
        <CardContent className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={barData}
              onClick={(e: any) => {
                if (e && e.activePayload && e.activePayload[0]) {
                  setSelectedIdx(e.activePayload[0].payload.idx)
                }
              }}
            >
              <XAxis dataKey="name" />
              <YAxis yAxisId="left" orientation="left" domain={[0, 10]} />
              <YAxis
                yAxisId="right"
                orientation="right"
                domain={[0, 100]}
                hide
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar
                yAxisId="left"
                dataKey="total"
                name="Sleep (h)"
                fill="#4ade80"
                radius={[4, 4, 0, 0]}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="readiness"
                name="Readiness"
                stroke="#818cf8"
                strokeWidth={2}
                dot
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* ---------- STAGE DISTRIBUTION ---------- */}
      <Card className="lg:col-span-4">
        <CardHeader>
          <CardTitle>
            {selected.dayShort} Sleep Stages&nbsp;
            <span className="text-muted-foreground text-sm font-normal">
              ({minutesToHM(selected.total)})
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={stagePie}
                dataKey="value"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={3}
                stroke="none"
              >
                {stagePie.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Legend />
            </PieChart>
          </ResponsiveContainer>

          <div className="flex gap-4 text-sm mt-2">
            {stagePie.map((s) => (
              <div key={s.name} className="flex items-center gap-1">
                <span
                  className="inline-block w-3 h-3 rounded-sm"
                  style={{ backgroundColor: s.color }}
                />
                {s.name}: {minutesToHM(s.value)}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ---------- DETAIL TABS ---------- */}
      <Card className="lg:col-span-12">
        <CardHeader>
          <CardTitle>
            {selected.day} Detailed Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="scores">
            <TabsList>
              <TabsTrigger value="scores">Scores</TabsTrigger>
              <TabsTrigger value="vitals">Vitals</TabsTrigger>
            </TabsList>

            {/* ---------------- SCORES --------------- */}
            <TabsContent value="scores" className="pt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { label: "Readiness", value: selected.readiness_score },
                { label: "Efficiency", value: selected.efficiency + "%" },
                { label: "Deep %", value: Math.round((selected.deep / selected.total) * 100) + "%" },
                { label: "REM %", value: Math.round((selected.rem / selected.total) * 100) + "%" },
              ].map((m) => (
                <MetricCard key={m.label} {...m} />
              ))}
            </TabsContent>

            {/* ---------------- VITALS --------------- */}
            <TabsContent value="vitals" className="pt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { label: "Avg HR", value: selected.average_heart_rate.toFixed(1) + " bpm" },
                { label: "Avg HRV", value: selected.average_hrv + " ms" },
                { label: "Bedtime", value: selected.bedtime_start },
                { label: "Wake-up", value: selected.bedtime_end },
              ].map((m) => (
                <MetricCard key={m.label} {...m} />
              ))}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*                               Reusable Card                                */
/* -------------------------------------------------------------------------- */

const MetricCard = ({ label, value }: { label: string; value: string | number }) => (
  <Card className="text-center">
    <CardHeader>
      <CardTitle className="text-sm text-muted-foreground">{label}</CardTitle>
    </CardHeader>
    <CardContent className="text-2xl font-semibold">{value}</CardContent>
  </Card>
)

export default SleepDashboard