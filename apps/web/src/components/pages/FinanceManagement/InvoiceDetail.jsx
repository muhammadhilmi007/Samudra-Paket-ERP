"use client";

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { PencilIcon, ArrowLeftIcon, DocumentTextIcon, PrinterIcon, EnvelopeIcon } from '@heroicons/react/24/outline';
import { Tabs } from '../../molecules/Tabs';
import Button from '../../atoms/Button';
import InvoiceForm from './InvoiceForm';
import { 
  setSelectedInvoice,
  clearSelectedInvoice,
  selectSelectedInvoice
} from '../../../store/slices/financeSlice';
import { 
  useGetInvoiceByIdQuery,
  useGetInvoicePaymentsQuery,
  useDeleteInvoiceMutation 
} from '../../../store/api/financeApi';

/**
 * InvoiceDetail Component
 * A page for displaying detailed information about an invoice
 * Integrated with Redux store and RTK Query
 */
const InvoiceDetail = ({
  invoiceId,
  onPrintInvoice,
  onSendInvoice,
  onBack,
  className = '',
}) => {
  const dispatch = useDispatch();
  
  // Get selected invoice from Redux store
  const selectedInvoice = useSelector(selectSelectedInvoice);
  
  // RTK Query hooks
  const { data, isLoading: isLoadingInvoice } = useGetInvoiceByIdQuery(invoiceId, {
    skip: !invoiceId,
  });
  
  const { data: paymentsData, isLoading: isLoadingPayments } = useGetInvoicePaymentsQuery(invoiceId, {
    skip: !invoiceId,
  });
  
  const [deleteInvoice, { isLoading: isDeleting }] = useDeleteInvoiceMutation();
  
  // Extract data from API responses
  const invoice = data || selectedInvoice;
  const payments = paymentsData?.data || [];
  const loading = isLoadingInvoice || isLoadingPayments || isDeleting;
  
  // State for active tab
  const [activeTab, setActiveTab] = useState('overview');
  
  // State for edit modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  // Update selected invoice in Redux store when data changes
  useEffect(() => {
    if (data) {
      dispatch(setSelectedInvoice(data));
    }
    
    return () => {
      dispatch(clearSelectedInvoice());
    };
  }, [data, dispatch]);

  // Handle invoice update
  const handleInvoiceUpdate = (data) => {
    // Form submission is now handled in InvoiceForm component with RTK Query
    setIsEditModalOpen(false);
  };

  // Handle invoice deletion
  const handleInvoiceDelete = async (invoice) => {
    try {
      if (invoice?.id) {
        await deleteInvoice(invoice.id).unwrap();
        if (onBack) {
          onBack();
        }
      }
    } catch (error) {
      console.error('Error deleting invoice:', error);
    }
  };

  // Handle print invoice
  const handlePrintInvoice = () => {
    if (onPrintInvoice) {
      onPrintInvoice(invoice);
    }
  };

  // Handle send invoice
  const handleSendInvoice = () => {
    if (onSendInvoice) {
      onSendInvoice(invoice);
    }
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'paid':
        return 'green';
      case 'pending':
        return 'yellow';
      case 'overdue':
        return 'red';
      case 'cancelled':
        return 'gray';
      default:
        return 'gray';
    }
  };

  // Render invoice header
  const renderInvoiceHeader = () => {
    return (
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="flex items-center mb-4 md:mb-0">
          <Button
            variant="ghost"
            onClick={onBack}
            className="mr-4"
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Invoice #{invoice.invoiceNumber}</h1>
            <p className="mt-1 text-sm text-gray-500">
              Issued on {new Date(invoice.date).toLocaleDateString()}
            </p>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={handlePrintInvoice}
            className="flex items-center"
          >
            <PrinterIcon className="h-4 w-4 mr-1" />
            Print
          </Button>
          
          <Button
            variant="outline"
            onClick={handleSendInvoice}
            className="flex items-center"
          >
            <EnvelopeIcon className="h-4 w-4 mr-1" />
            Send
          </Button>
          
          <Button
            variant="outline"
            onClick={() => setIsEditModalOpen(true)}
            className="flex items-center"
          >
            <PencilIcon className="h-4 w-4 mr-1" />
            Edit
          </Button>
          
          <Button
            variant={invoice.status === 'paid' ? 'success' : invoice.status === 'overdue' ? 'danger' : 'primary'}
            disabled={invoice.status === 'paid' || invoice.status === 'cancelled'}
            onClick={() => {
              if (invoice.status !== 'paid' && invoice.status !== 'cancelled') {
                handleInvoiceUpdate({
                  ...invoice,
                  status: 'paid',
                });
              }
            }}
          >
            {invoice.status === 'paid' ? 'Paid' : 'Mark as Paid'}
          </Button>
        </div>
      </div>
    );
  };

  // Render invoice information
  const renderInvoiceInfo = () => {
    return (
      <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-200">
          {/* Left column */}
          <div className="p-6">
            <div className="mb-6">
              <h2 className="text-lg font-medium text-gray-900 mb-1">Invoice Information</h2>
              <div className="text-sm text-gray-500">Details about this invoice</div>
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="text-sm font-medium text-gray-500">Invoice Number</div>
                <div className="mt-1 text-sm font-medium text-gray-900">{invoice.invoiceNumber}</div>
              </div>
              
              <div>
                <div className="text-sm font-medium text-gray-500">Status</div>
                <div className="mt-1">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${getStatusColor(invoice.status)}-100 text-${getStatusColor(invoice.status)}-800`}>
                    {invoice.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </span>
                </div>
              </div>
              
              <div>
                <div className="text-sm font-medium text-gray-500">Issue Date</div>
                <div className="mt-1 text-sm text-gray-900">{new Date(invoice.date).toLocaleDateString()}</div>
              </div>
              
              <div>
                <div className="text-sm font-medium text-gray-500">Due Date</div>
                <div className="mt-1 text-sm text-gray-900">{new Date(invoice.dueDate).toLocaleDateString()}</div>
              </div>
              
              <div>
                <div className="text-sm font-medium text-gray-500">Payment Terms</div>
                <div className="mt-1 text-sm text-gray-900">
                  {invoice.paymentTerms?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'N/A'}
                </div>
              </div>
            </div>
          </div>
          
          {/* Right column */}
          <div className="p-6">
            <div className="mb-6">
              <h2 className="text-lg font-medium text-gray-900 mb-1">Customer Information</h2>
              <div className="text-sm text-gray-500">Customer details</div>
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="text-sm font-medium text-gray-500">Customer Name</div>
                <div className="mt-1 text-sm font-medium text-gray-900">{invoice.customerName}</div>
              </div>
              
              <div>
                <div className="text-sm font-medium text-gray-500">Customer Code</div>
                <div className="mt-1 text-sm text-gray-900">{invoice.customerCode}</div>
              </div>
              
              {invoice.customerAddress && (
                <div>
                  <div className="text-sm font-medium text-gray-500">Address</div>
                  <div className="mt-1 text-sm text-gray-900">{invoice.customerAddress}</div>
                </div>
              )}
              
              {invoice.customerEmail && (
                <div>
                  <div className="text-sm font-medium text-gray-500">Email</div>
                  <div className="mt-1 text-sm text-gray-900">{invoice.customerEmail}</div>
                </div>
              )}
              
              {invoice.customerPhone && (
                <div>
                  <div className="text-sm font-medium text-gray-500">Phone</div>
                  <div className="mt-1 text-sm text-gray-900">{invoice.customerPhone}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render invoice items
  const renderInvoiceItems = () => {
    return (
      <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
        <div className="px-6 py-5 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Invoice Items</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantity
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Unit Price
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {invoice.items.map((item, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                    {item.quantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                    Rp {item.unitPrice.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                    Rp {item.amount.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div className="flex flex-col items-end space-y-2">
            <div className="w-full max-w-xs">
              <div className="flex justify-between py-2">
                <span className="text-sm text-gray-500">Subtotal:</span>
                <span className="text-sm font-medium text-gray-900">
                  Rp {invoice.subtotal.toLocaleString()}
                </span>
              </div>
              
              {invoice.tax > 0 && (
                <div className="flex justify-between py-2">
                  <span className="text-sm text-gray-500">Tax:</span>
                  <span className="text-sm font-medium text-gray-900">
                    Rp {invoice.tax.toLocaleString()}
                  </span>
                </div>
              )}
              
              {invoice.discount > 0 && (
                <div className="flex justify-between py-2">
                  <span className="text-sm text-gray-500">Discount:</span>
                  <span className="text-sm font-medium text-gray-900">
                    Rp {invoice.discount.toLocaleString()}
                  </span>
                </div>
              )}
              
              <div className="flex justify-between py-2 border-t border-gray-200 font-medium">
                <span className="text-base text-gray-900">Total:</span>
                <span className="text-base text-gray-900">
                  Rp {invoice.amount.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render payment history
  const renderPaymentHistory = () => {
    if (!payments || payments.length === 0) {
      return (
        <div className="bg-white shadow rounded-lg p-6 text-center">
          <DocumentTextIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">No payments yet</h3>
          <p className="text-sm text-gray-500">
            Payment information will appear here once the invoice is paid.
          </p>
        </div>
      );
    }

    return (
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Payment History</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reference
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Method
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {payments.map((payment, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(payment.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {payment.reference}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {payment.method.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                    Rp {payment.amount.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // Render notes
  const renderNotes = () => {
    if (!invoice.notes) {
      return null;
    }

    return (
      <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
        <div className="px-6 py-5 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Notes</h2>
        </div>
        <div className="px-6 py-4">
          <p className="text-sm text-gray-900 whitespace-pre-line">{invoice.notes}</p>
        </div>
      </div>
    );
  };

  // Render overview tab
  const renderOverviewTab = () => {
    return (
      <div className="space-y-6">
        {renderInvoiceInfo()}
        {renderInvoiceItems()}
        {renderNotes()}
      </div>
    );
  };

  // Render payments tab
  const renderPaymentsTab = () => {
    return renderPaymentHistory();
  };

  return (
    <div className={`max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 ${className}`}>
      {renderInvoiceHeader()}

      <Tabs
        defaultActiveKey={activeTab}
        onChange={setActiveTab}
        className="mb-6"
      >
        <Tabs.Tab key="overview" tab="Overview">
          {renderOverviewTab()}
        </Tabs.Tab>
        <Tabs.Tab key="payments" tab="Payments">
          {renderPaymentsTab()}
        </Tabs.Tab>
      </Tabs>

      {isEditModalOpen && (
        <InvoiceForm
          invoice={invoice}
          mode="edit"
          onSubmit={handleInvoiceUpdate}
          onDelete={handleInvoiceDelete}
          onClose={() => setIsEditModalOpen(false)}
          loading={loading}
        />
      )}
    </div>
  );
};

InvoiceDetail.propTypes = {
  /**
   * Invoice ID to fetch details for
   */
  invoiceId: PropTypes.string.isRequired,
  /**
   * Callback when invoice is printed
   */
  onPrintInvoice: PropTypes.func,
  /**
   * Callback when invoice is sent
   */
  onSendInvoice: PropTypes.func,
  /**
   * Callback when back button is clicked
   */
  onBack: PropTypes.func,
  /**
   * Additional class names
   */
  className: PropTypes.string,
};

export default InvoiceDetail;
