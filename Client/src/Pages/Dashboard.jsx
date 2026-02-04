import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import { 
  Plane, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Users, 
  Star,
  Plus,
  TrendingUp,
  Clock,
  Settings,
  LogOut,
  Globe
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { tripApiService } from '../services/tripApiService';
import { getUserStats } from '../services/userService';


const Dashboard = () => {
  const { user, logout } = useAuth();
  const [recentTrips, setRecentTrips] = useState([]);
  const [stats, setStats] = useState({
    totalTrips: 0,
    totalSpent: 0,
    upcomingTrips: 0,
    favoriteDestinations: 0
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch recent trips using the API service
        const trips = await tripApiService.getTrips();
        setRecentTrips(trips.slice(0, 3)); // Show only recent 3 trips

        // Fetch stats
        const userStats = await getUserStats(user?._id);
        setStats({
          ...userStats,
          totalTrips: trips.length,
          upcomingTrips: trips.filter(trip => new Date(trip.startDate) > new Date()).length
        });
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        // Set default stats if API fails
        setStats({
          totalTrips: 0,
          totalSpent: 0,
          upcomingTrips: 0,
          favoriteDestinations: 0
        });
      }
    };

    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const handleLogout = () => {
    logout();
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'upcoming':
        return <Badge variant="secondary" className="bg-green-100 text-green-700">Upcoming</Badge>;
      case 'completed':
        return <Badge variant="secondary" className="bg-green-100 text-green-700">Completed</Badge>;
      case 'cancelled':
        return <Badge variant="secondary" className="bg-red-100 text-red-700">Cancelled</Badge>;
      default:
        return <Badge variant="secondary" className="bg-gray-100 text-gray-700">Unknown</Badge>;
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Clean white background */}
      <div className="fixed inset-0 z-0 bg-white"></div>

      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 relative shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Globe className="h-8 w-8 text-green-600" />
              <span className="text-xl font-bold text-gray-900">WanderWise</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="text-gray-700 hover:text-green-600">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Button variant="ghost" size="sm" onClick={handleLogout} className="text-gray-700 hover:text-green-600">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
              <Avatar>
                <AvatarImage src={user?.avatar} />
                <AvatarFallback className="bg-green-600 text-white">{user?.name?.charAt(0) || 'U'}</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-20">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name || 'Traveler'}! 👋
          </h1>
          <p className="text-gray-600 text-lg">
            Ready to plan your next adventure? Let's make it unforgettable.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Plane className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Trips</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalTrips}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Spent</p>
                  <p className="text-2xl font-bold text-gray-900">${stats.totalSpent.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Calendar className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Upcoming</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.upcomingTrips}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Star className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Favorites</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.favoriteDestinations}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer">
            <CardContent className="p-6">
              <div className="text-center">
                <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <MapPin className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Explore Destinations</h3>
                <p className="text-gray-600 mb-4">Discover amazing places to visit</p>
                <Link to="/destinations">
                  <Button className="w-full bg-green-600 hover:bg-green-700">
                    Browse Destinations
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer">
            <CardContent className="p-6">
              <div className="text-center">
                <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <Plus className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Plan New Trip</h3>
                <p className="text-gray-600 mb-4">Create a personalized itinerary</p>
                <Link to="/destinations">
                  <Button className="w-full bg-green-600 hover:bg-green-700">
                    Start Planning
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer">
            <CardContent className="p-6">
              <div className="text-center">
                <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">View Analytics</h3>
                <p className="text-gray-600 mb-4">Track your travel spending</p>
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  View Reports
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Trips */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Recent Trips</h2>
            <Link to="/trips">
              <Button variant="outline" className="border border-gray-300 text-gray-700 hover:bg-gray-50">
                View All
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentTrips.map((trip) => (
              <Card key={trip.id} className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="relative">
                  <img
                    src={trip.image}
                    alt={trip.destination}
                    className="w-full h-32 object-cover rounded-t-lg"
                  />
                  <div className="absolute top-2 right-2">
                    {getStatusBadge(trip.status)}
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-1">{trip.destination}</h3>
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(trip.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <DollarSign className="h-4 w-4" />
                      <span>${trip.budget.toLocaleString()}</span>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full border border-gray-300 text-gray-700 hover:bg-gray-50">
                    View Details
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-gray-900">Travel Insights</CardTitle>
              <CardDescription className="text-gray-600">
                Your travel patterns and preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Most visited region</span>
                  <span className="text-gray-900 font-medium">Europe</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Average trip duration</span>
                  <span className="text-gray-900 font-medium">7 days</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Preferred season</span>
                  <span className="text-gray-900 font-medium">Summer</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-gray-900">Upcoming Adventures</CardTitle>
              <CardDescription className="text-gray-600">
                Your next planned trips
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="text-gray-900 font-medium">Paris, France</p>
                    <p className="text-gray-600 text-sm">June 15, 2024</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="text-gray-900 font-medium">Tokyo, Japan</p>
                    <p className="text-gray-600 text-sm">September 8, 2024</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 