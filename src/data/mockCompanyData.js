// Comprehensive 150-employee company data generator for TechFlow Solutions
// Realistic Australian company with proper novated lease distribution

const generateMockCompanyData = () => {
  // Australian first names and surnames for realistic employee generation
  const firstNames = [
    'Sarah', 'Michael', 'Emma', 'James', 'Lisa', 'David', 'Jessica', 'Daniel', 'Michelle', 'Andrew',
    'Jennifer', 'Matthew', 'Amanda', 'Christopher', 'Rebecca', 'Joshua', 'Nicole', 'Ryan', 'Samantha', 'Benjamin',
    'Ashley', 'Anthony', 'Stephanie', 'Kevin', 'Rachel', 'Jason', 'Lauren', 'Mark', 'Megan', 'Steven',
    'Kimberly', 'Paul', 'Amy', 'Jonathan', 'Angela', 'Brian', 'Helen', 'Adam', 'Natalie', 'John',
    'Catherine', 'Robert', 'Elizabeth', 'William', 'Karen', 'Richard', 'Susan', 'Thomas', 'Linda', 'Charles'
  ];

  const surnames = [
    'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez',
    'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Thompson', 'White',
    'Harris', 'Clark', 'Lewis', 'Robinson', 'Walker', 'Young', 'Allen', 'King', 'Wright', 'Scott',
    'Torres', 'Nguyen', 'Hill', 'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Campbell', 'Mitchell',
    'Carter', 'Roberts', 'Phillips', 'Evans', 'Turner', 'Parker', 'Edwards', 'Collins', 'Stewart', 'Morris'
  ];

  const roles = [
    'Software Engineer', 'Senior Software Engineer', 'Lead Software Engineer', 'Principal Software Engineer',
    'Product Manager', 'Senior Product Manager', 'Product Owner', 'Business Analyst',
    'UX Designer', 'UI Designer', 'Senior Designer', 'Design Lead',
    'Data Analyst', 'Data Scientist', 'Senior Data Scientist', 'Data Engineer',
    'DevOps Engineer', 'Senior DevOps Engineer', 'Infrastructure Engineer', 'Cloud Architect',
    'QA Engineer', 'Senior QA Engineer', 'Test Automation Engineer', 'QA Lead',
    'Project Manager', 'Senior Project Manager', 'Program Manager', 'Scrum Master',
    'Marketing Manager', 'Digital Marketing Specialist', 'Content Manager', 'Marketing Coordinator',
    'Sales Manager', 'Account Manager', 'Business Development Manager', 'Sales Representative',
    'HR Manager', 'HR Business Partner', 'Talent Acquisition Specialist', 'HR Coordinator',
    'Finance Manager', 'Financial Analyst', 'Accountant', 'Payroll Specialist',
    'Operations Manager', 'Office Manager', 'Executive Assistant', 'Administrative Assistant'
  ];

  const vehicleData = [
    // EVs (15% of fleet - higher adoption for tech company)
    { make: 'Tesla', model: 'Model 3', type: 'Sedan', fuel: 'EV', efficiency: 0, basePrice: 65000 },
    { make: 'Tesla', model: 'Model Y', type: 'SUV', fuel: 'EV', efficiency: 0, basePrice: 72000 },
    { make: 'BMW', model: 'i4', type: 'Sedan', fuel: 'EV', efficiency: 0, basePrice: 68000 },
    { make: 'Mercedes-Benz', model: 'EQA', type: 'SUV', fuel: 'EV', efficiency: 0, basePrice: 70000 },
    { make: 'Audi', model: 'e-tron', type: 'SUV', fuel: 'EV', efficiency: 0, basePrice: 75000 },
    { make: 'Nissan', model: 'Leaf', type: 'Hatchback', fuel: 'EV', efficiency: 0, basePrice: 50000 },
    { make: 'Hyundai', model: 'Ioniq 5', type: 'SUV', fuel: 'EV', efficiency: 0, basePrice: 65000 },
    { make: 'Kia', model: 'EV6', type: 'SUV', fuel: 'EV', efficiency: 0, basePrice: 67000 },
    
    // Hybrids (25% of fleet)
    { make: 'Toyota', model: 'Prius', type: 'Hatchback', fuel: 'Hybrid', efficiency: 3.4, basePrice: 42000 },
    { make: 'Toyota', model: 'RAV4 Hybrid', type: 'SUV', fuel: 'Hybrid', efficiency: 4.8, basePrice: 48000 },
    { make: 'Toyota', model: 'Camry Hybrid', type: 'Sedan', fuel: 'Hybrid', efficiency: 4.2, basePrice: 45000 },
    { make: 'Honda', model: 'Accord Hybrid', type: 'Sedan', fuel: 'Hybrid', efficiency: 4.0, basePrice: 47000 },
    { make: 'Lexus', model: 'NX Hybrid', type: 'SUV', fuel: 'Hybrid', efficiency: 5.2, basePrice: 55000 },
    { make: 'BMW', model: 'X3 xDrive30e', type: 'SUV', fuel: 'Hybrid', efficiency: 5.8, basePrice: 62000 },
    
    // Petrol (50% of fleet)
    { make: 'Toyota', model: 'Camry', type: 'Sedan', fuel: 'Petrol', efficiency: 7.2, basePrice: 35000 },
    { make: 'Toyota', model: 'RAV4', type: 'SUV', fuel: 'Petrol', efficiency: 7.8, basePrice: 38000 },
    { make: 'Mazda', model: 'CX-5', type: 'SUV', fuel: 'Petrol', efficiency: 7.5, basePrice: 36000 },
    { make: 'Mazda', model: 'Mazda3', type: 'Sedan', fuel: 'Petrol', efficiency: 6.8, basePrice: 32000 },
    { make: 'Honda', model: 'Civic', type: 'Sedan', fuel: 'Petrol', efficiency: 6.4, basePrice: 30000 },
    { make: 'Honda', model: 'CR-V', type: 'SUV', fuel: 'Petrol', efficiency: 7.6, basePrice: 37000 },
    { make: 'Hyundai', model: 'i30', type: 'Hatchback', fuel: 'Petrol', efficiency: 6.9, basePrice: 28000 },
    { make: 'Hyundai', model: 'Tucson', type: 'SUV', fuel: 'Petrol', efficiency: 8.1, basePrice: 39000 },
    { make: 'Kia', model: 'Cerato', type: 'Sedan', fuel: 'Petrol', efficiency: 6.7, basePrice: 29000 },
    { make: 'Volkswagen', model: 'Golf', type: 'Hatchback', fuel: 'Petrol', efficiency: 6.5, basePrice: 33000 },
    { make: 'Subaru', model: 'Outback', type: 'SUV', fuel: 'Petrol', efficiency: 8.4, basePrice: 41000 },
    
    // Diesel (10% of fleet - mainly utes and larger vehicles)
    { make: 'Ford', model: 'Ranger', type: 'Ute', fuel: 'Diesel', efficiency: 8.9, basePrice: 45000 },
    { make: 'Toyota', model: 'Hilux', type: 'Ute', fuel: 'Diesel', efficiency: 8.6, basePrice: 43000 },
    { make: 'Isuzu', model: 'D-Max', type: 'Ute', fuel: 'Diesel', efficiency: 8.8, basePrice: 42000 },
    { make: 'Mitsubishi', model: 'Triton', type: 'Ute', fuel: 'Diesel', efficiency: 8.7, basePrice: 40000 }
  ];

  // Generate 150 employees with realistic distribution
  const employees = [];
  
  // Salary ranges by role level
  const salaryRanges = {
    'Junior': { min: 55000, max: 70000 },
    'Mid': { min: 70000, max: 95000 },
    'Senior': { min: 95000, max: 130000 },
    'Lead': { min: 120000, max: 160000 },
    'Principal': { min: 150000, max: 200000 },
    'Manager': { min: 110000, max: 150000 },
    'Director': { min: 140000, max: 180000 }
  };

  const getRoleLevel = (role) => {
    if (role.includes('Principal') || role.includes('Director')) return 'Principal';
    if (role.includes('Lead') || role.includes('Manager')) return 'Lead';
    if (role.includes('Senior')) return 'Senior';
    if (role.includes('Coordinator') || role.includes('Assistant')) return 'Junior';
    return 'Mid';
  };

  const getRandomSalary = (roleLevel) => {
    const range = salaryRanges[roleLevel];
    return Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
  };

  const getRandomVehicle = () => {
    return vehicleData[Math.floor(Math.random() * vehicleData.length)];
  };

  const getRandomKmPerYear = () => {
    // Realistic distribution: most people drive 12-25k km per year
    const distributions = [12000, 15000, 18000, 20000, 22000, 25000, 28000, 30000];
    return distributions[Math.floor(Math.random() * distributions.length)];
  };

  const getBusinessUsePercentage = (role) => {
    // Higher business use for sales, managers, field roles
    if (role.includes('Sales') || role.includes('Manager') || role.includes('Director')) {
      return Math.floor(Math.random() * 30) + 40; // 40-70%
    }
    if (role.includes('Engineer') || role.includes('Analyst')) {
      return Math.floor(Math.random() * 20) + 20; // 20-40%
    }
    return Math.floor(Math.random() * 25) + 15; // 15-40%
  };

  // Generate 150 employees with more diverse data
  for (let i = 1; i <= 150; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = surnames[Math.floor(Math.random() * surnames.length)];
    const role = roles[Math.floor(Math.random() * roles.length)];
    const roleLevel = getRoleLevel(role);
    const salary = getRandomSalary(roleLevel);
    
    // Variable novated lease uptake based on salary (higher earners more likely)
    let novatedChance = 0.02; // Base 2%
    if (salary > 120000) novatedChance = 0.08; // 8% for high earners
    else if (salary > 90000) novatedChance = 0.05; // 5% for mid-high earners
    else if (salary > 70000) novatedChance = 0.03; // 3% for mid earners
    
    const hasNovated = Math.random() < novatedChance;
    
    let vehicle = null;
    let monthlyPayment = 0;
    let annualPackageReduction = 0;
    let leaseEndDate = null;

    if (hasNovated) {
      vehicle = getRandomVehicle();
      // Calculate realistic lease payment based on vehicle price
      const leasePrice = vehicle.basePrice * 0.7; // Typical novated lease residual
      monthlyPayment = Math.floor(leasePrice / 36); // 3-year lease
      annualPackageReduction = monthlyPayment * 12;
      
      // Random lease end date between now and 3 years
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() + Math.floor(Math.random() * 36));
      leaseEndDate = startDate.toISOString().split('T')[0];
    }

    const employee = {
      id: i,
      employeeId: `TF${String(i).padStart(6, '0')}`,
      employeeName: `${firstName} ${lastName}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@techflowsolutions.com.au`,
      role: role,
      salary: salary,
      vehicleType: vehicle?.type || null,
      fuelType: vehicle?.fuel || null,
      make: vehicle?.make || null,
      model: vehicle?.model || null,
      kmPerYear: hasNovated ? getRandomKmPerYear() : 0,
      fuelEfficiency: vehicle?.efficiency || 0,
      businessUse: hasNovated ? getBusinessUsePercentage(role) : 0,
      hasNovated: hasNovated,
      monthlyPayment: monthlyPayment,
      annualPackageReduction: annualPackageReduction,
      leaseEnd: leaseEndDate,
      employeeSalary: salary
    };

    employees.push(employee);
  }

  // Ensure we have the 7 specific employees from the original demo for consistency
  const specificEmployees = [
    {
      id: 1,
      employeeId: 'TF000001',
      employeeName: 'Sarah Chen',
      email: 'sarah.chen@techflowsolutions.com.au',
      role: 'Senior Software Engineer',
      salary: 105000,
      vehicleType: 'Sedan',
      fuelType: 'EV',
      make: 'Tesla',
      model: 'Model 3',
      kmPerYear: 18000,
      fuelEfficiency: 0,
      businessUse: 25,
      hasNovated: true,
      monthlyPayment: 1150,
      annualPackageReduction: 13800,
      leaseEnd: '2027-03-01',
      employeeSalary: 105000
    },
    {
      id: 2,
      employeeId: 'TF000002',
      employeeName: 'Michael Rodriguez',
      email: 'michael.rodriguez@techflowsolutions.com.au',
      role: 'Product Manager',
      salary: 98000,
      vehicleType: 'SUV',
      fuelType: 'Hybrid',
      make: 'Toyota',
      model: 'RAV4 Hybrid',
      kmPerYear: 22000,
      fuelEfficiency: 4.8,
      businessUse: 35,
      hasNovated: true,
      monthlyPayment: 980,
      annualPackageReduction: 11760,
      leaseEnd: '2026-08-15',
      employeeSalary: 98000
    },
    {
      id: 3,
      employeeId: 'TF000003',
      employeeName: 'Emma Thompson',
      email: 'emma.thompson@techflowsolutions.com.au',
      role: 'Marketing Director',
      salary: 115000,
      vehicleType: 'SUV',
      fuelType: 'Petrol',
      make: 'Mazda',
      model: 'CX-5',
      kmPerYear: 20000,
      fuelEfficiency: 7.2,
      businessUse: 40,
      hasNovated: true,
      monthlyPayment: 850,
      annualPackageReduction: 10200,
      leaseEnd: '2026-11-01',
      employeeSalary: 115000
    },
    {
      id: 4,
      employeeId: 'TF000004',
      employeeName: 'James Wilson',
      email: 'james.wilson@techflowsolutions.com.au',
      role: 'Field Operations Manager',
      salary: 88000,
      vehicleType: 'Ute',
      fuelType: 'Diesel',
      make: 'Ford',
      model: 'Ranger',
      kmPerYear: 28000,
      fuelEfficiency: 8.5,
      businessUse: 70,
      hasNovated: true,
      monthlyPayment: 1200,
      annualPackageReduction: 14400,
      leaseEnd: '2027-01-15',
      employeeSalary: 88000
    },
    {
      id: 5,
      employeeId: 'TF000005',
      employeeName: 'Alex Kim',
      email: 'alex.kim@techflowsolutions.com.au',
      role: 'UX Designer',
      salary: 82000,
      vehicleType: null,
      fuelType: null,
      make: null,
      model: null,
      kmPerYear: 0,
      fuelEfficiency: 0,
      businessUse: 0,
      hasNovated: false,
      monthlyPayment: 0,
      annualPackageReduction: 0,
      leaseEnd: null,
      employeeSalary: 82000
    },
    {
      id: 6,
      employeeId: 'TF000006',
      employeeName: 'Lisa Patel',
      email: 'lisa.patel@techflowsolutions.com.au',
      role: 'Data Analyst',
      salary: 75000,
      vehicleType: null,
      fuelType: null,
      make: null,
      model: null,
      kmPerYear: 0,
      fuelEfficiency: 0,
      businessUse: 0,
      hasNovated: false,
      monthlyPayment: 0,
      annualPackageReduction: 0,
      leaseEnd: null,
      employeeSalary: 75000
    },
    {
      id: 7,
      employeeId: 'TF000007',
      employeeName: 'David Nguyen',
      email: 'david.nguyen@techflowsolutions.com.au',
      role: 'DevOps Engineer',
      salary: 92000,
      vehicleType: null,
      fuelType: null,
      make: null,
      model: null,
      kmPerYear: 0,
      fuelEfficiency: 0,
      businessUse: 0,
      hasNovated: false,
      monthlyPayment: 0,
      annualPackageReduction: 0,
      leaseEnd: null,
      employeeSalary: 92000
    }
  ];

  // Replace first 7 employees with specific ones for consistency
  specificEmployees.forEach((emp, index) => {
    employees[index] = emp;
  });

  return {
    employees,
    companyInfo: {
      name: 'TechFlow Solutions Pty Ltd',
      id: 'TFS001',
      industry: 'Technology Services',
      totalEmployees: 150,
      fleetSize: employees.filter(e => e.hasNovated).length,
      state: 'NSW',
      avgSalary: Math.floor(employees.reduce((sum, e) => sum + e.salary, 0) / employees.length)
    },
    summary: {
      totalEmployees: 150,
      novatedLeases: employees.filter(e => e.hasNovated).length,
      evCount: employees.filter(e => e.fuelType === 'EV').length,
      hybridCount: employees.filter(e => e.fuelType === 'Hybrid').length,
      petrolCount: employees.filter(e => e.fuelType === 'Petrol').length,
      dieselCount: employees.filter(e => e.fuelType === 'Diesel').length,
      totalPackageReduction: employees.reduce((sum, e) => sum + e.annualPackageReduction, 0),
      averageSalary: Math.floor(employees.reduce((sum, e) => sum + e.salary, 0) / employees.length)
    }
  };
};

export default generateMockCompanyData;
