/**
 * Two-Factor Authentication Page
 * Page for verifying two-factor authentication during login
 */

import TwoFactorAuthPage from '../../../components/pages/TwoFactorAuthPage';

export const metadata = {
  title: 'Two-Factor Authentication - Samudra Paket ERP',
  description: 'Verify your identity with two-factor authentication',
};

export default function Page() {
  return <TwoFactorAuthPage />;
}
