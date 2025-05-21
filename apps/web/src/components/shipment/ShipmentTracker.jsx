"use client";

/**
 * ShipmentTracker Component
 * Allows users to track shipments by tracking number
 */

import { useState } from 'react';
import { useCoreService } from '../../hooks';

/**
 * ShipmentTracker Component
 * Provides a form to track shipments and displays tracking results
 */
const ShipmentTracker = () => {
  const [trackingNumber, setTrackingNumber] = useState('');
  const { shipments } = useCoreService();
  const { execute: trackShipment, loading, error, data: trackingData } = shipments.trackShipment;

  /**
   * Handle form submission
   * @param {Event} e - Form submit event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!trackingNumber.trim()) return;
    
    try {
      await trackShipment(trackingNumber);
    } catch (error) {
      // Error is already handled by the useApi hook
      console.error('Tracking error:', error);
    }
  };

  /**
   * Render tracking status with appropriate styling
   * @param {string} status - Shipment status
   * @returns {JSX.Element} - Styled status element
   */
  const renderStatus = (status) => {
    let statusColor = 'bg-gray-100 text-gray-800';
    
    switch (status?.toLowerCase()) {
      case 'delivered':
        statusColor = 'bg-green-100 text-green-800';
        break;
      case 'in transit':
        statusColor = 'bg-blue-100 text-blue-800';
        break;
      case 'pending':
        statusColor = 'bg-yellow-100 text-yellow-800';
        break;
      case 'failed':
        statusColor = 'bg-red-100 text-red-800';
        break;
      default:
        statusColor = 'bg-gray-100 text-gray-800';
    }
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Track Your Shipment</h2>
      
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value)}
            placeholder="Enter tracking number"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            required
          />
          <button
            type="submit"
            disabled={loading || !trackingNumber.trim()}
            className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Tracking...' : 'Track'}
          </button>
        </div>
      </form>
      
      {error && (
        <div className="p-4 mb-6 bg-red-50 border-l-4 border-red-500 text-red-700">
          <p className="font-medium">Tracking Error</p>
          <p>{error}</p>
        </div>
      )}
      
      {trackingData && (
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-800">Tracking Details</h3>
          </div>
          
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-sm text-gray-500">Tracking Number</p>
                <p className="font-medium">{trackingData.trackingNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <div>{renderStatus(trackingData.status)}</div>
              </div>
              <div>
                <p className="text-sm text-gray-500">Origin</p>
                <p className="font-medium">{trackingData.origin}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Destination</p>
                <p className="font-medium">{trackingData.destination}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Estimated Delivery</p>
                <p className="font-medium">
                  {trackingData.estimatedDelivery ? new Date(trackingData.estimatedDelivery).toLocaleDateString() : 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Service Type</p>
                <p className="font-medium">{trackingData.serviceType}</p>
              </div>
            </div>
            
            {/* Tracking Timeline */}
            {trackingData.events && trackingData.events.length > 0 && (
              <div>
                <h4 className="text-md font-medium text-gray-800 mb-4">Tracking History</h4>
                <div className="relative">
                  {/* Timeline line */}
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                  
                  {/* Timeline events */}
                  <div className="space-y-6 ml-10">
                    {trackingData.events.map((event, index) => (
                      <div key={index} className="relative">
                        {/* Timeline dot */}
                        <div className="absolute -left-10 mt-1.5 w-4 h-4 rounded-full bg-primary-500 border-2 border-white"></div>
                        
                        {/* Event content */}
                        <div>
                          <p className="font-medium text-gray-800">{event.description}</p>
                          <div className="flex items-center text-sm text-gray-500 mt-1">
                            <span>{new Date(event.timestamp).toLocaleString()}</span>
                            <span className="mx-2">•</span>
                            <span>{event.location}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ShipmentTracker;
