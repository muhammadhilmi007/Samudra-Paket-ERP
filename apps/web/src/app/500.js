/**
 * 500 Error Page
 * Static version for server error handling
 */

import Link from 'next/link';

export default function InternalServerError() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 text-center">
        <div>
          <h1 className="text-6xl font-extrabold text-red-600">500</h1>
          <h2 className="mt-4 text-xl font-medium text-gray-900">
            Internal Server Error
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sorry, something went wrong on our server.
          </p>
        </div>
        <div className="flex flex-col space-y-4">
          <Link 
            href="/" 
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Go back home
          </Link>
        </div>
      </div>
    </div>
  );
}
