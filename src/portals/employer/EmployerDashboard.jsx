import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Leaf, 
  DollarSign, 
  Download, 
  Plus, 
  Settings,
  Users,
  Car,
  Zap,
  Globe,
  Award,
  Target,
  Calculator,
  FileText,
  CreditCard,
  AlertCircle,
  CheckCircle,
  Info,
  X,
  Edit,
  Save,
  Building,
  Activity,
  PieChart,
  Filter,
  Calendar,
  Eye,
  ExternalLink,
  TrendingDown,
  Shield,
  Briefcase,
  ClipboardList
} from 'lucide-react';
import { supabase } from '../../supabaseClient';
import generateMockCompanyData from '../../data/mockCompanyData';

const EmployerDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedMetric, setSelectedMetric] = useState('emissions');
  const [evTarget, setEvTarget] = useState(50);
  const [showTargetModal, setShowTargetModal] = useState(false);
  const [showEVTargetModal, setShowEVTargetModal] = useState(false);
  const [showEVTips, setShowEVTips] = useState(false);
  const [showAddVehicle, setShowAddVehicle] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Company and user info
  const [companyInfo, setCompanyInfo] = useState({
    name: 'TechCorp Australia',
    id: 'TC001',
    industry: 'Technology',
    employees: 247,
    fleetSize: 89,
    state: 'NSW', // For payroll tax calculations
    avgSalary: 85000 // Average salary for calculations
  });

  const [userInfo, setUserInfo] = useState({
    name: 'Michael Thompson',
    role: 'Fleet Manager',
    email: 'michael.thompson@techcorp.com.au'
  });

  // Australian tax rates and factors
  const taxRates = {
    payrollTax: {
      NSW: 0.0485, // 4.85%
      VIC: 0.062,  // 6.2%
      QLD: 0.0485, // 4.85%
      WA: 0.055,   // 5.5%
      SA: 0.0485,  // 4.85%
      TAS: 0.0485, // 4.85%
      ACT: 0.0685, // 6.85%
      NT: 0.055    // 5.5%
    },
    superGuarantee: 0.115, // 11.5% as of 2024-2025
    fbt: 0.47 // 47% FBT rate
  };

  // Carbon credits state
  const [creditsPurchaseAmount, setCreditsPurchaseAmount] = useState('');
  const [carbonPurchases, setCarbonPurchases] = useState([
    {
      id: 1,
      date: '2025-01-15',
      tonnes: 25.5,
      costPerTonne: 35,
      totalCost: 892.50,
      status: 'completed'
    },
    {
      id: 2,
      date: '2024-12-20',
      tonnes: 18.2,
      costPerTonne: 35,
      totalCost: 637.00,
      status: 'completed'
    }
  ]);

  // Mock fleet data with novated lease details
  const [fleetData, setFleetData] = useState([
    {
      id: 1,
      employeeId: 'TC001234',
      employeeName: 'Sarah Johnson',
      vehicleType: 'Sedan',
      fuelType: 'EV',
      make: 'Tesla',
      model: 'Model 3',
      kmPerYear: 12000,
      fuelEfficiency: 0,
      businessUse: 25,
      hasNovated: true,
      monthlyPayment: 890,
      annualPackageReduction: 10680, // Monthly * 12
      leaseEnd: '2026-01-15',
      employeeSalary: 95000
    },
    {
      id: 2,
      employeeId: 'TC001235',
      employeeName: 'David Park',
      vehicleType: 'SUV',
      fuelType: 'Hybrid',
      make: 'Toyota',
      model: 'RAV4 Hybrid',
      kmPerYear: 18000,
      fuelEfficiency: 5.2,
      businessUse: 40,
      hasNovated: true,
      monthlyPayment: 1150,
      annualPackageReduction: 13800,
      leaseEnd: '2025-08-20',
      employeeSalary: 78000
    },
    {
      id: 3,
      employeeId: 'TC001236',
      employeeName: 'Emma Wilson',
      vehicleType: 'Sedan',
      fuelType: 'Petrol',
      make: 'Holden',
      model: 'Commodore',
      kmPerYear: 22000,
      fuelEfficiency: 8.5,
      businessUse: 60,
      hasNovated: false,
      monthlyPayment: 0,
      annualPackageReduction: 0,
      leaseEnd: null,
      employeeSalary: 72000
    },
    {
      id: 4,
      employeeId: 'TC001237',
      employeeName: 'James Chen',
      vehicleType: 'Ute',
      fuelType: 'Diesel',
      make: 'Ford',
      model: 'Ranger',
      kmPerYear: 25000,
      fuelEfficiency: 9.2,
      businessUse: 80,
      hasNovated: true,
      monthlyPayment: 1300,
      annualPackageReduction: 15600,
      leaseEnd: '2025-12-10',
      employeeSalary: 88000
    }
  ]);

  // Australian emission factors (kg CO2 per litre/kWh)
  const emissionFactors = {
    Petrol: 2.31,
    Diesel: 2.66,
    Hybrid: 2.10,
    EV: 0.79 // kg CO2 per kWh from Australian grid
  };

  const ACCU_PRICE = 35; // Australian Carbon Credit Unit price
  const COMMISSION_RATE = 0.15; // 15% commission on carbon credit purchases

  // Load user data from Supabase or demo mode
  useEffect(() => {
    loadUserData();
    fetchFleetData();
  }, []);

  // Load 150-employee mock data
  useEffect(() => {
    const demoUser = localStorage.getItem('demo_user');
    const dataSource = localStorage.getItem('demo_data_source');
    
    if (demoUser && dataSource !== 'supabase') {
      console.log('Loading 150-employee mock company data...');
      const mockData = generateMockCompanyData();
      
      // Update company info
      setCompanyInfo(mockData.companyInfo);
      
      // Update fleet data with ALL employees (not just those with novated leases)
      setFleetData(mockData.employees);
      
      const novatedCount = mockData.employees.filter(emp => emp.hasNovated).length;
      console.log(`✅ Loaded ${mockData.employees.length} employees, ${novatedCount} with novated leases`);
    }
  }, []);

  const loadUserData = async () => {
    try {
      // Check for demo user first
      const demoUser = localStorage.getItem('demo_user');
      if (demoUser) {
        const parsedDemoUser = JSON.parse(demoUser);
        setUserInfo({
          name: parsedDemoUser.user_metadata?.full_name || 'Demo Manager',
          role: 'Fleet Manager',
          email: parsedDemoUser.email
        });
        setCompanyInfo(prev => ({
          ...prev,
          name: 'Demo Company'
        }));
        return;
      }

      // Regular Supabase session handling
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        // Get user profile data
        const { data: profile, error } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', session.user.id)
          .single();

        if (profile && !error) {
          setUserInfo({
            name: profile.full_name || session.user.user_metadata?.full_name || 'Fleet Manager',
            role: profile.role || 'Fleet Manager',
            email: session.user.email
          });
          setCompanyInfo(prev => ({
            ...prev,
            name: profile.company_name || 'Your Company'
          }));
        }
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  // Supabase integration functions
  const fetchFleetData = async () => {
    setLoading(true);
    try {
      // Check for demo mode
      const demoUser = localStorage.getItem('demo_user');
      if (demoUser) {
        console.log('Demo mode: Using mock fleet data');
        setLoading(false);
        return;
      }

      // Get current session
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setLoading(false);
        return;
      }

      // Fetch fleet data from Supabase
      const { data, error } = await supabase
        .from('fleet_vehicles')
        .select(`
          *,
          user_profiles!inner(company_name)
        `)
        .eq('user_profiles.user_id', session.user.id);
      
      if (error) {
        console.error('Error fetching fleet data:', error);
      } else if (data && data.length > 0) {
        setFleetData(data);
      }
    } catch (error) {
      console.error('Error fetching fleet data:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveVehicle = async (vehicleData) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('No session');

      const { data, error } = await supabase
        .from('fleet_vehicles')
        .insert([{
          ...vehicleData,
          user_id: session.user.id,
          created_at: new Date().toISOString()
        }]);
      
      if (error) throw error;
      
      console.log('Vehicle saved successfully:', data);
      await fetchFleetData(); // Refresh data
      return Promise.resolve({ success: true });
    } catch (error) {
      console.error('Error saving vehicle:', error);
      return Promise.reject(error);
    }
  };

  const saveCarbonPurchase = async (purchaseData) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('No session');

      const { data, error } = await supabase
        .from('carbon_purchases')
        .insert([{
          ...purchaseData,
          user_id: session.user.id,
          created_at: new Date().toISOString()
        }]);
      
      if (error) throw error;
      
      console.log('Carbon purchase saved successfully:', data);
      return Promise.resolve({ success: true });
    } catch (error) {
      console.error('Error saving carbon purchase:', error);
      return Promise.reject(error);
    }
  };

  // Calculate emissions for fleet
  const calculateFleetEmissions = () => {
    return fleetData.map(vehicle => {
      const kmPerYear = vehicle.kmPerYear;
      const efficiency = vehicle.fuelEfficiency;
      const emissionFactor = emissionFactors[vehicle.fuelType] || 0;
      
      let totalEmissions = 0;
      
      if (vehicle.fuelType === 'EV') {
        const kWhPerYear = (kmPerYear / 100) * (efficiency || 18);
        totalEmissions = kWhPerYear * emissionFactor;
      } else {
        const fuelPerYear = (kmPerYear / 100) * efficiency;
        totalEmissions = fuelPerYear * emissionFactor;
      }
      
      const scope2Emissions = totalEmissions * (vehicle.businessUse / 100);
      const scope3Emissions = totalEmissions - scope2Emissions;
      
      return {
        ...vehicle,
        totalEmissions,
        scope2Emissions,
        scope3Emissions
      };
    });
  };

  const fleetWithEmissions = calculateFleetEmissions();

  // Calculate key metrics
  const totalEmissions = fleetWithEmissions.reduce((sum, v) => sum + v.totalEmissions, 0);
  const scope2Total = fleetWithEmissions.reduce((sum, v) => sum + v.scope2Emissions, 0);
  const scope3Total = fleetWithEmissions.reduce((sum, v) => sum + v.scope3Emissions, 0);
  const evCount = fleetWithEmissions.filter(v => ['EV', 'Hybrid'].includes(v.fuelType)).length;
  const percentEV = fleetData.length ? (evCount / fleetData.length * 100) : 0;
  const totalCreditsPurchased = carbonPurchases.reduce((sum, p) => sum + p.tonnes, 0);
  const carbonLiability = scope2Total * ACCU_PRICE;
  const netEmissions = Math.max(0, scope2Total - totalCreditsPurchased);

  // Calculate company benefits
  const calculateCompanyBenefits = () => {
    const novatedVehicles = fleetData.filter(v => v.hasNovated);
    const totalPackageReduction = novatedVehicles.reduce((sum, v) => sum + v.annualPackageReduction, 0);
    
    const payrollTaxRate = taxRates.payrollTax[companyInfo.state] || taxRates.payrollTax.NSW;
    const payrollTaxSavings = totalPackageReduction * payrollTaxRate;
    const superSavings = totalPackageReduction * taxRates.superGuarantee;
    
    // Calculate carbon offset from EVs vs equivalent ICE vehicles
    const evVehicles = fleetWithEmissions.filter(v => v.fuelType === 'EV');
    const carbonOffset = evVehicles.reduce((sum, v) => {
      // Assume equivalent ICE vehicle would emit 2.31 kg CO2 per litre at 8L/100km
      const equivalentICEEmissions = (v.kmPerYear / 100) * 8 * 2.31;
      return sum + (equivalentICEEmissions - v.totalEmissions);
    }, 0);
    
    return {
      totalPackageReduction,
      payrollTaxSavings,
      superSavings,
      totalSavings: payrollTaxSavings + superSavings,
      carbonOffset: carbonOffset / 1000, // Convert to tonnes
      novatedCount: novatedVehicles.length
    };
  };

  const companyBenefits = calculateCompanyBenefits();

  // EV Uptake Tips
  const evUptakeTips = [
    {
      id: 1,
      title: 'Financial Education Sessions',
      description: 'Host lunch-and-learn sessions highlighting potential savings from EV novated leasing',
      impact: 'High',
      effort: 'Low',
      category: 'Education',
      implementation: 'Partner with finance team to show real salary packaging examples',
      expectedResult: '20-30% increase in EV enquiries',
      cost: 'Low - internal resources only'
    },
    {
      id: 2,
      title: 'EV Experience Days',
      description: 'Organise test drive events with local EV dealers for employees',
      impact: 'High',
      effort: 'Medium',
      category: 'Experience',
      implementation: 'Contact local Tesla, BMW, Mercedes dealers for on-site demonstrations',
      expectedResult: '15% increase in EV uptake',
      cost: 'Medium - venue and refreshments'
    },
    {
      id: 3,
      title: 'Workplace Charging Infrastructure',
      description: 'Install workplace charging stations to address range anxiety',
      impact: 'Medium',
      effort: 'High',
      category: 'Infrastructure',
      implementation: 'Partner with ChargePoint, Evie Networks for installation',
      expectedResult: '3x increase in EV adoption rates',
      cost: 'High - $5,000-15,000 per charging point'
    },
    {
      id: 4,
      title: 'Green Car Awards',
      description: 'Recognise employees who choose sustainable vehicles',
      impact: 'Medium',
      effort: 'Low',
      category: 'Recognition',
      implementation: 'Monthly newsletter features and parking spot rewards',
      expectedResult: 'Cultural shift towards sustainability',
      cost: 'Low - recognition programs only'
    },
    {
      id: 5,
      title: 'Enhanced EV Benefits',
      description: 'Offer additional perks like premium parking for EV drivers',
      impact: 'Low',
      effort: 'Low',
      category: 'Incentives',
      implementation: 'Designate prime parking spaces and reduced parking fees',
      expectedResult: '5-10% uptake improvement',
      cost: 'Very low - signage only'
    },
    {
      id: 6,
      title: 'EV-First Novated Lease Policy',
      description: 'Make EVs the default option for new leases unless exemption granted',
      impact: 'Very High',
      effort: 'Low',
      category: 'Policy',
      implementation: 'Update HR policies to prioritise EV approvals',
      expectedResult: '40-60% increase in EV selection',
      cost: 'None - policy change only'
    }
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-AU').format(Math.round(num));
  };

  const downloadCSV = (data, filename) => {
    const csv = [
      Object.keys(data[0]).join(','),
      ...data.map(row => Object.values(row).join(','))
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const downloadFleetReport = () => {
    const csvData = fleetWithEmissions.map(vehicle => ({
      employeeId: vehicle.employeeId,
      employeeName: vehicle.employeeName,
      vehicleType: vehicle.vehicleType,
      fuelType: vehicle.fuelType,
      make: vehicle.make,
      model: vehicle.model,
      kmPerYear: vehicle.kmPerYear,
      businessUse: vehicle.businessUse,
      totalEmissions: vehicle.totalEmissions.toFixed(2),
      scope2Emissions: vehicle.scope2Emissions.toFixed(2),
      scope3Emissions: vehicle.scope3Emissions.toFixed(2),
      isNovated: vehicle.hasNovated ? 'Yes' : 'No',
      monthlyPayment: vehicle.monthlyPayment || 0
    }));
    
    downloadCSV(csvData, `${companyInfo.id}_fleet_emissions_${new Date().toISOString().split('T')[0]}.csv`);
  };

  const downloadComplianceReport = () => {
    const csvData = [{
      reportDate: new Date().toLocaleDateString('en-AU'),
      companyId: companyInfo.id,
      companyName: companyInfo.name,
      totalVehicles: fleetData.length,
      totalEmissionsTonnes: (totalEmissions / 1000).toFixed(2),
      scope2EmissionsTonnes: (scope2Total / 1000).toFixed(2),
      scope3EmissionsTonnes: (scope3Total / 1000).toFixed(2),
      carbonCreditsPurchased: totalCreditsPurchased.toFixed(2),
      netScope2Emissions: (netEmissions / 1000).toFixed(2),
      evAdoptionPercentage: percentEV.toFixed(1),
      carbonLiabilityAUD: carbonLiability.toFixed(2),
      reportingPeriod: new Date().getFullYear()
    }];
    
    downloadCSV(csvData, `${companyInfo.id}_compliance_report_${new Date().toISOString().split('T')[0]}.csv`);
  };

  const downloadManagementSummary = () => {
    const benefits = calculateCompanyBenefits();
    const csvData = [{
      reportDate: new Date().toLocaleDateString('en-AU'),
      companyName: companyInfo.name,
      totalEmployees: companyInfo.employees,
      fleetSize: fleetData.length,
      novatedLeases: benefits.novatedCount,
      evAdoptionRate: `${percentEV.toFixed(1)}%`,
      annualPayrollTaxSavings: formatCurrency(benefits.payrollTaxSavings),
      annualSuperSavings: formatCurrency(benefits.superSavings),
      totalAnnualSavings: formatCurrency(benefits.totalSavings),
      carbonOffsetTonnes: benefits.carbonOffset.toFixed(1),
      scope2EmissionsTonnes: (scope2Total / 1000).toFixed(1),
      carbonLiabilityAUD: formatCurrency(carbonLiability),
      netEmissionsAfterCredits: (netEmissions / 1000).toFixed(1)
    }];
    
    downloadCSV(csvData, `${companyInfo.id}_management_summary_${new Date().toISOString().split('T')[0]}.csv`);
  };

  const handleBuyCredits = async () => {
    if (creditsPurchaseAmount && parseFloat(creditsPurchaseAmount) > 0) {
      const tonnes = parseFloat(creditsPurchaseAmount);
      const baseCost = tonnes * ACCU_PRICE;
      const commission = baseCost * COMMISSION_RATE;
      const totalCost = baseCost + commission;
      
      const newPurchase = {
        id: carbonPurchases.length + 1,
        date: new Date().toISOString().split('T')[0],
        tonnes,
        costPerTonne: ACCU_PRICE,
        totalCost,
        status: 'completed'
      };
      
      await saveCarbonPurchase(newPurchase);
      setCarbonPurchases([newPurchase, ...carbonPurchases]);
      setCreditsPurchaseAmount('');
      alert(`Successfully purchased ${tonnes} tonnes of carbon credits for ${formatCurrency(totalCost)}`);
    }
  };

  const TabButton = ({ id, label, icon: Icon, active, onClick }) => (
    <button
      onClick={() => onClick(id)}
      className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
        active 
          ? 'bg-blue-600 text-white' 
          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
      }`}
    >
      <Icon size={18} />
      <span>{label}</span>
    </button>
  );

  const MetricCard = ({ title, value, subtitle, icon: Icon, colour = 'blue', trend, onClick }) => (
    <div 
      className={`bg-white p-6 rounded-xl shadow-sm border border-gray-100 ${onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 bg-${colour}-100 rounded-lg`}>
          <Icon className={`h-6 w-6 text-${colour}-600`} />
        </div>
        {trend && (
          <div className="flex items-center text-sm text-green-600">
            <TrendingUp size={16} className="mr-1" />
            {trend}
          </div>
        )}
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-sm text-gray-600">{title}</p>
        {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
      </div>
    </div>
  );

  const DashboardOverview = () => (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-xl">
        <h2 className="text-2xl font-bold mb-2">Fleet Emissions Dashboard</h2>
        <p className="text-blue-100 mb-4">
          Monitor your fleet's environmental impact and manage Scope 2 & 3 emissions reporting
        </p>
        <div className="flex flex-wrap gap-4">
          <button 
            onClick={() => setActiveTab('benefits')}
            className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors"
          >
            View Company Benefits
          </button>
          <button 
            onClick={() => setActiveTab('ev-tips')}
            className="bg-blue-700 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-800 transition-colors"
          >
            EV Uptake Tips
          </button>
          <button 
            onClick={() => setActiveTab('carbon-credits')}
            className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors"
          >
            Buy Carbon Credits
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Fleet Vehicles"
          value={fleetData.length}
          subtitle="Active fleet size"
          icon={Car}
          colour="blue"
        />
        <MetricCard
          title="EV Adoption Rate"
          value={`${percentEV.toFixed(1)}%`}
          subtitle={`${evCount}/${fleetData.length} vehicles`}
          icon={Zap}
          colour="green"
          trend={percentEV > evTarget ? `${(percentEV - evTarget).toFixed(1)}% above target` : `${(evTarget - percentEV).toFixed(1)}% to target`}
          onClick={() => setShowEVTargetModal(true)}
        />
        <MetricCard
          title="Annual Tax Savings"
          value={formatCurrency(companyBenefits.totalSavings)}
          subtitle="Payroll tax + super"
          icon={DollarSign}
          colour="purple"
          trend={`${companyBenefits.novatedCount} novated leases`}
        />
        <MetricCard
          title="Carbon Offset"
          value={`${companyBenefits.carbonOffset.toFixed(1)}t`}
          subtitle="CO₂ saved from EVs"
          icon={Leaf}
          colour="green"
        />
      </div>

      {/* Fleet Composition */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Fleet Composition</h3>
        <div className="space-y-3">
          {['EV', 'Hybrid', 'Petrol', 'Diesel'].map(fuel => {
            const count = fleetWithEmissions.filter(v => v.fuelType === fuel).length;
            const percentage = fleetData.length ? (count / fleetData.length * 100) : 0;
            const colour = fuel === 'EV' ? 'green' : fuel === 'Hybrid' ? 'blue' : fuel === 'Petrol' ? 'orange' : 'red';
            
            return (
              <div key={fuel} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 bg-${colour}-500 rounded-full`}></div>
                  <span className="text-sm font-medium">{fuel}</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-semibold">{count} vehicles</span>
                  <span className="text-xs text-gray-500 ml-2">({percentage.toFixed(1)}%)</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const EmissionsReporting = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Emissions Reporting</h2>
        <div className="flex space-x-3">
          <button 
            onClick={downloadFleetReport}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
          >
            <Download size={16} />
            <span>Fleet Report</span>
          </button>
          <button 
            onClick={downloadComplianceReport}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2"
          >
            <Download size={16} />
            <span>Compliance Report</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 bg-orange-100 rounded-lg">
              <Globe className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Scope 2 Emissions</h3>
              <p className="text-xs text-gray-500">Business use reporting</p>
            </div>
          </div>
          <p className="text-3xl font-bold text-orange-600">{(scope2Total / 1000).toFixed(1)}t</p>
          <p className="text-sm text-gray-600 mt-1">CO₂ equivalent annually</p>
          <div className="mt-4 p-3 bg-orange-50 rounded-lg">
            <p className="text-xs text-orange-800">
              Offset liability: {formatCurrency(carbonLiability)}
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Activity className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Scope 3 Emissions</h3>
              <p className="text-xs text-gray-500">Employee commuting</p>
            </div>
          </div>
          <p className="text-3xl font-bold text-blue-600">{(scope3Total / 1000).toFixed(1)}t</p>
          <p className="text-sm text-gray-600 mt-1">CO₂ equivalent annually</p>
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-xs text-blue-800">
              Optional reporting category
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <Leaf className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Net Position</h3>
              <p className="text-xs text-gray-500">After carbon credits</p>
            </div>
          </div>
          <p className="text-3xl font-bold text-green-600">{(netEmissions / 1000).toFixed(1)}t</p>
          <p className="text-sm text-gray-600 mt-1">Remaining liability</p>
          <div className="mt-4 p-3 bg-green-50 rounded-lg">
            <p className="text-xs text-green-800">
              Credits purchased: {totalCreditsPurchased.toFixed(1)}t
            </p>
          </div>
        </div>
      </div>

      {/* Detailed Fleet Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Detailed Fleet Emissions</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fuel Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Annual KM</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Business Use</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Scope 2</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Scope 3</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Novated</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {fleetWithEmissions.map((vehicle) => (
                <tr key={vehicle.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{vehicle.employeeName}</p>
                      <p className="text-xs text-gray-500">{vehicle.employeeId}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm text-gray-900">{vehicle.make} {vehicle.model}</p>
                    <p className="text-xs text-gray-500">{vehicle.vehicleType}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      vehicle.fuelType === 'EV' ? 'bg-green-100 text-green-800' :
                      vehicle.fuelType === 'Hybrid' ? 'bg-blue-100 text-blue-800' :
                      vehicle.fuelType === 'Petrol' ? 'bg-orange-100 text-orange-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {vehicle.fuelType}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatNumber(vehicle.kmPerYear)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {vehicle.businessUse}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {(vehicle.scope2Emissions / 1000).toFixed(2)}t
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {(vehicle.scope3Emissions / 1000).toFixed(2)}t
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {vehicle.hasNovated ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <X className="h-4 w-4 text-red-500" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const CarbonCredits = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Carbon Credits Management</h2>
        <div className="text-sm text-gray-600">
          Current ACCU Price: {formatCurrency(ACCU_PRICE)} per tonne
        </div>
      </div>

      {/* Purchase Carbon Credits */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Purchase Carbon Credits</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tonnes to Purchase
              </label>
              <input
                type="number"
                value={creditsPurchaseAmount}
                onChange={(e) => setCreditsPurchaseAmount(e.target.value)}
                placeholder="Enter tonnes (e.g., 25.5)"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            {creditsPurchaseAmount && parseFloat(creditsPurchaseAmount) > 0 && (
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Purchase Summary</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Carbon Credits:</span>
                    <span>{parseFloat(creditsPurchaseAmount)} tonnes</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Base Cost:</span>
                    <span>{formatCurrency(parseFloat(creditsPurchaseAmount) * ACCU_PRICE)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Service Fee (15%):</span>
                    <span>{formatCurrency(parseFloat(creditsPurchaseAmount) * ACCU_PRICE * COMMISSION_RATE)}</span>
                  </div>
                  <div className="flex justify-between font-semibold border-t pt-1">
                    <span>Total Cost:</span>
                    <span>{formatCurrency(parseFloat(creditsPurchaseAmount) * ACCU_PRICE * (1 + COMMISSION_RATE))}</span>
                  </div>
                </div>
              </div>
            )}
            
            <button
              onClick={handleBuyCredits}
              disabled={!creditsPurchaseAmount || parseFloat(creditsPurchaseAmount) <= 0}
              className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
            >
              Purchase Carbon Credits
            </button>
          </div>
          
          <div className="space-y-4">
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-medium text-green-900 mb-2">Offset Requirements</h4>
              <div className="space-y-2 text-sm text-green-800">
                <p>Current Scope 2 Emissions: <strong>{(scope2Total / 1000).toFixed(1)}t</strong></p>
                <p>Credits Purchased: <strong>{totalCreditsPurchased.toFixed(1)}t</strong></p>
                <p>Remaining Liability: <strong>{(netEmissions / 1000).toFixed(1)}t</strong></p>
                <p>Cost to Neutralise: <strong>{formatCurrency(netEmissions * ACCU_PRICE * (1 + COMMISSION_RATE))}</strong></p>
              </div>
            </div>
            
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">About Australian Carbon Credit Units</h4>
              <p className="text-sm text-blue-800">
                ACCUs represent genuine emissions reductions or carbon sequestration 
                within Australia. Each unit represents one tonne of CO₂ equivalent 
                avoided or removed from the atmosphere.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Purchase History */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Purchase History</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tonnes</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price per Tonne</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Cost</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {carbonPurchases.map((purchase) => (
                <tr key={purchase.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(purchase.date).toLocaleDateString('en-AU')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {purchase.tonnes}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(purchase.costPerTonne)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(purchase.totalCost)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                      {purchase.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const CompanyBenefits = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Company Benefits Analysis</h2>
        <div className="text-sm text-gray-600">
          Financial and environmental benefits from novated leasing
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
        <div className="flex items-start space-x-3">
          <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
          <div>
            <h3 className="font-semibold text-yellow-900">Important Disclaimer</h3>
            <p className="text-yellow-800 text-sm mt-1">
              All calculations are estimates only and based on current tax rates and average data. 
              Actual savings may vary depending on individual circumstances, state-specific rates, 
              and changes to taxation legislation. Please consult with your financial advisor or 
              tax professional for personalised advice.
            </p>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Annual Payroll Tax Savings"
          value={formatCurrency(companyBenefits.payrollTaxSavings)}
          subtitle={`Rate: ${(taxRates.payrollTax[companyInfo.state] * 100).toFixed(2)}% (${companyInfo.state})`}
          icon={TrendingDown}
          colour="green"
        />
        <MetricCard
          title="Annual Super Savings"
          value={formatCurrency(companyBenefits.superSavings)}
          subtitle={`Rate: ${(taxRates.superGuarantee * 100).toFixed(1)}% super guarantee`}
          icon={Shield}
          colour="blue"
        />
        <MetricCard
          title="Total Annual Savings"
          value={formatCurrency(companyBenefits.totalSavings)}
          subtitle="Combined tax benefits"
          icon={DollarSign}
          colour="purple"
        />
        <MetricCard
          title="Carbon Offset from EVs"
          value={`${companyBenefits.carbonOffset.toFixed(1)}t`}
          subtitle="CO₂ saved vs equivalent ICE"
          icon={Leaf}
          colour="green"
        />
      </div>

      {/* Detailed Vehicle Analysis */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Vehicle-by-Vehicle Analysis</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Package Reduction</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payroll Tax Saving</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Super Saving</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Saving</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {fleetData.filter(v => v.hasNovated).map((vehicle) => {
                const payrollSaving = vehicle.annualPackageReduction * taxRates.payrollTax[companyInfo.state];
                const superSaving = vehicle.annualPackageReduction * taxRates.superGuarantee;
                const totalSaving = payrollSaving + superSaving;
                
                return (
                  <tr key={vehicle.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{vehicle.employeeName}</p>
                        <p className="text-xs text-gray-500">{vehicle.employeeId}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-sm text-gray-900">{vehicle.make} {vehicle.model}</p>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        vehicle.fuelType === 'EV' ? 'bg-green-100 text-green-800' :
                        vehicle.fuelType === 'Hybrid' ? 'bg-blue-100 text-blue-800' :
                        'bg-orange-100 text-orange-800'
                      }`}>
                        {vehicle.fuelType}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(vehicle.annualPackageReduction)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                      {formatCurrency(payrollSaving)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                      {formatCurrency(superSaving)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-purple-600">
                      {formatCurrency(totalSaving)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const ManagementSummary = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Management Summary</h2>
        <button 
          onClick={downloadManagementSummary}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
        >
          <Download size={16} />
          <span>Download Summary</span>
        </button>
      </div>

      {/* Executive Overview */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 rounded-xl">
        <h3 className="text-xl font-bold mb-4">Fleet Management Program - Executive Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <p className="text-3xl font-bold">{fleetData.length}</p>
            <p className="text-blue-100">Total Fleet Vehicles</p>
          </div>
          <div>
            <p className="text-3xl font-bold">{percentEV.toFixed(1)}%</p>
            <p className="text-blue-100">EV Adoption Rate</p>
          </div>
          <div>
            <p className="text-3xl font-bold">{formatCurrency(companyBenefits.totalSavings)}</p>
            <p className="text-blue-100">Annual Tax Savings</p>
          </div>
          <div>
            <p className="text-3xl font-bold">{companyBenefits.carbonOffset.toFixed(1)}t</p>
            <p className="text-blue-100">CO₂ Offset Annually</p>
          </div>
        </div>
      </div>

      {/* Key Metrics for Reporting */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Financial Performance</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <span className="font-medium">Payroll Tax Savings (Annual)</span>
              <span className="font-bold text-green-600">{formatCurrency(companyBenefits.payrollTaxSavings)}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
              <span className="font-medium">Superannuation Savings (Annual)</span>
              <span className="font-bold text-blue-600">{formatCurrency(companyBenefits.superSavings)}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
              <span className="font-medium">Total Package Reduction</span>
              <span className="font-bold text-purple-600">{formatCurrency(companyBenefits.totalPackageReduction)}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
              <span className="font-medium">Novated Leases Active</span>
              <span className="font-bold text-orange-600">{companyBenefits.novatedCount} vehicles</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Environmental Performance</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <span className="font-medium">EV/Hybrid Vehicles</span>
              <span className="font-bold text-green-600">{evCount} vehicles</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
              <span className="font-medium">Carbon Offset from EVs</span>
              <span className="font-bold text-blue-600">{companyBenefits.carbonOffset.toFixed(1)} tonnes CO₂</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
              <span className="font-medium">Scope 2 Emissions</span>
              <span className="font-bold text-orange-600">{(scope2Total / 1000).toFixed(1)} tonnes CO₂</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
              <span className="font-medium">Carbon Liability</span>
              <span className="font-bold text-purple-600">{formatCurrency(carbonLiability)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const EVUptakeTips = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">EV Uptake Strategies</h2>
        <div className="text-sm text-gray-600">
          Evidence-based tips to increase EV adoption
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-start space-x-3">
          <Target className="h-6 w-6 text-blue-600 mt-1" />
          <div>
            <h3 className="font-semibold text-blue-900">Current EV Adoption Progress</h3>
            <p className="text-blue-800 text-sm mt-1">
              Your fleet is {percentEV.toFixed(1)}% electric/hybrid. Target: {evTarget}%. 
              {percentEV >= evTarget ? 'Congratulations on meeting your target!' : `You need ${Math.ceil((evTarget - percentEV) / 100 * fleetData.length)} more EVs to reach your goal.`}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {evUptakeTips.map((tip) => (
          <div key={tip.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <span className={`px-3 py-1 text-sm rounded-full font-medium ${
                  tip.impact === 'Very High' ? 'bg-red-100 text-red-800' :
                  tip.impact === 'High' ? 'bg-orange-100 text-orange-800' :
                  tip.impact === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {tip.impact} Impact
                </span>
                <span className={`px-3 py-1 text-sm rounded-full font-medium ${
                  tip.effort === 'High' ? 'bg-red-100 text-red-800' :
                  tip.effort === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {tip.effort} Effort
                </span>
              </div>
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                {tip.category}
              </span>
            </div>
            
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{tip.title}</h3>
            <p className="text-gray-600 mb-4">{tip.description}</p>
            
            <div className="space-y-3">
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-1">Implementation</h4>
                <p className="text-sm text-gray-600">{tip.implementation}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-1">Expected Result</h4>
                  <p className="text-sm text-green-600">{tip.expectedResult}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-1">Cost</h4>
                  <p className="text-sm text-blue-600">{tip.cost}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardOverview />;
      case 'emissions':
        return <EmissionsReporting />;
      case 'carbon-credits':
        return <CarbonCredits />;
      case 'benefits':
        return <CompanyBenefits />;
      case 'management':
        return <ManagementSummary />;
      case 'ev-tips':
        return <EVUptakeTips />;
      default:
        return <DashboardOverview />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">MXDriveIQ</h1>
              <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">Employer Portal</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{userInfo.name}</p>
                <p className="text-xs text-gray-500">{userInfo.role} • {companyInfo.name}</p>
              </div>
              <div className="h-10 w-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium">
                {userInfo.name.split(' ').map(n => n[0]).join('')}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-1 py-4 overflow-x-auto">
            <TabButton
              id="dashboard"
              label="Dashboard"
              icon={BarChart3}
              active={activeTab === 'dashboard'}
              onClick={setActiveTab}
            />
            <TabButton
              id="emissions"
              label="Emissions Reporting"
              icon={Globe}
              active={activeTab === 'emissions'}
              onClick={setActiveTab}
            />
            <TabButton
              id="benefits"
              label="Company Benefits"
              icon={DollarSign}
              active={activeTab === 'benefits'}
              onClick={setActiveTab}
            />
            <TabButton
              id="management"
              label="Management Summary"
              icon={ClipboardList}
              active={activeTab === 'management'}
              onClick={setActiveTab}
            />
            <TabButton
              id="carbon-credits"
              label="Carbon Credits"
              icon={Leaf}
              active={activeTab === 'carbon-credits'}
              onClick={setActiveTab}
            />
            <TabButton
              id="ev-tips"
              label="EV Uptake Tips"
              icon={Zap}
              active={activeTab === 'ev-tips'}
              onClick={setActiveTab}
            />
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {renderTabContent()}
      </main>

      {/* EV Target Modal */}
      {showEVTargetModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">EV Adoption Target</h3>
                <button
                  onClick={() => setShowEVTargetModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Current Status */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2">Current EV Adoption</h4>
                <div className="flex items-center justify-between">
                  <span className="text-blue-800">Progress: {percentEV.toFixed(1)}%</span>
                  <span className="text-blue-800">Target: {evTarget}%</span>
                </div>
                <div className="w-full bg-blue-200 rounded-full h-3 mt-2">
                  <div 
                    className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(percentEV, 100)}%` }}
                  ></div>
                </div>
              </div>

              {/* Target Adjustment */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Set EV Adoption Target (%)
                </label>
                <div className="flex items-center space-x-4">
                  <input
                    type="range"
                    min="10"
                    max="100"
                    step="5"
                    value={evTarget}
                    onChange={(e) => setEvTarget(parseInt(e.target.value))}
                    className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="text-lg font-semibold text-gray-900 min-w-[60px]">
                    {evTarget}%
                  </div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>10%</span>
                  <span>50%</span>
                  <span>100%</span>
                </div>
              </div>

              {/* Target Analysis */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-green-50 rounded-lg p-4">
                  <h4 className="font-semibold text-green-900 mb-2">Target Impact</h4>
                  <div className="space-y-2 text-sm text-green-800">
                    <p>Vehicles needed: <strong>{Math.ceil(evTarget / 100 * fleetData.length)}</strong></p>
                    <p>Additional EVs: <strong>{Math.max(0, Math.ceil(evTarget / 100 * fleetData.length) - evCount)}</strong></p>
                    <p>Potential CO₂ reduction: <strong>{((evTarget - percentEV) / 100 * fleetData.length * 2.5).toFixed(1)}t/year</strong></p>
                  </div>
                </div>
                
                <div className="bg-orange-50 rounded-lg p-4">
                  <h4 className="font-semibold text-orange-900 mb-2">Implementation Timeline</h4>
                  <div className="space-y-2 text-sm text-orange-800">
                    <p>Realistic timeframe: <strong>{Math.ceil((evTarget - percentEV) / 10)} years</strong></p>
                    <p>Annual target: <strong>{((evTarget - percentEV) / Math.ceil((evTarget - percentEV) / 10)).toFixed(1)}% increase</strong></p>
                    <p>Lease cycles needed: <strong>{Math.ceil((evTarget - percentEV) / 15)}</strong></p>
                  </div>
                </div>
              </div>

              {/* Suggested Actions */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Recommended Actions to Reach Target</h4>
                <div className="space-y-3">
                  {evTarget > percentEV + 20 && (
                    <div className="flex items-start space-x-3 p-3 bg-red-50 rounded-lg">
                      <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-red-900">Ambitious Target</p>
                        <p className="text-sm text-red-800">Consider implementing EV-first policy and workplace charging infrastructure</p>
                      </div>
                    </div>
                  )}
                  
                  {evTarget > percentEV + 10 && evTarget <= percentEV + 20 && (
                    <div className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg">
                      <Info className="h-5 w-5 text-yellow-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-yellow-900">Moderate Target</p>
                        <p className="text-sm text-yellow-800">Focus on education sessions and EV experience days</p>
                      </div>
                    </div>
                  )}
                  
                  {evTarget <= percentEV + 10 && evTarget > percentEV && (
                    <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-green-900">Achievable Target</p>
                        <p className="text-sm text-green-800">Enhance EV benefits and recognition programs</p>
                      </div>
                    </div>
                  )}

                  {evTarget <= percentEV && (
                    <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                      <Award className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-blue-900">Target Already Achieved!</p>
                        <p className="text-sm text-blue-800">Consider setting a more ambitious target to drive further improvement</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => setShowEVTargetModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowEVTargetModal(false);
                    setActiveTab('ev-tips');
                  }}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-medium"
                >
                  View EV Strategies
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500">
              © 2025 MXDriveIQ Employer Portal. Scope 2 & 3 Emissions Reporting Platform
            </div>
            <div className="flex space-x-6 text-sm">
              <button className="text-gray-500 hover:text-gray-700">Support</button>
              <button className="text-gray-500 hover:text-gray-700">Documentation</button>
              <button className="text-gray-500 hover:text-gray-700">Privacy</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default EmployerDashboard;
