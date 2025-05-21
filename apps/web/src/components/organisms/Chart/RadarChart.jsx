"use client";

import React from 'react';
import PropTypes from 'prop-types';
import Chart from './Chart';

/**
 * RadarChart Component
 * A radar chart for displaying multivariate data in the form of a two-dimensional chart
 */
const RadarChart = ({
  data,
  options = {},
  ...props
}) => {
  // Default options specific to radar charts
  const defaultOptions = {
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      r: {
        angleLines: {
          display: true,
          color: 'rgba(0, 0, 0, 0.1)',
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
        pointLabels: {
          font: {
            size: 12,
          },
        },
        beginAtZero: true,
      },
    },
    elements: {
      line: {
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
      type="radar"
      data={data}
      options={mergedOptions}
      {...props}
    />
  );
};

RadarChart.propTypes = {
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

export default RadarChart;
