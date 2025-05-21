"use client";

import React from 'react';
import PropTypes from 'prop-types';
import Chart from './Chart';

/**
 * LineChart Component
 * A line chart for displaying trends over time
 */
const LineChart = ({
  data,
  options = {},
  ...props
}) => {
  // Default options specific to line charts
  const defaultOptions = {
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
    elements: {
      line: {
        tension: 0.4, // Adds a slight curve to the line
        borderWidth: 2,
      },
      point: {
        radius: 3,
        hitRadius: 10,
        hoverRadius: 5,
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
      type="line"
      data={data}
      options={mergedOptions}
      {...props}
    />
  );
};

LineChart.propTypes = {
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
        fill: PropTypes.bool,
      })
    ),
  }).isRequired,
  /**
   * Chart.js options
   */
  options: PropTypes.object,
};

export default LineChart;
