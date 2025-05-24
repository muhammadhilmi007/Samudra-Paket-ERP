import BranchEditPage from '../../../../../components/pages/BranchEditPage';

/**
 * Branch Edit Page
 * This page allows editing an existing branch
 */
export default function Page({ params }) {
  return <BranchEditPage branchId={params.id} />;
}
