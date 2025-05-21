"use client";

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { PencilIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { Tabs } from '../../molecules/Tabs';
import Table from '../../organisms/Table';
import Button from '../../atoms/Button';
import CustomerForm from './CustomerForm';
import { LineChart, BarChart } from '../../organisms/Chart';
import { 
  selectSelectedCustomer,
  setSelectedCustomer,
  clearSelectedCustomer
} from '../../../store/slices/customerSlice';
import { 
  useGetCustomerByIdQuery,
  useDeleteCustomerMutation 
} from '../../../store/api/customerApi';

/**
 * CustomerDetail Component
 * A page for displaying detailed information about a customer
 * Integrated with Redux store and RTK Query
 */
const CustomerDetail = ({
  customerId,
  className = '',
  onBack,
}) => {
  const dispatch = useDispatch();
  const router = useRouter();
  
  // Get selected customer from Redux store
  const selectedCustomer = useSelector(selectSelectedCustomer);
  
  // RTK Query hooks
  const { data, isLoading, isFetching } = useGetCustomerByIdQuery(customerId, {
    skip: !customerId,
  });
  
  const [deleteCustomer] = useDeleteCustomerMutation();
  
  // Extract customer data from the API response
  const customer = data || selectedCustomer;
  const loading = isLoading || isFetching;
  
  // Placeholder data until we implement the related endpoints
  const shipments = [];
  const payments = [];
  
  // State for active tab
  const [activeTab, setActiveTab] = useState('overview');
  
  // State for edit modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  // Update selected customer in Redux store when data changes
  useEffect(() => {
    if (data) {
      dispatch(setSelectedCustomer(data));
    }
    
    return () => {
      dispatch(clearSelectedCustomer());
    };
  }, [data, dispatch]);

  // Shipment table columns
  const shipmentColumns = [
    {
      accessor: 'trackingNumber',
      header: 'Tracking Number',
      render: (value) => (
        <div className="font-medium text-blue-600">{value}</div>
      ),
    },
    {
      accessor: 'origin',
      header: 'Origin',
    },
    {
      accessor: 'destination',
      header: 'Destination',
    },
    {
      accessor: 'service',
      header: 'Service',
      render: (value) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {value}
        </span>
      ),
    },
    {
      accessor: 'status',
      header: 'Status',
      render: (value) => {
        let statusColor = 'gray';
        
        switch (value) {
          case 'delivered':
            statusColor = 'green';
            break;
          case 'in_transit':
            statusColor = 'blue';
            break;
          case 'pending':
            statusColor = 'yellow';
            break;
          case 'cancelled':
            statusColor = 'red';
            break;
        }
        
        return (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${statusColor}-100 text-${statusColor}-800`}>
            {value.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </span>
        );
      },
    },
    {
      accessor: 'createdAt',
      header: 'Date',
      render: (value) => new Date(value).toLocaleDateString(),
    },
    {
      accessor: 'amount',
      header: 'Amount',
      render: (value) => `Rp ${value.toLocaleString()}`,
      align: 'right',
    },
  ];

  // Payment table columns
  const paymentColumns = [
    {
      accessor: 'invoiceNumber',
      header: 'Invoice Number',
      render: (value) => (
        <div className="font-medium text-blue-600">{value}</div>
      ),
    },
    {
      accessor: 'paymentMethod',
      header: 'Payment Method',
      render: (value) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          {value}
        </span>
      ),
    },
    {
      accessor: 'status',
      header: 'Status',
      render: (value) => {
        let statusColor = 'gray';
        
        switch (value) {
          case 'paid':
            statusColor = 'green';
            break;
          case 'pending':
            statusColor = 'yellow';
            break;
          case 'cancelled':
            statusColor = 'red';
            break;
        }
        
        return (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${statusColor}-100 text-${statusColor}-800`}>
            {value.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </span>
        );
      },
    },
    {
      accessor: 'date',
      header: 'Date',
      render: (value) => new Date(value).toLocaleDateString(),
    },
    {
      accessor: 'amount',
      header: 'Amount',
      render: (value) => `Rp ${value.toLocaleString()}`,
      align: 'right',
    },
  ];

  // Prepare chart data
  const getShipmentChartData = () => {
    // Group shipments by month
    const shipmentsByMonth = {};
    const last6Months = [];
    
    // Generate last 6 months
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthYear = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      shipmentsByMonth[monthYear] = 0;
      last6Months.push(monthYear);
    }
    
    // Count shipments by month
    shipments.forEach(shipment => {
      const date = new Date(shipment.createdAt);
      const monthYear = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      
      if (last6Months.includes(monthYear)) {
        shipmentsByMonth[monthYear] = (shipmentsByMonth[monthYear] || 0) + 1;
      }
    });
    
    return {
      labels: last6Months,
      datasets: [
        {
          label: 'Shipments',
          data: last6Months.map(month => shipmentsByMonth[month]),
          backgroundColor: 'rgba(37, 99, 235, 0.2)',
          borderColor: 'rgba(37, 99, 235, 1)',
          borderWidth: 2,
        },
      ],
    };
  };

  const getRevenueChartData = () => {
    // Group payments by month
    const revenueByMonth = {};
    const last6Months = [];
    
    // Generate last 6 months
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthYear = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      revenueByMonth[monthYear] = 0;
      last6Months.push(monthYear);
    }
    
    // Sum payments by month
    payments.forEach(payment => {
      const date = new Date(payment.date);
      const monthYear = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      
      if (last6Months.includes(monthYear)) {
        revenueByMonth[monthYear] = (revenueByMonth[monthYear] || 0) + payment.amount;
      }
    });
    
    return {
      labels: last6Months,
      datasets: [
        {
          label: 'Revenue',
          data: last6Months.map(month => revenueByMonth[month]),
          backgroundColor: 'rgba(16, 185, 129, 0.2)',
          borderColor: 'rgba(16, 185, 129, 1)',
          borderWidth: 2,
          fill: true,
        },
      ],
    };
  };

  // Calculate customer metrics
  const totalShipments = shipments.length;
  const totalRevenue = payments.reduce((sum, payment) => sum + payment.amount, 0);
  const averageShipmentValue = totalShipments > 0 
    ? totalRevenue / totalShipments 
    : 0;
  const activeShipments = shipments.filter(s => s.status === 'in_transit').length;

  // Handle edit customer
  const handleEditClick = () => {
    setIsEditModalOpen(true);
  };

  // Handle form submit (update)
  const handleFormSubmit = () => {
    // Form submission is now handled in CustomerForm component with RTK Query
    setIsEditModalOpen(false);
  };

  // Handle customer delete
  const handleCustomerDelete = async (customer) => {
    try {
      if (customer?.id) {
        await deleteCustomer(customer.id).unwrap();
        setIsEditModalOpen(false);
        onBack && onBack();
      }
    } catch (error) {
      console.error('Error deleting customer:', error);
    }
  };

  // Render customer information
  const renderCustomerInfo = () => {
    return (
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Customer Information
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Personal and contact details
            </p>
          </div>
          <Button
            variant="outline"
            onClick={handleEditClick}
            className="flex items-center"
          >
            <PencilIcon className="h-4 w-4 mr-1" />
            Edit
          </Button>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
          <dl className="sm:divide-y sm:divide-gray-200">
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Customer name</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{customer.name}</dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Customer code</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{customer.code}</dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Type</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  customer.type === 'corporate' 
                    ? 'bg-blue-100 text-blue-800' 
                    : 'bg-green-100 text-green-800'
                }`}>
                  {customer.type === 'corporate' ? 'Corporate' : 'Individual'}
                </span>
              </dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Status</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  customer.status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {customer.status === 'active' ? 'Active' : 'Inactive'}
                </span>
              </dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Contact person</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{customer.contactPerson || '-'}</dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Email address</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{customer.email || '-'}</dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Phone number</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{customer.phone || '-'}</dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Tax ID / NPWP</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{customer.taxId || '-'}</dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Address</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {customer.address ? (
                  <>
                    {customer.address}<br />
                    {customer.city}{customer.state && `, ${customer.state}`} {customer.zipCode}<br />
                    {customer.country}
                  </>
                ) : (
                  '-'
                )}
              </dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Notes</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{customer.notes || '-'}</dd>
            </div>
          </dl>
        </div>
      </div>
    );
  };

  // Render customer metrics
  const renderCustomerMetrics = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="text-sm font-medium text-gray-500">Total Shipments</div>
          <div className="mt-1 text-3xl font-semibold text-gray-900">{totalShipments}</div>
        </div>
        
        <div className="bg-white shadow rounded-lg p-6">
          <div className="text-sm font-medium text-gray-500">Active Shipments</div>
          <div className="mt-1 text-3xl font-semibold text-gray-900">{activeShipments}</div>
        </div>
        
        <div className="bg-white shadow rounded-lg p-6">
          <div className="text-sm font-medium text-gray-500">Total Revenue</div>
          <div className="mt-1 text-3xl font-semibold text-gray-900">Rp {totalRevenue.toLocaleString()}</div>
        </div>
        
        <div className="bg-white shadow rounded-lg p-6">
          <div className="text-sm font-medium text-gray-500">Avg. Shipment Value</div>
          <div className="mt-1 text-3xl font-semibold text-gray-900">Rp {averageShipmentValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
        </div>
      </div>
    );
  };

  // Render overview tab
  const renderOverviewTab = () => {
    return (
      <div className="space-y-6">
        {renderCustomerMetrics()}
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Shipment Activity</h3>
            <LineChart
              data={getShipmentChartData()}
              height={300}
            />
          </div>
          
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Revenue</h3>
            <BarChart
              data={getRevenueChartData()}
              height={300}
            />
          </div>
        </div>
        
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Recent Shipments
            </h3>
          </div>
          <Table
            data={shipments.slice(0, 5)}
            columns={shipmentColumns}
            loading={isLoading}
            emptyMessage="No shipments found"
            pagination={false}
          />
        </div>
      </div>
    );
  };

  // Render shipments tab
  const renderShipmentsTab = () => {
    return (
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <Table
          data={shipments}
          columns={shipmentColumns}
          loading={isLoading}
          emptyMessage="No shipments found"
          pagination={true}
          itemsPerPage={10}
        />
      </div>
    );
  };

  // Render payments tab
  const renderPaymentsTab = () => {
    return (
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <Table
          data={payments}
          columns={paymentColumns}
          loading={isLoading}
          emptyMessage="No payments found"
          pagination={true}
          itemsPerPage={10}
        />
      </div>
    );
  };

  // Render details tab
  const renderDetailsTab = () => {
    return renderCustomerInfo();
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
          <h1 className="text-2xl font-bold text-gray-900">{customer.name}</h1>
          <p className="mt-1 text-sm text-gray-500">
            Customer Code: {customer.code}
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
        <Tabs.Tab key="shipments" tab="Shipments">
          {renderShipmentsTab()}
        </Tabs.Tab>
        <Tabs.Tab key="payments" tab="Payments">
          {renderPaymentsTab()}
        </Tabs.Tab>
        <Tabs.Tab key="details" tab="Details">
          {renderDetailsTab()}
        </Tabs.Tab>
      </Tabs>

      {isEditModalOpen && (
        <CustomerForm
          customer={customer}
          mode="edit"
          onSubmit={handleFormSubmit}
          onDelete={handleCustomerDelete}
          onClose={() => setIsEditModalOpen(false)}
          loading={isLoading || isDeleting}
        />
      )}
    </div>
  );
};

CustomerDetail.propTypes = {
  /**
   * Customer ID to fetch details for
   */
  customerId: PropTypes.string.isRequired,
  /**
   * Callback when back button is clicked
   */
  onBack: PropTypes.func,
  /**
   * Additional class names
   */
  className: PropTypes.string,
};

export default CustomerDetail;
