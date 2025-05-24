import React, { useState, useMemo } from 'react';
import { Button } from '../../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table';
import { Badge } from '../../../components/ui/badge';
import { PlusCircle, Edit, AlertTriangle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../../components/ui/dialog';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/atoms/Label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { Textarea } from '../../../components/ui/textarea';

// Mock data for contracts - replace with API call
const mockContracts = [
  {
    id: 'C001',
    employeeId: 'EMP001',
    contractType: 'Permanent',
    startDate: '2022-01-01',
    endDate: null, // Permanent contracts might not have an end date
    status: 'Active',
    salary: 7000000,
    jobTitle: 'Software Engineer',
    department: 'Technology',
    documentUrl: '/path/to/contract_c001.pdf',
  },
  {
    id: 'C002',
    employeeId: 'EMP001',
    contractType: 'Fixed-Term',
    startDate: '2023-06-01',
    endDate: '2024-05-31',
    status: 'Active',
    salary: 6500000,
    jobTitle: 'Frontend Developer',
    department: 'Technology',
    documentUrl: '/path/to/contract_c002.pdf',
  },
  {
    id: 'C003',
    employeeId: 'EMP002',
    contractType: 'Fixed-Term',
    startDate: '2024-01-15',
    endDate: '2024-07-14', // Nearing expiration
    status: 'Active',
    salary: 8000000,
    jobTitle: 'Project Manager',
    department: 'Operations',
    documentUrl: '/path/to/contract_c003.pdf',
  },
  {
    id: 'C004',
    employeeId: 'EMP003',
    contractType: 'Internship',
    startDate: '2023-12-01',
    endDate: '2024-02-28',
    status: 'Expired',
    salary: 2500000,
    jobTitle: 'HR Intern',
    department: 'Human Resources',
    documentUrl: '/path/to/contract_c004.pdf',
  },
];

const ContractStatusBadge = ({ status }) => {
  let variant = 'default';
  if (status === 'Active') variant = 'success';
  else if (status === 'Expired') variant = 'destructive';
  else if (status === 'Upcoming') variant = 'outline';
  return <Badge variant={variant}>{status}</Badge>;
};

const EmployeeContractTab = ({ employeeId }) => {
  const [contracts, setContracts] = useState(mockContracts.filter(c => c.employeeId === employeeId || mockContracts.some(mc => mc.employeeId === 'EMP001'))); // Default to EMP001 if no specific employeeId contracts
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingContract, setEditingContract] = useState(null);

  // Filter contracts for the current employee (if employeeId is provided)
  // For demo purposes, if no employeeId is passed or no contracts match, it shows contracts for 'EMP001'
  const employeeContracts = useMemo(() => {
    if (employeeId) {
      const filtered = mockContracts.filter(c => c.employeeId === employeeId);
      return filtered.length > 0 ? filtered : mockContracts.filter(c => c.employeeId === 'EMP001');
    }
    return mockContracts.filter(c => c.employeeId === 'EMP001');
  }, [employeeId]);

  const openForm = (contract = null) => {
    setEditingContract(contract);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setEditingContract(null);
    setIsFormOpen(false);
  };

  const handleSaveContract = (formData) => {
    if (editingContract) {
      setContracts(contracts.map(c => c.id === editingContract.id ? { ...c, ...formData } : c));
    } else {
      setContracts([...contracts, { id: `C${String(contracts.length + 1).padStart(3, '0')}`, employeeId, ...formData }]);
    }
    closeForm();
    // Add notification: Contract saved successfully
  };

  const isNearingExpiration = (endDate) => {
    if (!endDate) return false;
    const today = new Date();
    const expirationDate = new Date(endDate);
    const diffTime = expirationDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 && diffDays <= 30; // Highlight if expiring within 30 days
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Employee Contracts</CardTitle>
        <Button onClick={() => openForm()} size="sm">
          <PlusCircle className="mr-2 h-4 w-4" /> Add Contract
        </Button>
      </CardHeader>
      <CardContent>
        {employeeContracts.length === 0 ? (
          <p className="text-center text-gray-500">No contracts found for this employee.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Job Title</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employeeContracts.map((contract) => (
                <TableRow key={contract.id} className={isNearingExpiration(contract.endDate) ? 'bg-yellow-50' : ''}>
                  <TableCell>
                    {contract.contractType}
                    {isNearingExpiration(contract.endDate) && (
                      <AlertTriangle className="ml-2 h-4 w-4 text-yellow-500 inline" title="Nearing expiration" />
                    )}
                  </TableCell>
                  <TableCell>{new Date(contract.startDate).toLocaleDateString()}</TableCell>
                  <TableCell>{contract.endDate ? new Date(contract.endDate).toLocaleDateString() : 'N/A'}</TableCell>
                  <TableCell><ContractStatusBadge status={contract.status} /></TableCell>
                  <TableCell>{contract.jobTitle}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => openForm(contract)} title="Edit Contract">
                      <Edit className="h-4 w-4" />
                    </Button>
                    {contract.status === 'Active' && contract.endDate && (
                       <Button variant="outline" size="sm" className="ml-2" onClick={() => alert(`Renew contract ${contract.id}`)} title="Renew Contract">
                         Renew
                       </Button>
                    )}
                    <Button variant="link" size="sm" asChild className="ml-2">
                        <a href={contract.documentUrl} target="_blank" rel="noopener noreferrer">View Doc</a>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>

      {isFormOpen && (
        <ContractFormDialog
          isOpen={isFormOpen}
          onClose={closeForm}
          onSave={handleSaveContract}
          contractData={editingContract}
          employeeId={employeeId || 'EMP001'}
        />
      )}
    </Card>
  );
};

const ContractFormDialog = ({ isOpen, onClose, onSave, contractData, employeeId }) => {
  const [formData, setFormData] = useState(
    contractData || {
      employeeId: employeeId,
      contractType: '',
      startDate: '',
      endDate: '',
      status: 'Active',
      salary: '',
      jobTitle: '',
      department: '',
      documentUrl: '',
      notes: '',
    }
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{contractData ? 'Edit Contract' : 'Add New Contract'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="contractType" className="text-right">Contract Type</Label>
            <Select name="contractType" value={formData.contractType} onValueChange={(value) => handleSelectChange('contractType', value)} required>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select contract type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Permanent">Permanent</SelectItem>
                <SelectItem value="Fixed-Term">Fixed-Term</SelectItem>
                <SelectItem value="Internship">Internship</SelectItem>
                <SelectItem value="Probation">Probation</SelectItem>
                <SelectItem value="Consultant">Consultant</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="startDate" className="text-right">Start Date</Label>
            <Input id="startDate" name="startDate" type="date" value={formData.startDate} onChange={handleChange} className="col-span-3" required />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="endDate" className="text-right">End Date</Label>
            <Input id="endDate" name="endDate" type="date" value={formData.endDate} onChange={handleChange} className="col-span-3" />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="jobTitle" className="text-right">Job Title</Label>
            <Input id="jobTitle" name="jobTitle" value={formData.jobTitle} onChange={handleChange} className="col-span-3" required />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="department" className="text-right">Department</Label>
            <Input id="department" name="department" value={formData.department} onChange={handleChange} className="col-span-3" required />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="salary" className="text-right">Salary (IDR)</Label>
            <Input id="salary" name="salary" type="number" value={formData.salary} onChange={handleChange} className="col-span-3" required />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right">Status</Label>
            <Select name="status" value={formData.status} onValueChange={(value) => handleSelectChange('status', value)} required>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Upcoming">Upcoming</SelectItem>
                <SelectItem value="Expired">Expired</SelectItem>
                <SelectItem value="Terminated">Terminated</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="documentUrl" className="text-right">Document URL</Label>
            <Input id="documentUrl" name="documentUrl" placeholder="https://example.com/contract.pdf" value={formData.documentUrl} onChange={handleChange} className="col-span-3" />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="notes" className="text-right">Notes</Label>
            <Textarea id="notes" name="notes" value={formData.notes} onChange={handleChange} className="col-span-3" placeholder="Any additional notes..." />
          </div>

          <div className="flex justify-end col-span-4 mt-4">
            <Button type="button" variant="outline" onClick={onClose} className="mr-2">Cancel</Button>
            <Button type="submit">Save Contract</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EmployeeContractTab;
