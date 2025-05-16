/**
 * Types Package
 * Shared TypeScript types for all services and applications
 */

// This is a placeholder file for the types package
// In a real implementation, this would export TypeScript types

/**
 * User interface
 */
export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * User role enum
 */
export enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  COURIER = 'courier',
  DRIVER = 'driver',
  COLLECTOR = 'collector',
  WAREHOUSE = 'warehouse',
  CUSTOMER = 'customer',
}

/**
 * Shipment interface
 */
export interface Shipment {
  id: string;
  trackingNumber: string;
  sender: Customer;
  recipient: Customer;
  weight: number;
  dimensions: Dimensions;
  service: ShipmentService;
  status: ShipmentStatus;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Customer interface
 */
export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address: Address;
}

/**
 * Address interface
 */
export interface Address {
  street: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
  coordinates?: Coordinates;
}

/**
 * Coordinates interface
 */
export interface Coordinates {
  latitude: number;
  longitude: number;
}

/**
 * Dimensions interface
 */
export interface Dimensions {
  length: number;
  width: number;
  height: number;
}

/**
 * Shipment service enum
 */
export enum ShipmentService {
  REGULAR = 'regular',
  EXPRESS = 'express',
  SAME_DAY = 'same_day',
}

/**
 * Shipment status enum
 */
export enum ShipmentStatus {
  PENDING = 'pending',
  PICKED_UP = 'picked_up',
  IN_TRANSIT = 'in_transit',
  OUT_FOR_DELIVERY = 'out_for_delivery',
  DELIVERED = 'delivered',
  FAILED = 'failed',
  RETURNED = 'returned',
}

export default {
  UserRole,
  ShipmentService,
  ShipmentStatus,
};
