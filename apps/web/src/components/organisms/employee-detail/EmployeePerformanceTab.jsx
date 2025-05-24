"use client";

/**
 * EmployeePerformanceTab Component
 * Displays employee performance metrics and KPIs
 */

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Typography from '../../atoms/Typography';
import Card from '../../molecules/Card';
import Button from '../../atoms/Button';
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
  RadialLinearScale,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Radar } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  RadialLinearScale,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

// Mock data for performance metrics
const generateMockPerformanceData = (employeeId) => {
  // Monthly performance data for the past 12 months
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  // Delivery performance data
  const deliveryPerformance = {
    labels: months,
    datasets: [
      {
        label: 'On-Time Delivery Rate (%)',
        data: [92, 94, 91, 95, 93, 97, 96, 98, 95, 94, 96, 98],
        borderColor: 'rgb(37, 99, 235)',
        backgroundColor: 'rgba(37, 99, 235, 0.1)',
        tension: 0.3,
      },
      {
        label: 'Delivery Completion Rate (%)',
        data: [88, 90, 87, 92, 89, 94, 93, 95, 92, 91, 93, 96],
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.3,
      },
    ],
  };
  
  // Delivery volume data
  const deliveryVolume = {
    labels: months,
    datasets: [
      {
        label: 'Packages Delivered',
        data: [320, 345, 310, 360, 330, 380, 370, 390, 350, 340, 375, 400],
        backgroundColor: 'rgba(37, 99, 235, 0.6)',
      },
    ],
  };
  
  // Customer satisfaction data
  const customerSatisfaction = {
    labels: months,
    datasets: [
      {
        label: 'Customer Satisfaction Score (1-5)',
        data: [4.2, 4.3, 4.1, 4.4, 4.2, 4.5, 4.4, 4.6, 4.3, 4.2, 4.4, 4.7],
        borderColor: 'rgb(245, 158, 11)',
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        tension: 0.3,
      },
    ],
  };
  
  // Skills radar data
  const skillsRadar = {
    labels: ['Delivery Speed', 'Customer Service', 'Route Knowledge', 'Problem Solving', 'Documentation', 'Team Collaboration'],
    datasets: [
      {
        label: 'Current Skills',
        data: [4.5, 4.2, 4.7, 3.8, 4.0, 4.3],
        backgroundColor: 'rgba(37, 99, 235, 0.2)',
        borderColor: 'rgb(37, 99, 235)',
        pointBackgroundColor: 'rgb(37, 99, 235)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgb(37, 99, 235)',
      },
      {
        label: 'Team Average',
        data: [4.0, 3.8, 4.2, 3.5, 3.7, 3.9],
        backgroundColor: 'rgba(156, 163, 175, 0.2)',
        borderColor: 'rgb(156, 163, 175)',
        pointBackgroundColor: 'rgb(156, 163, 175)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgb(156, 163, 175)',
      },
    ],
  };
  
  // KPI data
  const kpis = [
    {
      id: `kpi-${employeeId}-1`,
      name: 'On-Time Delivery Rate',
      target: 95,
      current: 98,
      unit: '%',
      trend: 'up',
      status: 'Exceeding',
      description: 'Percentage of deliveries completed within the promised time window',
    },
    {
      id: `kpi-${employeeId}-2`,
      name: 'Delivery Completion Rate',
      target: 92,
      current: 96,
      unit: '%',
      trend: 'up',
      status: 'Exceeding',
      description: 'Percentage of assigned deliveries successfully completed',
    },
    {
      id: `kpi-${employeeId}-3`,
      name: 'Customer Satisfaction',
      target: 4.5,
      current: 4.7,
      unit: 'rating',
      trend: 'up',
      status: 'Exceeding',
      description: 'Average customer satisfaction rating (1-5 scale)',
    },
    {
      id: `kpi-${employeeId}-4`,
      name: 'Packages Per Day',
      target: 35,
      current: 38,
      unit: 'packages',
      trend: 'up',
      status: 'Exceeding',
      description: 'Average number of packages delivered per working day',
    },
    {
      id: `kpi-${employeeId}-5`,
      name: 'Documentation Accuracy',
      target: 98,
      current: 97,
      unit: '%',
      trend: 'down',
      status: 'Below Target',
      description: 'Percentage of delivery documentation completed accurately',
    },
    {
      id: `kpi-${employeeId}-6`,
      name: 'Fuel Efficiency',
      target: 12,
      current: 11.5,
      unit: 'km/l',
      trend: 'down',
      status: 'Below Target',
      description: 'Average fuel efficiency for delivery routes',
    },
  ];
  
  // Performance reviews
  const performanceReviews = [
    {
      id: `review-${employeeId}-1`,
      period: 'Q4 2023',
      date: '2023-12-15',
      overallRating: 4.6,
      reviewedBy: 'John Doe',
      strengths: [
        'Consistently exceeds delivery targets',
        'Excellent customer service skills',
        'Great knowledge of delivery routes',
        'Proactive problem solver',
      ],
      areasForImprovement: [
        'Documentation could be more detailed',
        'Can improve on fuel efficiency',
      ],
      goals: [
        'Improve documentation accuracy to 99%',
        'Maintain customer satisfaction above 4.5',
        'Improve fuel efficiency to meet target',
      ],
    },
    {
      id: `review-${employeeId}-2`,
      period: 'Q3 2023',
      date: '2023-09-15',
      overallRating: 4.4,
      reviewedBy: 'John Doe',
      strengths: [
        'High delivery completion rate',
        'Good customer feedback',
        'Efficient route planning',
      ],
      areasForImprovement: [
        'Documentation accuracy needs improvement',
        'Could improve on team collaboration',
      ],
      goals: [
        'Improve documentation accuracy to 98%',
        'Participate more in team meetings',
        'Maintain high delivery completion rate',
      ],
    },
  ];
  
  return {
    deliveryPerformance,
    deliveryVolume,
    customerSatisfaction,
    skillsRadar,
    kpis,
    performanceReviews,
  };
};

