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
import { Label } from "@/Components/ui/label";

const Admin = () => {
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const [stats, setStats] = useState(null);
  const [destinations, setDestinations] = useState([]);
  const [users, setUsers] = useState([]);
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddDestinationForm, setShowAddDestinationForm] = useState(false);
  const [editingDestination, setEditingDestination] = useState(null);
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    if (!isAdmin()) {
      toast.error('Access denied. Admin privileges required.');
      navigate('/dashboard');
      return;
    }

    fetchAdminData();
  }, [isAdmin, navigate]);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const dashboardData = await adminService.getDashboard();
      setStats(dashboardData.stats);

      const destinationsData = await adminService.getDestinations();
      setDestinations(destinationsData.destinations || []);

      const usersData = await adminService.getUsers();
      setUsers(usersData.users || []);

      const tripsData = await adminService.getTrips();
      setTrips(tripsData.trips || []);
    } catch (error) {
      console.error('Failed to load admin data:', error);
      toast.error('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  const refreshDestinations = async () => {
    try {
      const destinationsData = await adminService.getDestinations();
      setDestinations(destinationsData.destinations || []);
    } catch (error) {
      console.error('Failed to refresh destinations:', error);
    }
  };

  const refreshUsers = async () => {
    try {
      const usersData = await adminService.getUsers();
      setUsers(usersData.users || []);
    } catch (error) {
      console.error('Failed to refresh users:', error);
    }
  };

  const handleDeleteDestination = async (id) => {
    if (!window.confirm('Are you sure you want to delete this destination?')) return;
    try {
      await destinationService.deleteDestination(id);
      setDestinations(destinations.filter(dest => dest._id !== id));
      toast.success('Destination deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete destination');
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user? This action is irreversible.')) return;
    try {
      await adminService.deleteUser(id);
      setUsers(users.filter(u => u._id !== id));
      toast.success('User deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete user');
    }
  };

  const handleDeleteTrip = async (id) => {
    if (!window.confirm('Are you sure you want to delete this trip record?')) return;
    try {
      await adminService.deleteTrip(id);
      setTrips(trips.filter(t => t._id !== id));
      toast.success('Trip deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete trip');
    }
  };

  const handleUpdateUser = async (id, data) => {
    try {
      await adminService.updateUser(id, data);
      toast.success('User updated successfully!');
      refreshUsers();
      setEditingUser(null);
    } catch (error) {
      toast.error('Failed to update user');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-emerald-50/30">
        <div className="relative">
          <div className="animate-spin rounded-full h-24 w-24 border-b-4 border-emerald-500"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-16 w-16 animate-pulse bg-emerald-100 rounded-full"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 relative overflow-hidden font-sans">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-emerald-200/10 rounded-full blur-[120px]"></div>
        <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-teal-200/15 rounded-full blur-[100px]"></div>
        <div className="absolute -bottom-20 left-1/4 w-[600px] h-[600px] bg-cyan-200/10 rounded-full blur-[140px]"></div>
      </div>

      <div className="bg-white/70 backdrop-blur-xl sticky top-0 z-40 border-b border-emerald-100/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => navigate('/dashboard')}
                className="bg-emerald-50/50 hover:bg-emerald-100/80 text-emerald-700 transition-all rounded-full h-10 w-10 p-0"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-black bg-gradient-to-r from-emerald-700 to-teal-700 bg-clip-text text-transparent">
                  WanderWise Admin
                </h1>
                <p className="text-xs font-semibold text-emerald-600/60 uppercase tracking-widest">
                  Control Center
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-sm font-bold text-gray-800">{user?.username}</span>
                <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full uppercase">Administrator</span>
              </div>
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 border-2 border-white shadow-md flex items-center justify-center text-white font-bold">
                {user?.username?.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
              { label: 'Total Users', value: stats.users?.total, icon: Users, color: 'blue', gradient: 'from-blue-500 to-indigo-600' },
              { label: 'Destinations', value: stats.destinations?.total, icon: MapPin, color: 'emerald', gradient: 'from-emerald-500 to-teal-600' },
              { label: 'Total Trips', value: stats.trips?.total, icon: BarChart3, color: 'purple', gradient: 'from-purple-500 to-violet-600' },
              { label: 'Active Trips', value: stats.trips?.active, icon: FileText, color: 'orange', gradient: 'from-orange-500 to-amber-600' }
            ].map((stat, idx) => (
              <Card key={idx} className="group overflow-hidden border-none shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
                <CardContent className="p-0">
                  <div className={`bg-gradient-to-br ${stat.gradient} p-6 text-white relative`}>
                    <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12 blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                    <div className="flex items-center justify-between relative z-10">
                      <div>
                        <p className="text-white/80 text-sm font-medium mb-1">{stat.label}</p>
                        <p className="text-4xl font-black">{stat.value || 0}</p>
                      </div>
                      <div className="p-3 bg-black/10 backdrop-blur-md rounded-2xl">
                        <stat.icon className="h-8 w-8 text-white" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <Tabs defaultValue="destinations" className="space-y-8">
          <div className="bg-white/40 backdrop-blur-lg rounded-3xl p-1.5 border border-white/50 shadow-2xl inline-flex w-full md:w-auto">
            <TabsList className="bg-transparent border-0 flex w-full">
              <TabsTrigger
                value="destinations"
                className="flex-1 md:flex-none px-8 py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-2xl transition-all duration-300 font-bold"
              >
                <MapPin className="h-4 w-4 mr-2" />
                Destinations
              </TabsTrigger>
              <TabsTrigger
                value="users"
                className="flex-1 md:flex-none px-8 py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-2xl transition-all duration-300 font-bold"
              >
                <Users className="h-4 w-4 mr-2" />
                Users
              </TabsTrigger>
              <TabsTrigger
                value="trips"
                className="flex-1 md:flex-none px-8 py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-2xl transition-all duration-300 font-bold"
              >
                <FileText className="h-4 w-4 mr-2" />
                Trips
              </TabsTrigger>
              <TabsTrigger
                value="analytics"
                className="flex-1 md:flex-none px-8 py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-violet-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-2xl transition-all duration-300 font-bold"
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                Analytics
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="destinations" className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/60 p-6 rounded-3xl border border-white/50 shadow-xl">
              <div>
                <h2 className="text-2xl font-black text-gray-800 flex items-center gap-2">
                  Destination Repository
                  <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 rounded-lg">
                    {destinations.length} Active
                  </Badge>
                </h2>
                <p className="text-gray-500 text-sm font-medium">Add, update or remove travel destinations</p>
              </div>
              <Button
                onClick={() => setShowAddDestinationForm(true)}
                className="w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 h-12 px-6 rounded-2xl font-bold flex items-center gap-2 transform hover:scale-105 active:scale-95"
              >
                <Plus className="h-5 w-5" />
                New Destination
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {destinations.map((destination) => (
                <Card key={destination._id} className="group bg-white/80 backdrop-blur-sm border-none shadow-xl hover:shadow-2xl transition-all duration-500 rounded-[2.5rem] overflow-hidden flex flex-col">
                  <div className="relative h-56 overflow-hidden">
                    <img 
                      src={destination.images?.[0] || 'https://images.unsplash.com/photo-1469474968028-56623f02e42e'} 
                      alt={destination.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                    <div className="absolute top-4 right-4 flex gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => setEditingDestination(destination)}
                        className="bg-white/20 backdrop-blur-md hover:bg-white/40 text-white rounded-2xl h-10 w-10 border border-white/20 shadow-lg"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleDeleteDestination(destination._id)}
                        className="bg-red-500/20 backdrop-blur-md hover:bg-red-500/40 text-red-100 rounded-2xl h-10 w-10 border border-white/20 shadow-lg"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="absolute bottom-4 left-6">
                      <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white border-none px-3 py-1 rounded-xl mb-2">
                        {destination.country}
                      </Badge>
                      <h3 className="text-xl font-bold text-white drop-shadow-md">{destination.name}</h3>
                    </div>
                  </div>
                  
                  <CardContent className="p-6 flex-1 flex flex-col">
                    <p className="text-gray-600 text-sm line-clamp-3 mb-6 bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100/50">
                      {destination.description}
                    </p>
                    
                    <div className="mt-auto flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Starting Price</span>
                        <span className="text-lg font-black text-emerald-700">${destination.price}<span className="text-xs font-normal text-gray-500">/person</span></span>
                      </div>
                      <div className="flex items-center gap-1 bg-yellow-50 px-3 py-1.5 rounded-xl border border-yellow-100">
                        <BarChart3 className="h-4 w-4 text-yellow-600" />
                        <span className="text-sm font-bold text-yellow-700">{destination.rating || 'N/A'}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="users" className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white/60 backdrop-blur-sm p-8 rounded-3xl border border-white/50 shadow-2xl">
              <div className="mb-8">
                <h2 className="text-3xl font-black text-gray-800">User Management</h2>
                <p className="text-gray-500 font-medium">Control user access, roles, and platform status</p>
              </div>

              <div className="overflow-hidden rounded-2xl border border-gray-100 shadow-sm">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50/50 border-b border-gray-100">
                      <th className="px-8 py-5 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Identity</th>
                      <th className="px-8 py-5 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Privileges</th>
                      <th className="px-8 py-5 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Status</th>
                      <th className="px-8 py-5 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Engagement</th>
                      <th className="px-8 py-5 text-right text-xs font-black text-gray-400 uppercase tracking-widest">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-50">
                    {users.map((u) => (
                      <tr key={u._id} className="hover:bg-blue-50/30 transition-colors group">
                        <td className="px-8 py-6 whitespace-nowrap">
                          <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-black shadow-lg shadow-blue-100 group-hover:scale-110 transition-transform">
                              {u.username?.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="text-base font-bold text-gray-900">{u.username}</div>
                              <div className="text-sm font-medium text-gray-400">{u.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6 whitespace-nowrap">
                          <Badge 
                            variant="secondary" 
                            className={`rounded-xl px-3 py-1 font-bold ${
                              u.role === 'admin' 
                                ? 'bg-indigo-100 text-indigo-700 border border-indigo-200' 
                                : 'bg-gray-100 text-gray-700 border border-gray-200'
                            }`}
                          >
                            {u.role?.toUpperCase()}
                          </Badge>
                        </td>
                        <td className="px-8 py-6 whitespace-nowrap">
                          <div className={`flex items-center gap-2 font-bold ${u.isActive ? 'text-emerald-600' : 'text-red-500'}`}>
                            <div className={`h-2.5 w-2.5 rounded-full ${u.isActive ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}></div>
                            {u.isActive ? 'Verified' : 'Suspended'}
                          </div>
                        </td>
                        <td className="px-8 py-6 whitespace-nowrap text-sm font-medium text-gray-500">
                          Joined {new Date(u.createdAt).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                        </td>
                        <td className="px-8 py-6 whitespace-nowrap text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => setEditingUser(u)}
                              className="bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-xl h-10 w-10 p-0 transition-all border border-blue-100"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              disabled={u._id === user._id}
                              onClick={() => handleDeleteUser(u._id)}
                              className="bg-red-50 text-red-500 hover:bg-red-100 rounded-xl h-10 w-10 p-0 transition-all border border-red-100 disabled:opacity-30"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="trips" className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white/60 backdrop-blur-sm p-8 rounded-3xl border border-white/50 shadow-2xl">
              <div className="mb-8">
                <h2 className="text-3xl font-black text-gray-800">Trip Repository</h2>
                <p className="text-gray-500 font-medium">Monitor and manage all generated itineraries</p>
              </div>

              <div className="overflow-hidden rounded-2xl border border-gray-100 shadow-sm">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50/50 border-b border-gray-100">
                      <th className="px-8 py-5 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Traveler</th>
                      <th className="px-8 py-5 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Destination</th>
                      <th className="px-8 py-5 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Budget</th>
                      <th className="px-8 py-5 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Status</th>
                      <th className="px-8 py-5 text-right text-xs font-black text-gray-400 uppercase tracking-widest">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-50">
                    {trips.length > 0 ? trips.map((t) => (
                      <tr key={t._id} className="hover:bg-orange-50/30 transition-colors group">
                        <td className="px-8 py-6 whitespace-nowrap">
                          <div>
                            <div className="text-base font-bold text-gray-900">{t.userId?.username || 'Guest'}</div>
                            <div className="text-sm font-medium text-gray-400">{t.userId?.email || 'N/A'}</div>
                          </div>
                        </td>
                        <td className="px-8 py-6 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl overflow-hidden shadow-md">
                              <img src={t.destinationImage} className="w-full h-full object-cover" alt="" />
                            </div>
                            <span className="font-bold text-gray-700">{t.destinationName}</span>
                          </div>
                        </td>
                        <td className="px-8 py-6 whitespace-nowrap">
                          <span className="font-black text-emerald-600">{t.budget} {t.currency}</span>
                        </td>
                        <td className="px-8 py-6 whitespace-nowrap">
                          <Badge className="bg-orange-100 text-orange-600 border border-orange-200 uppercase text-[10px] font-black tracking-tighter rounded-lg">
                            {t.status}
                          </Badge>
                        </td>
                        <td className="px-8 py-6 whitespace-nowrap text-right">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleDeleteTrip(t._id)}
                            className="bg-red-50 text-red-500 hover:bg-red-100 rounded-xl h-10 w-10 p-0 transition-all border border-red-100"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan="5" className="px-8 py-20 text-center text-gray-400 font-bold italic">
                          No trip records found in the database.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="rounded-[2.5rem] border-none shadow-2xl bg-white/80 backdrop-blur-sm overflow-hidden p-8">
                <h3 className="text-xl font-black text-gray-800 mb-6">Engagement Highlights</h3>
                <div className="space-y-6">
                  {[
                    { label: 'New users this month', value: stats?.users?.newThisMonth || 0, percent: 75, color: 'blue' },
                    { label: 'Pending destinations', value: stats?.destinations?.pending || 0, percent: 30, color: 'emerald' },
                    { label: 'Active trips', value: stats?.trips?.active || 0, percent: 90, color: 'purple' }
                  ].map((item, idx) => (
                    <div key={idx} className="space-y-2">
                      <div className="flex justify-between items-center px-1">
                        <span className="text-sm font-bold text-gray-600">{item.label}</span>
                        <span className="text-lg font-black text-gray-900">{item.value}</span>
                      </div>
                      <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full bg-${item.color}-500 rounded-full transition-all duration-1000`} 
                          style={{ width: `${item.percent}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="rounded-[2.5rem] border-none shadow-2xl bg-white/80 backdrop-blur-sm overflow-hidden p-8">
                <h3 className="text-xl font-black text-gray-800 mb-6">Network Insights</h3>
                <div className="flex items-center justify-center p-12">
                  <div className="relative">
                    <div className="h-48 w-48 rounded-full border-[12px] border-emerald-500 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-3xl font-black text-emerald-700">100%</div>
                        <div className="text-[10px] font-bold text-emerald-600 uppercase">Uptime</div>
                      </div>
                    </div>
                    <div className="absolute top-0 left-0 h-48 w-48 rounded-full border-[12px] border-blue-500 border-t-transparent border-l-transparent -rotate-45"></div>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {(showAddDestinationForm || editingDestination) && (
        <AddDestinationForm
          initialData={editingDestination}
          onClose={() => {
            setShowAddDestinationForm(false);
            setEditingDestination(null);
          }}
          onDestinationAdded={() => {
            fetchAdminData();
            setShowAddDestinationForm(false);
            setEditingDestination(null);
          }}
        />
      )}

      {editingUser && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
          <Card className="w-full max-w-md bg-white/95 backdrop-blur-lg border-none shadow-2xl rounded-[2.5rem] overflow-hidden">
            <CardHeader className="p-8 pb-0">
              <CardTitle className="text-2xl font-black text-gray-800">Assign Privileges</CardTitle>
              <CardDescription className="font-medium">Modify settings for {editingUser.username}</CardDescription>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="space-y-4">
                <Label className="text-xs font-black uppercase text-gray-400 tracking-widest">Authority Level</Label>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant={editingUser.role === 'admin' ? 'default' : 'outline'}
                    onClick={() => setEditingUser({ ...editingUser, role: 'admin' })}
                    className={`rounded-2xl h-12 font-bold ${editingUser.role === 'admin' ? 'bg-indigo-600 shadow-lg shadow-indigo-100' : 'bg-transparent text-gray-400'}`}
                  >
                    Administrator
                  </Button>
                  <Button
                    variant={editingUser.role === 'user' ? 'default' : 'outline'}
                    onClick={() => setEditingUser({ ...editingUser, role: 'user' })}
                    className={`rounded-2xl h-12 font-bold ${editingUser.role === 'user' ? 'bg-blue-600 shadow-lg shadow-blue-100' : 'bg-transparent text-gray-400'}`}
                  >
                    Member
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                <Label className="text-xs font-black uppercase text-gray-400 tracking-widest">Status Toggle</Label>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <span className="font-bold text-gray-700">Account Access</span>
                  <Button
                    variant={editingUser.isActive ? 'default' : 'destructive'}
                    onClick={() => setEditingUser({ ...editingUser, isActive: !editingUser.isActive })}
                    className="rounded-xl px-4 py-1.5 h-auto text-xs font-black"
                  >
                    {editingUser.isActive ? 'ACTIVE' : 'SUSPENDED'}
                  </Button>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button 
                  variant="ghost" 
                  onClick={() => setEditingUser(null)}
                  className="flex-1 rounded-2xl h-12 font-bold text-gray-500 hover:bg-gray-100"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={() => handleUpdateUser(editingUser._id, { role: editingUser.role, isActive: editingUser.isActive })}
                  className="flex-1 rounded-2xl h-12 font-bold bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-xl shadow-emerald-100"
                >
                  Apply Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Admin;
