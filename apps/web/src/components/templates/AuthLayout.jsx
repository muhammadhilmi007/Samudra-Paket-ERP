/**
 * AuthLayout Component
 * Layout for authentication pages with branding and responsive design
 */

import React from 'react';
import Link from 'next/link';
import Typography from '../atoms/Typography';

const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Link href="/" className="flex items-center">
            {/* <img
              className="h-12 w-auto"
              src="../logo.png"
              alt="Samudra Paket"
            /> */}
          </Link>
        </div>
        
        {title && (
          <Typography 
            variant="h4" 
            className="mt-6 text-center text-gray-900"
          >
            {title}
          </Typography>
        )}
        
        {subtitle && (
          <Typography 
            variant="body1" 
            className="mt-2 text-center text-gray-600"
          >
            {subtitle}
          </Typography>
        )}
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {children}
        </div>
        
        <div className="mt-6 text-center">
          <Typography variant="body2" className="text-gray-600">
            &copy; {new Date().getFullYear()} PT. Sarana Mudah Raya. All rights reserved.
          </Typography>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
