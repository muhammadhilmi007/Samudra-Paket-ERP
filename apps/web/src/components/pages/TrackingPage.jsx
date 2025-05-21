"use client";

/**
 * TrackingPage Component
 * Public page for tracking shipments
 */

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Typography from '../atoms/Typography';
import Button from '../atoms/Button';
import FormField from '../molecules/FormField';
import Card from '../molecules/Card';
import { formatDate, formatTrackingNumber } from '../../utils/formatters';

// Form validation schema
const trackingSchema = z.object({
  trackingNumber: z
    .string()
    .min(1, { message: 'Tracking number is required' })
    .regex(/^[A-Za-z0-9\s-]{6,20}$/, {
      message: 'Please enter a valid tracking number',
    }),
});

const TrackingPage = () => {
  const [trackingResult, setTrackingResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(trackingSchema),
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // In a real application, this would be an API call
      // For demo purposes, we'll simulate an API response
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Simulate tracking result based on the input
      const trackingNumber = data.trackingNumber.replace(/\s/g, '');
      
      // Mock data for demonstration
      if (trackingNumber === 'SHP12345') {
        setTrackingResult({
          trackingNumber: 'SHP12345',
          status: 'in_transit',
          statusText: 'In Transit',
          origin: 'Jakarta',
          destination: 'Surabaya',
          estimatedDelivery: '2025-05-22',
          customer: 'PT Maju Bersama',
          events: [
            {
              date: '2025-05-18T14:30:00',
              location: 'Jakarta Sorting Center',
              description: 'Package has left the sorting facility',
              status: 'in_transit',
            },
            {
              date: '2025-05-18T10:15:00',
              location: 'Jakarta Sorting Center',
              description: 'Package arrived at sorting facility',
              status: 'in_transit',
            },
            {
              date: '2025-05-17T16:45:00',
              location: 'Jakarta',
              description: 'Package picked up from sender',
              status: 'processing',
            },
            {
              date: '2025-05-17T09:20:00',
              location: 'Jakarta',
              description: 'Shipment created',
              status: 'processing',
            },
          ],
        });
      } else if (trackingNumber === 'SHP12346') {
        setTrackingResult({
          trackingNumber: 'SHP12346',
          status: 'delivered',
          statusText: 'Delivered',
          origin: 'Bandung',
          destination: 'Semarang',
          deliveredAt: '2025-05-16T14:25:00',
          customer: 'CV Teknologi Nusantara',
          events: [
            {
              date: '2025-05-16T14:25:00',
              location: 'Semarang',
              description: 'Package delivered to recipient',
              status: 'delivered',
            },
            {
              date: '2025-05-16T09:10:00',
              location: 'Semarang Distribution Center',
              description: 'Out for delivery',
              status: 'in_transit',
            },
            {
              date: '2025-05-15T18:30:00',
              location: 'Semarang Distribution Center',
              description: 'Package arrived at distribution center',
              status: 'in_transit',
            },
            {
              date: '2025-05-14T08:45:00',
              location: 'Bandung',
              description: 'Package picked up from sender',
              status: 'processing',
            },
          ],
        });
      } else {
        setError('Tracking information not found. Please check the tracking number and try again.');
      }
    } catch (err) {
      setError('An error occurred while tracking the shipment. Please try again later.');
      console.error('Tracking error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Get status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'in_transit':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'pending':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Typography variant="h3" className="text-gray-900 mb-2">
            Track Your Shipment
          </Typography>
          <Typography variant="body1" className="text-gray-600 max-w-2xl mx-auto">
            Enter your tracking number to get real-time updates on your shipment status and location.
          </Typography>
        </div>

        <div className="max-w-xl mx-auto mb-12">
          <Card className="p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                name="trackingNumber"
                label="Tracking Number"
                placeholder="Enter tracking number (e.g., SHP12345)"
                register={register}
                error={errors.trackingNumber?.message}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Tracking...' : 'Track Shipment'}
              </Button>
            </form>
          </Card>
        </div>

        {error && (
          <div className="max-w-3xl mx-auto mb-12">
            <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <Typography variant="body2" className="text-red-700">
                    {error}
                  </Typography>
                </div>
              </div>
            </div>
          </div>
        )}

        {trackingResult && (
          <div className="max-w-3xl mx-auto">
            <Card className="mb-8">
              <div className="border-b border-gray-200 px-6 py-5">
                <div className="flex justify-between items-center">
                  <Typography variant="h5" className="text-gray-900">
                    Shipment Details
                  </Typography>
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                      trackingResult.status
                    )}`}
                  >
                    {trackingResult.statusText}
                  </span>
                </div>
              </div>
              <div className="px-6 py-5">
                <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Tracking Number</dt>
                    <dd className="mt-1 text-lg font-semibold text-gray-900">
                      {formatTrackingNumber(trackingResult.trackingNumber)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Customer</dt>
                    <dd className="mt-1 text-lg font-semibold text-gray-900">
                      {trackingResult.customer}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Origin</dt>
                    <dd className="mt-1 text-lg font-semibold text-gray-900">
                      {trackingResult.origin}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Destination</dt>
                    <dd className="mt-1 text-lg font-semibold text-gray-900">
                      {trackingResult.destination}
                    </dd>
                  </div>
                  {trackingResult.estimatedDelivery && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Estimated Delivery</dt>
                      <dd className="mt-1 text-lg font-semibold text-gray-900">
                        {formatDate(trackingResult.estimatedDelivery)}
                      </dd>
                    </div>
                  )}
                  {trackingResult.deliveredAt && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Delivered At</dt>
                      <dd className="mt-1 text-lg font-semibold text-gray-900">
                        {formatDate(trackingResult.deliveredAt, {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </dd>
                    </div>
                  )}
                </dl>
              </div>
            </Card>

            <Card>
              <div className="border-b border-gray-200 px-6 py-5">
                <Typography variant="h5" className="text-gray-900">
                  Tracking History
                </Typography>
              </div>
              <div className="px-6 py-5">
                <div className="flow-root">
                  <ul className="-mb-8">
                    {trackingResult.events.map((event, eventIdx) => (
                      <li key={eventIdx}>
                        <div className="relative pb-8">
                          {eventIdx !== trackingResult.events.length - 1 ? (
                            <span
                              className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                              aria-hidden="true"
                            />
                          ) : null}
                          <div className="relative flex space-x-3">
                            <div>
                              <span
                                className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${
                                  event.status === 'delivered'
                                    ? 'bg-green-500'
                                    : event.status === 'in_transit'
                                    ? 'bg-blue-500'
                                    : 'bg-yellow-500'
                                }`}
                              >
                                {event.status === 'delivered' ? (
                                  <svg
                                    className="h-5 w-5 text-white"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                ) : event.status === 'in_transit' ? (
                                  <svg
                                    className="h-5 w-5 text-white"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                ) : (
                                  <svg
                                    className="h-5 w-5 text-white"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                )}
                              </span>
                            </div>
                            <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                              <div>
                                <Typography variant="subtitle2" className="text-gray-900">
                                  {event.description}
                                </Typography>
                                <Typography variant="body2" className="text-gray-500 mt-1">
                                  {event.location}
                                </Typography>
                              </div>
                              <div className="text-right text-sm whitespace-nowrap text-gray-500">
                                <time dateTime={event.date}>
                                  {formatDate(event.date, {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })}
                                </time>
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackingPage;
