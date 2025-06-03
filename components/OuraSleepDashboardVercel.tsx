"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { format, parseISO } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  MoonIcon,
  SunIcon,
  ActivityIcon,
  HeartIcon,
  ClockIcon,
  BarChart2Icon,
  CalendarIcon,
} from "lucide-react";
import { SleepData } from "@/data/sleepData";

interface OuraSleepDashboardVercelProps {
  sleepData: SleepData[];
  timeFrame?: number;
}

// Helper function to parse duration strings to minutes
const parseDurationToMinutes = (durationStr: string) => {
  const regex =
    /(?:(\d+) hours?,\s*)?(?:(\d+) minutes?(?:,\s*(\d+) seconds?)?)?/;
  const match = durationStr.match(regex);

  if (!match) return 0;

  const hours = match[1] ? parseInt(match[1], 10) : 0;
  const minutes = match[2] ? parseInt(match[2], 10) : 0;

  return hours * 60 + minutes;
};

export default function OuraSleepDashboardVercel({
  sleepData,
  timeFrame = 7,
}: OuraSleepDashboardVercelProps) {
  const [selectedTimeFrame, setSelectedTimeFrame] = useState(timeFrame);

  // Filter data based on selected time frame
  const filteredData = sleepData.slice(-selectedTimeFrame);

  // Process data for charts
  const processedData = filteredData.map((entry) => {
    const date = format(parseISO(entry.day), "MMM dd");
    const totalSleepMinutes = parseDurationToMinutes(
      entry.total_sleep_duration,
    );
    const deepSleepMinutes = parseDurationToMinutes(entry.deep_sleep_duration);
    const lightSleepMinutes = parseDurationToMinutes(
      entry.light_sleep_duration,
    );
    const remSleepMinutes = parseDurationToMinutes(entry.rem_sleep_duration);

    return {
      date,
      day: entry.day,
      totalSleepMinutes,
      deepSleepMinutes,
      lightSleepMinutes,
      remSleepMinutes,
      efficiency: entry.efficiency,
      readinessScore: entry.readiness_score,
      averageHeartRate: entry.average_heart_rate,
      averageHrv: entry.average_hrv,
      bedtimeStart: entry.bedtime_start,
      bedtimeEnd: entry.bedtime_end,
    };
  });

  // Calculate averages for the week
  const calculateAverages = () => {
    const totalEntries = processedData.length;

    const avgSleep =
      processedData.reduce((sum, entry) => sum + entry.totalSleepMinutes, 0) /
      totalEntries;
    const avgEfficiency =
      processedData.reduce((sum, entry) => sum + entry.efficiency, 0) /
      totalEntries;
    const avgReadiness =
      processedData.reduce((sum, entry) => sum + entry.readinessScore, 0) /
      totalEntries;
    const avgHr =
      processedData.reduce((sum, entry) => sum + entry.averageHeartRate, 0) /
      totalEntries;
    const avgHrv =
      processedData.reduce((sum, entry) => sum + entry.averageHrv, 0) /
      totalEntries;

    return {
      avgSleep: Math.round(avgSleep),
      avgEfficiency: Math.round(avgEfficiency),
      avgReadiness: Math.round(avgReadiness),
      avgHr: Math.round(avgHr * 10) / 10,
      avgHrv: Math.round(avgHrv * 10) / 10,
    };
  };

  const averages = calculateAverages();

  // Format minutes to hours and minutes
  const formatMinutes = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  // Get sleep quality label based on efficiency
  const getSleepQualityLabel = (efficiency: number) => {
    if (efficiency >= 90) return { label: "Excellent", color: "bg-green-500" };
    if (efficiency >= 80) return { label: "Good", color: "bg-emerald-500" };
    if (efficiency >= 70) return { label: "Fair", color: "bg-yellow-500" };
    return { label: "Poor", color: "bg-red-500" };
  };

  // Get readiness label based on score
  const getReadinessLabel = (score: number) => {
    if (score >= 75) return { label: "Optimal", color: "bg-green-500" };
    if (score >= 65) return { label: "Good", color: "bg-emerald-500" };
    if (score >= 55) return { label: "Moderate", color: "bg-yellow-500" };
    return { label: "Low", color: "bg-red-500" };
  };

  const [selectedDay, setSelectedDay] = useState(
    processedData[processedData.length - 1],
  );

  const timeFrameOptions = [
    { value: 7, label: "Last 7 days" },
    { value: 14, label: "Last 14 days" },
    { value: 21, label: "Last 21 days" },
    { value: 30, label: "Last 30 days" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="sticky top-0 z-10 border-b bg-white dark:bg-gray-950 dark:border-gray-800">
        <div className="container flex items-center justify-between sm:h-16 px-4 pb-4 mx-auto flex-wrap gap-y-2">
          <div className="flex items-center gap-2">
            <MoonIcon className="w-6 h-6 text-purple-600" />
            <h1 className="text-xl font-bold">Oura Sleep Dashboard</h1>
          </div>
          <div className="flex items-center gap-4 sm:w-auto w-full">
            <Select
              value={selectedTimeFrame.toString()}
              onValueChange={(value) => setSelectedTimeFrame(parseInt(value))}
            >
              <SelectTrigger className="w-full sm:w-[140px]">
                <CalendarIcon className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {timeFrameOptions.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value.toString()}
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Avg. Sleep Duration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <ClockIcon className="w-5 h-5 mr-2 text-purple-600" />
                <div className="text-2xl font-bold">
                  {formatMinutes(averages.avgSleep)}
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1">Weekly average</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Avg. Sleep Efficiency
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <ActivityIcon className="w-5 h-5 mr-2 text-emerald-600" />
                <div className="text-2xl font-bold">
                  {averages.avgEfficiency}%
                </div>
              </div>
              <Progress value={averages.avgEfficiency} className="h-2 mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Avg. Readiness
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <BarChart2Icon className="w-5 h-5 mr-2 text-amber-600" />
                <div className="text-2xl font-bold">
                  {averages.avgReadiness}
                </div>
              </div>
              <Progress value={averages.avgReadiness} className="h-2 mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Avg. Heart Rate & HRV
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <HeartIcon className="w-5 h-5 mr-2 text-rose-600" />
                <div className="text-2xl font-bold">{averages.avgHr} bpm</div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                HRV: {averages.avgHrv} ms
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-3 mb-6">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Sleep Duration</CardTitle>
              <CardDescription>
                Total sleep time over the past week
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={processedData}
                    margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="date" />
                    <YAxis
                      tickFormatter={(value) => `${Math.floor(value / 60)}h`}
                    />
                    <Tooltip
                      formatter={(value: number) => [
                        `${formatMinutes(value)}`,
                        "Duration",
                      ]}
                      labelFormatter={(label) => `Date: ${label}`}
                    />
                    <Legend />
                    <Bar
                      dataKey="deepSleepMinutes"
                      name="Deep Sleep"
                      stackId="a"
                      fill="#7c3aed"
                      radius={[0, 0, 0, 0]}
                    />
                    <Bar
                      dataKey="remSleepMinutes"
                      name="REM Sleep"
                      stackId="a"
                      fill="#a78bfa"
                      radius={[0, 0, 0, 0]}
                    />
                    <Bar
                      dataKey="lightSleepMinutes"
                      name="Light Sleep"
                      stackId="a"
                      fill="#c4b5fd"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Sleep Efficiency</CardTitle>
              <CardDescription>Quality of sleep percentage</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={processedData}
                    margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="date" />
                    <YAxis domain={[50, 100]} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="efficiency"
                      name="Efficiency (%)"
                      stroke="#10b981"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-3 mb-6">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Heart Rate & HRV</CardTitle>
              <CardDescription>Nightly averages</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={processedData}
                    margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="date" />
                    <YAxis yAxisId="left" domain={[50, 80]} />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      domain={[10, 40]}
                    />
                    <Tooltip />
                    <Legend />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="averageHeartRate"
                      name="Heart Rate (bpm)"
                      stroke="#ef4444"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="averageHrv"
                      name="HRV (ms)"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Readiness Score</CardTitle>
              <CardDescription>Daily recovery status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={processedData}
                    margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="date" />
                    <YAxis domain={[50, 100]} />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="readinessScore"
                      name="Readiness"
                      stroke="#f59e0b"
                      fill="#fcd34d"
                      fillOpacity={0.6}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-12">
          <Card className="md:col-span-8">
            <CardHeader>
              <CardTitle>Daily Sleep Details</CardTitle>
              <CardDescription>
                Select a day to view detailed sleep information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-6">
                {processedData.map((day) => (
                  <Button
                    key={day.day}
                    variant={
                      selectedDay.day === day.day ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => setSelectedDay(day)}
                  >
                    {day.date}
                  </Button>
                ))}
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h3 className="font-medium mb-2">Sleep Time</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Bedtime:</span>
                      <span className="font-medium">
                        {selectedDay.bedtimeStart}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Wake-up:</span>
                      <span className="font-medium">
                        {selectedDay.bedtimeEnd}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Total Sleep:</span>
                      <span className="font-medium">
                        {formatMinutes(selectedDay.totalSleepMinutes)}
                      </span>
                    </div>
                  </div>

                  <Separator className="my-4" />

                  <h3 className="font-medium mb-2">Sleep Quality</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500">Efficiency:</span>
                      <div className="flex items-center">
                        <span className="font-medium mr-2">
                          {selectedDay.efficiency}%
                        </span>
                        <Badge
                          className={
                            getSleepQualityLabel(selectedDay.efficiency).color
                          }
                        >
                          {getSleepQualityLabel(selectedDay.efficiency).label}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500">Readiness:</span>
                      <div className="flex items-center">
                        <span className="font-medium mr-2">
                          {selectedDay.readinessScore}
                        </span>
                        <Badge
                          className={
                            getReadinessLabel(selectedDay.readinessScore).color
                          }
                        >
                          {getReadinessLabel(selectedDay.readinessScore).label}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Sleep Stages</h3>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-gray-500">Deep Sleep</span>
                        <span className="font-medium">
                          {formatMinutes(selectedDay.deepSleepMinutes)}
                        </span>
                      </div>
                      <Progress
                        value={
                          (selectedDay.deepSleepMinutes /
                            selectedDay.totalSleepMinutes) *
                          100
                        }
                        className="h-2 bg-gray-200"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-gray-500">REM Sleep</span>
                        <span className="font-medium">
                          {formatMinutes(selectedDay.remSleepMinutes)}
                        </span>
                      </div>
                      <Progress
                        value={
                          (selectedDay.remSleepMinutes /
                            selectedDay.totalSleepMinutes) *
                          100
                        }
                        className="h-2 bg-gray-200"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-gray-500">Light Sleep</span>
                        <span className="font-medium">
                          {formatMinutes(selectedDay.lightSleepMinutes)}
                        </span>
                      </div>
                      <Progress
                        value={
                          (selectedDay.lightSleepMinutes /
                            selectedDay.totalSleepMinutes) *
                          100
                        }
                        className="h-2 bg-gray-200"
                      />
                    </div>
                  </div>

                  <Separator className="my-4" />

                  <h3 className="font-medium mb-2">Vitals</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Avg. Heart Rate:</span>
                      <span className="font-medium">
                        {selectedDay.averageHeartRate} bpm
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Avg. HRV:</span>
                      <span className="font-medium">
                        {selectedDay.averageHrv} ms
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-4">
            <CardHeader>
              <CardTitle>Weekly Insights</CardTitle>
              <CardDescription>Sleep patterns and trends</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">
                    Sleep Duration Trend
                  </h3>
                  <div className="h-[100px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={processedData}
                        margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                      >
                        <Line
                          type="monotone"
                          dataKey="totalSleepMinutes"
                          stroke="#7c3aed"
                          strokeWidth={2}
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">
                    Sleep Quality Distribution
                  </h3>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-purple-100 dark:bg-purple-950 p-2 rounded-md">
                      <div className="text-lg font-bold text-purple-700 dark:text-purple-400">
                        {Math.round(
                          processedData.reduce(
                            (sum, day) =>
                              sum +
                              (day.deepSleepMinutes / day.totalSleepMinutes) *
                                100,
                            0,
                          ) / processedData.length,
                        )}
                        %
                      </div>
                      <div className="text-xs text-gray-500">Deep</div>
                    </div>
                    <div className="bg-purple-100 dark:bg-purple-950 p-2 rounded-md">
                      <div className="text-lg font-bold text-purple-700 dark:text-purple-400">
                        {Math.round(
                          processedData.reduce(
                            (sum, day) =>
                              sum +
                              (day.remSleepMinutes / day.totalSleepMinutes) *
                                100,
                            0,
                          ) / processedData.length,
                        )}
                        %
                      </div>
                      <div className="text-xs text-gray-500">REM</div>
                    </div>
                    <div className="bg-purple-100 dark:bg-purple-950 p-2 rounded-md">
                      <div className="text-lg font-bold text-purple-700 dark:text-purple-400">
                        {Math.round(
                          processedData.reduce(
                            (sum, day) =>
                              sum +
                              (day.lightSleepMinutes / day.totalSleepMinutes) *
                                100,
                            0,
                          ) / processedData.length,
                        )}
                        %
                      </div>
                      <div className="text-xs text-gray-500">Light</div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">
                    Sleep Consistency
                  </h3>
                  <div className="space-y-2">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span>Bedtime Variance</span>
                        <span>Moderate</span>
                      </div>
                      <Progress value={65} className="h-1.5" />
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span>Wake-up Consistency</span>
                        <span>Good</span>
                      </div>
                      <Progress value={80} className="h-1.5" />
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">
                    Recommendations
                  </h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <div className="rounded-full bg-amber-100 p-1 mt-0.5">
                        <SunIcon className="h-3 w-3 text-amber-600" />
                      </div>
                      <span>
                        Try to maintain a more consistent bedtime schedule
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="rounded-full bg-purple-100 p-1 mt-0.5">
                        <MoonIcon className="h-3 w-3 text-purple-600" />
                      </div>
                      <span>Your deep sleep percentage is optimal</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

