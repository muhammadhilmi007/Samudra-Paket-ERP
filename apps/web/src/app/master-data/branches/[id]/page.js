/**
 * Branch Detail Page
 * Displays detailed information about a specific branch with tabbed interface
 */

import BranchDetailPage from '../../../../components/pages/BranchDetailPage';

export const metadata = {
  title: 'Branch Detail - Samudra Paket ERP',
  description: 'View and manage branch details',
};

export default function Page({ params }) {
  return <BranchDetailPage branchId={params.id} />;
}
