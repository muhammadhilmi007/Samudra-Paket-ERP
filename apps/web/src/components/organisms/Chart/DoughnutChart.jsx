"use client";

import React from 'react';
import PropTypes from 'prop-types';
import Chart from './Chart';

/**
 * DoughnutChart Component
 * A doughnut chart for displaying proportions of a whole with a hollow center
 */
const DoughnutChart = ({
  data,
  options = {},
  centerText,
  ...props
}) => {
  // Default options specific to doughnut charts
  const defaultOptions = {
    cutout: '70%',
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

  // Add center text plugin if centerText is provided
  if (centerText) {
    defaultOptions.plugins.centerText = {
      display: true,
      text: centerText,
    };
  }

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

  // Add center text plugin to Chart.js
  const addCenterTextPlugin = (chart) => {
    if (centerText && !chart.options.plugins.centerText) {
      const plugin = {
        id: 'centerText',
        afterDraw: (chart) => {
          if (chart.options.plugins.centerText && chart.options.plugins.centerText.display) {
            const width = chart.width;
            const height = chart.height;
            const ctx = chart.ctx;
            
            ctx.restore();
            
            // Text settings
            const text = chart.options.plugins.centerText.text;
            const textX = width / 2;
            const textY = height / 2;
            const fontSize = chart.options.plugins.centerText.fontSize || (height / 114).toFixed(2) * 14;
            const fontFamily = chart.options.plugins.centerText.fontFamily || "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif";
            const fontWeight = chart.options.plugins.centerText.fontWeight || 'bold';
            const fontColor = chart.options.plugins.centerText.fontColor || '#666';
            
            // Draw text
            ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
            ctx.fillStyle = fontColor;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            
            // Handle multiline text
            if (Array.isArray(text)) {
              const lineHeight = fontSize * 1.2;
              const totalHeight = text.length * lineHeight;
              const startY = textY - (totalHeight / 2) + (lineHeight / 2);
              
              text.forEach((line, i) => {
                ctx.fillText(line, textX, startY + (i * lineHeight));
              });
            } else {
              ctx.fillText(text, textX, textY);
            }
            
            ctx.save();
          }
        }
      };
      
      chart.register(plugin);
    }
  };

  return (
    <Chart
      type="doughnut"
      data={data}
      options={mergedOptions}
      plugins={[{ beforeInit: addCenterTextPlugin }]}
      {...props}
    />
  );
};

DoughnutChart.propTypes = {
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
  /**
   * Text to display in the center of the doughnut
   */
  centerText: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]),
};

export default DoughnutChart;
