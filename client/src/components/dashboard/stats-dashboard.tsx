import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { 
  Activity, 
  TrendingUp, 
  Calendar, 
  Clock, 
  BarChart2,
  LineChart as LineChartIcon
} from 'lucide-react';

// Sample data for demonstration - in a real app, this would come from an API
const weightData = [
  { date: 'Mar 1', weight: 175 },
  { date: 'Mar 5', weight: 173 },
  { date: 'Mar 9', weight: 174 },
  { date: 'Mar 13', weight: 171 },
  { date: 'Mar 17', weight: 169 },
  { date: 'Mar 21', weight: 168 },
];

const workoutData = [
  { day: 'Mon', duration: 45, calories: 320 },
  { day: 'Tue', duration: 0, calories: 0 },
  { day: 'Wed', duration: 30, calories: 250 },
  { day: 'Thu', duration: 60, calories: 450 },
  { day: 'Fri', duration: 0, calories: 0 },
  { day: 'Sat', duration: 90, calories: 680 },
  { day: 'Sun', duration: 40, calories: 300 },
];

const caloriesData = [
  { date: 'Mar 15', consumed: 2100, burned: 2300, target: 2000 },
  { date: 'Mar 16', consumed: 2200, burned: 2150, target: 2000 },
  { date: 'Mar 17', consumed: 1950, burned: 2050, target: 2000 },
  { date: 'Mar 18', consumed: 2300, burned: 2100, target: 2000 },
  { date: 'Mar 19', consumed: 1800, burned: 2200, target: 2000 },
  { date: 'Mar 20', consumed: 2050, burned: 2250, target: 2000 },
  { date: 'Mar 21', consumed: 1900, burned: 2300, target: 2000 },
];

const statsCards = [
  {
    title: "Average Daily Steps",
    value: "8,354",
    change: "+12%",
    icon: <Activity className="h-4 w-4 text-primary" />,
  },
  {
    title: "Total Workouts",
    value: "24",
    change: "+4",
    icon: <TrendingUp className="h-4 w-4 text-secondary" />,
  },
  {
    title: "Workout Streak",
    value: "9 days",
    change: "+2",
    icon: <Calendar className="h-4 w-4 text-accent" />,
  },
  {
    title: "Avg. Workout Duration",
    value: "43 min",
    change: "+5 min",
    icon: <Clock className="h-4 w-4 text-secondary" />,
  },
];

export default function StatsDashboard() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((card, index) => (
          <Card key={index} className="bg-card">
            <CardContent className="pt-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-muted-foreground">{card.title}</span>
                {card.icon}
              </div>
              <div className="text-2xl font-bold">{card.value}</div>
              <div className="text-xs text-primary mt-1">{card.change} from last month</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="weight" className="bg-card rounded-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Your Progress</h3>
          <TabsList>
            <TabsTrigger value="weight" className="flex items-center">
              <LineChartIcon className="h-4 w-4 mr-1" />
              <span>Weight</span>
            </TabsTrigger>
            <TabsTrigger value="workouts" className="flex items-center">
              <BarChart2 className="h-4 w-4 mr-1" />
              <span>Workouts</span>
            </TabsTrigger>
            <TabsTrigger value="calories" className="flex items-center">
              <Activity className="h-4 w-4 mr-1" />
              <span>Calories</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="weight" className="p-2">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weightData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="date" />
                <YAxis domain={['dataMin - 5', 'dataMax + 5']} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    borderColor: 'hsl(var(--border))',
                    color: 'hsl(var(--foreground))'
                  }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="weight" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={3}
                  dot={{ fill: 'hsl(var(--primary))', r: 5 }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="text-center text-sm text-muted-foreground mt-4">
            Weight tracked over the past 21 days
          </div>
        </TabsContent>

        <TabsContent value="workouts" className="p-2">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={workoutData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="day" />
                <YAxis yAxisId="left" orientation="left" stroke="hsl(var(--secondary))" />
                <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--accent))" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    borderColor: 'hsl(var(--border))',
                    color: 'hsl(var(--foreground))'
                  }} 
                />
                <Legend />
                <Bar 
                  yAxisId="left" 
                  dataKey="duration" 
                  name="Duration (min)" 
                  fill="hsl(var(--secondary))" 
                  radius={[4, 4, 0, 0]} 
                />
                <Bar 
                  yAxisId="right" 
                  dataKey="calories" 
                  name="Calories Burned" 
                  fill="hsl(var(--accent))" 
                  radius={[4, 4, 0, 0]} 
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="text-center text-sm text-muted-foreground mt-4">
            Workout duration and calories burned over the past week
          </div>
        </TabsContent>

        <TabsContent value="calories" className="p-2">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={caloriesData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    borderColor: 'hsl(var(--border))',
                    color: 'hsl(var(--foreground))'
                  }} 
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="consumed"
                  name="Calories Consumed"
                  stroke="hsl(var(--accent))"
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--accent))', r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="burned"
                  name="Calories Burned"
                  stroke="hsl(var(--secondary))"
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--secondary))', r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="target"
                  name="Calorie Target"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="text-center text-sm text-muted-foreground mt-4">
            Calorie intake vs. burned over the past week
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}