import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials not found. Quote saving will be disabled.');
}

export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export async function saveQuote(quoteData) {
  if (!supabase) {
    console.warn('Supabase not configured - quote not saved');
    return { success: false, error: 'Database not configured' };
  }

  try {
    // Use the existing quote ID or generate a new one
    const quoteId = quoteData.id || quoteData.quoteId || `Q${Date.now()}${Math.random().toString(36).substr(2, 5)}`;

    // Map all fields to the new schema
    const quoteRecord = {
      quote_id: quoteId,
      
      // Customer information
      client_name: quoteData.clientName || quoteData.customerName || null,
      client_email: quoteData.clientEmail || quoteData.customerEmail || null,
      client_phone: quoteData.clientPhone || quoteData.customerPhone || null,
      
      // Vehicle information
      vehicle_make: quoteData.vehicleMake || null,
      vehicle_model: quoteData.vehicleModel || null,
      vehicle_year: quoteData.vehicleYear ? parseInt(quoteData.vehicleYear) : null,
      vehicle_trim: quoteData.vehicleTrim || null,
      vehicle_price: quoteData.vehiclePrice ? parseFloat(quoteData.vehiclePrice) : null,
      engine_size: quoteData.engineSize ? parseFloat(quoteData.engineSize) : null,
      fuel_type: quoteData.fuelType || null,
      body_style: quoteData.bodyStyle || null,
      is_ev: quoteData.isEV || false,
      
      // Financial information
      monthly_payment: quoteData.monthlyPayment ? parseFloat(quoteData.monthlyPayment) : null,
      term_years: quoteData.termYears ? parseInt(quoteData.termYears) : null,
      employer: quoteData.employer || null,
      employer_code: quoteData.employerCode || null,
      portal_source: quoteData.portalSource || 'mxdealer',
      state: quoteData.state || 'VIC',
      annual_kms: quoteData.annualKms ? parseInt(quoteData.annualKms) : null,
      pay_cycle: quoteData.payCycle || 'Monthly',
      fbt_method: quoteData.fbtMethod || null,
      business_use_percent: quoteData.businessUsePercent ? parseInt(quoteData.businessUsePercent) : null,
      
      // Finance calculations
      naf: quoteData.naf ? parseFloat(quoteData.naf) : null,
      establishment_fee: quoteData.establishmentFee ? parseFloat(quoteData.establishmentFee) : null,
      base_rate: quoteData.comparisonRate ? parseFloat(quoteData.comparisonRate) : (quoteData.baseRate ? parseFloat(quoteData.baseRate) : null),
      balloon_payment: quoteData.balloonPayment ? parseFloat(quoteData.balloonPayment) : null,
      
      // On-road costs
      stamp_duty: quoteData.stampDuty ? parseFloat(quoteData.stampDuty) : null,
      registration: quoteData.registration ? parseFloat(quoteData.registration) : null,
      
      // Running costs
      insurance: quoteData.runningCosts?.insurance ? parseFloat(quoteData.runningCosts.insurance) : (quoteData.insurance ? parseFloat(quoteData.insurance) : null),
      fuel_cost: quoteData.runningCosts?.fuel ? parseFloat(quoteData.runningCosts.fuel) : (quoteData.fuelCost ? parseFloat(quoteData.fuelCost) : null),
      maintenance_cost: quoteData.runningCosts?.service ? parseFloat(quoteData.runningCosts.service) : (quoteData.maintenanceCost ? parseFloat(quoteData.maintenanceCost) : null),
      tyre_cost: quoteData.runningCosts?.tyres ? parseFloat(quoteData.runningCosts.tyres) : (quoteData.tyreCost ? parseFloat(quoteData.tyreCost) : null),
      total_annual_cost: quoteData.runningCosts?.total ? parseFloat(quoteData.runningCosts.total) : (quoteData.totalAnnualCost ? parseFloat(quoteData.totalAnnualCost) : null),
      
      // Tax calculations
      income: quoteData.income ? parseFloat(quoteData.income) : null,
      annual_salary: quoteData.annualSalary ? parseFloat(quoteData.annualSalary) : (quoteData.income ? parseFloat(quoteData.income) : null),
      tax_savings: quoteData.taxSavings ? parseFloat(quoteData.taxSavings) : null,
      net_annual_cost: quoteData.netAnnualCost ? parseFloat(quoteData.netAnnualCost) : null,
      pay_amount: quoteData.payAmount ? parseFloat(quoteData.payAmount) : null
    };

    // Remove null/undefined values to avoid unnecessary database writes
    Object.keys(quoteRecord).forEach(key => {
      if (quoteRecord[key] === null || quoteRecord[key] === undefined || quoteRecord[key] === '') {
        delete quoteRecord[key];
      }
    });

    console.log('Saving quote to database:', quoteRecord);

    const { data, error } = await supabase
      .from('quotes')
      .insert([quoteRecord])
      .select()
      .single();

    if (error) {
      console.error('Database save error:', error);
      return { 
        success: false, 
        error: `Failed to save quote: ${error.message}`,
        details: error
      };
    }

    console.log('Quote saved successfully:', data);
    return { 
      success: true, 
      data: data,
      quoteId: quoteId
    };

  } catch (err) {
    console.error('Unexpected error saving quote:', err);
    return { 
      success: false, 
      error: `Unexpected error: ${err.message}`
    };
  }
}

