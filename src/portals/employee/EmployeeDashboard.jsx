import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import {
  Car, 
  Bike, 
  Bus, 
  MapPin, 
  TrendingUp, 
  Leaf, 
  Calculator, 
  Plus, 
  Edit,
  Calendar,
  Award,
  Users,
  Target,
  CheckCircle,
  AlertCircle,
  Clock,
  DollarSign,
  BarChart3,
  MessageCircle,
  Share2,
  Settings,
  Bell,
  ChevronRight,
  Zap,
  Globe,
  Heart,
  Star,
  Trophy,
  Lightbulb,
  PieChart,
  Activity,
  Save,
  X,
  Home,
  Truck,
  Train,
  Plane
} from 'lucide-react';

const EmployeeDashboard = () => {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState('overview');
  const [user, setUser] = useState({
    name: 'Loading...',
    email: '',
    company: '',
    employeeId: '',
    joinDate: ''
  });
  const [loading, setLoading] = useState(true);
  const [realData, setRealData] = useState({
    vehicles: [],
    commutes: [],
    goals: [],
    companySettings: null
  });

  // Load user data from Supabase
  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      // Check URL parameters first
      const companyParam = searchParams.get('company');
      const demoParam = searchParams.get('demo');
      
      // Handle demo mode or company parameter
      if (demoParam === 'true' || companyParam) {
        await loadDemoCompanyData(companyParam);
        return;
      }

      // Check for demo user in localStorage
      const demoUser = localStorage.getItem('demo_user');
      if (demoUser) {
        const parsedDemoUser = JSON.parse(demoUser);
        setUser({
          name: parsedDemoUser.user_metadata?.full_name || 'Demo Employee',
          email: parsedDemoUser.email,
          company: 'Demo Company Pty Ltd',
          employeeId: 'DEMO001',
          joinDate: new Date().toISOString()
        });
        await loadDemoCompanyData();
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
          setUser({
            name: profile.full_name || session.user.user_metadata?.full_name || 'Employee',
            email: session.user.email,
            company: profile.company_name || 'Your Company',
            employeeId: profile.employee_id || 'EMP001',
            joinDate: profile.created_at || new Date().toISOString()
          });
          
          // Load real user data
          await loadUserRealData(session.user.id);
        } else {
          // Fallback to session data
          setUser({
            name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'Employee',
            email: session.user.email,
            company: 'Your Company',
            employeeId: 'EMP001',
            joinDate: new Date().toISOString()
          });
        }
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      // Keep default fallback data
      setUser({
        name: 'Employee',
        email: 'employee@company.com',
        company: 'Your Company',
        employeeId: 'EMP001',
        joinDate: new Date().toISOString()
      });
    } finally {
      setLoading(false);
    }
  };

  const loadDemoCompanyData = async (companyId = null) => {
    try {
      // Determine which employee to load based on company parameter
      let employeeUserId = 'techflow-emp-001'; // Default to Sarah Chen (EV owner)
      
      if (companyId === 'techflow-sarah') employeeUserId = 'techflow-emp-001';
      else if (companyId === 'techflow-michael') employeeUserId = 'techflow-emp-002';
      else if (companyId === 'techflow-emma') employeeUserId = 'techflow-emp-003';
      else if (companyId === 'techflow-james') employeeUserId = 'techflow-emp-004';
      else if (companyId === 'techflow-alex') employeeUserId = 'techflow-emp-005';
      else if (companyId === 'techflow-lisa') employeeUserId = 'techflow-emp-006';
      else if (companyId === 'techflow-david') employeeUserId = 'techflow-emp-007';

      // Load employee data
      const { data: employeeData, error: employeeError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', employeeUserId)
        .single();

      if (employeeData && !employeeError) {
        setUser({
          name: employeeData.full_name,
          email: employeeData.email,
          company: employeeData.company_name,
          employeeId: employeeData.employee_id,
          joinDate: employeeData.created_at
        });
      }

      // Load employee vehicle data
      const { data: vehicleData, error: vehicleError } = await supabase
        .from('employee_vehicles')
        .select('*')
        .eq('user_id', employeeUserId)
        .single();

      // Load commute data
      const { data: commuteData, error: commuteError } = await supabase
        .from('commute_data')
        .select('*')
        .eq('user_id', employeeUserId)
        .order('date', { ascending: false })
        .limit(10);

      // Load sustainability goals
      const { data: goalsData, error: goalsError } = await supabase
        .from('sustainability_goals')
        .select('*')
        .eq('user_id', employeeUserId);

      // Load company settings
      const { data: companyData, error: companyError } = await supabase
        .from('company_settings')
        .select('*')
        .eq('user_id', 'techflow-hr-001')
        .single();

      // Update real data state
      setRealData({
        vehicles: vehicleData ? [vehicleData] : [],
        commutes: commuteData || [],
        goals: goalsData || [],
        companySettings: companyData
      });

      // Update personal data with real demo data
      if (vehicleData) {
        setPersonalData(prev => ({
          ...prev,
          currentLeases: [{
            id: 1,
            vehicle: `${vehicleData.make} ${vehicleData.model}`,
            monthlyPayment: vehicleData.monthly_lease_payment || 750,
            leaseEnd: vehicleData.lease_end_date,
            status: 'active',
            co2Saved: 2.4,
            image: '/api/placeholder/300/200'
          }]
        }));
      }

      // Update weekly commutes with real data
      if (commuteData && commuteData.length > 0) {
        const formattedCommutes = commuteData.map(commute => ({
          date: commute.date,
          segments: [{
            mode: commute.transport_mode,
            distance: commute.distance_km,
            description: `Daily commute - ${commute.transport_mode}`,
            emissions: commute.emissions_kg
          }],
          totalDistance: commute.distance_km,
          totalEmissions: commute.emissions_kg
        }));
        setWeeklyCommutes(formattedCommutes);
      }

    } catch (error) {
      console.error('Error loading demo company data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserRealData = async (userId) => {
    try {
      // Load user's vehicle data
      const { data: vehicleData, error: vehicleError } = await supabase
        .from('employee_vehicles')
        .select('*')
        .eq('user_id', userId);

      // Load commute data
      const { data: commuteData, error: commuteError } = await supabase
        .from('commute_data')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false })
        .limit(10);

      // Load sustainability goals
      const { data: goalsData, error: goalsError } = await supabase
        .from('sustainability_goals')
        .select('*')
        .eq('user_id', userId);

      // Update real data state
      setRealData({
        vehicles: vehicleData || [],
        commutes: commuteData || [],
        goals: goalsData || [],
        companySettings: null
      });

      // Update UI with real data if available
      if (vehicleData && vehicleData.length > 0) {
        const formattedLeases = vehicleData.map((vehicle, index) => ({
          id: index + 1,
          vehicle: `${vehicle.make} ${vehicle.model}`,
          monthlyPayment: vehicle.monthly_lease_payment || 0,
          leaseEnd: vehicle.lease_end_date,
          status: new Date(vehicle.lease_end_date) > new Date() ? 'active' : 'ending-soon',
          co2Saved: 2.4, // Calculate based on vehicle type
          image: '/api/placeholder/300/200'
        }));
        
        setPersonalData(prev => ({
          ...prev,
          currentLeases: formattedLeases
        }));
      }

      if (commuteData && commuteData.length > 0) {
        const formattedCommutes = commuteData.map(commute => ({
          date: commute.date,
          segments: [{
            mode: commute.transport_mode,
            distance: commute.distance_km,
            description: `Daily commute - ${commute.transport_mode}`,
            emissions: commute.emissions_kg
          }],
          totalDistance: commute.distance_km,
          totalEmissions: commute.emissions_kg
        }));
        setWeeklyCommutes(formattedCommutes);
      }

    } catch (error) {
      console.error('Error loading user real data:', error);
    }
  };

  // Enhanced commute tracking with multi-modal journeys
  const [dailyCommute, setDailyCommute] = useState({
    date: new Date().toISOString().split('T')[0],
    segments: [],
    totalDistance: 0,
    totalEmissions: 0,
    notes: ''
  });

  const [isAddingSegment, setIsAddingSegment] = useState(false);
  const [newSegment, setNewSegment] = useState({
    mode: 'car',
    distance: '',
    description: ''
  });

  // Add Vehicle Modal State
  const [showAddVehicleModal, setShowAddVehicleModal] = useState(false);
  const [newVehicle, setNewVehicle] = useState({
    make: '',
    model: '',
    year: '',
    fuelType: 'petrol',
    monthlyPayment: '',
    leaseEndDate: '',
    isNovated: false
  });

  // Vehicle Details Modal State
  const [showVehicleDetailsModal, setShowVehicleDetailsModal] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  // Australian-specific emission factors (kg CO2 per km)
  const emissionFactors = {
    car: 0.21,        // Average Australian car
    carpool: 0.105,   // Shared car (50% reduction)
    bike: 0,
    walk: 0,
    bus: 0.089,       // Public bus
    train: 0.042,     // Electric train
    tram: 0.035,      // Melbourne tram system
    motorbike: 0.113,
    taxi: 0.21,
    rideshare: 0.21
  };

  const transportModes = {
    car: { icon: Car, label: 'Private Car', color: 'blue' },
    carpool: { icon: Users, label: 'Carpool', color: 'purple' },
    bike: { icon: Bike, label: 'Bicycle', color: 'green' },
    walk: { icon: MapPin, label: 'Walking', color: 'orange' },
    bus: { icon: Bus, label: 'Bus', color: 'red' },
    train: { icon: Train, label: 'Train', color: 'indigo' },
    tram: { icon: Truck, label: 'Tram', color: 'yellow' },
    motorbike: { icon: Car, label: 'Motorbike', color: 'gray' },
    taxi: { icon: Car, label: 'Taxi', color: 'yellow' },
    rideshare: { icon: Car, label: 'Rideshare', color: 'pink' }
  };

  // Mock data for the employee
  const [personalData, setPersonalData] = useState({
    currentLeases: [
      {
        id: 1,
        vehicle: 'Tesla Model 3',
        monthlyPayment: 890,
        leaseEnd: '2026-01-15',
        status: 'active',
        co2Saved: 2.4,
        image: '/api/placeholder/300/200'
      },
      {
        id: 2,
        vehicle: 'BMW iX3',
        monthlyPayment: 1150,
        leaseEnd: '2025-03-20',
        status: 'ending-soon',
        co2Saved: 1.8,
        image: '/api/placeholder/300/200'
      }
    ],
    monthlyBudget: 2040,
    totalCarbonSaved: 4.2,
    commuteScore: 8.5,
    communityRank: 23,
    achievements: ['Early EV Adopter', 'Green Commuter', 'Carbon Saver']
  });

  const [weeklyCommutes, setWeeklyCommutes] = useState([
    {
      date: '2025-01-27',
      segments: [
        { mode: 'car', distance: 3, description: 'Home to train station' },
        { mode: 'train', distance: 22, description: 'Train to CBD' },
        { mode: 'walk', distance: 1, description: 'Station to office' }
      ],
      totalDistance: 26,
      totalEmissions: 1.56
    },
    {
      date: '2025-01-28',
      segments: [
        { mode: 'bike', distance: 26, description: 'Direct cycle to work' }
      ],
      totalDistance: 26,
      totalEmissions: 0
    },
    {
      date: '2025-01-29',
      segments: [
        { mode: 'carpool', distance: 26, description: 'Shared ride with colleague' }
      ],
      totalDistance: 26,
      totalEmissions: 2.73
    }
  ]);

  // Australian sustainability tips based on research
  const sustainabilityTips = [
    {
      category: 'Transport',
      title: 'Join a Carpool Group',
      impact: 'High',
      description: 'Carpooling can reduce your commute emissions by 50% and save you money. The average Australian commutes 16km each way - sharing this journey halves your carbon footprint.',
      action: 'Use workplace carpooling apps or notice boards to find colleagues with similar routes.',
      saving: 'Save ~$2,000 annually on petrol and parking',
      australianContext: '79% of Australians drive alone to work - carpooling can significantly impact national emissions.'
    },
    {
      category: 'Active Transport',
      title: 'Cycle Part of Your Journey',
      impact: 'High',
      description: 'Even cycling part-way (like to a train station) can dramatically reduce emissions. Cycling 10km daily saves approximately 1.3 tonnes of CO₂ annually.',
      action: 'Try cycling to your nearest public transport hub, then use train/bus for longer distances.',
      saving: 'Zero fuel costs + improved fitness',
      australianContext: 'Only 5.2% of Australians currently cycle to work - huge room for improvement!'
    },
    {
      category: 'Public Transport',
      title: 'Embrace Public Transport',
      impact: 'Medium',
      description: 'Public transport has been the highest priority for Australians since 2010. Trains and buses spread emissions across many passengers, making them very efficient.',
      action: 'Use transport apps to plan multi-modal journeys combining different public transport options.',
      saving: 'Save on petrol, parking, and vehicle maintenance',
      australianContext: 'Australian cities are investing heavily in public transport infrastructure.'
    },
    {
      category: 'Flexible Work',
      title: 'Work from Home Strategically',
      impact: 'High',
      description: 'Working from home 1-2 days per week can reduce annual commute emissions by 20-40%. Best combined with green commuting on office days.',
      action: 'Negotiate flexible working arrangements with your manager.',
      saving: 'Reduce commute costs and time stress',
      australianContext: 'Remote work adoption accelerated post-COVID, with many Australian employers now offering hybrid options.'
    },
    {
      category: 'EV Transition',
      title: 'Consider an Electric Vehicle',
      impact: 'Very High',
      description: 'EVs can reduce transport emissions by 70-80% compared to petrol cars. With Australias increasingly renewable energy grid, this benefit grows each year.',
      action: 'Use our lease calculator to explore EV novated lease options with significant tax benefits.',
      saving: 'Up to $15,000 annual tax savings through novated leasing',
      australianContext: 'EV sales grew 269% in 2023 - infrastructure is rapidly improving across Australia.'
    },
    {
      category: 'Mixed-Mode Commuting',
      title: 'Combine Transport Methods',
      impact: 'Medium',
      description: 'Multi-modal commuting (like drive + train, or bike + bus) can optimise both convenience and emissions for longer journeys.',
      action: 'Plan routes using park-and-ride facilities or bike storage at transport hubs.',
      saving: 'Reduced petrol costs while maintaining convenience',
      australianContext: 'Australian cities are expanding park-and-ride facilities to support mixed-mode commuting.'
    }
  ];

  const [communityFeed, setCommunityFeed] = useState([
    {
      id: 1,
      user: 'Mike Chen',
      action: 'just completed a week of bike+train commuting',
      time: '2 hours ago',
      likes: 12,
      carbonSaved: 8.2,
      details: 'Cycled 5km to station, then train to work'
    },
    {
      id: 2,
      user: 'Emma Wilson',
      action: 'achieved zero emissions commuting for the month',
      time: '5 hours ago',
      likes: 24,
      carbonSaved: 15.6,
      details: 'Combination of cycling, walking and public transport'
    },
    {
      id: 3,
      user: 'David Park',
      action: 'started a new carpool group for North Shore',
      time: '1 day ago',
      likes: 18,
      carbonSaved: 12.4,
      details: '4 colleagues now sharing the daily commute'
    }
  ]);

  const calculateSegmentEmissions = (mode, distance) => {
    return (emissionFactors[mode] || 0) * parseFloat(distance || 0);
  };

  const addCommuteSegment = () => {
    if (newSegment.distance && newSegment.mode) {
      const emissions = calculateSegmentEmissions(newSegment.mode, newSegment.distance);
      const segment = {
        ...newSegment,
        distance: parseFloat(newSegment.distance),
        emissions: emissions
      };
      
      setDailyCommute(prev => ({
        ...prev,
        segments: [...prev.segments, segment],
        totalDistance: prev.totalDistance + segment.distance,
        totalEmissions: prev.totalEmissions + emissions
      }));
      
      setNewSegment({ mode: 'car', distance: '', description: '' });
      setIsAddingSegment(false);
    }
  };

  // Stable input handlers to prevent re-rendering issues
  const handleSegmentModeChange = useCallback((value) => {
    setNewSegment(prev => ({ ...prev, mode: value }));
  }, []);

  const handleSegmentDistanceChange = useCallback((value) => {
    setNewSegment(prev => ({ ...prev, distance: value }));
  }, []);

  const handleSegmentDescriptionChange = useCallback((value) => {
    setNewSegment(prev => ({ ...prev, description: value }));
  }, []);

  // Add Vehicle functionality
  const saveVehicle = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id || 'demo-employee-123';

      const { error } = await supabase
        .from('employee_vehicles')
        .insert({
          user_id: userId,
          make: newVehicle.make,
          model: newVehicle.model,
          year: parseInt(newVehicle.year),
          fuel_type: newVehicle.fuelType,
          monthly_lease_payment: parseFloat(newVehicle.monthlyPayment) || 0,
          lease_end_date: newVehicle.leaseEndDate,
          is_novated: newVehicle.isNovated,
          created_at: new Date().toISOString()
        });

      if (error) {
        console.error('Error saving vehicle:', error);
        alert('Error saving vehicle to database');
      } else {
        // Add to local state
        const newLease = {
          id: personalData.currentLeases.length + 1,
          vehicle: `${newVehicle.make} ${newVehicle.model}`,
          monthlyPayment: parseFloat(newVehicle.monthlyPayment) || 0,
          leaseEnd: newVehicle.leaseEndDate,
          status: 'active',
          co2Saved: newVehicle.fuelType === 'electric' ? 2.4 : newVehicle.fuelType === 'hybrid' ? 1.8 : 0,
          image: '/api/placeholder/300/200'
        };
        
        setPersonalData(prev => ({
          ...prev,
          currentLeases: [...prev.currentLeases, newLease]
        }));

        // Reset form and close modal
        setNewVehicle({
          make: '',
          model: '',
          year: '',
          fuelType: 'petrol',
          monthlyPayment: '',
          leaseEndDate: '',
          isNovated: false
        });
        setShowAddVehicleModal(false);
        alert('Vehicle added successfully!');
      }
    } catch (error) {
      console.error('Error saving vehicle:', error);
      alert('Error saving vehicle');
    }
  };

  // Vehicle Details functionality
  const viewVehicleDetails = (vehicle) => {
    setSelectedVehicle(vehicle);
    setShowVehicleDetailsModal(true);
  };

  const manageVehicle = (vehicle) => {
    // For now, just show details - could expand to edit functionality
    viewVehicleDetails(vehicle);
  };

  const removeSegment = (index) => {
    const segmentToRemove = dailyCommute.segments[index];
    setDailyCommute(prev => ({
      ...prev,
      segments: prev.segments.filter((_, i) => i !== index),
      totalDistance: prev.totalDistance - segmentToRemove.distance,
      totalEmissions: prev.totalEmissions - segmentToRemove.emissions
    }));
  };

  const saveCommute = async () => {
    if (dailyCommute.segments.length > 0) {
      try {
        // Get current user ID
        const { data: { session } } = await supabase.auth.getSession();
        const userId = session?.user?.id || 'demo-employee-123';

        // Save each segment as a separate commute entry
        for (const segment of dailyCommute.segments) {
          const { error } = await supabase
            .from('commute_data')
            .insert({
              user_id: userId,
              date: dailyCommute.date,
              distance_km: segment.distance,
              transport_mode: segment.mode,
              fuel_cost: segment.mode === 'car' ? segment.distance * 0.18 : 0, // Rough estimate
              emissions_kg: segment.emissions,
              created_at: new Date().toISOString()
            });

          if (error) {
            console.error('Error saving commute segment:', error);
          }
        }

        // Update local state
        setWeeklyCommutes(prev => [dailyCommute, ...prev.slice(0, 6)]);
        setDailyCommute({
          date: new Date().toISOString().split('T')[0],
          segments: [],
          totalDistance: 0,
          totalEmissions: 0,
          notes: ''
        });

        alert('Commute logged successfully and saved to database!');
      } catch (error) {
        console.error('Error saving commute:', error);
        // Still update local state even if save fails
        setWeeklyCommutes(prev => [dailyCommute, ...prev.slice(0, 6)]);
        setDailyCommute({
          date: new Date().toISOString().split('T')[0],
          segments: [],
          totalDistance: 0,
          totalEmissions: 0,
          notes: ''
        });
        alert('Commute logged locally (database save failed)');
      }
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

  const MetricCard = ({ title, value, subtitle, icon: Icon, colour = 'blue', trend }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
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

  const OverviewTab = () => (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-xl">
        <h2 className="text-2xl font-bold mb-2">Welcome back, {user.name}!</h2>
        <p className="text-blue-100 mb-4">You've saved {personalData.totalCarbonSaved} tonnes of CO₂ this year. Keep up the great work!</p>
        <div className="flex space-x-4">
          <a 
            href="https://mxdealeradvantage.com.au/calculator"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors"
          >
            Calculate New Lease
          </a>
          <button className="bg-blue-700 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-800 transition-colors">
            Join Community Challenge
          </button>
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center space-x-2">
            <Zap size={16} />
            <span>Need Home Charging?</span>
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Active Leases"
          value={personalData.currentLeases.length}
          subtitle="Current vehicles"
          icon={Car}
          colour="blue"
        />
        <MetricCard
          title="Monthly Budget"
          value={`$${personalData.monthlyBudget.toLocaleString()}`}
          subtitle="Total lease payments"
          icon={DollarSign}
          colour="green"
        />
        <MetricCard
          title="CO₂ Saved"
          value={`${personalData.totalCarbonSaved}t`}
          subtitle="This year"
          icon={Leaf}
          colour="green"
          trend="+18%"
        />
        <MetricCard
          title="Community Rank"
          value={`#${personalData.communityRank}`}
          subtitle="Out of 247 employees"
          icon={Trophy}
          colour="purple"
        />
      </div>

      {/* Recent Commutes Summary */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Commute Activity</h3>
        <div className="space-y-3">
          {weeklyCommutes.slice(0, 3).map((commute, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm font-medium">{new Date(commute.date).toLocaleDateString('en-AU')}</p>
                  <p className="text-xs text-gray-500">
                    {commute.segments.map(s => transportModes[s.mode]?.label).join(' + ')}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold">{commute.totalDistance}km</p>
                <p className="text-xs text-gray-500">{commute.totalEmissions.toFixed(1)}kg CO₂</p>
              </div>
            </div>
          ))}
        </div>
        <button 
          onClick={() => setActiveTab('commute')}
          className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Log Today's Commute
        </button>
      </div>

      {/* My Vehicles */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">My Vehicles</h3>
          <button 
            onClick={() => setShowAddVehicleModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
          >
            <Plus size={16} />
            <span>Add Vehicle</span>
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {personalData.currentLeases.map(lease => (
            <div key={lease.id} className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="h-32 bg-gray-200 flex items-center justify-center">
                <Car className="h-12 w-12 text-gray-400" />
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-900">{lease.vehicle}</h4>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    lease.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-orange-100 text-orange-800'
                  }`}>
                    {lease.status === 'active' ? 'Active' : 'Ending Soon'}
                  </span>
                </div>
                <div className="space-y-1 text-sm text-gray-600">
                  <p>Monthly: ${lease.monthlyPayment}</p>
                  <p>Lease ends: {new Date(lease.leaseEnd).toLocaleDateString('en-AU')}</p>
                  <p>CO₂ saved: {lease.co2Saved}t this year</p>
                </div>
                <div className="mt-4 flex space-x-2">
                  <button 
                    onClick={() => viewVehicleDetails(lease)}
                    className="flex-1 bg-gray-100 text-gray-700 py-2 px-3 rounded text-sm hover:bg-gray-200"
                  >
                    View Details
                  </button>
                  <button 
                    onClick={() => manageVehicle(lease)}
                    className="bg-blue-600 text-white py-2 px-3 rounded text-sm hover:bg-blue-700"
                  >
                    Manage
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sustainability Tips Preview */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Australian Sustainability Tips</h3>
          <button 
            onClick={() => setActiveTab('tips')}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center space-x-1"
          >
            <span>View All Tips</span>
            <ChevronRight size={16} />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sustainabilityTips.slice(0, 2).map((tip, index) => (
            <div key={index} className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  tip.impact === 'Very High' ? 'bg-red-100 text-red-800' :
                  tip.impact === 'High' ? 'bg-orange-100 text-orange-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {tip.impact} Impact
                </span>
                <span className="text-xs text-gray-500">{tip.category}</span>
              </div>
              <h4 className="font-medium text-gray-900 mb-1">{tip.title}</h4>
              <p className="text-sm text-gray-600">{tip.description.substring(0, 100)}...</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const CommuteTrackingTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Commute Tracking</h2>
        <div className="text-sm text-gray-600">
          Track your daily journey and see your environmental impact
        </div>
      </div>

      {/* Today's Commute Builder */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Log Today's Commute</h3>
        
        {/* Current segments */}
        {dailyCommute.segments.length > 0 && (
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Journey Segments</h4>
            <div className="space-y-2">
              {dailyCommute.segments.map((segment, index) => {
                const ModeIcon = transportModes[segment.mode]?.icon || Car;
                return (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <ModeIcon className={`h-5 w-5 text-${transportModes[segment.mode]?.color || 'blue'}-600`} />
                      <div>
                        <p className="text-sm font-medium">{transportModes[segment.mode]?.label}</p>
                        <p className="text-xs text-gray-500">{segment.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-sm font-semibold">{segment.distance}km</p>
                        <p className="text-xs text-gray-500">{segment.emissions.toFixed(2)}kg CO₂</p>
                      </div>
                      <button
                        onClick={() => removeSegment(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-blue-900">Total Journey</p>
                  <p className="text-xs text-blue-700">
                    {dailyCommute.segments.map(s => transportModes[s.mode]?.label).join(' → ')}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-blue-900">{dailyCommute.totalDistance}km</p>
                  <p className="text-sm text-blue-700">{dailyCommute.totalEmissions.toFixed(2)}kg CO₂</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add segment form */}
        {isAddingSegment ? (
          <div className="p-4 border border-gray-200 rounded-lg mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Add Journey Segment</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Transport Mode</label>
                <select
                  value={newSegment.mode}
                  onChange={(e) => setNewSegment(prev => ({ ...prev, mode: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {Object.entries(transportModes).map(([key, mode]) => (
                    <option key={key} value={key}>{mode.label}</option>
                  ))}
                </select>
              </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Distance (km)</label>
                  <input
                    type="number"
                    value={newSegment.distance}
                    onChange={(e) => handleSegmentDistanceChange(e.target.value)}
                    placeholder="e.g., 5.2"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <input
                    type="text"
                    value={newSegment.description}
                    onChange={(e) => handleSegmentDescriptionChange(e.target.value)}
                    placeholder="e.g., Home to station"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
            </div>
            <div className="flex space-x-3 mt-4">
              <button
                onClick={addCommuteSegment}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Add Segment
              </button>
              <button
                onClick={() => setIsAddingSegment(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setIsAddingSegment(true)}
            className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 text-gray-500 hover:border-blue-400 hover:text-blue-600 transition-colors flex items-center justify-center space-x-2"
          >
            <Plus size={20} />
            <span>Add Journey Segment</span>
          </button>
        )}

        {/* Save commute */}
        {dailyCommute.segments.length > 0 && (
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes (optional)</label>
              <textarea
                value={dailyCommute.notes}
                onChange={(e) => setDailyCommute(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Any additional notes about your commute..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={2}
              />
            </div>
            <button
              onClick={saveCommute}
              className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 font-medium flex items-center justify-center space-x-2"
            >
              <Save size={16} />
              <span>Save Today's Commute</span>
            </button>
          </div>
        )}
      </div>

      {/* Recent Commutes */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Commutes</h3>
        <div className="space-y-4">
          {weeklyCommutes.map((commute, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-gray-500" />
                  <span className="font-medium">{new Date(commute.date).toLocaleDateString('en-AU')}</span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">{commute.totalDistance}km</p>
                  <p className="text-xs text-gray-500">{commute.totalEmissions.toFixed(1)}kg CO₂</p>
                </div>
              </div>
              <div className="space-y-2">
                {commute.segments.map((segment, segIndex) => {
                  const ModeIcon = transportModes[segment.mode]?.icon || Car;
                  return (
                    <div key={segIndex} className="flex items-center space-x-3 text-sm">
                      <ModeIcon className={`h-4 w-4 text-${transportModes[segment.mode]?.color || 'blue'}-600`} />
                      <span className="flex-1">{segment.description}</span>
                      <span className="text-gray-500">{segment.distance}km</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Emission Factors Reference */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Australian Transport Emissions</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {Object.entries(emissionFactors).map(([mode, factor]) => {
            const ModeIcon = transportModes[mode]?.icon || Car;
            return (
              <div key={mode} className="text-center p-3 bg-gray-50 rounded-lg">
                <ModeIcon className={`h-6 w-6 mx-auto mb-2 text-${transportModes[mode]?.color || 'blue'}-600`} />
                <p className="text-xs font-medium text-gray-900">{transportModes[mode]?.label}</p>
                <p className="text-xs text-gray-500">{factor}kg CO₂/km</p>
              </div>
            );
          })}
        </div>
        <p className="text-xs text-gray-500 mt-4">
          * Emission factors based on Australian government data and include lifecycle emissions
        </p>
      </div>
    </div>
  );

  const SustainabilityTipsTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Australian Sustainability Tips</h2>
        <div className="text-sm text-gray-600">
          Evidence-based tips for Australian commuters
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {sustainabilityTips.map((tip, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
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
              </div>
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                {tip.category}
              </span>
            </div>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-3">{tip.title}</h3>
            <p className="text-gray-600 mb-4">{tip.description}</p>
            
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="text-sm font-medium text-blue-900 mb-2">How to implement:</h4>
                <p className="text-sm text-blue-800">{tip.action}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="text-sm font-medium text-green-900 mb-2">Potential Savings:</h4>
                  <p className="text-sm text-green-800">{tip.saving}</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <h4 className="text-sm font-medium text-purple-900 mb-2">Australian Context:</h4>
                  <p className="text-sm text-purple-800">{tip.australianContext}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-6 rounded-xl">
        <h3 className="text-xl font-bold mb-4">Ready to Take Action?</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="bg-white text-green-600 px-4 py-3 rounded-lg font-medium hover:bg-green-50 transition-colors">
            Calculate EV Savings
          </button>
          <button className="bg-green-700 text-white px-4 py-3 rounded-lg font-medium hover:bg-green-800 transition-colors">
            Find Carpool Partners
          </button>
          <button className="bg-blue-700 text-white px-4 py-3 rounded-lg font-medium hover:bg-blue-800 transition-colors">
            Plan Public Transport
          </button>
        </div>
      </div>
    </div>
  );

  const CommunityTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Community</h2>
        <div className="text-sm text-gray-600">
          Connect with colleagues on sustainability
        </div>
      </div>

      {/* Community Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MetricCard
          title="Your Rank"
          value={`#${personalData.communityRank}`}
          subtitle="Out of 247 employees"
          icon={Trophy}
          colour="purple"
        />
        <MetricCard
          title="CO₂ Saved"
          value={`${personalData.totalCarbonSaved}t`}
          subtitle="This year"
          icon={Leaf}
          colour="green"
        />
        <MetricCard
          title="Commute Score"
          value={personalData.commuteScore}
          subtitle="Sustainability rating"
          icon={Star}
          colour="yellow"
        />
        <MetricCard
          title="Achievements"
          value={personalData.achievements.length}
          subtitle="Badges earned"
          icon={Award}
          colour="blue"
        />
      </div>

      {/* Community Feed */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Community Activity</h3>
        <div className="space-y-4">
          {communityFeed.map(post => (
            <div key={post.id} className="border-b border-gray-100 pb-4 last:border-b-0">
              <div className="flex items-start space-x-3">
                <div className="h-10 w-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
                  {post.user.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-medium text-gray-900">{post.user}</span>
                    <span className="text-gray-600">{post.action}</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{post.details}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>{post.time}</span>
                    <button className="flex items-center space-x-1 hover:text-blue-600">
                      <Heart size={14} />
                      <span>{post.likes}</span>
                    </button>
                    <span className="flex items-center space-x-1">
                      <Leaf size={14} className="text-green-500" />
                      <span>{post.carbonSaved}kg CO₂ saved</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex space-x-3">
            <div className="h-10 w-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
              {user.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="flex-1">
              <textarea
                placeholder="Share your sustainability win..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                rows={2}
              />
              <div className="flex justify-between items-center mt-2">
                <div className="flex space-x-2">
                  <button className="text-gray-500 hover:text-blue-600">
                    <MapPin size={16} />
                  </button>
                  <button className="text-gray-500 hover:text-blue-600">
                    <Car size={16} />
                  </button>
                </div>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm">
                  Share
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Achievements</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {personalData.achievements.map((achievement, index) => (
            <div key={index} className="p-4 border border-gray-200 rounded-lg text-center">
              <Award className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
              <h4 className="font-medium text-gray-900">{achievement}</h4>
              <p className="text-xs text-gray-500 mt-1">Earned this month</p>
            </div>
          ))}
        </div>
      </div>

      {/* Leaderboard */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Leaderboard</h3>
        <div className="space-y-3">
          {[
            { rank: 1, name: 'Sarah Johnson', score: 9.8, co2Saved: 18.2 },
            { rank: 2, name: 'Mike Chen', score: 9.5, co2Saved: 16.8 },
            { rank: 3, name: 'Emma Wilson', score: 9.2, co2Saved: 15.6 },
            { rank: personalData.communityRank, name: user.name, score: personalData.commuteScore, co2Saved: personalData.totalCarbonSaved, isUser: true }
          ].map(entry => (
            <div key={entry.rank} className={`flex items-center justify-between p-3 rounded-lg ${
              entry.isUser ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'
            }`}>
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  entry.rank === 1 ? 'bg-yellow-500 text-white' :
                  entry.rank === 2 ? 'bg-gray-400 text-white' :
                  entry.rank === 3 ? 'bg-orange-500 text-white' :
                  'bg-gray-200 text-gray-700'
                }`}>
                  {entry.rank}
                </div>
                <span className={`font-medium ${entry.isUser ? 'text-blue-900' : 'text-gray-900'}`}>
                  {entry.name}
                </span>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold">{entry.score}/10</p>
                <p className="text-xs text-gray-500">{entry.co2Saved}t CO₂ saved</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const VehiclesTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">My Vehicles</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2">
          <Plus size={16} />
          <span>Add Vehicle</span>
        </button>
      </div>

      {/* Current Leases */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {personalData.currentLeases.map(lease => (
          <div key={lease.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Car className="h-16 w-16 text-white" />
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-900">{lease.vehicle}</h3>
                <span className={`px-3 py-1 text-sm rounded-full font-medium ${
                  lease.status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-orange-100 text-orange-800'
                }`}>
                  {lease.status === 'active' ? 'Active' : 'Ending Soon'}
                </span>
              </div>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Monthly Payment:</span>
                  <span className="font-semibold">${lease.monthlyPayment}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Lease Ends:</span>
                  <span className="font-semibold">{new Date(lease.leaseEnd).toLocaleDateString('en-AU')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">CO₂ Saved This Year:</span>
                  <span className="font-semibold text-green-600">{lease.co2Saved}t</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                  View Details
                </button>
                <div className="grid grid-cols-2 gap-2">
                  <button className="bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors text-sm">
                    Service History
                  </button>
                  <button className="bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors text-sm">
                    Documents
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lease Calculator CTA */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-8 rounded-xl">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold mb-2">Ready for Your Next Vehicle?</h3>
            <p className="text-green-100 mb-4">
              Explore electric and hybrid options with our lease calculator. 
              See potential tax savings and environmental benefits.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://mxdealeradvantage.com.au/calculator"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white text-green-600 px-6 py-3 rounded-lg font-medium hover:bg-green-50 transition-colors"
              >
                Calculate Lease Options
              </a>
              <button className="bg-green-700 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-800 transition-colors">
                Browse EVs
              </button>
              <button className="bg-yellow-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-yellow-700 transition-colors flex items-center space-x-2">
                <Zap size={20} />
                <span>Need Home Charging?</span>
              </button>
            </div>
          </div>
          <Calculator className="h-16 w-16 text-green-200" />
        </div>
      </div>

      {/* Vehicle Comparison */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Vehicle Impact Comparison</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-900">Vehicle</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Type</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Monthly Cost</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Annual CO₂</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Tax Savings</th>
              </tr>
            </thead>
            <tbody>
              {personalData.currentLeases.map(lease => (
                <tr key={lease.id} className="border-b border-gray-100">
                  <td className="py-3 px-4 font-medium">{lease.vehicle}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                      Electric
                    </span>
                  </td>
                  <td className="py-3 px-4">${lease.monthlyPayment}</td>
                  <td className="py-3 px-4 text-green-600">-{lease.co2Saved}t saved</td>
                  <td className="py-3 px-4 text-blue-600">~$8,500</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Maintenance Reminders */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Maintenance</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <AlertCircle className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="font-medium text-yellow-900">Tesla Model 3 - Service Due</p>
                <p className="text-sm text-yellow-700">Annual service recommended</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-sm text-yellow-600">Due in 2 weeks</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-medium text-green-900">BMW iX3 - Recently Serviced</p>
                <p className="text-sm text-green-700">Service completed last month</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-sm text-green-600">Next due: 6 months</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab />;
      case 'commute':
        return <CommuteTrackingTab />;
      case 'tips':
        return <SustainabilityTipsTab />;
      case 'community':
        return <CommunityTab />;
      case 'vehicles':
        return <VehiclesTab />;
      default:
        return <OverviewTab />;
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
              <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">Employee Portal</span>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-600 relative">
                <Bell size={20} />
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">3</span>
              </button>
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.company}</p>
                </div>
                <div className="h-10 w-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </div>
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
              id="overview"
              label="Overview"
              icon={BarChart3}
              active={activeTab === 'overview'}
              onClick={setActiveTab}
            />
            <TabButton
              id="commute"
              label="Commute"
              icon={MapPin}
              active={activeTab === 'commute'}
              onClick={setActiveTab}
            />
            <TabButton
              id="vehicles"
              label="Vehicles"
              icon={Car}
              active={activeTab === 'vehicles'}
              onClick={setActiveTab}
            />
            <TabButton
              id="tips"
              label="Tips"
              icon={Lightbulb}
              active={activeTab === 'tips'}
              onClick={setActiveTab}
            />
            <TabButton
              id="community"
              label="Community"
              icon={Users}
              active={activeTab === 'community'}
              onClick={setActiveTab}
            />
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {renderTabContent()}
      </main>

      {/* Add Vehicle Modal */}
      {showAddVehicleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">Add New Vehicle</h3>
                <button
                  onClick={() => setShowAddVehicleModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Make</label>
                  <input
                    type="text"
                    value={newVehicle.make}
                    onChange={(e) => setNewVehicle(prev => ({ ...prev, make: e.target.value }))}
                    placeholder="e.g., Tesla"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Model</label>
                  <input
                    type="text"
                    value={newVehicle.model}
                    onChange={(e) => setNewVehicle(prev => ({ ...prev, model: e.target.value }))}
                    placeholder="e.g., Model 3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
                  <input
                    type="number"
                    value={newVehicle.year}
                    onChange={(e) => setNewVehicle(prev => ({ ...prev, year: e.target.value }))}
                    placeholder="2024"
                    min="2020"
                    max="2025"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Fuel Type</label>
                  <select
                    value={newVehicle.fuelType}
                    onChange={(e) => setNewVehicle(prev => ({ ...prev, fuelType: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="petrol">Petrol</option>
                    <option value="diesel">Diesel</option>
                    <option value="hybrid">Hybrid</option>
                    <option value="electric">Electric</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Payment ($)</label>
                  <input
                    type="number"
                    value={newVehicle.monthlyPayment}
                    onChange={(e) => setNewVehicle(prev => ({ ...prev, monthlyPayment: e.target.value }))}
                    placeholder="890"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Lease End Date</label>
                  <input
                    type="date"
                    value={newVehicle.leaseEndDate}
                    onChange={(e) => setNewVehicle(prev => ({ ...prev, leaseEndDate: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isNovated"
                  checked={newVehicle.isNovated}
                  onChange={(e) => setNewVehicle(prev => ({ ...prev, isNovated: e.target.checked }))}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="isNovated" className="ml-2 block text-sm text-gray-900">
                  This is a novated lease
                </label>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => setShowAddVehicleModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={saveVehicle}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-medium"
                >
                  Add Vehicle
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Vehicle Details Modal */}
      {showVehicleDetailsModal && selectedVehicle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">Vehicle Details</h3>
                <button
                  onClick={() => setShowVehicleDetailsModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="text-center">
                <div className="h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                  <Car className="h-16 w-16 text-white" />
                </div>
                <h4 className="text-2xl font-bold text-gray-900">{selectedVehicle.vehicle}</h4>
                <span className={`inline-block px-3 py-1 text-sm rounded-full font-medium mt-2 ${
                  selectedVehicle.status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-orange-100 text-orange-800'
                }`}>
                  {selectedVehicle.status === 'active' ? 'Active Lease' : 'Ending Soon'}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h5 className="font-semibold text-blue-900 mb-2">Lease Details</h5>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Monthly Payment:</span>
                        <span className="font-semibold">${selectedVehicle.monthlyPayment}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Lease End Date:</span>
                        <span className="font-semibold">{new Date(selectedVehicle.leaseEnd).toLocaleDateString('en-AU')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Remaining Months:</span>
                        <span className="font-semibold">
                          {Math.max(0, Math.ceil((new Date(selectedVehicle.leaseEnd) - new Date()) / (1000 * 60 * 60 * 24 * 30)))}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h5 className="font-semibold text-green-900 mb-2">Environmental Impact</h5>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>CO₂ Saved This Year:</span>
                        <span className="font-semibold text-green-600">{selectedVehicle.co2Saved}t</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Fuel Type:</span>
                        <span className="font-semibold">Electric</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Efficiency Rating:</span>
                        <span className="font-semibold">★★★★★</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <h5 className="font-semibold text-gray-900 mb-3">Quick Actions</h5>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <button className="p-3 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 text-center">
                    <Calendar className="h-5 w-5 mx-auto mb-1 text-blue-600" />
                    <span className="text-xs">Service History</span>
                  </button>
                  <button className="p-3 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 text-center">
                    <DollarSign className="h-5 w-5 mx-auto mb-1 text-green-600" />
                    <span className="text-xs">Payment History</span>
                  </button>
                  <button className="p-3 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 text-center">
                    <Settings className="h-5 w-5 mx-auto mb-1 text-gray-600" />
                    <span className="text-xs">Manage Lease</span>
                  </button>
                  <button className="p-3 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 text-center">
                    <Share2 className="h-5 w-5 mx-auto mb-1 text-purple-600" />
                    <span className="text-xs">Share Details</span>
                  </button>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => setShowVehicleDetailsModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
                >
                  Close
                </button>
                <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-medium">
                  Edit Vehicle
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
              © 2025 MXDriveIQ Employee Portal. Secure • Private • Sustainable
            </div>
            <div className="flex space-x-6 text-sm">
              <button className="text-gray-500 hover:text-gray-700">Help</button>
              <button className="text-gray-500 hover:text-gray-700">Settings</button>
              <button className="text-gray-500 hover:text-gray-700">Feedback</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default EmployeeDashboard;
