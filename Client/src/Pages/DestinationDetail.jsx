import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import { MapPin, Calendar, Users, Star, Heart, ArrowLeft, Cloud, Plane } from 'lucide-react';
import { destinationService } from '../services/destinationService';
import { tripApiService } from '../services/tripApiService';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

const DestinationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const [destination, setDestination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState({});

  useEffect(() => {
    const fetchDestination = async () => {
      try {
        const data = await destinationService.getDestination(id);
        setDestination(data);
      } catch (error) {
        toast.error('Failed to load destination details');
        navigate('/destinations');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchDestination();
    }
  }, [id, navigate]);

  const handlePlanTrip = () => {
    if (!isLoggedIn) {
      toast.error('Please log in to plan a trip');
      navigate('/login');
      return;
    }
    navigate(`/quiz/${id}`, { state: { destination } });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#4facfe]/10 transition-colors duration-1000">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (!destination) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#4facfe]/10 transition-colors duration-1000">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Destination not found</h2>
          <Button onClick={() => navigate('/destinations')}>
            Back to Destinations
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-[#4facfe] to-[#00f2fe] dark:from-[#4facfe] dark:to-[#a1c4fd] transition-colors duration-1000 font-sans pb-20">

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
        {/* Back Navigation */}
        <div className="absolute top-6 left-6 z-50">
          <Button
            variant="ghost"
            onClick={() => navigate('/destinations')}
            className="bg-white/20 backdrop-blur-md hover:bg-white/40 text-white rounded-full p-4 border border-white/20 shadow-xl transition-all hover:scale-110 active:scale-90"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
        </div>

        {/* Hero Section */}
        <div className="relative h-[60vh] w-full overflow-hidden rounded-b-[4rem] shadow-2xl border-b border-white/20">
          {destination.images && destination.images[0] && (
            <img
              src={destination.images[0]}
              alt={destination.name}
              className="w-full h-full object-cover transform scale-105"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

          <div className="absolute bottom-0 left-0 w-full p-8 md:p-16">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                  <div className="flex items-center space-x-3 text-white/90 mb-4 uppercase tracking-[0.3em] font-black drop-shadow-lg">
                    <MapPin className="h-6 w-6 text-blue-400" />
                    <span className="text-xl">{destination.location}, {destination.country}</span>
                  </div>
                  <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter mb-4 drop-shadow-2xl transform -rotate-1">
                    {destination.name}
                  </h1>
                </div>
                <div className="flex items-center gap-4 bg-white/20 backdrop-blur-2xl px-6 py-3 rounded-[32px] border border-white/20 shadow-2xl transform rotate-2">
                  <Star className="h-8 w-8 text-yellow-400 fill-current" />
                  <span className="text-4xl font-black text-white tracking-tighter">{destination.rating.toFixed(1)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10 pb-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

            {/* Main Content */}
            <div className="lg:col-span-2 space-y-12">
              {/* Description */}
              <div className="bg-white/95 dark:bg-white/90 backdrop-blur-xl rounded-[40px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] p-10 border border-white/40 dark:border-white/20 transition-all hover:shadow-[0_25px_70px_-15px_rgba(0,0,0,0.15)]">
                <h2 className="text-3xl font-black text-gray-900 mb-6 flex items-center gap-3">
                  About this place
                </h2>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-xl font-medium">
                  {destination.description}
                </p>
              </div>

              {/* Activities */}
              {destination.activities && destination.activities.length > 0 && (
                <div className="bg-white/95 dark:bg-white/90 backdrop-blur-xl rounded-[40px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] p-10 border border-white/40 dark:border-white/20">
                  <h2 className="text-3xl font-black text-gray-900 mb-8">Things to do</h2>
                  <div className="flex flex-wrap gap-4">
                    {destination.activities.map((activity, index) => (
                      <span
                        key={index}
                        className="bg-blue-600 text-white px-6 py-3 rounded-full font-black text-sm shadow-lg transform hover:scale-105 transition-transform cursor-default uppercase tracking-widest border-2 border-white/20"
                      >
                        {activity}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Popular Attractions */}
              {destination.popularAttractions && destination.popularAttractions.length > 0 && (
                <div className="bg-white/95 dark:bg-white/90 backdrop-blur-xl rounded-[40px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] p-10 border border-white/40 dark:border-white/20">
                  <h2 className="text-3xl font-black text-gray-900 mb-8">Popular Attractions</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {destination.popularAttractions.map((attraction, index) => (
                      <div key={index} className="flex items-center gap-4 p-5 rounded-[24px] bg-gray-50/50 dark:bg-gray-50/50 hover:bg-white dark:hover:bg-white transition-all border border-transparent hover:border-blue-500/30 hover:shadow-xl group">
                        <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-all transform group-hover:rotate-12">
                          <MapPin className="h-7 w-7 text-blue-600 dark:text-blue-400 group-hover:text-white" />
                        </div>
                        <span className="font-black text-gray-700 dark:text-gray-200 text-lg">{attraction}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Trip Planning Card */}
              <div className="bg-white/95 dark:bg-white/90 backdrop-blur-xl rounded-[40px] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] p-10 border-2 border-blue-500/20 sticky top-24 transform hover:scale-[1.02] transition-all">
                <div className="mb-8">
                  <h3 className="text-3xl font-black text-gray-900 mb-4">Ready to explore?</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-lg font-medium leading-relaxed">
                    Get a personalized itinerary including budget, hotels, and daily activities.
                  </p>
                </div>

                {destination.bestSeason && (
                  <div className="flex items-center gap-5 mb-10 p-6 bg-blue-50/50 dark:bg-blue-50/50 rounded-[32px] border-2 border-blue-100 dark:border-blue-100">
                    <div className="w-16 h-16 bg-blue-600 rounded-[20px] flex items-center justify-center shadow-lg transform -rotate-6">
                      <Calendar className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-blue-600 font-black uppercase tracking-[0.2em] mb-1">Best Season</p>
                      <p className="font-black text-gray-900 text-xl">{destination.bestSeason}</p>
                    </div>
                  </div>
                )}

                <Button
                  onClick={handlePlanTrip}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-full py-10 text-2xl font-black shadow-[0_15px_40px_-5px_rgba(37,99,235,0.4)] hover:shadow-[0_20px_50px_-5px_rgba(37,99,235,0.5)] hover:scale-[1.03] active:scale-95 transition-all duration-300 transform"
                >
                  Start Planning <Plane className="h-8 w-8 ml-4" />
                </Button>

                <p className="text-center text-gray-400 dark:text-gray-500 mt-6 text-sm font-bold uppercase tracking-widest">
                  Quick & easy • 100% Personal
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default DestinationDetail;
