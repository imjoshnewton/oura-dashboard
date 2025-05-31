"use client";

import React, { useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip as ShadTooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";
import {
  BedDouble,
  Zap,
  Percent,
  HeartPulse,
  Activity,
  TrendingUp,
  Moon,
  Sun,
  Gauge,
  CalendarDays,
  BarChartHorizontalBig,
  Info,
} from "lucide-react";
import { SleepData, getLastNDaysData } from "@/data/sleepData";

// Use the SleepData type from the common data file
type SleepDataEntry = SleepData;

// Define the structure of processed data for charts and display
interface ProcessedSleepDataEntry extends SleepDataEntry {
  formattedDate: string;
  shortDate: string;
  totalSleepMinutes: number;
  totalSleepHours: number;
  deepSleepMinutes: number;
  lightSleepMinutes: number;
  remSleepMinutes: number;
}

// Helper function to parse duration strings (e.g., "X hours, Y minutes, Z seconds") to total minutes
const parseDurationToMinutes = (durationStr?: string): number => {
  if (!durationStr) return 0;
  let totalMinutes = 0;
  const parts = durationStr.toLowerCase().split(", ");

  parts.forEach((part) => {
    if (part.includes("hour")) {
      totalMinutes += parseInt(part) * 60;
    } else if (part.includes("minute")) {
      totalMinutes += parseInt(part);
    } else if (part.includes("second")) {
      totalMinutes += parseInt(part) / 60;
    }
  });
  return parseFloat(totalMinutes.toFixed(1));
};

// Helper function to format duration from minutes to "Xh Ym" string
const formatMinutesToHoursMinutes = (totalMinutes: number): string => {
  if (totalMinutes === 0) return "0m";
  const hours = Math.floor(totalMinutes / 60);
  const minutes = Math.round(totalMinutes % 60);
  let result = "";
  if (hours > 0) {
    result += `${hours}h `;
  }
  if (minutes > 0 || hours === 0) {
    result += `${minutes}m`;
  }
  return result.trim();
};

// Get the last 7 days of sleep data
const sampleSleepData = getLastNDaysData(7) as SleepDataEntry[];

// Main Dashboard Component
const OuraSleepDashboard: React.FC = () => {
  const processedData = useMemo(() => {
    return sampleSleepData
      .map((entry) => {
        const totalSleepMinutes = parseDurationToMinutes(
          entry.total_sleep_duration,
        );
        return {
          ...entry,
          formattedDate: new Date(entry.day + "T00:00:00").toLocaleDateString(
            "en-US",
            { weekday: "short", month: "short", day: "numeric" },
          ),
          shortDate: new Date(entry.day + "T00:00:00").toLocaleDateString(
            "en-US",
            { month: "short", day: "numeric" },
          ),
          totalSleepMinutes,
          totalSleepHours: parseFloat((totalSleepMinutes / 60).toFixed(2)),
          deepSleepMinutes: parseDurationToMinutes(entry.deep_sleep_duration),
          lightSleepMinutes: parseDurationToMinutes(entry.light_sleep_duration),
          remSleepMinutes: parseDurationToMinutes(entry.rem_sleep_duration),
        };
      })
      .sort((a, b) => new Date(a.day).getTime() - new Date(b.day).getTime()); // Ensure data is sorted by date
  }, []);

  const averageMetrics = useMemo(() => {
    if (processedData.length === 0) {
      return {
        avgTotalSleepHours: 0,
        avgEfficiency: 0,
        avgReadinessScore: 0,
        avgHeartRate: 0,
        avgHrv: 0,
      };
    }
    const total = processedData.reduce(
      (acc, curr) => {
        acc.totalSleepHours += curr.totalSleepHours;
        acc.efficiency += curr.efficiency;
        acc.readinessScore += curr.readiness_score;
        acc.heartRate += curr.average_heart_rate;
        acc.hrv += curr.average_hrv;
        return acc;
      },
      {
        totalSleepHours: 0,
        efficiency: 0,
        readinessScore: 0,
        heartRate: 0,
        hrv: 0,
      },
    );

    const count = processedData.length;
    return {
      avgTotalSleepHours: parseFloat(
        (total.totalSleepHours / count).toFixed(2),
      ),
      avgEfficiency: Math.round(total.efficiency / count),
      avgReadinessScore: Math.round(total.readinessScore / count),
      avgHeartRate: parseFloat((total.heartRate / count).toFixed(1)),
      avgHrv: Math.round(total.hrv / count),
    };
  }, [processedData]);

  const latestDayData =
    processedData.length > 0 ? processedData[processedData.length - 1] : null;

  const sleepStageDataForPie = latestDayData
    ? [
        {
          name: "Deep",
          value: latestDayData.deepSleepMinutes,
          color: "#3b82f6",
        }, // blue-500
        {
          name: "Light",
          value: latestDayData.lightSleepMinutes,
          color: "#8b5cf6",
        }, // violet-500
        { name: "REM", value: latestDayData.remSleepMinutes, color: "#10b981" }, // emerald-500
      ]
    : [];

  const getReadinessColor = (score: number) => {
    if (score >= 85) return "text-green-500";
    if (score >= 70) return "text-yellow-500";
    return "text-red-500";
  };

  const getEfficiencyColor = (score: number) => {
    if (score >= 85) return "text-green-500";
    if (score >= 70) return "text-yellow-500"; // Oura typically marks 85%+ as good for efficiency
    return "text-red-500";
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-gray-200 p-3 shadow-lg rounded-md">
          <p className="label font-semibold text-gray-900">{`${label}`}</p>
          {payload.map((pld: any, index: number) => (
            <p key={index} style={{ color: pld.color }} className="text-sm">
              {`${pld.name}: ${pld.value}${pld.unit || ""}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (processedData.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50 text-gray-900">
        <Card>
          <CardHeader>
            <CardTitle>No Sleep Data Available</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Please check your data source or try again later.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">
            Oura Sleep Dashboard
          </h1>
          <p className="text-gray-600">
            Your 7-day sleep analysis and insights.
          </p>
        </header>

        {/* Overview Metrics */}
        <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Avg. Total Sleep
              </CardTitle>
              <BedDouble className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatMinutesToHoursMinutes(
                  averageMetrics.avgTotalSleepHours * 60,
                )}
              </div>
              <p className="text-xs text-gray-500">Average over last 7 days</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Avg. Sleep Efficiency
              </CardTitle>
              <Percent className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div
                className={`text-2xl font-bold ${getEfficiencyColor(averageMetrics.avgEfficiency)}`}
              >
                {averageMetrics.avgEfficiency}%
              </div>
              <p className="text-xs text-gray-500">85%+ is optimal</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Avg. Readiness Score
              </CardTitle>
              <Zap className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div
                className={`text-2xl font-bold ${getReadinessColor(averageMetrics.avgReadinessScore)}`}
              >
                {averageMetrics.avgReadinessScore}
              </div>
              <p className="text-xs text-gray-500">Score out of 100</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Avg. Resting HR
              </CardTitle>
              <HeartPulse className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {averageMetrics.avgHeartRate}{" "}
                <span className="text-sm">bpm</span>
              </div>
              <p className="text-xs text-gray-500">Average during sleep</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. HRV</CardTitle>
              <Activity className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {averageMetrics.avgHrv} <span className="text-sm">ms</span>
              </div>
              <p className="text-xs text-gray-500">Heart Rate Variability</p>
            </CardContent>
          </Card>
        </section>

        {/* Main Charts Section */}
        <Tabs defaultValue="trends" className="mb-8">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-4">
            <TabsTrigger value="trends">Sleep Trends</TabsTrigger>
            <TabsTrigger value="stages">Sleep Stages</TabsTrigger>
            <TabsTrigger value="vitals">Vitals</TabsTrigger>
            <TabsTrigger value="log">Daily Log</TabsTrigger>
          </TabsList>

          <TabsContent value="trends">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="mr-2 h-5 w-5" />
                    Sleep Duration & Quality Trends
                  </CardTitle>
                  <CardDescription>
                    Total sleep, efficiency, and readiness over the last 7 days.
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-[400px] pr-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={processedData}
                      margin={{ top: 5, right: 25, left: 5, bottom: 0 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        strokeOpacity={0.2}
                      />
                      <XAxis dataKey="shortDate" tick={{ fontSize: 12 }} />
                      <YAxis
                        yAxisId="left"
                        label={{
                          value: "Hours",
                          angle: -90,
                          position: "insideLeft",
                          fontSize: 12,
                          dy: 40,
                        }}
                        tick={{ fontSize: 12 }}
                      />
                      <YAxis
                        yAxisId="right"
                        orientation="right"
                        label={{
                          value: "Score / %",
                          angle: 90,
                          position: "insideRight",
                          fontSize: 12,
                          dy: -40,
                        }}
                        tick={{ fontSize: 12 }}
                      />
                      <RechartsTooltip content={<CustomTooltip />} />
                      <Legend verticalAlign="top" height={36} />
                      <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="totalSleepHours"
                        name="Total Sleep"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                        unit="h"
                      />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="efficiency"
                        name="Efficiency"
                        stroke="#10b981"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                        unit="%"
                      />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="readiness_score"
                        name="Readiness"
                        stroke="#f59e0b"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="stages">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Moon className="mr-2 h-5 w-5" />
                    Latest Sleep Stages
                  </CardTitle>
                  <CardDescription>
                    Breakdown for{" "}
                    {latestDayData?.formattedDate || "the latest night"}. Total:{" "}
                    {formatMinutesToHoursMinutes(
                      latestDayData?.totalSleepMinutes || 0,
                    )}
                    .
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-[350px] flex items-center justify-center">
                  {latestDayData && (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={sleepStageDataForPie}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent, value }) =>
                            `${name}: ${formatMinutesToHoursMinutes(value)} (${(percent * 100).toFixed(0)}%)`
                          }
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                          paddingAngle={2}
                        >
                          {sleepStageDataForPie.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <RechartsTooltip
                          formatter={(value: number, name: string) => [
                            `${formatMinutesToHoursMinutes(value)}`,
                            name,
                          ]}
                        />
                        <Legend verticalAlign="bottom" iconType="circle" />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChartHorizontalBig className="mr-2 h-5 w-5" />
                    Sleep Stage Durations
                  </CardTitle>
                  <CardDescription>
                    Deep, Light, and REM sleep over the last 7 days (in
                    minutes).
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-[350px] pr-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={processedData}
                      barCategoryGap="20%"
                      margin={{ top: 5, right: 25, left: 5, bottom: 0 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        strokeOpacity={0.2}
                      />
                      <XAxis dataKey="shortDate" tick={{ fontSize: 12 }} />
                      <YAxis
                        label={{
                          value: "Minutes",
                          angle: -90,
                          position: "insideLeft",
                          fontSize: 12,
                        }}
                        tick={{ fontSize: 12 }}
                      />
                      <RechartsTooltip content={<CustomTooltip />} />
                      <Legend verticalAlign="top" height={36} />
                      <Bar
                        dataKey="deepSleepMinutes"
                        name="Deep"
                        stackId="a"
                        fill="#3b82f6"
                        radius={[4, 4, 0, 0]}
                        unit="m"
                      />
                      <Bar
                        dataKey="lightSleepMinutes"
                        name="Light"
                        stackId="a"
                        fill="#8b5cf6"
                        radius={[0, 0, 0, 0]}
                        unit="m"
                      />
                      <Bar
                        dataKey="remSleepMinutes"
                        name="REM"
                        stackId="a"
                        fill="#10b981"
                        radius={[0, 0, 0, 0]}
                        unit="m"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="vitals">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Gauge className="mr-2 h-5 w-5" />
                  Sleep Vitals Trends
                </CardTitle>
                <CardDescription>
                  Average resting heart rate and HRV during sleep.
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[400px] pr-0">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={processedData}
                    margin={{ top: 5, right: 25, left: 5, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                    <XAxis dataKey="shortDate" tick={{ fontSize: 12 }} />
                    <YAxis
                      yAxisId="left"
                      orientation="left"
                      stroke="#ef4444"
                      label={{
                        value: "Avg Heart Rate (bpm)",
                        angle: -90,
                        position: "insideLeft",
                        fill: "#ef4444",
                        fontSize: 12,
                        dy: 60,
                      }}
                      tick={{ fontSize: 12, fill: "#ef4444" }}
                    />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      stroke="#a855f7"
                      label={{
                        value: "Avg HRV (ms)",
                        angle: 90,
                        position: "insideRight",
                        fill: "#a855f7",
                        fontSize: 12,
                        dy: -20,
                      }}
                      tick={{ fontSize: 12, fill: "#a855f7" }}
                    />
                    <RechartsTooltip content={<CustomTooltip />} />
                    <Legend verticalAlign="top" height={36} />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="average_heart_rate"
                      name="Avg Heart Rate"
                      stroke="#ef4444"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                      unit=" bpm"
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="average_hrv"
                      name="Avg HRV"
                      stroke="#a855f7"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                      unit=" ms"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="log">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CalendarDays className="mr-2 h-5 w-5" />
                  Detailed Sleep Log
                </CardTitle>
                <CardDescription>
                  A day-by-day breakdown of your sleep data.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[130px]">Date</TableHead>
                        <TableHead>Bedtime</TableHead>
                        <TableHead>Total Sleep</TableHead>
                        <TableHead>Efficiency</TableHead>
                        <TableHead>Readiness</TableHead>
                        <TableHead>Deep</TableHead>
                        <TableHead>Light</TableHead>
                        <TableHead>REM</TableHead>
                        <TableHead className="text-right">Avg HR</TableHead>
                        <TableHead className="text-right">Avg HRV</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {processedData
                        .slice()
                        .reverse()
                        .map(
                          (
                            entry, // Show most recent first
                          ) => (
                            <TableRow key={entry.day}>
                              <TableCell className="font-medium">
                                {entry.formattedDate}
                              </TableCell>
                              <TableCell>
                                {entry.bedtime_start} - {entry.bedtime_end}
                              </TableCell>
                              <TableCell>
                                {formatMinutesToHoursMinutes(
                                  entry.totalSleepMinutes,
                                )}
                              </TableCell>
                              <TableCell>
                                <span
                                  className={getEfficiencyColor(
                                    entry.efficiency,
                                  )}
                                >
                                  {entry.efficiency}%
                                </span>
                              </TableCell>
                              <TableCell>
                                <span
                                  className={getReadinessColor(
                                    entry.readiness_score,
                                  )}
                                >
                                  {entry.readiness_score}
                                </span>
                              </TableCell>
                              <TableCell>
                                {formatMinutesToHoursMinutes(
                                  entry.deepSleepMinutes,
                                )}
                              </TableCell>
                              <TableCell>
                                {formatMinutesToHoursMinutes(
                                  entry.lightSleepMinutes,
                                )}
                              </TableCell>
                              <TableCell>
                                {formatMinutesToHoursMinutes(
                                  entry.remSleepMinutes,
                                )}
                              </TableCell>
                              <TableCell className="text-right">
                                {entry.average_heart_rate.toFixed(1)}
                              </TableCell>
                              <TableCell className="text-right">
                                {entry.average_hrv}
                              </TableCell>
                            </TableRow>
                          ),
                        )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <footer className="mt-12 text-center text-sm text-gray-500">
          <p>
            Oura Sleep Data Visualizer | Powered by React, shadcn/ui, Recharts &
            Lucide Icons.
          </p>
          <p>Data for demonstration purposes only.</p>
        </footer>
      </div>
    </TooltipProvider>
  );
};

export default OuraSleepDashboard;
