"use client"

import { useMemo, useState } from "react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts"

/**
 * 7-day Oura sleep data ---------------------------------------------
 */
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

/**
 * Helpers ------------------------------------------------------------
 */
// Convert any duration string to minutes
const parseDurationToMinutes = (str: string): number => {
  const regex =
    /(?:(\d+)\s*hours?)?\s*,?\s*(?:(\d+)\s*minutes?)?\s*,?\s*(?:(\d+)\s*seconds?)?/i
  const [, h = "0", m = "0", s = "0"] = regex.exec(str) || []
  const minutes = parseInt(h) * 60 + parseInt(m) + parseInt(s) / 60
  return Number.isFinite(minutes) ? +minutes.toFixed(2) : 0
}

const shortDate = (iso: string) =>
  new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(new Date(iso))

/**
 * Dashboard Component -------------------------------------------------
 */
export default function SleepDashboard() {
  const [showAvgHr, setShowAvgHr] = useState(false)

  // transform data for charts + cards only once ----------------------
  const { chartData, lastNight } = useMemo(() => {
    const processed = rawData.map((d) => ({
      name: shortDate(d.day),
      total: +(parseDurationToMinutes(d.total_sleep_duration) / 60).toFixed(2),
      deep: parseDurationToMinutes(d.deep_sleep_duration),
      light: parseDurationToMinutes(d.light_sleep_duration),
      rem: parseDurationToMinutes(d.rem_sleep_duration),
      efficiency: d.efficiency,
      readiness: d.readiness_score,
      avgHr: +d.average_heart_rate.toFixed(1),
      hrv: d.average_hrv,
    }))
    return { chartData: processed, lastNight: processed.at(-1)! }
  }, [])

  return (
    <div className="space-y-6">
      {/* Quick-stats cards ------------------------------------------- */}
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
        <StatCard
          title="Total Sleep"
          value={`${lastNight.total.toFixed(2)} h`}
        />
        <StatCard title="Efficiency" value={`${lastNight.efficiency}%`} />
        <StatCard
          title="Readiness"
          value={lastNight.readiness.toString()}
          intent={scoreIntent(lastNight.readiness)}
        />
        <StatCard
          title="Avg. HR"
          value={`${lastNight.avgHr} bpm`}
          hide={!showAvgHr}
        />
        <StatCard title="Avg. HRV" value={`${lastNight.hrv} ms`} />
      </div>

      {/* Tabs container --------------------------------------------- */}
      <Tabs defaultValue="stages" className="w-full space-y-4">
        <TabsList className="flex w-full justify-start gap-2">
          <TabsTrigger value="stages">Sleep Stages</TabsTrigger>
          <TabsTrigger value="quality">Quality</TabsTrigger>
          <TabsTrigger value="cardio">HR / HRV</TabsTrigger>

          {/* additional UI right-aligned */}
          <div className="ml-auto flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Show Avg HR</span>
            <Switch
              checked={showAvgHr}
              onCheckedChange={setShowAvgHr}
              disabled={false}
            />
          </div>
        </TabsList>

        {/* Sleep stages area-chart ---------------------------------- */}
        <TabsContent value="stages">
          <Card>
            <CardHeader>
              <CardTitle>Sleep Stage Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="h-[350px] px-0">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} stackOffset="expand">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis
                    tickFormatter={(v) => `${Math.round(v * 100)}%`}
                    domain={[0, 1]}
                  />
                  <Tooltip
                    formatter={(value: number) =>
                      `${(value as number).toFixed(1)} min`
                    }
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="light"
                    stackId="1"
                    name="Light"
                    stroke="#60a5fa"
                    fill="#60a5fa"
                  />
                  <Area
                    type="monotone"
                    dataKey="deep"
                    stackId="1"
                    name="Deep"
                    stroke="#4ade80"
                    fill="#4ade80"
                  />
                  <Area
                    type="monotone"
                    dataKey="rem"
                    stackId="1"
                    name="REM"
                    stroke="#c084fc"
                    fill="#c084fc"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Quality line-chart --------------------------------------- */}
        <TabsContent value="quality">
          <Card>
            <CardHeader>
              <CardTitle>Readiness vs. Efficiency</CardTitle>
            </CardHeader>
            <CardContent className="h-[350px] px-0">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="readiness"
                    stroke="#818cf8"
                    activeDot={{ r: 6 }}
                    name="Readiness"
                  />
                  <Line
                    type="monotone"
                    dataKey="efficiency"
                    stroke="#fbbf24"
                    name="Efficiency"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Cardio bar-chart ----------------------------------------- */}
        <TabsContent value="cardio">
          <Card>
            <CardHeader>
              <CardTitle>Nightly Cardiovascular Metrics</CardTitle>
            </CardHeader>
            <CardContent className="h-[350px] px-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  {showAvgHr && (
                    <Bar dataKey="avgHr" fill="#fb7185" name="Avg HR (bpm)" />
                  )}
                  <Bar dataKey="hrv" fill="#34d399" name="HRV (ms)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

/**
 * Small helper card component ----------------------------------------
 */
function StatCard({
  title,
  value,
  intent = "default",
  hide = false,
}: {
  title: string
  value: string
  intent?: "good" | "bad" | "default"
  hide?: boolean
}) {
  const colorMap = {
    good: "text-emerald-500",
    bad: "text-rose-500",
    default: "text-foreground",
  }
  if (hide) return null
  return (
    <Card className="flex flex-col justify-between">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <span className={`text-2xl font-semibold ${colorMap[intent]}`}>
          {value}
        </span>
      </CardContent>
    </Card>
  )
}

/**
 * Simple readiness coloring logic ------------------------------------
 */
function scoreIntent(score: number): "good" | "bad" | "default" {
  if (score >= 75) return "good"
  if (score < 65) return "bad"
  return "default"
}