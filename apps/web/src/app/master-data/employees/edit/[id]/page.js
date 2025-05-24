import EmployeeFormPage from '../../../../../components/pages/EmployeeFormPage';

/**
 * Edit Employee Page
 * This page provides a multi-step wizard for editing an existing employee
 */
export default function Page({ params }) {
  return <EmployeeFormPage mode="edit" employeeId={params.id} />;
}
