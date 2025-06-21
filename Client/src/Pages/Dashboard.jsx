import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  MapPin, 
  Calendar, 
  Clock, 
  DollarSign, 
  Star, 
  Heart, 
  Trash2, 
  CheckCircle, 
  Plane, 
  TrendingUp,
  ArrowRight,
  Plus
} from 'lucide-react';
import { toast } from "sonner";
import { useAuth } from '../context/AuthContext';
import DestinationCard from '../Components/DestinationCard';
import { 
  getUpcomingTrips, 
  getPastTrips, 
  getFavoriteDestinations, 
  getTripStats,
  deleteTrip,
  completeTrip,
  toggleFavorite
} from '../services/tripStorage';

const Dashboard = () => {
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [upcomingTrips, setUpcomingTrips] = useState([]);
  const [pastTrips, setPastTrips] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [stats, setStats] = useState({
    upcomingCount: 0,
    pastCount: 0,
    favoritesCount: 0,
    totalTrips: 0
  });

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    loadDashboardData();
  }, [isLoggedIn, navigate]);

  const loadDashboardData = () => {
    const upcoming = getUpcomingTrips();
    const past = getPastTrips();
    const favs = getFavoriteDestinations();
    const tripStats = getTripStats();

    setUpcomingTrips(upcoming);
    setPastTrips(past);
    setFavorites(favs);
    setStats(tripStats);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleCompleteTrip = (tripId) => {
    try {
      completeTrip(tripId);
      loadDashboardData();
      toast.success("Trip marked as completed!");
    } catch {
      toast.error("Failed to complete trip");
    }
  };

  const handleDeleteTrip = (tripId, type) => {
    try {
      deleteTrip(tripId, type);
      loadDashboardData();
      toast.success("Trip deleted successfully!");
    } catch {
      toast.error("Failed to delete trip");
    }
  };

  const handleFavoriteToggle = (destination) => {
    try {
      toggleFavorite(destination);
      loadDashboardData();
      toast.success("Favorites updated!");
    } catch {
      toast.error("Failed to update favorites");
    }
  };

  const handlePlanNewTrip = () => {
    navigate('/');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <MapPin className="w-8 h-8 text-green-600" />
            <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <Button
              onClick={handlePlanNewTrip}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Plan New Trip
            </Button>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="text-gray-600 hover:text-gray-800"
            >
              Logout
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-lg border-0 bg-gradient-to-r from-blue-50 to-blue-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-600 font-medium">Upcoming Trips</p>
                  <p className="text-2xl font-bold text-blue-800">{stats.upcomingCount}</p>
                </div>
                <Plane className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-gradient-to-r from-green-50 to-green-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-600 font-medium">Completed Trips</p>
                  <p className="text-2xl font-bold text-green-800">{stats.pastCount}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-gradient-to-r from-purple-50 to-purple-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-600 font-medium">Favorite Places</p>
                  <p className="text-2xl font-bold text-purple-800">{stats.favoritesCount}</p>
                </div>
                <Heart className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-gradient-to-r from-orange-50 to-orange-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-orange-600 font-medium">Total Trips</p>
                  <p className="text-2xl font-bold text-orange-800">{stats.totalTrips}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming Trips</TabsTrigger>
            <TabsTrigger value="past">Past Trips</TabsTrigger>
            <TabsTrigger value="favorites">Favorites</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Recent Upcoming Trips */}
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plane className="w-5 h-5 text-blue-600" />
                  Recent Upcoming Trips
                </CardTitle>
              </CardHeader>
              <CardContent>
                {upcomingTrips.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {upcomingTrips.slice(0, 3).map((trip) => (
                      <Card key={trip.id} className="border border-gray-200 hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-gray-800">{trip.destination?.name}</h4>
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                              {trip.itinerary?.length} days
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">{trip.summary?.description}</p>
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span>Saved: {formatDate(trip.savedAt)}</span>
                            <span>₹{trip.budget?.total?.toLocaleString()}</span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Plane className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No upcoming trips yet</p>
                    <Button onClick={handlePlanNewTrip} className="mt-4">
                      Plan Your First Trip
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Favorite Destinations */}
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-purple-600" />
                  Favorite Destinations
                </CardTitle>
              </CardHeader>
              <CardContent>
                {favorites.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {favorites.slice(0, 3).map((destination) => (
                      <DestinationCard
                        key={destination.id}
                        destination={destination}
                        onClick={() => navigate(`/quiz/${destination.id}`, { state: { destination } })}
                        onFavorite={handleFavoriteToggle}
                        isFavorited={true}
                        className="scale-90"
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Heart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No favorite destinations yet</p>
                    <Button onClick={() => navigate('/destinations')} className="mt-4">
                      Explore Destinations
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Upcoming Trips Tab */}
          <TabsContent value="upcoming" className="space-y-4">
            {upcomingTrips.length > 0 ? (
              upcomingTrips.map((trip) => (
                <Card key={trip.id} className="shadow-lg border-0">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-4">
                          <h3 className="text-xl font-semibold text-gray-800">{trip.destination?.name}</h3>
                          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                            {trip.itinerary?.length} Days
                          </span>
                        </div>
                        <p className="text-gray-600 mb-4">{trip.summary?.description}</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="w-4 h-4" />
                            <span>Saved: {formatDate(trip.savedAt)}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <DollarSign className="w-4 h-4" />
                            <span>₹{trip.budget?.total?.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Star className="w-4 h-4" />
                            <span className="capitalize">{trip.quizAnswers?.[0]}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Clock className="w-4 h-4" />
                            <span>Just Now</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 ml-4">
                        <Button
                          size="sm"
                          onClick={() => handleCompleteTrip(trip.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Complete
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteTrip(trip.id, 'upcoming')}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="shadow-lg border-0">
                <CardContent className="text-center py-12">
                  <Plane className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">No upcoming trips</h3>
                  <p className="text-gray-500 mb-4">Start planning your next adventure!</p>
                  <Button onClick={handlePlanNewTrip} className="bg-green-600 hover:bg-green-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Plan New Trip
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Past Trips Tab */}
          <TabsContent value="past" className="space-y-4">
            {pastTrips.length > 0 ? (
              pastTrips.map((trip) => (
                <Card key={trip.id} className="shadow-lg border-0">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-4">
                          <h3 className="text-xl font-semibold text-gray-800">{trip.destination?.name}</h3>
                          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                            Completed
                          </span>
                        </div>
                        <p className="text-gray-600 mb-4">{trip.summary?.description}</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="w-4 h-4" />
                            <span>Completed: {formatDate(trip.completedAt)}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <DollarSign className="w-4 h-4" />
                            <span>₹{trip.budget?.total?.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Star className="w-4 h-4" />
                            <span className="capitalize">{trip.quizAnswers?.[0]}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Clock className="w-4 h-4" />
                            <span>{trip.itinerary?.length} Days</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 ml-4">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteTrip(trip.id, 'past')}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="shadow-lg border-0">
                <CardContent className="text-center py-12">
                  <CheckCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">No completed trips</h3>
                  <p className="text-gray-500 mb-4">Complete your first trip to see it here!</p>
                  <Button onClick={handlePlanNewTrip} className="bg-green-600 hover:bg-green-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Plan New Trip
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Favorites Tab */}
          <TabsContent value="favorites" className="space-y-4">
            {favorites.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {favorites.map((destination) => (
                  <DestinationCard
                    key={destination.id}
                    destination={destination}
                    onClick={() => navigate(`/quiz/${destination.id}`, { state: { destination } })}
                    onFavorite={handleFavoriteToggle}
                    isFavorited={true}
                  />
                ))}
              </div>
            ) : (
              <Card className="shadow-lg border-0">
                <CardContent className="text-center py-12">
                  <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">No favorite destinations</h3>
                  <p className="text-gray-500 mb-4">Start exploring and add destinations to your favorites!</p>
                  <Button onClick={() => navigate('/destinations')} className="bg-green-600 hover:bg-green-700">
                    <ArrowRight className="w-4 h-4 mr-2" />
                    Explore Destinations
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;