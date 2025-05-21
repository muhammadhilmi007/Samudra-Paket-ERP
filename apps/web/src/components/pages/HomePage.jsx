"use client";

/**
 * HomePage Component
 * Landing page for the application
 */

import React from 'react';
import Link from 'next/link';
import Typography from '../atoms/Typography';
import Button from '../atoms/Button';
import Footer from '../organisms/Footer';

const HomePage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              {/* <img
                className="h-10 w-auto"
                src="../logo-samudra.svg"
                alt="Samudra Paket"
              /> */}
              <Typography variant="h5" className="ml-2 text-primary-600">
                Samudra Paket
              </Typography>
            </div>
            <div className="flex items-center space-x-4">
              <Link 
                href="/tracking" 
                className="text-gray-600 hover:text-gray-900 font-medium"
              >
                Track Shipment
              </Link>
              <Link 
                href="/auth/login" 
                className="text-gray-600 hover:text-gray-900 font-medium"
              >
                Login
              </Link>
              <Button 
                as={Link}
                href="/auth/register"
                variant="primary"
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-primary-600 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8 items-center">
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
                Logistics & Shipping Solutions for Your Business
              </h1>
              <p className="mt-6 text-xl text-primary-100 max-w-3xl">
                Samudra Paket ERP provides comprehensive logistics and shipping solutions to streamline your operations and enhance customer satisfaction.
              </p>
              <div className="mt-10 flex space-x-4">
                <Button 
                  as={Link}
                  href="/auth/register"
                  variant="secondary"
                  className="px-8 py-3 text-lg"
                >
                  Get Started
                </Button>
                <Button 
                  as={Link}
                  href="/tracking"
                  variant="outline"
                  className="px-8 py-3 text-lg text-white border-white hover:bg-primary-700"
                >
                  Track Shipment
                </Button>
              </div>
            </div>
            <div className="mt-12 lg:mt-0">
              <div className="pl-4 sm:pl-6 lg:pl-0">
                {/* <img
                  className="w-full rounded-xl shadow-xl ring-1 ring-black ring-opacity-5"
                  src="../logo-samudra.png"
                  alt="Shipping and logistics illustration"
                /> */}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Typography variant="h2" className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Comprehensive Logistics Solutions
            </Typography>
            <Typography variant="body1" className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
              Everything you need to manage your logistics operations efficiently
            </Typography>
          </div>

          <div className="mt-16">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {/* Feature 1 */}
              <div className="pt-6">
                <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-primary-500 rounded-md shadow-lg">
                        <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                        </svg>
                      </span>
                    </div>
                    <Typography variant="h5" className="mt-5 text-lg font-medium text-gray-900">
                      Pickup Management
                    </Typography>
                    <Typography variant="body2" className="mt-2 text-base text-gray-500">
                      Efficiently manage pickup requests, assign couriers, and track pickup status in real-time.
                    </Typography>
                  </div>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="pt-6">
                <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-primary-500 rounded-md shadow-lg">
                        <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                        </svg>
                      </span>
                    </div>
                    <Typography variant="h5" className="mt-5 text-lg font-medium text-gray-900">
                      Shipment Tracking
                    </Typography>
                    <Typography variant="body2" className="mt-2 text-base text-gray-500">
                      Provide real-time tracking information to customers with detailed shipment status updates.
                    </Typography>
                  </div>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="pt-6">
                <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-primary-500 rounded-md shadow-lg">
                        <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </span>
                    </div>
                    <Typography variant="h5" className="mt-5 text-lg font-medium text-gray-900">
                      Financial Management
                    </Typography>
                    <Typography variant="body2" className="mt-2 text-base text-gray-500">
                      Manage invoices, payments, and financial reporting for your logistics operations.
                    </Typography>
                  </div>
                </div>
              </div>

              {/* Feature 4 */}
              <div className="pt-6">
                <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-primary-500 rounded-md shadow-lg">
                        <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                        </svg>
                      </span>
                    </div>
                    <Typography variant="h5" className="mt-5 text-lg font-medium text-gray-900">
                      Route Optimization
                    </Typography>
                    <Typography variant="body2" className="mt-2 text-base text-gray-500">
                      Optimize delivery routes to reduce costs and improve efficiency with advanced algorithms.
                    </Typography>
                  </div>
                </div>
              </div>

              {/* Feature 5 */}
              <div className="pt-6">
                <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-primary-500 rounded-md shadow-lg">
                        <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                      </span>
                    </div>
                    <Typography variant="h5" className="mt-5 text-lg font-medium text-gray-900">
                      Mobile Applications
                    </Typography>
                    <Typography variant="body2" className="mt-2 text-base text-gray-500">
                      Empower your field staff with mobile apps for pickups, deliveries, and real-time updates.
                    </Typography>
                  </div>
                </div>
              </div>

              {/* Feature 6 */}
              <div className="pt-6">
                <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-primary-500 rounded-md shadow-lg">
                        <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </span>
                    </div>
                    <Typography variant="h5" className="mt-5 text-lg font-medium text-gray-900">
                      Comprehensive Reporting
                    </Typography>
                    <Typography variant="body2" className="mt-2 text-base text-gray-500">
                      Generate detailed reports on operations, finances, and performance metrics.
                    </Typography>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-700">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Ready to get started?</span>
            <span className="block text-primary-300">Sign up today and transform your logistics operations.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <Button
                as={Link}
                href="/auth/register"
                variant="secondary"
                className="px-5 py-3 text-base font-medium"
              >
                Get Started
              </Button>
            </div>
            <div className="ml-3 inline-flex rounded-md shadow">
              <Button
                as={Link}
                href="/contact"
                variant="outline"
                className="px-5 py-3 text-base font-medium text-white border-white hover:bg-primary-600"
              >
                Contact Sales
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default HomePage;
