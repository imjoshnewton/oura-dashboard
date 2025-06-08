'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon, ChevronLeft, ChevronRight, AlertCircle } from "lucide-react"
import { format, addDays, subDays, isToday, differenceInDays } from "date-fns"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell } from 'recharts'

interface ActivityData {
  day: string;
  score: number;
  active_calories: number;
  steps: number;
  equivalent_walking_distance: number;
  total_calories: number;
  high_activity_time: number;
  medium_activity_time: number;
  low_activity_time: number;
  sedentary_time: number;
  resting_time: number;
  inactivity_alerts: number;
  contributors?: {
    meet_daily_targets: number;
    move_every_hour: number;
    recovery_time: number;
    stay_active: number;
    training_frequency: number;
    training_volume: number;
  };
  target_calories: number;
  target_meters: number;
  meters_to_target: number;
  timestamp?: string;
}

interface OuraActivityDashboardVercelProps {
  activityData: ActivityData[];
}

// Helper function to convert minutes to hours and minutes
const formatTime = (minutes: number) => {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return `${hours}h ${mins}m`
}

export default function OuraActivityDashboardVercel({ activityData }: OuraActivityDashboardVercelProps) {
  const [date, setDate] = useState<Date | undefined>(new Date(activityData[activityData.length - 1].day))
  
  // Get the selected day's data
  const selectedData = activityData.find(d => d.day === format(date || new Date(), 'yyyy-MM-dd')) || activityData[activityData.length - 1]
  
  // Navigation functions
  const goToPreviousDay = () => {
    if (date) {
      const prevDate = subDays(date, 1)
      const prevDateStr = format(prevDate, 'yyyy-MM-dd')
      if (activityData.some(d => d.day === prevDateStr)) {
        setDate(prevDate)
      }
    }
  }
  
  const goToNextDay = () => {
    if (date) {
      const nextDate = addDays(date, 1)
      const nextDateStr = format(nextDate, 'yyyy-MM-dd')
      if (activityData.some(d => d.day === nextDateStr)) {
        setDate(nextDate)
      }
    }
  }
  
  // Check if navigation buttons should be disabled
  const isPrevDisabled = !date || !activityData.some(d => d.day === format(subDays(date, 1), 'yyyy-MM-dd'))
  const isNextDisabled = !date || !activityData.some(d => d.day === format(addDays(date, 1), 'yyyy-MM-dd'))
  
  // Prepare data for activity breakdown chart
  const activityBreakdownData = [
    { name: 'High', value: selectedData.high_activity_time, color: '#22c55e' },
    { name: 'Medium', value: selectedData.medium_activity_time, color: '#84cc16' },
    { name: 'Low', value: selectedData.low_activity_time, color: '#facc15' },
    { name: 'Sedentary', value: selectedData.sedentary_time, color: '#f97316' },
    { name: 'Resting', value: selectedData.resting_time, color: '#8b5cf6' }
  ]
  
  // Prepare data for calorie chart
  const calorieData = [
    { name: 'Active', value: selectedData.active_calories, color: '#22c55e' },
    { name: 'Resting', value: selectedData.total_calories - selectedData.active_calories, color: '#8b5cf6' }
  ]
  
  // Prepare data for contributors radar chart
  const contributorsData = selectedData.contributors 
    ? Object.entries(selectedData.contributors).map(([key, value]) => ({
        subject: key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
        value: value,
        fullMark: 100
      }))
    : []
  
  // Calculate step progress
  const stepProgress = Math.min(100, (selectedData.steps / (selectedData.target_meters / 2)) * 100)
  
  // Calculate distance progress
  const distanceProgress = Math.min(100, ((selectedData.equivalent_walking_distance) / selectedData.target_meters) * 100)
  
  // Calculate calorie progress
  const calorieProgress = Math.min(100, (selectedData.active_calories / selectedData.target_calories) * 100)
  
  // Check if selected date is today
  const selectedDate = date || new Date()
  const isShowingToday = isToday(selectedDate)
  const daysOld = differenceInDays(new Date(), selectedDate)
  
  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex flex-col space-y-4">
        <h1 className="text-3xl font-bold tracking-tight text-center md:text-left">Oura Activity Dashboard</h1>
        
        {!isShowingToday && (
          <div className="flex items-center justify-center md:justify-start space-x-2 text-amber-600 bg-amber-50 border border-amber-200 rounded-lg p-3">
            <AlertCircle className="h-5 w-5" />
            <span className="text-sm font-medium">
              Showing data from {format(selectedDate, 'MMMM d, yyyy')} ({daysOld} day{daysOld !== 1 ? 's' : ''} ago)
            </span>
          </div>
        )}
        
        {selectedData.timestamp && (
          <div className="flex items-center justify-center md:justify-start space-x-2 text-slate-600 bg-slate-50 border border-slate-200 rounded-lg p-2">
            <span className="text-xs font-medium">
              Data calculated at: {format(new Date(selectedData.timestamp), 'h:mm a, MMMM d')}
            </span>
          </div>
        )}
        
        <div className="flex items-center justify-center md:justify-start space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={goToPreviousDay}
            disabled={isPrevDisabled}
            className="h-10 w-10"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className="w-[200px] justify-center text-center font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "MMM d, yyyy") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="center">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
                disabled={(date) => 
                  !activityData.some(d => d.day === format(date, 'yyyy-MM-dd'))
                }
              />
            </PopoverContent>
          </Popover>
          
          <Button
            variant="outline"
            size="icon"
            onClick={goToNextDay}
            disabled={isNextDisabled}
            className="h-10 w-10"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Activity Score Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Activity Score</CardTitle>
            <CardDescription>Daily activity performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-5xl font-bold">{selectedData.score}</div>
                <div className="text-sm text-muted-foreground mt-1">
                  {selectedData.score >= 80 ? 'Excellent' : selectedData.score >= 70 ? 'Good' : 'Needs Improvement'}
                </div>
              </div>
              {activityData.length > 1 && (
                <Badge variant={selectedData.score >= 80 ? "default" : selectedData.score >= 70 ? "secondary" : "destructive"} className="h-8 px-3">
                  {selectedData.score > activityData[0].score ? '+' : ''}
                  {selectedData.score - activityData[0].score}
                </Badge>
              )}
            </div>
            
            <div className="h-[150px] mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={activityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" tickFormatter={(value) => format(new Date(value), 'MMM dd')} />
                  <YAxis domain={[0, 100]} />
                  <Tooltip 
                    formatter={(value) => [`${value}`, 'Score']}
                    labelFormatter={(value) => format(new Date(value), 'MMMM d, yyyy')}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="score" 
                    stroke="#8b5cf6" 
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* Steps & Distance Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Steps & Distance</CardTitle>
            <CardDescription>Daily movement metrics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Steps</span>
                <span className="text-sm font-medium">{selectedData.steps.toLocaleString()} steps</span>
              </div>
              <Progress value={stepProgress} className="h-2" />
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Distance</span>
                <span className="text-sm font-medium">{(selectedData.equivalent_walking_distance / 1000).toFixed(2)} km</span>
              </div>
              <Progress value={distanceProgress} className="h-2" />
              <div className="text-xs text-muted-foreground mt-1">
                Target: {(selectedData.target_meters / 1000).toFixed(2)} km
              </div>
            </div>
            
            <div className="h-[100px] mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={activityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" tickFormatter={(value) => format(new Date(value), 'MMM dd')} />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => [`${(value as number).toLocaleString()}`, 'Steps']}
                    labelFormatter={(value) => format(new Date(value), 'MMMM d, yyyy')}
                  />
                  <Bar dataKey="steps" fill="#8b5cf6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* Calories Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Calories</CardTitle>
            <CardDescription>Energy expenditure</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Active Calories</span>
                <span className="text-sm font-medium">{selectedData.active_calories} kcal</span>
              </div>
              <Progress value={calorieProgress} className="h-2" />
              <div className="text-xs text-muted-foreground mt-1">
                Target: {selectedData.target_calories} kcal
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <div>
                <div className="text-2xl font-bold">{selectedData.total_calories}</div>
                <div className="text-sm text-muted-foreground">Total Calories</div>
              </div>
              
              <div className="h-[100px] w-[100px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={calorieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={25}
                      outerRadius={40}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {calorieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value, name) => [`${value} kcal`, name]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Activity Breakdown Card */}
        <Card>
          <CardHeader>
            <CardTitle>Activity Breakdown</CardTitle>
            <CardDescription>Time spent at different activity levels</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={activityBreakdownData}
                  layout="vertical"
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" />
                  <Tooltip 
                    formatter={(value) => [`${formatTime(value as number)}`, 'Duration']}
                  />
                  <Legend />
                  <Bar dataKey="value">
                    {activityBreakdownData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="grid grid-cols-5 gap-2 mt-4">
              {activityBreakdownData.map((item, index) => (
                <div key={index} className="text-center">
                  <div className="text-xs font-medium">{item.name}</div>
                  <div className="text-sm">{formatTime(item.value)}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        {/* Contributors Card */}
        <Card>
          <CardHeader>
            <CardTitle>Score Contributors</CardTitle>
            <CardDescription>Factors affecting your activity score</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={contributorsData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} />
                  <Radar
                    name="Score"
                    dataKey="value"
                    stroke="#8b5cf6"
                    fill="#8b5cf6"
                    fillOpacity={0.6}
                  />
                  <Tooltip formatter={(value) => [`${value}`, 'Score']} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-4">
              {contributorsData.map((item, index) => (
                <div key={index} className="flex justify-between">
                  <span className="text-sm">{item.subject}</span>
                  <span className="text-sm font-medium">{item.value}/100</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Daily Targets Card */}
        <Card>
          <CardHeader>
            <CardTitle>Daily Targets</CardTitle>
            <CardDescription>Progress towards your goals</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Steps</span>
                <span className="text-sm font-medium">{selectedData.steps.toLocaleString()} / {(selectedData.target_meters / 2).toLocaleString()}</span>
              </div>
              <Progress value={stepProgress} className="h-3" />
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Distance</span>
                <span className="text-sm font-medium">
                  {(selectedData.equivalent_walking_distance / 1000).toFixed(2)} / {(selectedData.target_meters / 1000).toFixed(2)} km
                </span>
              </div>
              <Progress value={distanceProgress} className="h-3" />
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Active Calories</span>
                <span className="text-sm font-medium">{selectedData.active_calories} / {selectedData.target_calories} kcal</span>
              </div>
              <Progress value={calorieProgress} className="h-3" />
            </div>
          </CardContent>
        </Card>
        
        {/* Inactivity Alerts Card */}
        <Card>
          <CardHeader>
            <CardTitle>Inactivity Alerts</CardTitle>
            <CardDescription>Reminders to move throughout the day</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center h-[calc(100%-88px)]">
            <div className={cn(
              "flex items-center justify-center rounded-full w-32 h-32 text-white",
              selectedData.inactivity_alerts === 0 ? "bg-green-500" : 
              selectedData.inactivity_alerts <= 2 ? "bg-yellow-500" : "bg-red-500"
            )}>
              <div className="text-center">
                <div className="text-4xl font-bold">{selectedData.inactivity_alerts}</div>
                <div className="text-sm">Alerts</div>
              </div>
            </div>
            <p className="text-center mt-4 text-sm text-muted-foreground">
              {selectedData.inactivity_alerts === 0 
                ? "Great job staying active throughout the day!" 
                : `You received ${selectedData.inactivity_alerts} inactivity alert${selectedData.inactivity_alerts > 1 ? 's' : ''} today. Try to move more frequently.`}
            </p>
          </CardContent>
        </Card>
        
        {/* Activity Intensity Card */}
        <Card>
          <CardHeader>
            <CardTitle>Activity Intensity</CardTitle>
            <CardDescription>24-hour activity pattern</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={[
                    { time: '00:00', intensity: 10 },
                    { time: '03:00', intensity: 5 },
                    { time: '06:00', intensity: 15 },
                    { time: '09:00', intensity: 40 },
                    { time: '12:00', intensity: 65 },
                    { time: '15:00', intensity: 80 },
                    { time: '18:00', intensity: 50 },
                    { time: '21:00', intensity: 30 },
                    { time: '23:59', intensity: 15 },
                  ]}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Area 
                    type="monotone" 
                    dataKey="intensity" 
                    stroke="#8b5cf6" 
                    fill="#8b5cf6" 
                    fillOpacity={0.6} 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-between mt-4 text-xs text-muted-foreground">
              <div>Midnight</div>
              <div>6 AM</div>
              <div>Noon</div>
              <div>6 PM</div>
              <div>Midnight</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}