const EmployeePerformanceTab = ({ employeeId }) => {
  // State
  const [performanceData, setPerformanceData] = useState(generateMockPerformanceData(employeeId));
  const [selectedPeriod, setSelectedPeriod] = useState('12months');
  const [selectedReview, setSelectedReview] = useState(performanceData.performanceReviews[0]);
  
  // Chart options
  const lineOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        min: 80,
      },
    },
  };
  
  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };
  
  const radarOptions = {
    responsive: true,
    scales: {
      r: {
        min: 0,
        max: 5,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };
  
  // Handle period change
  const handlePeriodChange = (period) => {
    setSelectedPeriod(period);
    // In a real app, this would fetch data for the selected period
  };
  
  // Handle review selection
  const handleReviewSelection = (review) => {
    setSelectedReview(review);
  };
  
  // Render KPI card
  const renderKpiCard = (kpi) => {
    const getStatusColor = (status) => {
      switch (status) {
        case 'Exceeding':
          return 'bg-green-100 text-green-800';
        case 'On Target':
          return 'bg-blue-100 text-blue-800';
        case 'Below Target':
          return 'bg-yellow-100 text-yellow-800';
        case 'Critical':
          return 'bg-red-100 text-red-800';
        default:
          return 'bg-gray-100 text-gray-800';
      }
    };
    
    const getTrendIcon = (trend) => {
      switch (trend) {
        case 'up':
          return (
            <svg className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          );
        case 'down':
          return (
            <svg className="h-4 w-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          );
        case 'stable':
          return (
            <svg className="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" />
            </svg>
          );
        default:
          return null;
      }
    };
    
    const calculateProgress = (current, target) => {
      return (current / target) * 100;
    };
    
    const progress = calculateProgress(kpi.current, kpi.target);
    const progressColor = progress >= 100 ? 'bg-green-500' : progress >= 90 ? 'bg-blue-500' : 'bg-yellow-500';
    
    return (
      <Card key={kpi.id} className="overflow-hidden">
        <div className="p-4">
          <div className="flex justify-between items-start">
            <Typography variant="h3" className="text-md font-medium">
              {kpi.name}
            </Typography>
            <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(kpi.status)}`}>
              {kpi.status}
            </div>
          </div>
          
          <div className="mt-4 flex items-end justify-between">
            <div>
              <Typography variant="body2" className="text-xs text-gray-500">
                Current
              </Typography>
              <div className="flex items-center">
                <Typography variant="h2" className="text-2xl font-bold">
                  {kpi.current}
                </Typography>
                <Typography variant="body2" className="ml-1 text-xs text-gray-500">
                  {kpi.unit}
                </Typography>
                <div className="ml-2">
                  {getTrendIcon(kpi.trend)}
                </div>
              </div>
            </div>
            <div className="text-right">
              <Typography variant="body2" className="text-xs text-gray-500">
                Target
              </Typography>
              <Typography variant="body1" className="text-lg font-medium">
                {kpi.target} {kpi.unit}
              </Typography>
            </div>
          </div>
          
          <div className="mt-3">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`${progressColor} h-2 rounded-full`}
                style={{ width: `${Math.min(progress, 100)}%` }}
              ></div>
            </div>
          </div>
          
          <div className="mt-2">
            <Typography variant="body2" className="text-xs text-gray-500">
              {kpi.description}
            </Typography>
          </div>
        </div>
      </Card>
    );
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Typography variant="h2" className="text-xl font-semibold">
          Performance Dashboard
        </Typography>
        
        <div className="flex space-x-2">
          <Button
            variant={selectedPeriod === '3months' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => handlePeriodChange('3months')}
          >
            3 Months
          </Button>
          <Button
            variant={selectedPeriod === '6months' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => handlePeriodChange('6months')}
          >
            6 Months
          </Button>
          <Button
            variant={selectedPeriod === '12months' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => handlePeriodChange('12months')}
          >
            12 Months
          </Button>
        </div>
      </div>
      
      {/* KPI Summary */}
      <div>
        <Typography variant="h3" className="text-lg font-medium mb-4">
          Key Performance Indicators
        </Typography>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {performanceData.kpis.map((kpi) => renderKpiCard(kpi))}
        </div>
      </div>
      
      {/* Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Delivery Performance Chart */}
        <Card>
          <div className="p-4 border-b border-gray-200">
            <Typography variant="h3" className="text-lg font-medium">
              Delivery Performance
            </Typography>
          </div>
          <div className="p-4">
            <Line data={performanceData.deliveryPerformance} options={lineOptions} />
          </div>
        </Card>
        
        {/* Delivery Volume Chart */}
        <Card>
          <div className="p-4 border-b border-gray-200">
            <Typography variant="h3" className="text-lg font-medium">
              Delivery Volume
            </Typography>
          </div>
          <div className="p-4">
            <Bar data={performanceData.deliveryVolume} options={barOptions} />
          </div>
        </Card>
        
        {/* Customer Satisfaction Chart */}
        <Card>
          <div className="p-4 border-b border-gray-200">
            <Typography variant="h3" className="text-lg font-medium">
              Customer Satisfaction
            </Typography>
          </div>
          <div className="p-4">
            <Line data={performanceData.customerSatisfaction} options={{
              ...lineOptions,
              scales: {
                y: {
                  beginAtZero: false,
                  min: 3,
                  max: 5,
                },
              },
            }} />
          </div>
        </Card>
        
        {/* Skills Radar Chart */}
        <Card>
          <div className="p-4 border-b border-gray-200">
            <Typography variant="h3" className="text-lg font-medium">
              Skills Assessment
            </Typography>
          </div>
          <div className="p-4">
            <Radar data={performanceData.skillsRadar} options={radarOptions} />
          </div>
        </Card>
      </div>
      
      {/* Performance Reviews */}
      <div>
        <Typography variant="h3" className="text-lg font-medium mb-4">
          Performance Reviews
        </Typography>
        
        <Card>
          <div className="p-4 border-b border-gray-200">
            <div className="flex space-x-2 overflow-x-auto pb-2">
              {performanceData.performanceReviews.map((review) => (
                <Button
                  key={review.id}
                  variant={selectedReview.id === review.id ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => handleReviewSelection(review)}
                >
                  {review.period}
                </Button>
              ))}
            </div>
          </div>
          
          <div className="p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <Typography variant="h3" className="text-lg font-medium">
                  {selectedReview.period} Performance Review
                </Typography>
                <Typography variant="body2" className="text-sm text-gray-500 mt-1">
                  Reviewed on {selectedReview.date} by {selectedReview.reviewedBy}
                </Typography>
              </div>
              <div className="flex items-center">
                <div className="text-right mr-2">
                  <Typography variant="body2" className="text-xs text-gray-500">
                    Overall Rating
                  </Typography>
                  <Typography variant="h3" className="text-xl font-bold">
                    {selectedReview.overallRating}
                  </Typography>
                </div>
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg"
                  style={{
                    backgroundColor: 
                      selectedReview.overallRating >= 4.5 ? '#22C55E' :
                      selectedReview.overallRating >= 4.0 ? '#3B82F6' :
                      selectedReview.overallRating >= 3.5 ? '#F59E0B' : '#EF4444'
                  }}
                >
                  {selectedReview.overallRating}
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Typography variant="h4" className="text-md font-medium mb-3">
                  Strengths
                </Typography>
                <ul className="space-y-2">
                  {selectedReview.strengths.map((strength, index) => (
                    <li key={index} className="flex items-start">
                      <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <Typography variant="body1" className="text-gray-700">
                        {strength}
                      </Typography>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <Typography variant="h4" className="text-md font-medium mb-3">
                  Areas for Improvement
                </Typography>
                <ul className="space-y-2">
                  {selectedReview.areasForImprovement.map((area, index) => (
                    <li key={index} className="flex items-start">
                      <svg className="h-5 w-5 text-yellow-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <Typography variant="body1" className="text-gray-700">
                        {area}
                      </Typography>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="mt-6">
              <Typography variant="h4" className="text-md font-medium mb-3">
                Goals for Next Period
              </Typography>
              <ul className="space-y-2">
                {selectedReview.goals.map((goal, index) => (
                  <li key={index} className="flex items-start">
                    <svg className="h-5 w-5 text-blue-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <Typography variant="body1" className="text-gray-700">
                      {goal}
                    </Typography>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

EmployeePerformanceTab.propTypes = {
  employeeId: PropTypes.string.isRequired,
};

export default EmployeePerformanceTab;
