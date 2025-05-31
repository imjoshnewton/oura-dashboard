"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
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
} from "recharts";
import { sleepData } from "@/data/sleepData";

/**
 * 7-day Oura sleep data ---------------------------------------------
 */
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

/**
 * Helpers ------------------------------------------------------------
 */
// Convert any duration string to minutes
const parseDurationToMinutes = (str: string): number => {
  const regex =
    /(?:(\d+)\s*hours?)?\s*,?\s*(?:(\d+)\s*minutes?)?\s*,?\s*(?:(\d+)\s*seconds?)?/i;
  const [, h = "0", m = "0", s = "0"] = regex.exec(str) || [];
  const minutes = parseInt(h) * 60 + parseInt(m) + parseInt(s) / 60;
  return Number.isFinite(minutes) ? +minutes.toFixed(2) : 0;
};

const shortDate = (iso: string) =>
  new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(new Date(iso));

/**
 * Dashboard Component -------------------------------------------------
 */
export default function SleepDashboard() {
  const [showAvgHr, setShowAvgHr] = useState(false);

  // transform data for charts + cards only once ----------------------
  const { chartData, lastNight } = useMemo(() => {
    const processed = raw.map((d) => ({
      name: shortDate(d.day),
      total: +(parseDurationToMinutes(d.total_sleep_duration) / 60).toFixed(2),
      deep: parseDurationToMinutes(d.deep_sleep_duration),
      light: parseDurationToMinutes(d.light_sleep_duration),
      rem: parseDurationToMinutes(d.rem_sleep_duration),
      efficiency: d.efficiency,
      readiness: d.readiness_score,
      avgHr: +d.average_heart_rate.toFixed(1),
      hrv: d.average_hrv,
    }));
    return { chartData: processed, lastNight: processed.at(-1)! };
  }, []);

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
                <AreaChart
                  data={chartData}
                  stackOffset="expand"
                  margin={{ top: 15, right: 25, left: 10, bottom: 0 }}
                >
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
                <LineChart
                  data={chartData}
                  margin={{ top: 15, right: 25, left: 5, bottom: 0 }}
                >
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
                <BarChart
                  data={chartData}
                  margin={{ top: 15, right: 25, left: 0, bottom: 0 }}
                >
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
  );
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
  title: string;
  value: string;
  intent?: "good" | "bad" | "default";
  hide?: boolean;
}) {
  const colorMap = {
    good: "text-emerald-500",
    bad: "text-rose-500",
    default: "text-foreground",
  };
  if (hide) return null;
  return (
    <Card className="flex flex-col justify-between">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <span className={`text-2xl font-semibold ${colorMap[intent]}`}>
          {value}
        </span>
      </CardContent>
    </Card>
  );
}

/**
 * Simple readiness coloring logic ------------------------------------
 */
function scoreIntent(score: number): "good" | "bad" | "default" {
  if (score >= 75) return "good";
  if (score < 65) return "bad";
  return "default";
}

