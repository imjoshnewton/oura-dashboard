"use client";

import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  LineChart,
  Line,
  CartesianGrid,
  ReferenceLine,
} from "recharts";
import { Calendar, Heart, Moon, Activity } from "lucide-react";
import { SleepData } from "@/data/sleepData";

// --- Utility functions ---

// Converts "X hours, Y minutes, Z seconds" or "X hours, Y minutes" to minutes
function durationToMinutes(str: string): number {
  if (!str) return 0;
  const regex =
    /(?:(\d+)\s*hours?)?\s*,?\s*(?:(\d+)\s*minutes?)?\s*,?\s*(?:(\d+)\s*seconds?)?/;
  const [, h, m, s] = str.match(regex) || [];
  return parseInt(h || "0") * 60 + parseInt(m || "0") + parseInt(s || "0") / 60;
}

// Format minutes to "Hh Mm"
function minutesToHM(mins: number): string {
  const h = Math.floor(mins / 60);
  const m = Math.round(mins % 60);
  return `${h > 0 ? h + "h " : ""}${m}m`;
}

// Converts "2025-05-21" to "May 21"
function formatDay(day: string): string {
  // Add 'T00:00:00' to ensure the date is parsed in local time, not UTC
  const date = new Date(day + "T00:00:00");
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

// --- Custom tooltip for charts ---
interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
  type?: string;
}

function CustomTooltip({ active, payload, label, type }: CustomTooltipProps) {
  if (!active || !payload || !payload.length) return null;

  if (type === "stages") {
    const d = payload[0].payload;
    return (
      <div className="rounded-lg border bg-white p-3 shadow-lg text-xs">
        <div className="font-semibold">{label}</div>
        <div>
          <span className="text-indigo-500 font-medium">Deep: </span>
          {minutesToHM(d.Deep)}
        </div>
        <div>
          <span className="text-blue-400 font-medium">REM: </span>
          {minutesToHM(d.REM)}
        </div>
        <div>
          <span className="text-yellow-400 font-medium">Light: </span>
          {minutesToHM(d.Light)}
        </div>
        <div>
          <span className="text-gray-400 font-medium">Total: </span>
          {minutesToHM(d.Total)}
        </div>
      </div>
    );
  }

  if (type === "readiness") {
    const d = payload[0].payload;
    return (
      <div className="rounded-lg border bg-white p-3 shadow-lg text-xs">
        <div className="font-semibold">{label}</div>
        <div>
          <span className="text-orange-500 font-medium">Readiness: </span>
          {d.readiness}
        </div>
      </div>
    );
  }

  // Default for sleep trend
  const d = payload[0].payload;
  return (
    <div className="rounded-lg border bg-white p-3 shadow-lg text-xs">
      <div className="font-semibold">{label}</div>
      <div>
        <span className="text-indigo-500 font-medium">Sleep: </span>
        {minutesToHM(d.totalSleepMins)}
      </div>
      <div>
        <span className="text-green-500 font-medium">Eff.: </span>
        {d.efficiency}%
      </div>
    </div>
  );
}

interface OuraSleepDashboardGPTProps {
  sleepData: SleepData[];
}

