"use client";

import React from 'react';
import PropTypes from 'prop-types';
import Chart from './Chart';

/**
 * PieChart Component
 * A pie chart for displaying proportions of a whole
 */
const PieChart = ({
  data,
  options = {},
  ...props
}) => {
  // Default options specific to pie charts
  const defaultOptions = {
    plugins: {
      legend: {
        position: 'right',
        labels: {
          padding: 20,
          usePointStyle: true,
        },
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.formattedValue;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = Math.round((context.raw / total) * 100);
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    },
    elements: {
      arc: {
        borderWidth: 1,
        borderColor: '#fff',
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
    elements: {
      ...defaultOptions.elements,
      ...(options.elements || {}),
    },
  };

  return (
    <Chart
      type="pie"
      data={data}
      options={mergedOptions}
      {...props}
    />
  );
};

PieChart.propTypes = {
  /**
   * Chart data
   */
  data: PropTypes.shape({
    labels: PropTypes.arrayOf(PropTypes.string),
    datasets: PropTypes.arrayOf(
      PropTypes.shape({
        data: PropTypes.arrayOf(PropTypes.number),
        backgroundColor: PropTypes.oneOfType([
          PropTypes.string,
          PropTypes.arrayOf(PropTypes.string),
        ]),
        borderColor: PropTypes.oneOfType([
          PropTypes.string,
          PropTypes.arrayOf(PropTypes.string),
        ]),
        hoverOffset: PropTypes.number,
      })
    ),
  }).isRequired,
  /**
   * Chart.js options
   */
  options: PropTypes.object,
};

export default PieChart;
