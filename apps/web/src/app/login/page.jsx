/**
 * Login Page
 * Authentication page for user login
 */

import LoginForm from '../../components/auth/LoginForm';

/**
 * Login Page
 * Displays login form and related information
 */
export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <img
            className="h-16 w-auto"
            src="/logo.svg"
            alt="Samudra Paket"
          />
        </div>
        <h1 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Samudra Paket ERP
        </h1>
        <p className="mt-2 text-center text-sm text-gray-600">
          Enterprise Resource Planning System
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <LoginForm />
        
        <div className="mt-6 text-center text-sm">
          <p className="text-gray-600">
            By logging in, you agree to our{' '}
            <a href="/terms" className="font-medium text-primary-600 hover:text-primary-500">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="/privacy" className="font-medium text-primary-600 hover:text-primary-500">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