// --- The Dashboard Component ---
const OuraSleepDashboardGPT = ({ sleepData }: OuraSleepDashboardGPTProps) => {
  const [tab, setTab] = useState("sleep");
  const [timeFrame, setTimeFrame] = useState(7);

  // Filter data based on selected time frame
  const filteredData = useMemo(() => {
    return sleepData.slice(-timeFrame);
  }, [sleepData, timeFrame]);

  // --- Preprocessing for charts ---
  const chartData = useMemo(() => {
    return filteredData.map((d) => ({
      day: formatDay(d.day),
      totalSleepMins: durationToMinutes(d.total_sleep_duration),
      remSleepMins: durationToMinutes(d.rem_sleep_duration),
      deepSleepMins: durationToMinutes(d.deep_sleep_duration),
      lightSleepMins: durationToMinutes(d.light_sleep_duration),
      efficiency: d.efficiency,
      readiness: d.readiness_score,
      avgHR: d.average_heart_rate,
      avgHRV: d.average_hrv,
      bedtime: d.bedtime_start,
      wake: d.bedtime_end,
    }));
  }, [filteredData]);

  // --- Metric calculation ---
  const avg = (arr: number[]) => arr.reduce((a, b) => a + b, 0) / arr.length;
  const last = <T,>(arr: T[]) => arr[arr.length - 1];

  // --- Cards config ---
  const summaryCards = useMemo(
    () => [
      {
        label: "Avg Sleep",
        value: minutesToHM(avg(chartData.map((d) => d.totalSleepMins))),
        icon: <Moon className="w-5 h-5 text-indigo-500" />,
        desc: `per night (last ${timeFrame} days)`,
      },
      {
        label: "Efficiency",
        value: `${Math.round(avg(chartData.map((d) => d.efficiency)))}%`,
        icon: <Activity className="w-5 h-5 text-green-500" />,
        desc: "Avg sleep efficiency",
      },
      {
        label: "Readiness",
        value: `${Math.round(avg(chartData.map((d) => d.readiness)))} / 100`,
        icon: <Heart className="w-5 h-5 text-orange-500" />,
        desc: "Avg readiness score",
      },
      {
        label: "Avg HRV",
        value: `${Math.round(avg(chartData.map((d) => d.avgHRV)))} ms`,
        icon: <Calendar className="w-5 h-5 text-cyan-500" />,
        desc: "Avg nightly HRV",
      },
    ],
    [chartData, timeFrame],
  );

  // For sleep stages chart: stacked bar data
  const stagesData = useMemo(() => {
    return chartData.map((d) => ({
      day: d.day,
      Deep: d.deepSleepMins,
      REM: d.remSleepMins,
      Light: d.lightSleepMins,
      Total: d.totalSleepMins,
    }));
  }, [chartData]);

  const timeFrameOptions = [
    { value: 7, label: "Last 7 days" },
    { value: 14, label: "Last 14 days" },
    { value: 21, label: "Last 21 days" },
    { value: 30, label: "Last 30 days" },
  ];

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-1">
            Oura Sleep Dashboard
          </h1>
          <span className="text-gray-600 text-sm">
            Data range:{" "}
            {filteredData.length > 0
              ? `${formatDay(filteredData[0].day)} - ${formatDay(filteredData[filteredData.length - 1].day)}`
              : "No data"}
          </span>
        </div>
        <div className="mt-2 md:mt-0">
          {/* Mobile Select */}
          <div className="md:hidden">
            <Select value={timeFrame.toString()} onValueChange={(value) => setTimeFrame(parseInt(value))}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                {timeFrameOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value.toString()}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Desktop Buttons */}
          <div className="hidden md:flex gap-2">
            {timeFrameOptions.map((option) => (
              <Button
                key={option.value}
                variant={timeFrame === option.value ? "default" : "outline"}
                onClick={() => setTimeFrame(option.value)}
                size="sm"
                className="text-xs"
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((card) => (
          <Card
            key={card.label}
            className="shadow-sm hover:shadow-md transition-shadow"
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {card.label}
              </CardTitle>
              {card.icon}
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-2xl font-semibold">{card.value}</div>
              <div className="text-xs text-gray-600 mt-1">{card.desc}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabbed Charts */}
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="sleep">Sleep Trend</TabsTrigger>
          <TabsTrigger value="stages">Sleep Stages</TabsTrigger>
          <TabsTrigger value="readiness">Readiness</TabsTrigger>
        </TabsList>

        {/* Sleep Trend */}
        <TabsContent value="sleep">
          <Card className="p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="font-semibold text-lg">
                  Sleep Duration & Efficiency
                </h2>
                <p className="text-gray-600 text-xs">
                  Track your nightly sleep and efficiency
                </p>
              </div>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={chartData}
                  margin={{ top: 16, right: 0, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="sleep" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366F1" stopOpacity={0.6} />
                      <stop
                        offset="95%"
                        stopColor="#6366F1"
                        stopOpacity={0.05}
                      />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                  <YAxis
                    yAxisId="left"
                    tickFormatter={minutesToHM}
                    tick={{ fontSize: 12 }}
                    width={40}
                    domain={[
                      0,
                      (dataMax: number) => Math.max(500, dataMax + 20),
                    ]}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    tick={{ fontSize: 12 }}
                    width={40}
                    domain={[60, 100]}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Area
                    yAxisId="left"
                    type="monotone"
                    dataKey="totalSleepMins"
                    name="Sleep (mins)"
                    stroke="#6366F1"
                    fill="url(#sleep)"
                    fillOpacity={1}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="efficiency"
                    name="Efficiency (%)"
                    stroke="#22C55E"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </TabsContent>

        {/* Sleep Stages */}
        <TabsContent value="stages">
          <Card className="p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="font-semibold text-lg">
                  Sleep Stages Breakdown
                </h2>
                <p className="text-gray-600 text-xs">
                  See how your sleep is distributed between stages
                </p>
              </div>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={stagesData}
                  stackOffset="expand"
                  margin={{ top: 16, right: 0, left: 0, bottom: 0 }}
                >
                  <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                  <YAxis
                    tickFormatter={(v) => `${Math.round(v * 100)}%`}
                    tick={{ fontSize: 12 }}
                    width={40}
                  />
                  <Tooltip content={<CustomTooltip type="stages" />} />
                  <Legend />
                  <Bar dataKey="Deep" stackId="a" fill="#6366F1" name="Deep" />
                  <Bar dataKey="REM" stackId="a" fill="#60A5FA" name="REM" />
                  <Bar
                    dataKey="Light"
                    stackId="a"
                    fill="#FBBF24"
                    name="Light"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </TabsContent>

        {/* Readiness */}
        <TabsContent value="readiness">
          <Card className="p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="font-semibold text-lg">Readiness Score</h2>
                <p className="text-gray-600 text-xs">
                  Track your daily readiness
                </p>
              </div>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={chartData}
                  margin={{ top: 16, right: 15, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                  <YAxis
                    domain={[50, 100]}
                    tick={{ fontSize: 12 }}
                    width={40}
                  />
                  <Tooltip content={<CustomTooltip type="readiness" />} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="readiness"
                    name="Readiness"
                    stroke="#FB923C"
                    strokeWidth={3}
                    dot={{ r: 5, fill: "#FB923C" }}
                    activeDot={{ r: 8 }}
                  />
                  <ReferenceLine
                    y={70}
                    label="70"
                    stroke="#D1D5DB"
                    strokeDasharray="4 4"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Details for last night */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Moon className="w-5 h-5 mr-2 text-indigo-500" />
            Last Night Summary ({last(chartData).day})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="text-xs text-gray-600 mb-1">Bedtime</div>
              <div className="font-semibold">
                {filteredData[filteredData.length - 1].bedtime_start} -{" "}
                {filteredData[filteredData.length - 1].bedtime_end}
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-600 mb-1">Total Sleep</div>
              <div className="font-semibold">
                {minutesToHM(last(chartData).totalSleepMins)}
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-600 mb-1">Efficiency</div>
              <div className="font-semibold">{last(chartData).efficiency}%</div>
            </div>
            <div>
              <div className="text-xs text-gray-600 mb-1">Readiness</div>
              <div className="font-semibold">
                {last(chartData).readiness} / 100
              </div>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-6">
            <div>
              <div className="text-xs text-gray-600">Deep</div>
              <div className="font-semibold text-indigo-500">
                {minutesToHM(last(chartData).deepSleepMins)}
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-600">REM</div>
              <div className="font-semibold text-blue-400">
                {minutesToHM(last(chartData).remSleepMins)}
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-600">Light</div>
              <div className="font-semibold text-yellow-500">
                {minutesToHM(last(chartData).lightSleepMins)}
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-600">Avg HR</div>
              <div className="font-semibold">
                {last(chartData).avgHR.toFixed(1)} bpm
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-600">Avg HRV</div>
              <div className="font-semibold">{last(chartData).avgHRV} ms</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OuraSleepDashboardGPT;
