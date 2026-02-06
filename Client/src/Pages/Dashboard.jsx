import { useState, useEffect } from 'react';
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
  Globe,
  Cloud,
  ChevronRight
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
        const trips = await tripApiService.getTrips();
        setRecentTrips(trips.slice(0, 3));

        const userStats = await getUserStats(user?._id);
        setStats({
          ...userStats,
          totalTrips: trips.length,
          upcomingTrips: trips.filter(trip => new Date(trip.startDate) > new Date()).length
        });
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
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
        return <Badge className="bg-emerald-500 text-white border-none px-3 py-1 rounded-full text-xs font-black uppercase">Upcoming</Badge>;
      case 'completed':
        return <Badge className="bg-blue-500 text-white border-none px-3 py-1 rounded-full text-xs font-black uppercase">Completed</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-500 text-white border-none px-3 py-1 rounded-full text-xs font-black uppercase">Cancelled</Badge>;
      default:
        return <Badge className="bg-gray-500 text-white border-none px-3 py-1 rounded-full text-xs font-black uppercase">Active</Badge>;
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-[#4facfe] to-[#00f2fe] dark:from-[#4facfe] dark:to-[#a1c4fd] transition-colors duration-1000 font-sans">

      {/* Decorative Clouds */}
      <div className="absolute top-20 left-10 opacity-30 dark:opacity-10 animate-float pointer-events-none z-0">
        <Cloud className="w-24 h-24 text-white fill-white drop-shadow-xl" />
      </div>
      <div className="absolute top-60 right-20 opacity-20 dark:opacity-5 animate-float animation-delay-2000 pointer-events-none z-0">
        <Cloud className="w-32 h-32 text-white fill-white drop-shadow-xl" />
      </div>

      {/* Night Mode Stars */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none hidden dark:block">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-white rounded-full animate-pulse"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
              animationDuration: `${Math.random() * 3 + 2}s`,
              animationDelay: `${Math.random() * 2}s`,
              opacity: Math.random() * 0.7 + 0.3,
            }}
          />
        ))}
      </div>

      <div className="relative z-10">
        {/* Navigation */}
        <nav className="bg-white/10 backdrop-blur-2xl border-b border-white/20 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-20">
              <Link to="/" className="flex items-center space-x-3 group">
                <div className="bg-white p-2 rounded-2xl shadow-xl transform group-hover:rotate-12 transition-transform">
                  <Globe className="h-8 w-8 text-blue-600" />
                </div>
                <span className="text-2xl font-black text-white tracking-tighter">WanderWise</span>
              </Link>

              <div className="flex items-center space-x-6">
                <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 rounded-full font-bold px-4">
                  <Settings className="h-5 w-5 mr-2" />
                  Settings
                </Button>
                <Button variant="ghost" size="sm" onClick={handleLogout} className="text-white hover:bg-red-500 hover:text-white rounded-full font-bold px-4 transition-all">
                  <LogOut className="h-5 w-5 mr-2" />
                  Logout
                </Button>
                <div className="p-1 bg-white/20 rounded-full border border-white/20">
                  <Avatar className="h-10 w-10 border-2 border-white shadow-lg">
                    <AvatarImage src={user?.avatar} />
                    <AvatarFallback className="bg-blue-600 text-white font-bold">{user?.name?.charAt(0) || 'U'}</AvatarFallback>
                  </Avatar>
                </div>
              </div>
            </div>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Welcome Section */}
          <div className="mb-12 text-center md:text-left">
            <h1 className="text-5xl md:text-7xl font-black text-white mb-4 tracking-tighter drop-shadow-2xl transform -rotate-1">
              Hey, {user?.name || 'Traveler'}! 👋
            </h1>
            <p className="text-white/90 text-2xl font-medium tracking-tight drop-shadow-lg">
              "Ready to plan your next adventure? Let's make it unforgettable."
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {[
              { label: 'Total Trips', value: stats.totalTrips, icon: Plane, color: 'bg-blue-500' },
              { label: 'Total Spent', value: `$${stats.totalSpent.toLocaleString()}`, icon: DollarSign, color: 'bg-emerald-500' },
              { label: 'Upcoming', value: stats.upcomingTrips, icon: Calendar, color: 'bg-orange-500' },
              { label: 'Favorites', value: stats.favoriteDestinations, icon: Star, color: 'bg-purple-500' }
            ].map((stat, i) => (
              <Card key={i} className="bg-white border border-[#E0F2FF] rounded-[32px] shadow-lg transform hover:scale-105 transition-all duration-300">
                <CardContent className="p-8">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-4 ${stat.color} rounded-2xl shadow-lg transform -rotate-12`}>
                      <stat.icon className="h-8 w-8 text-white" />
                    </div>
                    <span className="text-4xl font-black text-gray-900 tracking-tighter">{stat.value}</span>
                  </div>
                  <p className="text-lg font-black text-gray-400 uppercase tracking-widest">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="group relative bg-white/90 backdrop-blur-xl border border-[#D6E9FF] rounded-[40px] shadow-xl p-10 transition-all hover:-translate-y-2">
              <div className="mx-auto w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-[24px] flex items-center justify-center mb-6 transform group-hover:rotate-12 transition-transform shadow-inner">
                <MapPin className="h-10 w-10 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-3 text-center tracking-tight">Explore</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-8 text-center font-medium leading-relaxed">Discover amazing places across the globe.</p>
              <Link to="/destinations">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-full py-8 text-xl font-black shadow-xl">
                  Browse Now
                </Button>
              </Link>
            </div>

            <div className="group relative bg-white/95 backdrop-blur-2xl border border-[#BFE3FF] rounded-[40px] shadow-2xl p-10 transition-all hover:-translate-y-2 scale-105 z-20">
              <div className="mx-auto w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-[24px] flex items-center justify-center mb-6 transform group-hover:scale-110 transition-transform shadow-inner">
                <Plus className="h-10 w-10 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-3 text-center tracking-tight">Plan New Trip</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-8 text-center font-medium leading-relaxed">Create your custom AI itinerary today.</p>
              <Link to="/destinations">
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-full py-8 text-xl font-black shadow-xl">
                  Start Planning
                </Button>
              </Link>
            </div>

            <div className="group relative bg-white/90 backdrop-blur-xl border border-[#D6E9FF] rounded-[40px] shadow-xl p-10 transition-all hover:-translate-y-2">
              <div className="mx-auto w-20 h-20 bg-purple-100 dark:bg-purple-900/30 rounded-[24px] flex items-center justify-center mb-6 transform group-hover:-rotate-12 transition-transform shadow-inner">
                <TrendingUp className="h-10 w-10 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-3 text-center tracking-tight">Analytics</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-8 text-center font-medium leading-relaxed">View your detailed travel spending reports.</p>
              <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-full py-8 text-xl font-black shadow-xl">
                View Reports
              </Button>
            </div>
          </div>

          {/* Recent Trips */}
          <div className="mb-16">
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-4xl font-black text-white tracking-tighter drop-shadow-lg">Recent Adventures</h2>
              <Link to="/trips">
                <Button variant="outline" className="bg-white/10 backdrop-blur-md border hover:bg-white text-white hover:text-blue-600 font-black rounded-full px-8 py-6 text-lg border-white/20 transition-all">
                  See All Trips
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {recentTrips.length > 0 ? recentTrips.map((trip) => (
                <div key={trip.id} className="group relative bg-white dark:bg-white rounded-[32px] shadow-2xl overflow-hidden border border-white/40 dark:border-white/20 transition-all duration-500 hover:-translate-y-2">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={trip.image || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800'}
                      alt={trip.destination}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                    <div className="absolute top-4 right-4 z-10">
                      {getStatusBadge(trip.status)}
                    </div>
                  </div>
                  <div className="p-8">
                    <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-4 tracking-tight group-hover:text-blue-600 transition-colors">{trip.destination}</h3>
                    <div className="flex items-center justify-between mb-8">
                      <div className="flex items-center space-x-2 text-gray-500 font-bold">
                        <Calendar className="h-5 w-5 text-blue-500" />
                        <span>{new Date(trip.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-emerald-600 font-black text-2xl">
                        <DollarSign className="h-6 w-6 stroke-[3px]" />
                        <span>{trip.budget.toLocaleString()}</span>
                      </div>
                    </div>
                    <Button className="w-full bg-black hover:bg-gray-800 text-white rounded-full py-7 font-black text-xl shadow-lg hover:shadow-xl transition-all">
                      View Itinerary <ChevronRight className="h-6 w-6 ml-2" />
                    </Button>
                  </div>
                </div>
              )) : (
                <div className="col-span-full py-24 bg-white/10 backdrop-blur-md rounded-[40px] border-4 border-dashed border-white/30 text-center">
                  <Plane className="h-20 w-20 text-white/50 mx-auto mb-6 animate-pulse" />
                  <h3 className="text-3xl font-black text-white mb-3">No trips planned yet</h3>
                  <p className="text-white/70 text-lg mb-8 tracking-tight">Your future adventures are waiting to be created.</p>
                  <Link to="/destinations">
                    <Button className="bg-white text-blue-600 hover:bg-blue-50 font-black rounded-full px-12 py-8 text-2xl shadow-2xl">
                      Start Exploring
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 