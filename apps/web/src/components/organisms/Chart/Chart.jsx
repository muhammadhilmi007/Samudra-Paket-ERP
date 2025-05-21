"use client";

import React, { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Chart as ChartJS, registerables } from 'chart.js';
import { Chart as ReactChart } from 'react-chartjs-2';
import cn from 'classnames';

// Register all Chart.js components
ChartJS.register(...registerables);

/**
 * Chart Component
 * A flexible chart component that wraps Chart.js
 */
const Chart = ({
  type = 'bar',
  data,
  options = {},
  width,
  height,
  className = '',
  containerClassName = '',
  title,
  subtitle,
  loading = false,
  loadingMessage = 'Loading chart data...',
  emptyMessage = 'No data available',
  error,
  errorMessage = 'Error loading chart data',
  onDataPointClick,
  ...props
}) => {
  const chartRef = useRef(null);
  const [chartInstance, setChartInstance] = useState(null);

  // Set up chart instance and event listeners
  useEffect(() => {
    if (chartRef.current) {
      const chart = chartRef.current;
      
      if (chart) {
        setChartInstance(chart);
        
        // Add click event listener for data point clicks
        if (onDataPointClick) {
          const handleClick = (event) => {
            const points = chart.getElementsAtEventForMode(
              event,
              'nearest',
              { intersect: true },
              false
            );
            
            if (points.length) {
              const firstPoint = points[0];
              const datasetIndex = firstPoint.datasetIndex;
              const index = firstPoint.index;
              const datasetLabel = chart.data.datasets[datasetIndex].label;
              const value = chart.data.datasets[datasetIndex].data[index];
              const label = chart.data.labels[index];
              
              onDataPointClick({
                datasetIndex,
                index,
                datasetLabel,
                value,
                label,
              });
            }
          };
          
          chart.canvas.addEventListener('click', handleClick);
          
          return () => {
            chart.canvas.removeEventListener('click', handleClick);
          };
        }
      }
    }
  }, [chartRef, onDataPointClick]);

  // Default options to ensure consistent styling
  const defaultOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleFont: {
          size: 14,
        },
        bodyFont: {
          size: 13,
        },
        padding: 12,
        cornerRadius: 6,
        displayColors: true,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 12,
          },
        },
      },
      y: {
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
        ticks: {
          font: {
            size: 12,
          },
        },
        beginAtZero: true,
      },
    },
    animation: {
      duration: 750,
      easing: 'easeOutQuart',
    },
  };

  // Merge default options with user options
  const mergedOptions = {
    ...defaultOptions,
    ...options,
    plugins: {
      ...defaultOptions.plugins,
      ...(options.plugins || {}),
    },
    scales: {
      ...defaultOptions.scales,
      ...(options.scales || {}),
    },
  };

  // Render loading state
  if (loading) {
    return (
      <div className={cn('w-full flex flex-col', containerClassName)}>
        {title && <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>}
        {subtitle && <p className="text-sm text-gray-500 mb-4">{subtitle}</p>}
        <div
          className={cn(
            'flex items-center justify-center bg-gray-50 border border-gray-200 rounded-lg',
            className
          )}
          style={{ width, height: height || 300 }}
        >
          <div className="text-gray-500">{loadingMessage}</div>
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className={cn('w-full flex flex-col', containerClassName)}>
        {title && <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>}
        {subtitle && <p className="text-sm text-gray-500 mb-4">{subtitle}</p>}
        <div
          className={cn(
            'flex items-center justify-center bg-red-50 border border-red-200 rounded-lg',
            className
          )}
          style={{ width, height: height || 300 }}
        >
          <div className="text-red-500">{errorMessage}</div>
        </div>
      </div>
    );
  }

  // Render empty state
  if (!data || !data.datasets || data.datasets.length === 0 || data.datasets.every(d => d.data.length === 0)) {
    return (
      <div className={cn('w-full flex flex-col', containerClassName)}>
        {title && <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>}
        {subtitle && <p className="text-sm text-gray-500 mb-4">{subtitle}</p>}
        <div
          className={cn(
            'flex items-center justify-center bg-gray-50 border border-gray-200 rounded-lg',
            className
          )}
          style={{ width, height: height || 300 }}
        >
          <div className="text-gray-500">{emptyMessage}</div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('w-full flex flex-col', containerClassName)}>
      {title && <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>}
      {subtitle && <p className="text-sm text-gray-500 mb-4">{subtitle}</p>}
      <div
        className={cn('relative', className)}
        style={{ width, height: height || 300 }}
      >
        <ReactChart
          ref={chartRef}
          type={type}
          data={data}
          options={mergedOptions}
          {...props}
        />
      </div>
    </div>
  );
};

Chart.propTypes = {
  /**
   * Type of chart
   */
  type: PropTypes.oneOf(['bar', 'line', 'pie', 'doughnut', 'radar', 'polarArea', 'bubble', 'scatter']),
  /**
   * Chart data
   */
  data: PropTypes.shape({
    labels: PropTypes.arrayOf(PropTypes.string),
    datasets: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string,
        data: PropTypes.arrayOf(PropTypes.number),
        backgroundColor: PropTypes.oneOfType([
          PropTypes.string,
          PropTypes.arrayOf(PropTypes.string),
        ]),
        borderColor: PropTypes.oneOfType([
          PropTypes.string,
          PropTypes.arrayOf(PropTypes.string),
        ]),
      })
    ),
  }),
  /**
   * Chart.js options
   */
  options: PropTypes.object,
  /**
   * Width of the chart
   */
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  /**
   * Height of the chart
   */
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  /**
   * Additional CSS classes for the chart container
   */
  className: PropTypes.string,
  /**
   * Additional CSS classes for the outer container
   */
  containerClassName: PropTypes.string,
  /**
   * Chart title
   */
  title: PropTypes.node,
  /**
   * Chart subtitle
   */
  subtitle: PropTypes.node,
  /**
   * Whether the chart is in a loading state
   */
  loading: PropTypes.bool,
  /**
   * Message to display when the chart is loading
   */
  loadingMessage: PropTypes.node,
  /**
   * Message to display when there is no data
   */
  emptyMessage: PropTypes.node,
  /**
   * Whether the chart is in an error state
   */
  error: PropTypes.bool,
  /**
   * Message to display when there is an error
   */
  errorMessage: PropTypes.node,
  /**
   * Callback function when a data point is clicked
   */
  onDataPointClick: PropTypes.func,
};

export default Chart;
