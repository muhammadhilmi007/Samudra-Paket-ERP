/**
 * Track Page
 * Public page for shipment tracking
 */

import ShipmentTracker from '../../components/shipment/ShipmentTracker';

/**
 * Track Page
 * Displays shipment tracking functionality
 */
export default function TrackPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Track Your Shipment</h1>
        <p className="text-lg text-gray-600">
          Enter your tracking number to get real-time updates on your shipment
        </p>
      </div>
      
      <ShipmentTracker />
      
      <div className="mt-16 max-w-2xl mx-auto">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Tracking Information</h2>
        <div className="bg-white shadow-md rounded-lg p-6">
          <p className="text-gray-700 mb-4">
            With our advanced tracking system, you can:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-gray-700">
            <li>Track your shipment in real-time</li>
            <li>View detailed shipment history</li>
            <li>Receive estimated delivery dates</li>
            <li>View proof of delivery once completed</li>
          </ul>
          <p className="mt-4 text-gray-700">
            If you have any questions about your shipment, please contact our customer service at{' '}
            <a href="tel:+621234567890" className="text-primary-600 hover:text-primary-700">
              +62 123 456 7890
            </a>{' '}
            or email us at{' '}
            <a href="mailto:support@samudrapaket.com" className="text-primary-600 hover:text-primary-700">
              support@samudrapaket.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
