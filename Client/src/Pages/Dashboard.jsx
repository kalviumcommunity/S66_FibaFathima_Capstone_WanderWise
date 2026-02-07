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
    <div className="min-h-screen w-full relative overflow-x-hidden bg-gradient-to-b from-[#4facfe] to-[#00f2fe] dark:from-[#4facfe] dark:to-[#a1c4fd] bg-fixed transition-colors duration-1000 font-sans">

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

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Welcome Section */}
          <div className="mb-8 text-center md:text-left">
            <h1 className="text-3xl md:text-5xl font-black text-white mb-3 tracking-tighter drop-shadow-2xl transform -rotate-1">
              Hey, {user?.name || 'Traveler'}! 👋
            </h1>
            <p className="text-white/90 text-lg font-medium tracking-tight drop-shadow-lg">
              "Ready to plan your next adventure? Let's make it unforgettable."
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
              { label: 'Total Trips', value: stats.totalTrips, icon: Plane, color: 'bg-blue-500' },
              { label: 'Total Spent', value: `$${stats.totalSpent.toLocaleString()}`, icon: DollarSign, color: 'bg-emerald-500' },
              { label: 'Upcoming', value: stats.upcomingTrips, icon: Calendar, color: 'bg-orange-500' },
              { label: 'Favorites', value: stats.favoriteDestinations, icon: Star, color: 'bg-purple-500' }
            ].map((stat, i) => (
              <Card key={i} className="bg-white/20 backdrop-blur-lg border border-white/30 rounded-[20px] shadow-lg transform hover:scale-105 transition-all duration-300">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-2.5 ${stat.color} rounded-lg shadow-lg transform -rotate-12`}>
                      <stat.icon className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-xl font-black text-white tracking-tighter drop-shadow-sm">{stat.value}</span>
                  </div>
                  <p className="text-[10px] font-black text-white/60 uppercase tracking-widest">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="group relative bg-white/20 backdrop-blur-xl border border-white/30 rounded-[24px] shadow-lg p-6 transition-all hover:-translate-y-2">
              <div className="mx-auto w-12 h-12 bg-white/10 dark:bg-blue-900/30 rounded-[16px] flex items-center justify-center mb-4 transform group-hover:rotate-12 transition-transform shadow-inner border border-white/20">
                <MapPin className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg font-black text-white mb-1 text-center tracking-tight drop-shadow-sm">Explore</h3>
              <p className="text-white/70 mb-5 text-center font-medium leading-relaxed text-xs">Discover amazing places across the globe.</p>
              <Link to="/destinations">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-full py-6 text-lg font-black shadow-lg">
                  Browse Now
                </Button>
              </Link>
            </div>

            <div className="group relative bg-white/30 backdrop-blur-2xl border border-white/40 rounded-[24px] shadow-xl p-6 transition-all hover:-translate-y-2 scale-105 z-20">
              <div className="mx-auto w-12 h-12 bg-white/20 dark:bg-emerald-900/30 rounded-[16px] flex items-center justify-center mb-4 transform group-hover:scale-110 transition-transform shadow-inner border border-white/30">
                <Plus className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-lg font-black text-white mb-1 text-center tracking-tight drop-shadow-sm">Plan New Trip</h3>
              <p className="text-white/80 mb-5 text-center font-medium leading-relaxed text-xs">Create your custom AI itinerary today.</p>
              <Link to="/destinations">
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-full py-6 text-lg font-black shadow-lg">
                  Start Planning
                </Button>
              </Link>
            </div>

            <div className="group relative bg-white/20 backdrop-blur-xl border border-white/30 rounded-[24px] shadow-lg p-6 transition-all hover:-translate-y-2">
              <div className="mx-auto w-12 h-12 bg-white/10 dark:bg-purple-900/30 rounded-[16px] flex items-center justify-center mb-4 transform group-hover:-rotate-12 transition-transform shadow-inner border border-white/20">
                <TrendingUp className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-lg font-black text-white mb-1 text-center tracking-tight drop-shadow-sm">Analytics</h3>
              <p className="text-white/70 mb-5 text-center font-medium leading-relaxed text-xs">View your detailed travel spending reports.</p>
              <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-full py-6 text-lg font-black shadow-lg">
                View Reports
              </Button>
            </div>
          </div>

          {/* Recent Trips */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-black text-white tracking-tighter drop-shadow-lg">Recent Adventures</h2>
              <Link to="/trips">
                <Button variant="outline" className="bg-white/10 backdrop-blur-md border hover:bg-white text-white hover:text-blue-600 font-black rounded-full px-6 py-3 text-sm border-white/20 transition-all">
                  See All Trips
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentTrips.length > 0 ? recentTrips.map((trip) => (
                <div key={trip._id || trip.id} className="group relative bg-white/20 backdrop-blur-lg rounded-[20px] shadow-lg overflow-hidden border border-white/30 transition-all duration-500 hover:-translate-y-2">
                  <div className="relative h-32 overflow-hidden">
                    <img
                      src={trip.destinationImage || trip.image || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800'}
                      alt={trip.destinationName || trip.destination}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                    <div className="absolute top-3 right-3 z-10">
                      {getStatusBadge(trip.status)}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-black text-white mb-2 tracking-tight group-hover:text-blue-100 transition-colors uppercase drop-shadow-sm">{trip.destinationName || trip.destination}</h3>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2 text-white/70 font-bold text-[10px]">
                        <Calendar className="h-3 w-3 text-blue-200" />
                        <span>{(trip.startDate || trip.date) ? new Date(trip.startDate || trip.date).toLocaleDateString() : 'No date'}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-white font-black text-lg">
                        <DollarSign className="h-4 w-4 stroke-[2px]" />
                        <span>{(trip.budget || 0).toLocaleString()} {trip.currency || 'INR'}</span>
                      </div>
                    </div>
                    <Button className="w-full bg-white/10 hover:bg-white/20 text-white rounded-full py-4 font-black text-sm shadow-lg border border-white/20 transition-all h-10">
                      View Itinerary <ChevronRight className="h-4 w-4 ml-1" />
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