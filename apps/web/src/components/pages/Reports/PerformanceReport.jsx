'use client';

/**
 * PerformanceReport Component
 * Displays performance metrics and KPIs for operations
 */

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { DatePicker } from '../../molecules/DatePicker/index';
import { Button } from '../../ui/button';
import { Download, RefreshCw } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

// Sample data for performance metrics
const deliveryPerformanceData = [
  { name: 'Mon', onTime: 85, delayed: 15 },
  { name: 'Tue', onTime: 88, delayed: 12 },
  { name: 'Wed', onTime: 90, delayed: 10 },
  { name: 'Thu', onTime: 84, delayed: 16 },
  { name: 'Fri', onTime: 92, delayed: 8 },
  { name: 'Sat', onTime: 78, delayed: 22 },
  { name: 'Sun', onTime: 82, delayed: 18 },
];

const courierPerformanceData = [
  { name: 'Team A', deliveries: 120, rating: 4.7 },
  { name: 'Team B', deliveries: 98, rating: 4.5 },
  { name: 'Team C', deliveries: 86, rating: 4.8 },
  { name: 'Team D', deliveries: 99, rating: 4.2 },
  { name: 'Team E', deliveries: 85, rating: 4.6 },
];

const operationalMetricsData = [
  { date: '2025-05-01', pickups: 120, deliveries: 110, returns: 5 },
  { date: '2025-05-02', pickups: 115, deliveries: 105, returns: 8 },
  { date: '2025-05-03', pickups: 125, deliveries: 118, returns: 6 },
  { date: '2025-05-04', pickups: 130, deliveries: 125, returns: 4 },
  { date: '2025-05-05', pickups: 140, deliveries: 132, returns: 7 },
  { date: '2025-05-06', pickups: 135, deliveries: 128, returns: 9 },
  { date: '2025-05-07', pickups: 145, deliveries: 138, returns: 6 },
];

/**
 * PerformanceReport component
 * @returns {React.ReactElement} PerformanceReport component
 */
const PerformanceReport = () => {
  const [dateRange, setDateRange] = useState({
    from: new Date(2025, 4, 1), // May 1, 2025
    to: new Date(2025, 4, 7),   // May 7, 2025
  });
  const [region, setRegion] = useState('all');
  const [isLoading, setIsLoading] = useState(false);

  // Handle refresh data
  const handleRefresh = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  // Handle export data
  const handleExport = () => {
    // Implementation for exporting data
    alert('Exporting data...');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <DatePicker
            dateRange={dateRange}
            onChange={setDateRange}
            label="Date Range"
          />
          <Select value={region} onValueChange={setRegion}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Region" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Regions</SelectItem>
              <SelectItem value="jakarta">Jakarta</SelectItem>
              <SelectItem value="bandung">Bandung</SelectItem>
              <SelectItem value="surabaya">Surabaya</SelectItem>
              <SelectItem value="medan">Medan</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleRefresh} disabled={isLoading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <Tabs defaultValue="delivery" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="delivery">Delivery Performance</TabsTrigger>
          <TabsTrigger value="courier">Courier Performance</TabsTrigger>
          <TabsTrigger value="operational">Operational Metrics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="delivery" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Delivery Performance</CardTitle>
              <CardDescription>
                On-time delivery performance metrics for the selected period
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={deliveryPerformanceData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="onTime" stackId="a" fill="#2563EB" name="On Time" />
                    <Bar dataKey="delayed" stackId="a" fill="#EF4444" name="Delayed" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold">87%</div>
                    <p className="text-xs text-muted-foreground">On-Time Delivery</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold">13%</div>
                    <p className="text-xs text-muted-foreground">Delayed Delivery</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold">4.6</div>
                    <p className="text-xs text-muted-foreground">Average Rating</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold">98%</div>
                    <p className="text-xs text-muted-foreground">Successful Delivery</p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="courier" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Courier Performance</CardTitle>
              <CardDescription>
                Performance metrics for courier teams
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={courierPerformanceData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis yAxisId="left" orientation="left" stroke="#2563EB" />
                    <YAxis yAxisId="right" orientation="right" stroke="#10B981" />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="deliveries" fill="#2563EB" name="Deliveries" />
                    <Bar yAxisId="right" dataKey="rating" fill="#10B981" name="Rating" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold">97.6</div>
                    <p className="text-xs text-muted-foreground">Avg. Deliveries per Team</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold">4.56</div>
                    <p className="text-xs text-muted-foreground">Avg. Rating</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold">Team C</div>
                    <p className="text-xs text-muted-foreground">Highest Rated Team</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold">Team A</div>
                    <p className="text-xs text-muted-foreground">Most Deliveries</p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="operational" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Operational Metrics</CardTitle>
              <CardDescription>
                Daily operational metrics for pickups, deliveries, and returns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={operationalMetricsData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="pickups" stroke="#2563EB" name="Pickups" />
                    <Line type="monotone" dataKey="deliveries" stroke="#10B981" name="Deliveries" />
                    <Line type="monotone" dataKey="returns" stroke="#EF4444" name="Returns" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold">130</div>
                    <p className="text-xs text-muted-foreground">Avg. Daily Pickups</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold">122.3</div>
                    <p className="text-xs text-muted-foreground">Avg. Daily Deliveries</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold">6.4</div>
                    <p className="text-xs text-muted-foreground">Avg. Daily Returns</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold">94.1%</div>
                    <p className="text-xs text-muted-foreground">Delivery Success Rate</p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PerformanceReport;
