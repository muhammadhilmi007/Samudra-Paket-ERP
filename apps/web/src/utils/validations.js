/**
 * Validations Utility
 * Zod validation schemas for forms and data validation
 */

import { z } from 'zod';

/**
 * Common validation schemas that can be reused across the application
 */

// Email validation with custom error message
export const emailSchema = z
  .string()
  .min(1, { message: 'Email is required' })
  .email({ message: 'Please enter a valid email address' });

// Password validation with strength requirements
export const passwordSchema = z
  .string()
  .min(8, { message: 'Password must be at least 8 characters' })
  .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
  .regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter' })
  .regex(/[0-9]/, { message: 'Password must contain at least one number' })
  .regex(/[^A-Za-z0-9]/, { message: 'Password must contain at least one special character' });

// Phone number validation for Indonesian format
export const phoneSchema = z
  .string()
  .min(1, { message: 'Phone number is required' })
  .regex(/^(\+62|62|0)8[1-9][0-9]{6,10}$/, {
    message: 'Please enter a valid Indonesian phone number',
  });

// Name validation
export const nameSchema = z
  .string()
  .min(1, { message: 'Name is required' })
  .max(100, { message: 'Name is too long' });

// Address validation
export const addressSchema = z.object({
  street: z.string().min(1, { message: 'Street is required' }),
  city: z.string().min(1, { message: 'City is required' }),
  province: z.string().min(1, { message: 'Province is required' }),
  postalCode: z.string().min(1, { message: 'Postal code is required' }),
  country: z.string().min(1, { message: 'Country is required' }).default('Indonesia'),
});

// Date validation
export const dateSchema = z.coerce
  .date()
  .refine((date) => !isNaN(date.getTime()), {
    message: 'Please enter a valid date',
  });

// Shipment validation schema
export const shipmentSchema = z.object({
  senderName: nameSchema,
  senderPhone: phoneSchema,
  senderEmail: emailSchema.optional(),
  senderAddress: addressSchema,
  
  recipientName: nameSchema,
  recipientPhone: phoneSchema,
  recipientEmail: emailSchema.optional(),
  recipientAddress: addressSchema,
  
  packageDetails: z.object({
    weight: z.number().positive({ message: 'Weight must be greater than 0' }),
    length: z.number().positive({ message: 'Length must be greater than 0' }),
    width: z.number().positive({ message: 'Width must be greater than 0' }),
    height: z.number().positive({ message: 'Height must be greater than 0' }),
    description: z.string().optional(),
    declaredValue: z.number().nonnegative({ message: 'Declared value cannot be negative' }),
  }),
  
  serviceType: z.enum(['regular', 'express', 'sameDay', 'nextDay']),
  paymentMethod: z.enum(['cash', 'credit', 'cod']),
  notes: z.string().optional(),
});

// Customer validation schema
export const customerSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
  type: z.enum(['individual', 'business']),
  taxId: z.string().optional(),
  addresses: z.array(addressSchema).min(1, { message: 'At least one address is required' }),
  creditLimit: z.number().nonnegative().optional(),
  paymentTerms: z.number().int().nonnegative().optional(),
  notes: z.string().optional(),
});

// Login validation schema
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, { message: 'Password is required' }),
  rememberMe: z.boolean().optional(),
});

// Registration validation schema
export const registrationSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string().min(1, { message: 'Please confirm your password' }),
  phone: phoneSchema,
  agreeToTerms: z.boolean().refine((val) => val === true, {
    message: 'You must agree to the terms and conditions',
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

// Password reset validation schema
export const passwordResetSchema = z.object({
  password: passwordSchema,
  confirmPassword: z.string().min(1, { message: 'Please confirm your password' }),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

// Forgot password validation schema
export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

// Profile update validation schema
export const profileUpdateSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
  avatar: z.any().optional(),
});
