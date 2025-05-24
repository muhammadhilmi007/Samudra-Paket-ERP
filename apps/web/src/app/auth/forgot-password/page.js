/**
 * Forgot Password Page
 * Page for requesting password reset via email
 */

import ForgotPasswordPage from '../../../components/pages/ForgotPasswordPage';

export const metadata = {
  title: 'Forgot Password - Samudra Paket ERP',
  description: 'Reset your Samudra Paket ERP account password',
};

export default function Page() {
  return <ForgotPasswordPage />;
}
