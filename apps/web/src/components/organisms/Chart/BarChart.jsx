"use client";

import React from 'react';
import PropTypes from 'prop-types';
import Chart from './Chart';

/**
 * BarChart Component
 * A bar chart for comparing values across categories
 */
const BarChart = ({
  data,
  options = {},
  horizontal = false,
  ...props
}) => {
  // Default options specific to bar charts
  const defaultOptions = {
    indexAxis: horizontal ? 'y' : 'x',
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
        beginAtZero: true,
      },
    },
    barPercentage: 0.8,
    categoryPercentage: 0.8,
    elements: {
      bar: {
        borderWidth: 1,
        borderRadius: 4,
      },
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
    elements: {
      ...defaultOptions.elements,
      ...(options.elements || {}),
    },
  };

  return (
    <Chart
      type="bar"
      data={data}
      options={mergedOptions}
      {...props}
    />
  );
};

BarChart.propTypes = {
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
  }).isRequired,
  /**
   * Chart.js options
   */
  options: PropTypes.object,
  /**
   * Whether to display the chart horizontally
   */
  horizontal: PropTypes.bool,
};

export default BarChart;
