import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  Legend
} from 'recharts';
import { Moon, Heart, Zap, Clock, TrendingUp, Activity } from 'lucide-react';
import { getLastNDaysData } from '@/data/sleepData';

// Get the last 7 days of sleep data
const rawSleepData = getLastNDaysData(7);

// Helper function to parse duration strings to minutes
function parseDuration(durationStr: string): number {
  if (!durationStr) return 0;
  let totalMinutes = 0;
  
  const hourMatch = durationStr.match(/(\d+)\s*hour/);
  const minuteMatch = durationStr.match(/(\d+)\s*minute/);
  const secondMatch = durationStr.match(/(\d+)\s*second/);
  
  if (hourMatch) totalMinutes += parseInt(hourMatch[1]) * 60;
  if (minuteMatch) totalMinutes += parseInt(minuteMatch[1]);
  if (secondMatch) totalMinutes += Math.round(parseInt(secondMatch[1]) / 60);
  
  return totalMinutes;
}

// Helper function to format minutes back to hours and minutes
function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
}

// Helper function to format date for display
function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// Process data for charts
const processedData = rawSleepData.map(day => ({
  ...day,
  date: formatDate(day.day),
  totalSleepMinutes: parseDuration(day.total_sleep_duration),
  deepSleepMinutes: parseDuration(day.deep_sleep_duration),
  lightSleepMinutes: parseDuration(day.light_sleep_duration),
  remSleepMinutes: parseDuration(day.rem_sleep_duration),
  awakeMinutes: parseDuration(day.awake_time || "0 minutes")
}));

// Calculate averages
const avgTotalSleep = processedData.reduce((sum, day) => sum + day.totalSleepMinutes, 0) / processedData.length;
const avgEfficiency = processedData.reduce((sum, day) => sum + day.efficiency, 0) / processedData.length;
const avgReadiness = processedData.reduce((sum, day) => sum + day.readiness_score, 0) / processedData.length;
const avgHeartRate = processedData.reduce((sum, day) => sum + day.average_heart_rate, 0) / processedData.length;

// Sleep stages pie chart data (using averages)
const avgDeepSleep = processedData.reduce((sum, day) => sum + day.deepSleepMinutes, 0) / processedData.length;
const avgLightSleep = processedData.reduce((sum, day) => sum + day.lightSleepMinutes, 0) / processedData.length;
const avgRemSleep = processedData.reduce((sum, day) => sum + day.remSleepMinutes, 0) / processedData.length;

const sleepStagesData = [
  { name: 'Deep Sleep', value: avgDeepSleep, color: '#1e3a8a' },
  { name: 'Light Sleep', value: avgLightSleep, color: '#3b82f6' },
  { name: 'REM Sleep', value: avgRemSleep, color: '#60a5fa' }
];

// Colors for charts
const COLORS = ['#1e3a8a', '#3b82f6', '#60a5fa'];

// Readiness score color function
function getReadinessColor(score: number): string {
  if (score >= 85) return 'bg-green-500';
  if (score >= 70) return 'bg-yellow-500';
  return 'bg-red-500';
}

function getReadinessBadgeColor(score: number): "default" | "secondary" | "destructive" | "outline" {
  if (score >= 85) return 'default';
  if (score >= 70) return 'secondary';
  return 'destructive';
}

export default function OuraSleepDashboardClaude() {
  const [selectedMetric, setSelectedMetric] = useState('sleep');
  
  const latestNight = processedData[processedData.length - 1];

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-6 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Sleep Analytics Dashboard</h1>
        <p className="text-gray-600">Your Oura ring data from May 21-27, 2025</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Sleep Duration</CardTitle>
            <Moon className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{formatDuration(avgTotalSleep)}</div>
            <p className="text-xs text-gray-600 mt-1">Last night: {formatDuration(latestNight.totalSleepMinutes)}</p>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Sleep Efficiency</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{Math.round(avgEfficiency)}%</div>
            <Progress value={avgEfficiency} className="mt-2" />
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Readiness</CardTitle>
            <Zap className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{Math.round(avgReadiness)}</div>
            <Badge variant={getReadinessBadgeColor(avgReadiness)} className="mt-2">
              {avgReadiness >= 85 ? 'Excellent' : avgReadiness >= 70 ? 'Good' : 'Poor'}
            </Badge>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Heart Rate</CardTitle>
            <Heart className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{Math.round(avgHeartRate)} bpm</div>
            <p className="text-xs text-gray-600 mt-1">During sleep</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sleep Duration Trend */}
        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-600" />
              Sleep Duration Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={processedData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip 
                  formatter={(value: any) => [formatDuration(value as number), 'Sleep Duration']}
                  labelStyle={{ color: '#1f2937' }}
                  contentStyle={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="totalSleepMinutes" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Sleep Efficiency & Readiness */}
        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-green-600" />
              Efficiency & Readiness
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={processedData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip 
                  labelStyle={{ color: '#1f2937' }}
                  contentStyle={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="efficiency" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  name="Sleep Efficiency (%)"
                />
                <Line 
                  type="monotone" 
                  dataKey="readiness_score" 
                  stroke="#f59e0b" 
                  strokeWidth={2}
                  name="Readiness Score"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Sleep Stages Breakdown */}
        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Average Sleep Stages</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={sleepStagesData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }: any) => `${name}: ${formatDuration(value)}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {sleepStagesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: any) => formatDuration(value as number)} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Daily Readiness Scores */}
        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Daily Readiness Scores</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={processedData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip 
                  labelStyle={{ color: '#1f2937' }}
                  contentStyle={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}
                />
                <Bar dataKey="readiness_score" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Summary */}
      <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Weekly Sleep Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Best Night</h3>
              <p className="text-sm text-gray-600">May 24 - {formatDuration(Math.max(...processedData.map(d => d.totalSleepMinutes)))}</p>
              <Badge variant="default" className="mt-1">7h 47m sleep</Badge>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Sleep Consistency</h3>
              <p className="text-sm text-gray-600">Varied bedtimes</p>
              <Badge variant="secondary" className="mt-1">Room for improvement</Badge>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Recovery</h3>
              <p className="text-sm text-gray-600">Average readiness: {Math.round(avgReadiness)}</p>
              <Badge variant={getReadinessBadgeColor(avgReadiness)} className="mt-1">
                {avgReadiness >= 70 ? 'Good recovery' : 'Needs attention'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}