// Get quotes for dealer dashboard
export async function getQuotes() {
  if (!supabase) {
    console.warn('Supabase not configured');
    return { success: false, error: 'Database not configured' };
  }

  try {
    const { data, error } = await supabase
      .from('quotes')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching quotes:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (err) {
    console.error('Error fetching quotes:', err);
    return { success: false, error: err.message };
  }
}

// Save to applications table (applications go to you, not the dealer)
export async function saveToApplications(applicationData) {
  if (!supabase) {
    console.warn('Supabase not configured');
    return { success: false, error: 'Database not configured' };
  }

  try {
    // Generate application reference - this is required by the schema
    const applicationRef = `APP${Date.now()}${Math.random().toString(36).substr(2, 5)}`;
    
    // Map the data to correct column names for the new schema
    const mappedData = {
      application_ref: applicationRef, // Required field
      quote_ref: applicationData.quote_ref,
      
      // Required fields with defaults
      first_name: applicationData.first_name || 'Not Provided',
      last_name: applicationData.last_name || 'Not Provided', 
      email: applicationData.email || 'not-provided@example.com',
      phone: applicationData.phone || 'Not Provided',
      address: applicationData.address || 'Not Provided',
      city: applicationData.city || 'Melbourne',
      state: applicationData.state || 'VIC',
      postcode: applicationData.postcode || '3000',
      current_employer: applicationData.current_employer || 'Not Provided',
      annual_salary: applicationData.annual_salary ? parseFloat(applicationData.annual_salary) : 50000,
      
      // Vehicle information
      vehicle_make: applicationData.vehicle_make,
      vehicle_model: applicationData.vehicle_model,
      vehicle_year: applicationData.vehicle_year ? parseInt(applicationData.vehicle_year) : null,
      vehicle_price: applicationData.vehicle_price ? parseFloat(applicationData.vehicle_price) : null,
      monthly_payment: applicationData.monthly_payment ? parseFloat(applicationData.monthly_payment) : null,
      term_years: applicationData.term_years ? parseInt(applicationData.term_years) : null,
      
      status: applicationData.status || 'submitted'
    };

    // Remove null/undefined values (but keep required fields)
    Object.keys(mappedData).forEach(key => {
      if (mappedData[key] === null || mappedData[key] === undefined || mappedData[key] === '') {
        // Don't delete required fields
        if (!['application_ref', 'first_name', 'last_name', 'email', 'phone', 'address', 'city', 'state', 'postcode', 'current_employer', 'annual_salary'].includes(key)) {
          delete mappedData[key];
        }
      }
    });

    const { data, error } = await supabase
      .from('applications')
      .insert([mappedData])
      .select()
      .single();

    if (error) {
      console.error('Applications save error:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data: { ...data, application_ref: applicationRef } };
  } catch (err) {
    console.error('Applications save error:', err);
    return { success: false, error: err.message };
  }
}

// Save full application form data
export async function saveApplication(applicationData) {
  if (!supabase) {
    console.warn('Supabase not configured');
    return { success: false, error: 'Database not configured' };
  }

  try {
    // Generate application reference
    const applicationRef = `APP${Date.now()}${Math.random().toString(36).substr(2, 5)}`;
    
    const fullApplicationData = {
      ...applicationData,
      application_ref: applicationRef
    };

    const { data, error } = await supabase
      .from('applications')
      .insert([fullApplicationData])
      .select()
      .single();

    if (error) {
      console.error('Application save error:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data: { ...data, application_ref: applicationRef } };
  } catch (err) {
    console.error('Application save error:', err);
    return { success: false, error: err.message };
  }
}

// Save to email logs table
export async function saveToEmailLogs(emailData) {
  if (!supabase) {
    console.warn('Supabase not configured');
    return { success: false, error: 'Database not configured' };
  }

  try {
    const { data, error } = await supabase
      .from('email_logs')
      .insert([emailData])
      .select()
      .single();

    if (error) {
      console.error('Email logs save error:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (err) {
    console.error('Email logs save error:', err);
    return { success: false, error: err.message };
  }
}
