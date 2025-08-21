import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { Textarea } from "@/Components/ui/textarea";
import { Badge } from "@/Components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import { Plus, Edit, Trash2, Users, MapPin, FileText, BarChart3, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { adminService } from '../services/adminService';
import { destinationService } from '../services/destinationService';
import { toast } from 'react-hot-toast';
import AddDestinationForm from '../Components/AddDestinationForm';

const Admin = () => {
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const [stats, setStats] = useState(null);
  const [destinations, setDestinations] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddDestination, setShowAddDestination] = useState(false);
  const [showAddDestinationForm, setShowAddDestinationForm] = useState(false);
  const [newDestination, setNewDestination] = useState({
    name: '',
    description: '',
    country: '',
    location: '',
    images: '',
    activities: '',
    bestSeason: '',
    popularAttractions: '',
    price: 0
  });

  useEffect(() => {
    if (!isAdmin()) {
      toast.error('Access denied. Admin privileges required.');
      navigate('/dashboard');
      return;
    }

    const fetchAdminData = async () => {
      try {
        // Fetch admin dashboard stats
        const dashboardData = await adminService.getDashboard();
        setStats(dashboardData.stats);

        // Fetch destinations
        const destinationsData = await adminService.getDestinations();
        setDestinations(destinationsData.destinations || []);

        // Fetch users
        const usersData = await adminService.getUsers();
        setUsers(usersData.users || []);

      } catch (error) {
        console.error('Failed to load admin data:', error);
        toast.error('Failed to load admin data');
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, [isAdmin, navigate]);

  const refreshDestinations = async () => {
    try {
      const destinationsData = await adminService.getDestinations();
      setDestinations(destinationsData.destinations || []);
    } catch (error) {
      console.error('Failed to refresh destinations:', error);
    }
  };

  const handleAddDestination = async () => {
    try {
      if (!newDestination.name || !newDestination.description || !newDestination.country) {
        toast.error('Please fill in all required fields');
        return;
      }

      const destinationData = {
        ...newDestination,
        images: newDestination.images.split(',').map(img => img.trim()).filter(img => img),
        activities: newDestination.activities.split(',').map(act => act.trim()).filter(act => act),
        popularAttractions: newDestination.popularAttractions.split(',').map(attr => attr.trim()).filter(attr => attr),
        price: parseFloat(newDestination.price) || 0
      };

      await adminService.createDestination(destinationData);
      
      // Refresh destinations list
      const updatedDestinations = await adminService.getDestinations();
      setDestinations(updatedDestinations.destinations || []);
      
      setNewDestination({
        name: '',
        description: '',
        country: '',
        location: '',
        images: '',
        activities: '',
        bestSeason: '',
        popularAttractions: '',
        price: 0
      });
      setShowAddDestination(false);
      
      toast.success('Destination added successfully!');
    } catch (error) {
      toast.error('Failed to add destination');
    }
  };

  const handleDeleteDestination = async (id) => {
    try {
      await destinationService.deleteDestination(id);
      setDestinations(destinations.filter(dest => dest._id !== id));
      toast.success('Destination deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete destination');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-200/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/4 right-0 w-80 h-80 bg-teal-200/25 rounded-full blur-2xl"></div>
        <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-cyan-200/20 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <div className="bg-white/80 backdrop-blur-lg shadow-lg border-b border-emerald-100/50 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 backdrop-blur-sm rounded-xl p-4 border border-emerald-200/30 mb-6">
            <Button
              variant="ghost"
              onClick={() => navigate('/dashboard')}
              className="mb-4 bg-white/50 hover:bg-white/70 transition-all duration-200"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-700 to-teal-700 bg-clip-text text-transparent mb-2">
              Admin Dashboard
            </h1>
            <p className="text-gray-700/80">
              Manage users, destinations, and platform content
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Stats Overview */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gradient-to-br from-blue-50/80 to-indigo-50/80 backdrop-blur-sm border border-blue-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-blue-400/10 rounded-full blur-xl"></div>
                <div className="flex items-center relative z-10">
                  <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-blue-700/80">Total Users</p>
                    <p className="text-2xl font-bold text-blue-900">{stats.users?.total || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-emerald-50/80 to-teal-50/80 backdrop-blur-sm border border-emerald-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-400/10 rounded-full blur-xl"></div>
                <div className="flex items-center relative z-10">
                  <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl shadow-lg">
                    <MapPin className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-emerald-700/80">Destinations</p>
                    <p className="text-2xl font-bold text-emerald-900">{stats.destinations?.total || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50/80 to-violet-50/80 backdrop-blur-sm border border-purple-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-purple-400/10 rounded-full blur-xl"></div>
                <div className="flex items-center relative z-10">
                  <div className="p-3 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl shadow-lg">
                    <BarChart3 className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-purple-700/80">Total Trips</p>
                    <p className="text-2xl font-bold text-purple-900">{stats.trips?.total || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-50/80 to-amber-50/80 backdrop-blur-sm border border-orange-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-orange-400/10 rounded-full blur-xl"></div>
                <div className="flex items-center relative z-10">
                  <div className="p-3 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl shadow-lg">
                    <FileText className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-orange-700/80">Active Trips</p>
                    <p className="text-2xl font-bold text-orange-900">{stats.trips?.active || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Tabs */}
        <Tabs defaultValue="destinations" className="space-y-6">
          <div className="bg-white/60 backdrop-blur-lg rounded-2xl p-2 border border-gray-200/50 shadow-lg">
            <TabsList className="bg-transparent border-0 space-x-2">
              <TabsTrigger
                value="destinations"
                className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-600 data-[state=active]:text-white border border-emerald-200/50 data-[state=active]:border-emerald-400 rounded-xl transition-all duration-300"
              >
                Destinations
              </TabsTrigger>
              <TabsTrigger
                value="users"
                className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white border border-blue-200/50 data-[state=active]:border-blue-400 rounded-xl transition-all duration-300"
              >
                Users
              </TabsTrigger>
              <TabsTrigger
                value="analytics"
                className="bg-gradient-to-r from-purple-500/10 to-violet-500/10 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-violet-600 data-[state=active]:text-white border border-purple-200/50 data-[state=active]:border-purple-400 rounded-xl transition-all duration-300"
              >
                Analytics
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Destinations Tab */}
          <TabsContent value="destinations" className="space-y-6">
            <div className="bg-gradient-to-r from-emerald-50/80 to-teal-50/80 backdrop-blur-sm rounded-2xl p-6 border border-emerald-200/50 shadow-lg">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-700 to-teal-700 bg-clip-text text-transparent">Manage Destinations</h2>
                <Button
                  onClick={() => setShowAddDestinationForm(true)}
                  className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Destination
                </Button>
              </div>
            </div>

            {/* Add Destination Form */}
            {showAddDestination && (
              <Card>
                <CardHeader>
                  <CardTitle>Add New Destination</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Name *</label>
                      <Input
                        placeholder="Destination name"
                        value={newDestination.name}
                        onChange={(e) => setNewDestination({...newDestination, name: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Country *</label>
                      <Input
                        placeholder="Country"
                        value={newDestination.country}
                        onChange={(e) => setNewDestination({...newDestination, country: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Description *</label>
                    <Textarea
                      placeholder="Destination description"
                      value={newDestination.description}
                      onChange={(e) => setNewDestination({...newDestination, description: e.target.value})}
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Location</label>
                      <Input
                        placeholder="City, Region"
                        value={newDestination.location}
                        onChange={(e) => setNewDestination({...newDestination, location: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Best Season</label>
                      <Input
                        placeholder="e.g., Spring, Summer"
                        value={newDestination.bestSeason}
                        onChange={(e) => setNewDestination({...newDestination, bestSeason: e.target.value})}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Images (comma-separated URLs)</label>
                    <Input
                      placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                      value={newDestination.images}
                      onChange={(e) => setNewDestination({...newDestination, images: e.target.value})}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Activities (comma-separated)</label>
                    <Input
                      placeholder="Sightseeing, Museums, Food tours"
                      value={newDestination.activities}
                      onChange={(e) => setNewDestination({...newDestination, activities: e.target.value})}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Popular Attractions (comma-separated)</label>
                    <Input
                      placeholder="Eiffel Tower, Louvre Museum, Notre Dame"
                      value={newDestination.popularAttractions}
                      onChange={(e) => setNewDestination({...newDestination, popularAttractions: e.target.value})}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Price (USD)</label>
                    <Input
                      type="number"
                      placeholder="1500"
                      value={newDestination.price}
                      onChange={(e) => setNewDestination({...newDestination, price: e.target.value})}
                    />
                  </div>

                  <div className="flex space-x-2">
                    <Button onClick={handleAddDestination}>
                      Add Destination
                    </Button>
                    <Button variant="outline" onClick={() => setShowAddDestination(false)}>
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Destinations List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {destinations.map((destination) => (
                <Card key={destination._id} className="bg-white/70 backdrop-blur-sm border border-emerald-200/50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-400/10 to-teal-400/10 rounded-full blur-2xl"></div>
                  <CardHeader className="relative z-10">
                    <CardTitle className="flex items-center justify-between">
                      <span className="truncate text-emerald-800">{destination.name}</span>
                      <div className="flex space-x-1">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDeleteDestination(destination._id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardTitle>
                    <CardDescription>
                      {destination.location}, {destination.country}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 line-clamp-3 mb-3">
                      {destination.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <Badge variant={destination.isPopular ? "default" : "secondary"}>
                        {destination.isPopular ? "Popular" : "Standard"}
                      </Badge>
                      <span className="text-sm text-gray-500">
                        {destination.activities?.length || 0} activities
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Manage Users</h2>
            
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          User
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Role
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Joined
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users.map((user) => (
                        <tr key={user._id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{user.username}</div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                              {user.role}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge variant={user.isActive ? 'default' : 'destructive'}>
                              {user.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Platform Analytics</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">New users this month</span>
                      <span className="font-medium">{stats?.users?.newThisMonth || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Pending destinations</span>
                      <span className="font-medium">{stats?.destinations?.pending || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Active trips</span>
                      <span className="font-medium">{stats?.trips?.active || 0}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Popular Destinations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Paris, France</span>
                      <span className="font-medium">124 trips</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Tokyo, Japan</span>
                      <span className="font-medium">89 trips</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">New York, USA</span>
                      <span className="font-medium">67 trips</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Add Destination Form Modal */}
      {showAddDestinationForm && (
        <AddDestinationForm
          onClose={() => setShowAddDestinationForm(false)}
          onDestinationAdded={refreshDestinations}
        />
      )}
    </div>
  );
};

export default Admin;
