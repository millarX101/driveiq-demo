import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { 
  Users, 
  Plus, 
  Mail, 
  Phone, 
  Building, 
  MapPin, 
  CheckCircle, 
  XCircle, 
  Edit, 
  Trash2,
  Copy,
  ExternalLink,
  AlertCircle
} from 'lucide-react';

const DealerUserManagement = () => {
  const [dealers, setDealers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newDealer, setNewDealer] = useState({
    email: '',
    full_name: '',
    dealership_name: '',
    phone: '',
    territory: '',
    tier: 'Bronze'
  });
  const [inviteLinks, setInviteLinks] = useState({});

  useEffect(() => {
    loadDealers();
  }, []);

  const loadDealers = async () => {
    try {
      // Get all users with mxdealer portal access
      const { data: portalAccess, error: portalError } = await supabase
        .from('portal_access')
        .select(`
          *,
          user:auth.users(*)
        `)
        .eq('portal_type', 'mxdealer')
        .eq('is_active', true);

      if (portalError) {
        console.error('Error loading dealers:', portalError);
        return;
      }

      setDealers(portalAccess || []);
    } catch (error) {
      console.error('Error loading dealers:', error);
    } finally {
      setLoading(false);
    }
  };

  const createDealerAccount = async () => {
    try {
      setLoading(true);

      // Create the invite link
      const inviteLink = `${window.location.origin}/mxdealer/login?invite=${encodeURIComponent(newDealer.email)}`;
      
      // Store dealer info in a temporary table or use metadata
      const dealerData = {
        email: newDealer.email,
        full_name: newDealer.full_name,
        dealership_name: newDealer.dealership_name,
        phone: newDealer.phone,
        territory: newDealer.territory,
        tier: newDealer.tier,
        invite_link: inviteLink,
        created_at: new Date().toISOString()
      };

      // Store in local storage for demo purposes (in production, you'd store this in a database)
      const existingInvites = JSON.parse(localStorage.getItem('dealer_invites') || '[]');
      existingInvites.push(dealerData);
      localStorage.setItem('dealer_invites', JSON.stringify(existingInvites));

      // Update invite links state
      setInviteLinks(prev => ({
        ...prev,
        [newDealer.email]: inviteLink
      }));

      // Reset form
      setNewDealer({
        email: '',
        full_name: '',
        dealership_name: '',
        phone: '',
        territory: '',
        tier: 'Bronze'
      });
      setShowAddForm(false);

      alert(`Dealer invite created! Share this link with ${newDealer.full_name}: ${inviteLink}`);
      
    } catch (error) {
      console.error('Error creating dealer account:', error);
      alert('Error creating dealer account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyInviteLink = (email, link) => {
    navigator.clipboard.writeText(link);
    alert('Invite link copied to clipboard!');
  };

  const DealerCard = ({ dealer }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <Users className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {dealer.user?.user_metadata?.full_name || 'Unknown User'}
            </h3>
            <p className="text-sm text-gray-600">{dealer.user?.email}</p>
          </div>
        </div>
        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
          dealer.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {dealer.is_active ? 'Active' : 'Inactive'}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-gray-500 mb-1">Dealership</p>
          <p className="font-medium">
            {dealer.permissions?.dealership_name || 'Not specified'}
          </p>
        </div>
        <div>
          <p className="text-gray-500 mb-1">Territory</p>
          <p className="font-medium">
            {dealer.permissions?.territory || 'Not specified'}
          </p>
        </div>
        <div>
          <p className="text-gray-500 mb-1">Tier</p>
          <p className="font-medium">
            {dealer.permissions?.tier || 'Bronze'}
          </p>
        </div>
        <div>
          <p className="text-gray-500 mb-1">Joined</p>
          <p className="font-medium">
            {new Date(dealer.created_at).toLocaleDateString('en-AU')}
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-3 mt-4 pt-4 border-t border-gray-100">
        <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 text-sm">
          <Edit size={16} />
          <span>Edit</span>
        </button>
        <button className="flex items-center space-x-2 text-red-600 hover:text-red-700 text-sm">
          <Trash2 size={16} />
          <span>Remove</span>
        </button>
      </div>
    </div>
  );

  const AddDealerForm = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Dealer</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Name *
          </label>
          <input
            type="text"
            value={newDealer.full_name}
            onChange={(e) => setNewDealer({...newDealer, full_name: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="John Smith"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address *
          </label>
          <input
            type="email"
            value={newDealer.email}
            onChange={(e) => setNewDealer({...newDealer, email: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="john@dealership.com"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Dealership Name *
          </label>
          <input
            type="text"
            value={newDealer.dealership_name}
            onChange={(e) => setNewDealer({...newDealer, dealership_name: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="Premium Motors Melbourne"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            value={newDealer.phone}
            onChange={(e) => setNewDealer({...newDealer, phone: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="+61 3 9123 4567"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Territory
          </label>
          <input
            type="text"
            value={newDealer.territory}
            onChange={(e) => setNewDealer({...newDealer, territory: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="Melbourne Metro"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tier Level
          </label>
          <select
            value={newDealer.tier}
            onChange={(e) => setNewDealer({...newDealer, tier: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
          >
            <option value="Bronze">Bronze Partner</option>
            <option value="Silver">Silver Partner</option>
            <option value="Gold">Gold Partner</option>
            <option value="Platinum">Platinum Partner</option>
          </select>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <button
          onClick={createDealerAccount}
          disabled={!newDealer.email || !newDealer.full_name || !newDealer.dealership_name}
          className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          Create Dealer Account
        </button>
        <button
          onClick={() => setShowAddForm(false)}
          className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Dealer Management</h2>
          <p className="text-gray-600 mt-1">Manage dealer accounts and access</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Add Dealer</span>
        </button>
      </div>

      {showAddForm && <AddDealerForm />}

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-start space-x-3">
          <AlertCircle className="w-6 h-6 text-blue-600 mt-0.5" />
          <div>
            <h3 className="text-lg font-semibold text-blue-900 mb-2">How Dealer Access Works</h3>
            <div className="text-blue-800 space-y-2">
              <p><strong>1. Create Account:</strong> Add dealer details above to generate an invite link</p>
              <p><strong>2. Share Link:</strong> Send the invite link to the dealer via email</p>
              <p><strong>3. Google Sign-in:</strong> Dealer clicks link and signs in with Google</p>
              <p><strong>4. Auto-Setup:</strong> Their account is automatically configured with dealer access</p>
            </div>
          </div>
        </div>
      </div>

      {/* Existing Dealers */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Active Dealers ({dealers.length})
        </h3>
        
        {dealers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dealers.map((dealer) => (
              <DealerCard key={dealer.id} dealer={dealer} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No dealers yet</h3>
            <p className="text-gray-500 mb-6">Create your first dealer account to get started</p>
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
            >
              Add First Dealer
            </button>
          </div>
        )}
      </div>

      {/* Pending Invites */}
      {Object.keys(inviteLinks).length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Pending Invites</h3>
          <div className="space-y-3">
            {Object.entries(inviteLinks).map(([email, link]) => (
              <div key={email} className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-yellow-900">{email}</p>
                    <p className="text-sm text-yellow-700">Invite sent - waiting for sign-up</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => copyInviteLink(email, link)}
                      className="text-yellow-700 hover:text-yellow-800 p-2"
                      title="Copy invite link"
                    >
                      <Copy size={16} />
                    </button>
                    <a
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-yellow-700 hover:text-yellow-800 p-2"
                      title="Open invite link"
                    >
                      <ExternalLink size={16} />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DealerUserManagement;
