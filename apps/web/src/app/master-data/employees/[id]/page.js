import EmployeeDetailPage from '../../../../components/pages/EmployeeDetailPage';

/**
 * Employee Detail Page
 * This page displays comprehensive information about an employee
 */
export default function Page({ params }) {
  return <EmployeeDetailPage employeeId={params.id} />;
}
