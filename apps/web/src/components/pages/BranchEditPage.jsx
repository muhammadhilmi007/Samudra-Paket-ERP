"use client";

/**
 * BranchEditPage Component
 * Allows editing an existing branch
 */

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import Typography from '../atoms/Typography';
import Card from '../molecules/Card';
import Button from '../atoms/Button';
import Breadcrumb from '../molecules/Breadcrumb';
import { createNotificationHandler } from '../../utils/notificationUtils';

// Form schema
const branchSchema = z.object({
  name: z.string().min(1, 'Branch name is required'),
  code: z.string().min(1, 'Branch code is required'),
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  province: z.string().min(1, 'Province is required'),
  postalCode: z.string().min(1, 'Postal code is required'),
  phone: z.string().min(1, 'Phone number is required'),
  email: z.string().email('Invalid email address'),
  manager: z.string().optional(),
  isActive: z.boolean().default(true),
  type: z.enum(['HEAD_OFFICE', 'BRANCH', 'SUB_BRANCH', 'AGENT']),
  openingHours: z.string().optional(),
  capacity: z.number().positive().optional(),
});

// Mock branch data
const getMockBranch = (id) => {
  return {
    id,
    name: 'Jakarta Branch',
    code: 'JKT001',
    address: 'Jl. Sudirman No. 123',
    city: 'Jakarta',
    province: 'DKI Jakarta',
    postalCode: '12930',
    phone: '021-5551234',
    email: 'jakarta@samudrapaket.com',
    manager: 'John Doe',
    isActive: true,
    type: 'BRANCH',
    openingHours: '08:00 - 17:00',
    capacity: 1000,
    createdAt: '2023-01-15',
    updatedAt: '2023-05-20',
  };
};

const BranchEditPage = () => {
  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const notifications = createNotificationHandler(dispatch);
  const branchId = params.id;
  
  // Form setup
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(branchSchema),
    defaultValues: {
      name: '',
      code: '',
      address: '',
      city: '',
      province: '',
      postalCode: '',
      phone: '',
      email: '',
      manager: '',
      isActive: true,
      type: 'BRANCH',
      openingHours: '',
      capacity: 0,
    },
  });
  
  // Load branch data
  useEffect(() => {
    // In a real app, this would be an API call
    const branch = getMockBranch(branchId);
    reset(branch);
  }, [branchId, reset]);
  
  // Handle form submission
  const onSubmit = async (data) => {
    try {
      // In a real app, this would be an API call
      console.log('Updating branch:', data);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      notifications.success('Branch updated successfully');
      router.push('/master-data/branches');
    } catch (error) {
      console.error('Error updating branch:', error);
      notifications.error('Failed to update branch');
    }
  };
  
  // Handle cancel
  const handleCancel = () => {
    router.push('/master-data/branches');
  };
  
  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'Master Data', href: '/master-data' },
          { label: 'Branches', href: '/master-data/branches' },
          { label: 'Edit Branch', href: `/master-data/branches/edit/${branchId}` },
        ]}
      />
      
      <div className="flex justify-between items-center">
        <Typography variant="h1" className="text-2xl font-bold">
          Edit Branch
        </Typography>
      </div>
      
      <Card>
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Branch Information */}
            <div className="space-y-4">
              <Typography variant="h2" className="text-xl font-semibold">
                Branch Information
              </Typography>
              
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Branch Name *
                </label>
                <input
                  id="name"
                  type="text"
                  {...register('name')}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="code" className="block text-sm font-medium text-gray-700">
                  Branch Code *
                </label>
                <input
                  id="code"
                  type="text"
                  {...register('code')}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                />
                {errors.code && (
                  <p className="mt-1 text-sm text-red-600">{errors.code.message}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                  Branch Type *
                </label>
                <select
                  id="type"
                  {...register('type')}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                >
                  <option value="HEAD_OFFICE">Head Office</option>
                  <option value="BRANCH">Branch</option>
                  <option value="SUB_BRANCH">Sub Branch</option>
                  <option value="AGENT">Agent</option>
                </select>
                {errors.type && (
                  <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="manager" className="block text-sm font-medium text-gray-700">
                  Branch Manager
                </label>
                <input
                  id="manager"
                  type="text"
                  {...register('manager')}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                />
                {errors.manager && (
                  <p className="mt-1 text-sm text-red-600">{errors.manager.message}</p>
                )}
              </div>
              
              <div className="flex items-center">
                <input
                  id="isActive"
                  type="checkbox"
                  {...register('isActive')}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                  Active
                </label>
              </div>
            </div>
            
            {/* Contact Information */}
            <div className="space-y-4">
              <Typography variant="h2" className="text-xl font-semibold">
                Contact Information
              </Typography>
              
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                  Address *
                </label>
                <textarea
                  id="address"
                  rows={3}
                  {...register('address')}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                />
                {errors.address && (
                  <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                    City *
                  </label>
                  <input
                    id="city"
                    type="text"
                    {...register('city')}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  />
                  {errors.city && (
                    <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="province" className="block text-sm font-medium text-gray-700">
                    Province *
                  </label>
                  <input
                    id="province"
                    type="text"
                    {...register('province')}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  />
                  {errors.province && (
                    <p className="mt-1 text-sm text-red-600">{errors.province.message}</p>
                  )}
                </div>
              </div>
              
              <div>
                <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700">
                  Postal Code *
                </label>
                <input
                  id="postalCode"
                  type="text"
                  {...register('postalCode')}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                />
                {errors.postalCode && (
                  <p className="mt-1 text-sm text-red-600">{errors.postalCode.message}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Phone *
                </label>
                <input
                  id="phone"
                  type="text"
                  {...register('phone')}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email *
                </label>
                <input
                  id="email"
                  type="email"
                  {...register('email')}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>
            </div>
          </div>
          
          {/* Additional Information */}
          <div className="space-y-4">
            <Typography variant="h2" className="text-xl font-semibold">
              Additional Information
            </Typography>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="openingHours" className="block text-sm font-medium text-gray-700">
                  Opening Hours
                </label>
                <input
                  id="openingHours"
                  type="text"
                  {...register('openingHours')}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  placeholder="e.g. 08:00 - 17:00"
                />
              </div>
              
              <div>
                <label htmlFor="capacity" className="block text-sm font-medium text-gray-700">
                  Capacity (packages/day)
                </label>
                <input
                  id="capacity"
                  type="number"
                  {...register('capacity', { valueAsNumber: true })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                />
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default BranchEditPage;
