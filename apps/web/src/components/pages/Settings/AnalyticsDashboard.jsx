"use client";

/**
 * Analytics Dashboard Component
 * Displays analytics data and insights for the application
 */

import React, { useState, useEffect } from 'react';
import { analyticsService } from '../../../utils/analyticsService';
import { useAnalytics } from '../../../hooks/useAnalytics';
import Typography from '../../atoms/Typography';
import Card from '../../molecules/Card';
import Tabs from '../../molecules/Tabs';
import { BarChart, LineChart, PieChart, DoughnutChart } from '../../organisms/Chart';

const AnalyticsDashboard = () => {
  const analytics = useAnalytics({ componentName: 'AnalyticsDashboard' });
  const [analyticsData, setAnalyticsData] = useState({
    pageViews: [],
    userActions: [],
    errors: [],
    performance: [],
    featureUsage: [],
    businessProcesses: [],
  });
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('7d'); // 1d, 7d, 30d, 90d

  // Track component mount
  useEffect(() => {
    analytics.trackFeature(
      analytics.EVENT_ACTIONS.VIEW,
      'AnalyticsDashboard',
      { timeRange }
    );
  }, []);

  // Load analytics data
  useEffect(() => {
    // In a real implementation, this would fetch data from an API
    // For now, we'll use local storage data
    const loadAnalyticsData = () => {
      const storedEvents = analyticsService.getStoredEvents();
      
      // Filter events by time range
      const now = new Date();
      const rangeInDays = timeRange === '1d' ? 1 : 
                          timeRange === '7d' ? 7 : 
                          timeRange === '30d' ? 30 : 90;
      
      const rangeStart = new Date(now);
      rangeStart.setDate(now.getDate() - rangeInDays);
      
      const filteredEvents = storedEvents.filter(event => {
        const eventDate = new Date(event.timestamp);
        return eventDate >= rangeStart;
      });
      
      // Group events by category
      const pageViews = filteredEvents.filter(
        event => event.category === analyticsService.EVENT_CATEGORIES.PAGE_VIEW
      );
      
      const userActions = filteredEvents.filter(
        event => event.category === analyticsService.EVENT_CATEGORIES.USER_ACTION
      );
      
      const errors = filteredEvents.filter(
        event => event.category === analyticsService.EVENT_CATEGORIES.ERROR
      );
      
      const performance = filteredEvents.filter(
        event => event.category === analyticsService.EVENT_CATEGORIES.PERFORMANCE
      );
      
      const featureUsage = filteredEvents.filter(
        event => event.category === analyticsService.EVENT_CATEGORIES.FEATURE_USAGE
      );
      
      const businessProcesses = filteredEvents.filter(
        event => event.category === analyticsService.EVENT_CATEGORIES.BUSINESS_PROCESS
      );
      
      setAnalyticsData({
        pageViews,
        userActions,
        errors,
        performance,
        featureUsage,
        businessProcesses,
      });
    };
    
    loadAnalyticsData();
    
    // Track time range change
    if (timeRange) {
      analytics.trackAction(
        analytics.EVENT_ACTIONS.FILTER,
        'AnalyticsDashboard_TimeRange',
        { timeRange }
      );
    }
  }, [timeRange]);

  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    analytics.trackNavigation(
      analytics.EVENT_ACTIONS.NAVIGATE,
      `AnalyticsDashboard_Tab_${tab}`,
      { previousTab: activeTab }
    );
  };

  // Handle time range change
  const handleTimeRangeChange = (range) => {
    setTimeRange(range);
  };

  // Prepare chart data
  const preparePageViewsData = () => {
    // Group page views by day
    const pageViewsByDay = {};
    
    analyticsData.pageViews.forEach(event => {
      const date = new Date(event.timestamp).toLocaleDateString();
      pageViewsByDay[date] = (pageViewsByDay[date] || 0) + 1;
    });
    
    return {
      labels: Object.keys(pageViewsByDay),
      datasets: [
        {
          label: 'Page Views',
          data: Object.values(pageViewsByDay),
          backgroundColor: '#2563EB',
        },
      ],
    };
  };
  
  const prepareUserActionsData = () => {
    // Group user actions by type
    const actionsByType = {};
    
    analyticsData.userActions.forEach(event => {
      actionsByType[event.action] = (actionsByType[event.action] || 0) + 1;
    });
    
    return {
      labels: Object.keys(actionsByType),
      datasets: [
        {
          label: 'User Actions',
          data: Object.values(actionsByType),
          backgroundColor: [
            '#2563EB',
            '#10B981',
            '#F59E0B',
            '#EF4444',
            '#8B5CF6',
          ],
        },
      ],
    };
  };
  
  const prepareErrorsData = () => {
    // Group errors by type
    const errorsByType = {};
    
    analyticsData.errors.forEach(event => {
      errorsByType[event.action] = (errorsByType[event.action] || 0) + 1;
    });
    
    return {
      labels: Object.keys(errorsByType),
      datasets: [
        {
          label: 'Errors',
          data: Object.values(errorsByType),
          backgroundColor: '#EF4444',
        },
      ],
    };
  };
  
  const preparePerformanceData = () => {
    // Group performance metrics by name
    const performanceByMetric = {};
    
    analyticsData.performance.forEach(event => {
      if (event.data && event.data.metric_name) {
        if (!performanceByMetric[event.data.metric_name]) {
          performanceByMetric[event.data.metric_name] = [];
        }
        
        performanceByMetric[event.data.metric_name].push({
          value: event.data.metric_value,
          timestamp: event.timestamp,
        });
      }
    });
    
    // Calculate averages
    const metricNames = Object.keys(performanceByMetric);
    const metricAverages = metricNames.map(name => {
      const values = performanceByMetric[name].map(item => item.value);
      const sum = values.reduce((a, b) => a + b, 0);
      return sum / values.length;
    });
    
    return {
      labels: metricNames,
      datasets: [
        {
          label: 'Average Performance (ms)',
          data: metricAverages,
          backgroundColor: '#10B981',
        },
      ],
    };
  };
  
  const prepareFeatureUsageData = () => {
    // Group feature usage by feature name
    const featuresByName = {};
    
    analyticsData.featureUsage.forEach(event => {
      featuresByName[event.label] = (featuresByName[event.label] || 0) + 1;
    });
    
    return {
      labels: Object.keys(featuresByName),
      datasets: [
        {
          label: 'Feature Usage',
          data: Object.values(featuresByName),
          backgroundColor: [
            '#2563EB',
            '#10B981',
            '#F59E0B',
            '#EF4444',
            '#8B5CF6',
          ],
        },
      ],
    };
  };
  
  const prepareBusinessProcessesData = () => {
    // Group business processes by process name
    const processesByName = {};
    
    analyticsData.businessProcesses.forEach(event => {
      processesByName[event.label] = (processesByName[event.label] || 0) + 1;
    });
    
    return {
      labels: Object.keys(processesByName),
      datasets: [
        {
          label: 'Business Processes',
          data: Object.values(processesByName),
          backgroundColor: [
            '#2563EB',
            '#10B981',
            '#F59E0B',
            '#EF4444',
            '#8B5CF6',
          ],
        },
      ],
    };
  };

  // Calculate summary metrics
  const totalPageViews = analyticsData.pageViews.length;
  const totalUserActions = analyticsData.userActions.length;
  const totalErrors = analyticsData.errors.length;
  const uniquePages = new Set(analyticsData.pageViews.map(event => event.label)).size;
  const uniqueUsers = new Set(analyticsData.pageViews.map(event => event.userId)).size;
  
  // Calculate bounce rate (users who viewed only one page)
  const userPageViews = {};
  analyticsData.pageViews.forEach(event => {
    if (event.userId) {
      userPageViews[event.userId] = (userPageViews[event.userId] || 0) + 1;
    }
  });
  
  const usersWithOnePageView = Object.values(userPageViews).filter(count => count === 1).length;
  const bounceRate = uniqueUsers > 0 ? (usersWithOnePageView / uniqueUsers) * 100 : 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Typography variant="h1">Analytics Dashboard</Typography>
        
        <div className="flex space-x-2">
          <button
            className={`px-3 py-1 rounded ${timeRange === '1d' ? 'bg-primary text-white' : 'bg-gray-100'}`}
            onClick={() => handleTimeRangeChange('1d')}
          >
            1 Day
          </button>
          <button
            className={`px-3 py-1 rounded ${timeRange === '7d' ? 'bg-primary text-white' : 'bg-gray-100'}`}
            onClick={() => handleTimeRangeChange('7d')}
          >
            7 Days
          </button>
          <button
            className={`px-3 py-1 rounded ${timeRange === '30d' ? 'bg-primary text-white' : 'bg-gray-100'}`}
            onClick={() => handleTimeRangeChange('30d')}
          >
            30 Days
          </button>
          <button
            className={`px-3 py-1 rounded ${timeRange === '90d' ? 'bg-primary text-white' : 'bg-gray-100'}`}
            onClick={() => handleTimeRangeChange('90d')}
          >
            90 Days
          </button>
        </div>
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-sm text-gray-500">Page Views</div>
          <div className="text-2xl font-bold">{totalPageViews}</div>
          <div className="text-xs text-gray-400">Across {uniquePages} pages</div>
        </Card>
        
        <Card className="p-4">
          <div className="text-sm text-gray-500">User Actions</div>
          <div className="text-2xl font-bold">{totalUserActions}</div>
          <div className="text-xs text-gray-400">Clicks, searches, etc.</div>
        </Card>
        
        <Card className="p-4">
          <div className="text-sm text-gray-500">Unique Users</div>
          <div className="text-2xl font-bold">{uniqueUsers}</div>
          <div className="text-xs text-gray-400">Based on user IDs</div>
        </Card>
        
        <Card className="p-4">
          <div className="text-sm text-gray-500">Bounce Rate</div>
          <div className="text-2xl font-bold">{bounceRate.toFixed(1)}%</div>
          <div className="text-xs text-gray-400">Single page sessions</div>
        </Card>
      </div>
      
      {/* Tabs */}
      <Tabs
        tabs={[
          { id: 'overview', label: 'Overview' },
          { id: 'pageViews', label: 'Page Views' },
          { id: 'userActions', label: 'User Actions' },
          { id: 'errors', label: 'Errors' },
          { id: 'performance', label: 'Performance' },
          { id: 'features', label: 'Features' },
          { id: 'processes', label: 'Business Processes' },
        ]}
        activeTab={activeTab}
        onChange={handleTabChange}
      />
      
      {/* Tab Content */}
      <div className="mt-6">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-4">
                <Typography variant="h3">Page Views Over Time</Typography>
                <div className="h-64">
                  <LineChart data={preparePageViewsData()} />
                </div>
              </Card>
              
              <Card className="p-4">
                <Typography variant="h3">User Actions</Typography>
                <div className="h-64">
                  <PieChart data={prepareUserActionsData()} />
                </div>
              </Card>
              
              <Card className="p-4">
                <Typography variant="h3">Feature Usage</Typography>
                <div className="h-64">
                  <DoughnutChart data={prepareFeatureUsageData()} />
                </div>
              </Card>
              
              <Card className="p-4">
                <Typography variant="h3">Performance Metrics</Typography>
                <div className="h-64">
                  <BarChart data={preparePerformanceData()} />
                </div>
              </Card>
            </div>
            
            <Card className="p-4">
              <Typography variant="h3">Insights</Typography>
              <div className="mt-4 space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                  <Typography>
                    {totalPageViews > 0 
                      ? `Users viewed ${totalPageViews} pages in the last ${timeRange === '1d' ? 'day' : timeRange === '7d' ? '7 days' : timeRange === '30d' ? '30 days' : '90 days'}.` 
                      : 'No page views recorded in the selected time period.'}
                  </Typography>
                </div>
                
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-secondary"></div>
                  <Typography>
                    {totalUserActions > 0 
                      ? `Users performed ${totalUserActions} actions in the selected time period.` 
                      : 'No user actions recorded in the selected time period.'}
                  </Typography>
                </div>
                
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-warning"></div>
                  <Typography>
                    {totalErrors > 0 
                      ? `${totalErrors} errors occurred in the selected time period.` 
                      : 'No errors recorded in the selected time period.'}
                  </Typography>
                </div>
                
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-success"></div>
                  <Typography>
                    {bounceRate > 0 
                      ? `The bounce rate is ${bounceRate.toFixed(1)}%, which is ${bounceRate > 50 ? 'higher than recommended' : 'within acceptable range'}.` 
                      : 'No bounce rate data available for the selected time period.'}
                  </Typography>
                </div>
              </div>
            </Card>
          </div>
        )}
        
        {/* Page Views Tab */}
        {activeTab === 'pageViews' && (
          <div className="space-y-6">
            <Card className="p-4">
              <Typography variant="h3">Page Views Over Time</Typography>
              <div className="h-80">
                <LineChart data={preparePageViewsData()} />
              </div>
            </Card>
            
            <Card className="p-4">
              <Typography variant="h3">Top Pages</Typography>
              <div className="mt-4">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Page</th>
                      <th className="text-right py-2">Views</th>
                      <th className="text-right py-2">% of Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analyticsData.pageViews.reduce((pages, event) => {
                      const path = event.label;
                      pages[path] = (pages[path] || 0) + 1;
                      return pages;
                    }, {})
                    .toSorted((a, b) => b[1] - a[1])
                    .slice(0, 10)
                    .map(([path, count]) => (
                      <tr key={path} className="border-b">
                        <td className="py-2">{path}</td>
                        <td className="text-right py-2">{count}</td>
                        <td className="text-right py-2">
                          {totalPageViews > 0 ? ((count / totalPageViews) * 100).toFixed(1) : 0}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}
        
        {/* User Actions Tab */}
        {activeTab === 'userActions' && (
          <div className="space-y-6">
            <Card className="p-4">
              <Typography variant="h3">User Actions by Type</Typography>
              <div className="h-80">
                <PieChart data={prepareUserActionsData()} />
              </div>
            </Card>
            
            <Card className="p-4">
              <Typography variant="h3">Top User Actions</Typography>
              <div className="mt-4">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Action</th>
                      <th className="text-left py-2">Label</th>
                      <th className="text-right py-2">Count</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analyticsData.userActions
                      .reduce((actions, event) => {
                        const key = `${event.action}:${event.label}`;
                        actions[key] = (actions[key] || 0) + 1;
                        return actions;
                      }, {})
                      .toSorted((a, b) => b[1] - a[1])
                      .slice(0, 10)
                      .map(([key, count]) => {
                        const [action, label] = key.split(':');
                        return (
                          <tr key={key} className="border-b">
                            <td className="py-2">{action}</td>
                            <td className="py-2">{label}</td>
                            <td className="text-right py-2">{count}</td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}
        
        {/* Errors Tab */}
        {activeTab === 'errors' && (
          <div className="space-y-6">
            <Card className="p-4">
              <Typography variant="h3">Errors by Type</Typography>
              <div className="h-80">
                <BarChart data={prepareErrorsData()} />
              </div>
            </Card>
            
            <Card className="p-4">
              <Typography variant="h3">Recent Errors</Typography>
              <div className="mt-4">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Time</th>
                      <th className="text-left py-2">Type</th>
                      <th className="text-left py-2">Message</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analyticsData.errors
                      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                      .slice(0, 10)
                      .map((error, index) => (
                        <tr key={index} className="border-b">
                          <td className="py-2">
                            {new Date(error.timestamp).toLocaleString()}
                          </td>
                          <td className="py-2">{error.action}</td>
                          <td className="py-2">{error.label}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}
        
        {/* Performance Tab */}
        {activeTab === 'performance' && (
          <div className="space-y-6">
            <Card className="p-4">
              <Typography variant="h3">Performance Metrics</Typography>
              <div className="h-80">
                <BarChart data={preparePerformanceData()} />
              </div>
            </Card>
            
            <Card className="p-4">
              <Typography variant="h3">Performance Trends</Typography>
              <div className="mt-4">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Metric</th>
                      <th className="text-right py-2">Average</th>
                      <th className="text-right py-2">Min</th>
                      <th className="text-right py-2">Max</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(
                      analyticsData.performance.reduce((metrics, event) => {
                        if (event.data && event.data.metric_name) {
                          const name = event.data.metric_name;
                          const value = event.data.metric_value;
                          
                          if (!metrics[name]) {
                            metrics[name] = {
                              values: [],
                              sum: 0,
                              count: 0,
                              min: Infinity,
                              max: -Infinity,
                            };
                          }
                          
                          metrics[name].values.push(value);
                          metrics[name].sum += value;
                          metrics[name].count += 1;
                          metrics[name].min = Math.min(metrics[name].min, value);
                          metrics[name].max = Math.max(metrics[name].max, value);
                        }
                        return metrics;
                      }, {})
                    ).map(([name, data]) => (
                      <tr key={name} className="border-b">
                        <td className="py-2">{name}</td>
                        <td className="text-right py-2">
                          {(data.sum / data.count).toFixed(2)} ms
                        </td>
                        <td className="text-right py-2">
                          {data.min === Infinity ? 'N/A' : `${data.min.toFixed(2)} ms`}
                        </td>
                        <td className="text-right py-2">
                          {data.max === -Infinity ? 'N/A' : `${data.max.toFixed(2)} ms`}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}
        
        {/* Features Tab */}
        {activeTab === 'features' && (
          <div className="space-y-6">
            <Card className="p-4">
              <Typography variant="h3">Feature Usage</Typography>
              <div className="h-80">
                <DoughnutChart data={prepareFeatureUsageData()} />
              </div>
            </Card>
            
            <Card className="p-4">
              <Typography variant="h3">Feature Usage Details</Typography>
              <div className="mt-4">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Feature</th>
                      <th className="text-left py-2">Action</th>
                      <th className="text-right py-2">Count</th>
                      <th className="text-right py-2">% of Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(
                      analyticsData.featureUsage.reduce((features, event) => {
                        const key = `${event.label}:${event.action}`;
                        features[key] = (features[key] || 0) + 1;
                        return features;
                      }, {})
                    )
                      .sort((a, b) => b[1] - a[1])
                      .map(([key, count]) => {
                        const [feature, action] = key.split(':');
                        return (
                          <tr key={key} className="border-b">
                            <td className="py-2">{feature}</td>
                            <td className="py-2">{action}</td>
                            <td className="text-right py-2">{count}</td>
                            <td className="text-right py-2">
                              {analyticsData.featureUsage.length > 0
                                ? ((count / analyticsData.featureUsage.length) * 100).toFixed(1)
                                : 0}%
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}
        
        {/* Business Processes Tab */}
        {activeTab === 'processes' && (
          <div className="space-y-6">
            <Card className="p-4">
              <Typography variant="h3">Business Processes</Typography>
              <div className="h-80">
                <PieChart data={prepareBusinessProcessesData()} />
              </div>
            </Card>
            
            <Card className="p-4">
              <Typography variant="h3">Business Process Details</Typography>
              <div className="mt-4">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Process</th>
                      <th className="text-left py-2">Action</th>
                      <th className="text-right py-2">Count</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(
                      analyticsData.businessProcesses.reduce((processes, event) => {
                        const key = `${event.label}:${event.action}`;
                        processes[key] = (processes[key] || 0) + 1;
                        return processes;
                      }, {})
                    )
                      .sort((a, b) => b[1] - a[1])
                      .map(([key, count]) => {
                        const [process, action] = key.split(':');
                        return (
                          <tr key={key} className="border-b">
                            <td className="py-2">{process}</td>
                            <td className="py-2">{action}</td>
                            <td className="text-right py-2">{count}</td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
