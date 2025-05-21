"use client";

/**
 * PerformanceDashboard Component
 * Displays performance metrics and insights for the application
 */

import React, { useState, useEffect } from 'react';
import { 
  ChartBarIcon, 
  ClockIcon, 
  ServerIcon, 
  DevicePhoneMobileIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { performanceMonitoring } from '../../../utils/performanceMonitoring';
import { usePerformanceMonitoring } from '../../../hooks/usePerformanceMonitoring';
import Card from '../../molecules/Card';
import Button from '../../atoms/Button';
import Typography from '../../atoms/Typography';

// Chart.js components
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const PerformanceDashboard = () => {
  const { reportMetric } = usePerformanceMonitoring('PerformanceDashboard');
  const [metrics, setMetrics] = useState({});
  const [resourceMetrics, setResourceMetrics] = useState([]);
  const [apiMetrics, setApiMetrics] = useState([]);
  const [componentMetrics, setComponentMetrics] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);

  // Fetch metrics on mount and when refreshed
  useEffect(() => {
    const fetchMetrics = () => {
      const collectedMetrics = performanceMonitoring.getCollectedMetrics();
      setMetrics(collectedMetrics);

      // Extract resource metrics
      const resources = Object.entries(collectedMetrics)
        .filter(([key]) => key.startsWith('resource-load-time'))
        .map(([key, value]) => ({
          name: key.replace('resource-load-time:', ''),
          duration: value,
        }));
      setResourceMetrics(resources);

      // Extract API metrics
      const apis = Object.entries(collectedMetrics)
        .filter(([key]) => key.startsWith('api-response-time'))
        .map(([key, value]) => ({
          name: key.replace('api-response-time:', ''),
          duration: value,
        }));
      setApiMetrics(apis);

      // Extract component metrics
      const components = Object.entries(collectedMetrics)
        .filter(([key]) => key.startsWith('component-render-time'))
        .map(([key, value]) => ({
          name: key.replace('component-render-time:', ''),
          duration: value,
        }));
      setComponentMetrics(components);
    };

    fetchMetrics();
  }, [refreshKey]);

  // Handle refresh button click
  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
    reportMetric('dashboard-refresh', 1);
  };

  // Handle clear metrics button click
  const handleClearMetrics = () => {
    performanceMonitoring.clearCollectedMetrics();
    setRefreshKey(prev => prev + 1);
    reportMetric('dashboard-clear', 1);
  };

  // Prepare data for Core Web Vitals chart
  const webVitalsData = {
    labels: ['LCP', 'FID', 'CLS', 'FCP', 'TTI'],
    datasets: [
      {
        label: 'Current',
        data: [
          metrics[performanceMonitoring.CORE_WEB_VITALS.LCP] || 0,
          metrics[performanceMonitoring.CORE_WEB_VITALS.FID] || 0,
          metrics[performanceMonitoring.CORE_WEB_VITALS.CLS] || 0,
          metrics[performanceMonitoring.CORE_WEB_VITALS.FCP] || 0,
          metrics[performanceMonitoring.CORE_WEB_VITALS.TTI] || 0,
        ],
        backgroundColor: 'rgba(37, 99, 235, 0.5)',
        borderColor: 'rgba(37, 99, 235, 1)',
        borderWidth: 1,
      },
      {
        label: 'Target',
        data: [2500, 100, 0.1, 1800, 3800],
        backgroundColor: 'rgba(16, 185, 129, 0.5)',
        borderColor: 'rgba(16, 185, 129, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Prepare data for API response time chart
  const apiResponseData = {
    labels: apiMetrics.slice(0, 10).map(api => api.name),
    datasets: [
      {
        label: 'Response Time (ms)',
        data: apiMetrics.slice(0, 10).map(api => api.duration),
        backgroundColor: 'rgba(245, 158, 11, 0.5)',
        borderColor: 'rgba(245, 158, 11, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Prepare data for component render time chart
  const componentRenderData = {
    labels: componentMetrics.slice(0, 10).map(component => component.name),
    datasets: [
      {
        label: 'Render Time (ms)',
        data: componentMetrics.slice(0, 10).map(component => component.duration),
        backgroundColor: 'rgba(239, 68, 68, 0.5)',
        borderColor: 'rgba(239, 68, 68, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <Typography variant="h1" className="text-2xl font-bold mb-2">
            Performance Dashboard
          </Typography>
          <Typography variant="body" className="text-gray-600 dark:text-gray-300">
            Monitor and analyze application performance metrics
          </Typography>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={handleRefresh}
            className="flex items-center"
          >
            <ArrowPathIcon className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button
            variant="danger"
            onClick={handleClearMetrics}
            className="flex items-center"
          >
            Clear Metrics
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="p-4">
          <div className="flex items-start">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg mr-4">
              <ClockIcon className="h-6 w-6 text-blue-600 dark:text-blue-300" />
            </div>
            <div>
              <Typography variant="subtitle" className="text-sm text-gray-500 dark:text-gray-400">
                Page Load Time
              </Typography>
              <Typography variant="h2" className="text-xl font-bold">
                {(metrics['page-load-time'] || 0).toFixed(0)} ms
              </Typography>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-start">
            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg mr-4">
              <ChartBarIcon className="h-6 w-6 text-green-600 dark:text-green-300" />
            </div>
            <div>
              <Typography variant="subtitle" className="text-sm text-gray-500 dark:text-gray-400">
                First Contentful Paint
              </Typography>
              <Typography variant="h2" className="text-xl font-bold">
                {(metrics[performanceMonitoring.CORE_WEB_VITALS.FCP] || 0).toFixed(0)} ms
              </Typography>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-start">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg mr-4">
              <ServerIcon className="h-6 w-6 text-yellow-600 dark:text-yellow-300" />
            </div>
            <div>
              <Typography variant="subtitle" className="text-sm text-gray-500 dark:text-gray-400">
                API Response Time (Avg)
              </Typography>
              <Typography variant="h2" className="text-xl font-bold">
                {apiMetrics.length > 0
                  ? (apiMetrics.reduce((sum, api) => sum + api.duration, 0) / apiMetrics.length).toFixed(0)
                  : 0} ms
              </Typography>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-start">
            <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg mr-4">
              <DevicePhoneMobileIcon className="h-6 w-6 text-red-600 dark:text-red-300" />
            </div>
            <div>
              <Typography variant="subtitle" className="text-sm text-gray-500 dark:text-gray-400">
                Layout Shifts (CLS)
              </Typography>
              <Typography variant="h2" className="text-xl font-bold">
                {(metrics[performanceMonitoring.CORE_WEB_VITALS.CLS] || 0).toFixed(3)}
              </Typography>
            </div>
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card className="p-4">
          <Typography variant="h3" className="text-lg font-semibold mb-4">
            Core Web Vitals
          </Typography>
          <div className="h-80">
            <Bar data={webVitalsData} options={chartOptions} />
          </div>
        </Card>

        <Card className="p-4">
          <Typography variant="h3" className="text-lg font-semibold mb-4">
            API Response Times
          </Typography>
          <div className="h-80">
            <Bar data={apiResponseData} options={chartOptions} />
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card className="p-4">
          <Typography variant="h3" className="text-lg font-semibold mb-4">
            Component Render Times
          </Typography>
          <div className="h-80">
            <Bar data={componentRenderData} options={chartOptions} />
          </div>
        </Card>

        <Card className="p-4">
          <Typography variant="h3" className="text-lg font-semibold mb-4">
            Resource Load Times
          </Typography>
          <div className="h-80">
            <div className="overflow-y-auto h-full">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-100 dark:bg-gray-800">
                    <th className="p-2 text-left">Resource</th>
                    <th className="p-2 text-right">Load Time (ms)</th>
                  </tr>
                </thead>
                <tbody>
                  {resourceMetrics.slice(0, 20).map((resource, index) => (
                    <tr key={index} className="border-b border-gray-200 dark:border-gray-700">
                      <td className="p-2 text-left truncate max-w-[200px]">{resource.name}</td>
                      <td className="p-2 text-right">{resource.duration.toFixed(0)}</td>
                    </tr>
                  ))}
                  {resourceMetrics.length === 0 && (
                    <tr>
                      <td colSpan={2} className="p-4 text-center text-gray-500">
                        No resource metrics available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </Card>
      </div>

      {/* Performance Recommendations */}
      <Card className="p-4 mb-6">
        <Typography variant="h3" className="text-lg font-semibold mb-4">
          Performance Recommendations
        </Typography>
        <ul className="space-y-2">
          {metrics[performanceMonitoring.CORE_WEB_VITALS.LCP] > 2500 && (
            <li className="flex items-start">
              <span className="h-2 w-2 bg-red-500 rounded-full mt-2 mr-2"></span>
              <Typography variant="body">
                Largest Contentful Paint (LCP) is too high. Consider optimizing images, reducing JavaScript, and implementing lazy loading.
              </Typography>
            </li>
          )}
          {metrics[performanceMonitoring.CORE_WEB_VITALS.FID] > 100 && (
            <li className="flex items-start">
              <span className="h-2 w-2 bg-red-500 rounded-full mt-2 mr-2"></span>
              <Typography variant="body">
                First Input Delay (FID) is too high. Consider breaking up long tasks, optimizing JavaScript execution, and minimizing third-party code.
              </Typography>
            </li>
          )}
          {metrics[performanceMonitoring.CORE_WEB_VITALS.CLS] > 0.1 && (
            <li className="flex items-start">
              <span className="h-2 w-2 bg-red-500 rounded-full mt-2 mr-2"></span>
              <Typography variant="body">
                Cumulative Layout Shift (CLS) is too high. Set explicit dimensions for images and embeds, and avoid inserting content above existing content.
              </Typography>
            </li>
          )}
          {apiMetrics.some(api => api.duration > 500) && (
            <li className="flex items-start">
              <span className="h-2 w-2 bg-yellow-500 rounded-full mt-2 mr-2"></span>
              <Typography variant="body">
                Some API calls are taking more than 500ms. Consider implementing caching, optimizing database queries, or using a CDN.
              </Typography>
            </li>
          )}
          {componentMetrics.some(component => component.duration > 100) && (
            <li className="flex items-start">
              <span className="h-2 w-2 bg-yellow-500 rounded-full mt-2 mr-2"></span>
              <Typography variant="body">
                Some components have high render times. Consider using React.memo, useMemo, or code splitting to optimize rendering.
              </Typography>
            </li>
          )}
          {resourceMetrics.some(resource => resource.duration > 1000) && (
            <li className="flex items-start">
              <span className="h-2 w-2 bg-yellow-500 rounded-full mt-2 mr-2"></span>
              <Typography variant="body">
                Some resources are taking too long to load. Consider optimizing images, using a CDN, or implementing resource hints like preload and prefetch.
              </Typography>
            </li>
          )}
          {Object.keys(metrics).length === 0 && (
            <li className="flex items-start">
              <span className="h-2 w-2 bg-blue-500 rounded-full mt-2 mr-2"></span>
              <Typography variant="body">
                No performance metrics available yet. Navigate through the application to collect metrics.
              </Typography>
            </li>
          )}
        </ul>
      </Card>
    </div>
  );
};

export default PerformanceDashboard;
