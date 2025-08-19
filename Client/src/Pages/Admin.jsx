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
import { destinationService } from '../services/destinationService';
import { toast } from 'react-hot-toast';

const Admin = () => {
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const [stats, setStats] = useState(null);
  const [destinations, setDestinations] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddDestination, setShowAddDestination] = useState(false);
  const [newDestination, setNewDestination] = useState({
    name: '',
    description: '',
    country: '',
    location: '',
    images: '',
    activities: '',
    bestSeason: '',
    popularAttractions: ''
  });

  useEffect(() => {
    if (!isAdmin()) {
      toast.error('Access denied. Admin privileges required.');
      navigate('/dashboard');
      return;
    }

    const fetchAdminData = async () => {
      try {
        // Fetch admin stats
        const mockStats = {
          totalUsers: 1250,
          totalDestinations: 45,
          totalTrips: 320,
          totalJournals: 180,
          newUsersThisMonth: 85,
          pendingDestinations: 3
        };
        setStats(mockStats);

        // Fetch destinations
        const destinationsData = await destinationService.getDestinations();
        setDestinations(destinationsData);

        // Mock users data
        const mockUsers = [
          { id: '1', username: 'john_doe', email: 'john@example.com', role: 'user', isActive: true, createdAt: '2024-01-15' },
          { id: '2', username: 'jane_smith', email: 'jane@example.com', role: 'user', isActive: true, createdAt: '2024-01-20' },
          { id: '3', username: 'admin_user', email: 'admin@wanderwise.com', role: 'admin', isActive: true, createdAt: '2024-01-01' }
        ];
        setUsers(mockUsers);

      } catch (error) {
        toast.error('Failed to load admin data');
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, [isAdmin, navigate]);

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
        popularAttractions: newDestination.popularAttractions.split(',').map(attr => attr.trim()).filter(attr => attr)
      };

      await destinationService.createDestination(destinationData);
      
      // Refresh destinations list
      const updatedDestinations = await destinationService.getDestinations();
      setDestinations(updatedDestinations);
      
      setNewDestination({
        name: '',
        description: '',
        country: '',
        location: '',
        images: '',
        activities: '',
        bestSeason: '',
        popularAttractions: ''
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/dashboard')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600">
            Manage users, destinations, and platform content
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Users className="h-8 w-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Users</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <MapPin className="h-8 w-8 text-emerald-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Destinations</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalDestinations}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <BarChart3 className="h-8 w-8 text-purple-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Trips</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalTrips}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <FileText className="h-8 w-8 text-orange-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Journals</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalJournals}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Tabs */}
        <Tabs defaultValue="destinations" className="space-y-6">
          <TabsList>
            <TabsTrigger value="destinations">Destinations</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Destinations Tab */}
          <TabsContent value="destinations" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Manage Destinations</h2>
              <Button onClick={() => setShowAddDestination(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Destination
              </Button>
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
                <Card key={destination._id}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="truncate">{destination.name}</span>
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
                        <tr key={user.id}>
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
                      <span className="font-medium">{stats?.newUsersThisMonth}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Pending destinations</span>
                      <span className="font-medium">{stats?.pendingDestinations}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Active trips</span>
                      <span className="font-medium">45</span>
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
    </div>
  );
};

export default Admin;
