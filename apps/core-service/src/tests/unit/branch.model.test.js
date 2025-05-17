/**
 * Branch Model Unit Tests
 */

const mongoose = require('mongoose');
const { Branch } = require('../../domain/models');

// Mock user ID for testing
const mockUserId = new mongoose.Types.ObjectId();

// Test branch data
const branchData = {
  code: 'TEST',
  name: 'Test Branch',
  type: 'BRANCH',
  parent: null,
  status: 'ACTIVE',
  address: {
    street: 'Test Street',
    city: 'Test City',
    province: 'Test Province',
    postalCode: '12345',
    country: 'Indonesia'
  },
  contactInfo: {
    phone: '123456789',
    email: 'test@example.com'
  },
  createdBy: mockUserId
};

describe('Branch Model', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/test-db', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  afterEach(async () => {
    await Branch.deleteMany({});
  });

  it('should create a new branch successfully', async () => {
    const branch = new Branch(branchData);
    const savedBranch = await branch.save();
    
    expect(savedBranch._id).toBeDefined();
    expect(savedBranch.code).toBe(branchData.code);
    expect(savedBranch.name).toBe(branchData.name);
    expect(savedBranch.type).toBe(branchData.type);
    expect(savedBranch.status).toBe(branchData.status);
    expect(savedBranch.level).toBe(0); // Root branch should have level 0
    expect(savedBranch.path).toBe(branchData.code); // Root branch path should be its code
  });

  it('should require code, name, type, address, and contactInfo', async () => {
    const branch = new Branch({});
    
    let error;
    try {
      await branch.validate();
    } catch (e) {
      error = e;
    }
    
    expect(error).toBeDefined();
    expect(error.errors.code).toBeDefined();
    expect(error.errors.name).toBeDefined();
    expect(error.errors.type).toBeDefined();
    expect(error.errors.address).toBeDefined();
    expect(error.errors.contactInfo).toBeDefined();
  });

  it('should enforce type enum values', async () => {
    const branch = new Branch({
      ...branchData,
      type: 'INVALID_TYPE'
    });
    
    let error;
    try {
      await branch.validate();
    } catch (e) {
      error = e;
    }
    
    expect(error).toBeDefined();
    expect(error.errors.type).toBeDefined();
  });

  it('should enforce status enum values', async () => {
    const branch = new Branch({
      ...branchData,
      status: 'INVALID_STATUS'
    });
    
    let error;
    try {
      await branch.validate();
    } catch (e) {
      error = e;
    }
    
    expect(error).toBeDefined();
    expect(error.errors.status).toBeDefined();
  });

  it('should update path and level for child branches', async () => {
    // Create parent branch
    const parentBranch = new Branch(branchData);
    await parentBranch.save();
    
    // Create child branch
    const childBranchData = {
      ...branchData,
      code: 'CHILD',
      name: 'Child Branch',
      parent: parentBranch._id
    };
    
    const childBranch = new Branch(childBranchData);
    const savedChildBranch = await childBranch.save();
    
    expect(savedChildBranch.level).toBe(1); // Child branch should have level 1
    expect(savedChildBranch.path).toBe(`${parentBranch.code}.${childBranchData.code}`); // Child branch path should include parent path
  });

  it('should update status and add to status history', async () => {
    // Create branch
    const branch = new Branch(branchData);
    await branch.save();
    
    // Update status
    const newStatus = 'INACTIVE';
    const reason = 'Test reason';
    await branch.updateStatus(newStatus, reason, mockUserId);
    
    // Fetch updated branch
    const updatedBranch = await Branch.findById(branch._id);
    
    expect(updatedBranch.status).toBe(newStatus);
    expect(updatedBranch.statusHistory).toHaveLength(1);
    expect(updatedBranch.statusHistory[0].status).toBe(newStatus);
    expect(updatedBranch.statusHistory[0].reason).toBe(reason);
    expect(updatedBranch.statusHistory[0].changedBy.toString()).toBe(mockUserId.toString());
  });

  it('should get children branches', async () => {
    // Create parent branch
    const parentBranch = new Branch(branchData);
    await parentBranch.save();
    
    // Create child branches
    const childBranchData1 = {
      ...branchData,
      code: 'CHILD1',
      name: 'Child Branch 1',
      parent: parentBranch._id
    };
    
    const childBranchData2 = {
      ...branchData,
      code: 'CHILD2',
      name: 'Child Branch 2',
      parent: parentBranch._id
    };
    
    await Branch.create([childBranchData1, childBranchData2]);
    
    // Get children
    const children = await parentBranch.getChildren();
    
    expect(children).toHaveLength(2);
    expect(children[0].code).toBe('CHILD1');
    expect(children[1].code).toBe('CHILD2');
  });
});
