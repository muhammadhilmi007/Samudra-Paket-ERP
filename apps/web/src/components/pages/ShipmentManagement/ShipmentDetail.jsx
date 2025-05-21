"use client";

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { PencilIcon, ArrowLeftIcon, TruckIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import { Tabs } from '../../molecules/Tabs';
import Stepper from '../../molecules/Stepper';
import Button from '../../atoms/Button';
import ShipmentForm from './ShipmentForm';

/**
 * ShipmentDetail Component
 * A page for displaying detailed information about a shipment
 */
const ShipmentDetail = ({
  shipment,
  trackingEvents = [],
  onShipmentUpdate,
  onShipmentDelete,
  onBack,
  loading = false,
  className = '',
}) => {
  // State for active tab
  const [activeTab, setActiveTab] = useState('overview');
  
  // State for edit modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Handle shipment update
  const handleShipmentUpdate = async (data) => {
    if (onShipmentUpdate) {
      await onShipmentUpdate({
        ...shipment,
        ...data,
        updatedAt: new Date().toISOString(),
      });
    }
    setIsEditModalOpen(false);
  };

  // Handle shipment deletion
  const handleShipmentDelete = async (shipmentId) => {
    if (onShipmentDelete) {
      await onShipmentDelete(shipmentId);
      if (onBack) {
        onBack();
      }
    }
  };

  // Get status step based on shipment status
  const getStatusStep = () => {
    switch (shipment.status) {
      case 'pending':
        return 0;
      case 'in_transit':
        return 1;
      case 'delivered':
        return 2;
      case 'cancelled':
        return -1; // Special case for cancelled
      default:
        return 0;
    }
  };

  // Render shipment status stepper
  const renderStatusStepper = () => {
    const steps = [
      {
        title: 'Pending',
        description: 'Shipment registered',
      },
      {
        title: 'In Transit',
        description: 'Shipment in delivery',
      },
      {
        title: 'Delivered',
        description: 'Shipment completed',
      },
    ];

    if (shipment.status === 'cancelled') {
      return (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <span className="text-red-600 text-xl">×</span>
              </div>
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-medium text-red-800">Shipment Cancelled</h3>
              <div className="mt-2 text-sm text-red-700">
                This shipment has been cancelled and will not be processed further.
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="mb-6">
        <Stepper
          steps={steps}
          currentStep={getStatusStep()}
          orientation="horizontal"
        />
      </div>
    );
  };

  // Render shipment information
  const renderShipmentInfo = () => {
    return (
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Shipment Information
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Package and service details
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => setIsEditModalOpen(true)}
            className="flex items-center"
          >
            <PencilIcon className="h-4 w-4 mr-1" />
            Edit
          </Button>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
          <dl className="sm:divide-y sm:divide-gray-200">
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Tracking number</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 font-mono">{shipment.trackingNumber}</dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Customer</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {shipment.customerName} ({shipment.customerCode})
              </dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Status</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  shipment.status === 'delivered' 
                    ? 'bg-green-100 text-green-800' 
                    : shipment.status === 'in_transit'
                    ? 'bg-blue-100 text-blue-800'
                    : shipment.status === 'pending'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {shipment.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </span>
              </dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Service type</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {shipment.service.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </span>
              </dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Package type</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{shipment.packageType.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Weight & dimensions</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {shipment.packageWeight} kg • {shipment.packageLength} × {shipment.packageWidth} × {shipment.packageHeight} cm
              </dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Declared value</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                Rp {shipment.packageValue?.toLocaleString() || '0'}
              </dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Created date</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {new Date(shipment.createdAt).toLocaleString()}
              </dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Estimated delivery</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {shipment.estimatedDeliveryDate 
                  ? new Date(shipment.estimatedDeliveryDate).toLocaleDateString() 
                  : 'Not specified'}
              </dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Description</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{shipment.packageDescription || '-'}</dd>
            </div>
          </dl>
        </div>
      </div>
    );
  };

  // Render origin and destination information
  const renderRouteInfo = () => {
    return (
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Origin & Destination
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Pickup and delivery details
          </p>
        </div>
        <div className="border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-200">
            {/* Origin */}
            <div className="p-6">
              <h4 className="text-base font-medium text-gray-900 mb-4 flex items-center">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                  <span className="text-blue-600 text-lg">A</span>
                </div>
                Origin
              </h4>
              
              <div className="space-y-3">
                <div>
                  <div className="text-sm font-medium text-gray-500">Name</div>
                  <div className="mt-1 text-sm text-gray-900">{shipment.origin}</div>
                </div>
                
                <div>
                  <div className="text-sm font-medium text-gray-500">Contact</div>
                  <div className="mt-1 text-sm text-gray-900">
                    {shipment.originContactName}<br />
                    {shipment.originContactPhone}
                  </div>
                </div>
                
                <div>
                  <div className="text-sm font-medium text-gray-500">Address</div>
                  <div className="mt-1 text-sm text-gray-900">
                    {shipment.originAddress}<br />
                    {shipment.originCity}, {shipment.originZipCode}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Destination */}
            <div className="p-6">
              <h4 className="text-base font-medium text-gray-900 mb-4 flex items-center">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-2">
                  <span className="text-green-600 text-lg">B</span>
                </div>
                Destination
              </h4>
              
              <div className="space-y-3">
                <div>
                  <div className="text-sm font-medium text-gray-500">Name</div>
                  <div className="mt-1 text-sm text-gray-900">{shipment.destination}</div>
                </div>
                
                <div>
                  <div className="text-sm font-medium text-gray-500">Contact</div>
                  <div className="mt-1 text-sm text-gray-900">
                    {shipment.destinationContactName}<br />
                    {shipment.destinationContactPhone}
                  </div>
                </div>
                
                <div>
                  <div className="text-sm font-medium text-gray-500">Address</div>
                  <div className="mt-1 text-sm text-gray-900">
                    {shipment.destinationAddress}<br />
                    {shipment.destinationCity}, {shipment.destinationZipCode}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render payment information
  const renderPaymentInfo = () => {
    return (
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Payment Information
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Payment details and status
          </p>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
          <dl className="sm:divide-y sm:divide-gray-200">
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Amount</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 font-medium">
                Rp {shipment.amount.toLocaleString()}
              </dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Payment method</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {shipment.paymentMethod.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Payment status</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  shipment.paymentStatus === 'paid' 
                    ? 'bg-green-100 text-green-800' 
                    : shipment.paymentStatus === 'pending'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {shipment.paymentStatus.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </span>
              </dd>
            </div>
            {shipment.paymentMethod === 'cod' && (
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">COD amount</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  Rp {shipment.amount.toLocaleString()}
                </dd>
              </div>
            )}
          </dl>
        </div>
      </div>
    );
  };

  // Render tracking history
  const renderTrackingHistory = () => {
    // If no tracking events, show a message
    if (!trackingEvents || trackingEvents.length === 0) {
      return (
        <div className="bg-white shadow rounded-lg p-6 text-center">
          <TruckIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">No tracking events yet</h3>
          <p className="text-sm text-gray-500">
            Tracking information will appear here once the shipment is processed.
          </p>
        </div>
      );
    }

    return (
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Tracking History
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Shipment movement and status updates
          </p>
        </div>
        <div className="border-t border-gray-200">
          <ul className="divide-y divide-gray-200">
            {trackingEvents.map((event, index) => (
              <li key={index} className="px-4 py-4 sm:px-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      event.status === 'delivered' 
                        ? 'bg-green-100' 
                        : event.status === 'in_transit'
                        ? 'bg-blue-100'
                        : event.status === 'pending'
                        ? 'bg-yellow-100'
                        : 'bg-red-100'
                    }`}>
                      <span className={`text-lg ${
                        event.status === 'delivered' 
                          ? 'text-green-600' 
                          : event.status === 'in_transit'
                          ? 'text-blue-600'
                          : event.status === 'pending'
                          ? 'text-yellow-600'
                          : 'text-red-600'
                      }`}>
                        {index + 1}
                      </span>
                    </div>
                  </div>
                  <div className="ml-3 flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-gray-900">{event.description}</h4>
                      <span className="text-sm text-gray-500">
                        {new Date(event.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <div className="mt-1 text-sm text-gray-500">
                      {event.location && (
                        <div className="mt-1">
                          <span className="font-medium">Location:</span> {event.location}
                        </div>
                      )}
                      {event.notes && (
                        <div className="mt-1">
                          <span className="font-medium">Notes:</span> {event.notes}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  };

  // Render documents and photos
  const renderDocuments = () => {
    const packagePhotos = shipment.packagePhotos || [];
    const documents = shipment.documents || [];
    
    if (packagePhotos.length === 0 && documents.length === 0) {
      return (
        <div className="bg-white shadow rounded-lg p-6 text-center">
          <DocumentTextIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">No documents uploaded</h3>
          <p className="text-sm text-gray-500">
            Documents and photos related to this shipment will appear here.
          </p>
        </div>
      );
    }
    
    return (
      <div className="space-y-6">
        {/* Package Photos */}
        {packagePhotos.length > 0 && (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Package Photos
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Photos of the package
              </p>
            </div>
            <div className="border-t border-gray-200 p-4">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {packagePhotos.map((photo, index) => (
                  <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                    <img
                      src={photo.url || URL.createObjectURL(photo)}
                      alt={`Package photo ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {/* Documents */}
        {documents.length > 0 && (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Documents
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Shipping documents and attachments
              </p>
            </div>
            <div className="border-t border-gray-200">
              <ul className="divide-y divide-gray-200">
                {documents.map((doc, index) => (
                  <li key={index} className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <DocumentTextIcon className="h-5 w-5 text-gray-400 mr-3" />
                        <span className="text-sm font-medium text-gray-900">
                          {doc.name || `Document ${index + 1}`}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(doc.url || URL.createObjectURL(doc), '_blank')}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        View
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Render overview tab
  const renderOverviewTab = () => {
    return (
      <div className="space-y-6">
        {renderStatusStepper()}
        {renderShipmentInfo()}
        {renderRouteInfo()}
        {renderPaymentInfo()}
      </div>
    );
  };

  // Render tracking tab
  const renderTrackingTab = () => {
    return (
      <div className="space-y-6">
        {renderStatusStepper()}
        {renderTrackingHistory()}
      </div>
    );
  };

  // Render documents tab
  const renderDocumentsTab = () => {
    return renderDocuments();
  };

  return (
    <div className={`max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 ${className}`}>
      <div className="mb-6 flex items-center">
        <Button
          variant="ghost"
          onClick={onBack}
          className="mr-4"
        >
          <ArrowLeftIcon className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Shipment #{shipment.trackingNumber}</h1>
          <p className="mt-1 text-sm text-gray-500">
            Created on {new Date(shipment.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      <Tabs
        defaultActiveKey={activeTab}
        onChange={setActiveTab}
        className="mb-6"
      >
        <Tabs.Tab key="overview" tab="Overview">
          {renderOverviewTab()}
        </Tabs.Tab>
        <Tabs.Tab key="tracking" tab="Tracking">
          {renderTrackingTab()}
        </Tabs.Tab>
        <Tabs.Tab key="documents" tab="Documents">
          {renderDocumentsTab()}
        </Tabs.Tab>
      </Tabs>

      {isEditModalOpen && (
        <ShipmentForm
          shipment={shipment}
          mode="edit"
          onSubmit={handleShipmentUpdate}
          onDelete={handleShipmentDelete}
          onClose={() => setIsEditModalOpen(false)}
          loading={loading}
        />
      )}
    </div>
  );
};

ShipmentDetail.propTypes = {
  /**
   * Shipment data
   */
  shipment: PropTypes.shape({
    id: PropTypes.string.isRequired,
    trackingNumber: PropTypes.string.isRequired,
    customerName: PropTypes.string.isRequired,
    customerCode: PropTypes.string.isRequired,
    packageType: PropTypes.string.isRequired,
    packageWeight: PropTypes.number.isRequired,
    packageLength: PropTypes.number.isRequired,
    packageWidth: PropTypes.number.isRequired,
    packageHeight: PropTypes.number.isRequired,
    packageValue: PropTypes.number,
    packageDescription: PropTypes.string,
    origin: PropTypes.string.isRequired,
    originAddress: PropTypes.string.isRequired,
    originCity: PropTypes.string.isRequired,
    originZipCode: PropTypes.string.isRequired,
    originContactName: PropTypes.string.isRequired,
    originContactPhone: PropTypes.string.isRequired,
    destination: PropTypes.string.isRequired,
    destinationAddress: PropTypes.string.isRequired,
    destinationCity: PropTypes.string.isRequired,
    destinationZipCode: PropTypes.string.isRequired,
    destinationContactName: PropTypes.string.isRequired,
    destinationContactPhone: PropTypes.string.isRequired,
    service: PropTypes.string.isRequired,
    estimatedDeliveryDate: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
    paymentMethod: PropTypes.string.isRequired,
    paymentStatus: PropTypes.string.isRequired,
    amount: PropTypes.number.isRequired,
    status: PropTypes.string.isRequired,
    notes: PropTypes.string,
    packagePhotos: PropTypes.array,
    documents: PropTypes.array,
    createdAt: PropTypes.string.isRequired,
    updatedAt: PropTypes.string,
  }).isRequired,
  /**
   * Array of tracking event objects
   */
  trackingEvents: PropTypes.arrayOf(
    PropTypes.shape({
      timestamp: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      location: PropTypes.string,
      notes: PropTypes.string,
    })
  ),
  /**
   * Callback when shipment is updated
   */
  onShipmentUpdate: PropTypes.func,
  /**
   * Callback when shipment is deleted
   */
  onShipmentDelete: PropTypes.func,
  /**
   * Callback when back button is clicked
   */
  onBack: PropTypes.func,
  /**
   * Whether the component is in a loading state
   */
  loading: PropTypes.bool,
  /**
   * Additional CSS classes
   */
  className: PropTypes.string,
};

export default ShipmentDetail;
