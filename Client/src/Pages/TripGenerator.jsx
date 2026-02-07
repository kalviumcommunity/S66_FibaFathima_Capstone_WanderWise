import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Clock,
  DollarSign,
  Star,
  Download,
  Share2,
  Cloud,
  Sun,
  CloudRain,
  Bookmark,
  Globe,
  Sparkles,
  ChevronRight,
  Zap
} from 'lucide-react';
import { toast } from "react-hot-toast";
import { getWeatherData, generateRealisticTrip } from '../services/tripService';
import { tripApiService } from '../services/tripApiService';
import { destinationService } from '../services/destinationService';
import { useAuth } from '../context/AuthContext';

const TripGenerator = () => {
  const { destinationId } = useParams();
  const location = useLocation();
  const [destination, setDestination] = useState(location.state?.destination || null);
  const { quizAnswers } = location.state || {};
  const budget = quizAnswers?.budget;
  const currency = quizAnswers?.currency || 'INR';
  const navigate = useNavigate();
  const { user } = useAuth();

  const [isGenerating, setIsGenerating] = useState(true);
  const [tripData, setTripData] = useState(null);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [weatherData, setWeatherData] = useState(null);

  useEffect(() => {
    if (!destination && destinationId) {
      destinationService.getDestinationById(destinationId)
        .then(setDestination)
        .catch(console.error);
    }
  }, [destination, destinationId]);

  useEffect(() => {
    const generateTrip = async () => {
      try {
        setGenerationProgress(10);
        await new Promise(resolve => setTimeout(resolve, 800));
        const weather = await getWeatherData(destination?.name);
        setWeatherData(weather);
        setGenerationProgress(40);

        await new Promise(resolve => setTimeout(resolve, 1200));
        const generatedTrip = generateRealisticTrip(destination?.name, quizAnswers, budget, weather);
        setTripData(generatedTrip);
        setGenerationProgress(100);

        await new Promise(resolve => setTimeout(resolve, 500));
        setIsGenerating(false);
        toast.success("AI Synthesis Complete!");
      } catch (error) {
        console.error('Error generating trip:', error);
        toast.error("AI Neural Link Failed. Retrying...");
        setIsGenerating(false);
      }
    };

    if (destination) {
      generateTrip();
    }
  }, [destination, quizAnswers]);

  const handleRegenerate = () => {
    setIsGenerating(true);
    setGenerationProgress(0);
    // The effect will trigger again if we change a dependency, 
    // but here we can just call it manually or rely on state toggle if needed.
    // To force re-run without changing dependencies, we can use a key or a trigger state.
    setRegenTrigger(prev => prev + 1);
  };

  const [regenTrigger, setRegenTrigger] = useState(0);

  useEffect(() => {
    if (destination && regenTrigger > 0) {
      const regenerate = async () => {
        setIsGenerating(true);
        setGenerationProgress(0);
        try {
          setGenerationProgress(10);
          await new Promise(resolve => setTimeout(resolve, 1000));
          const generatedTrip = generateRealisticTrip(destination?.name, quizAnswers, budget, weatherData);
          setTripData(generatedTrip);
          setGenerationProgress(100);
          await new Promise(resolve => setTimeout(resolve, 500));
          setIsGenerating(false);
          toast.success("Brighter Idea Generated! 💡");
        } catch (error) {
          toast.error("AI Neural Link Failed.");
          setIsGenerating(false);
        }
      };
      regenerate();
    }
  }, [regenTrigger]);

  const getWeatherIcon = (description) => {
    if (description?.includes('Rain')) return <CloudRain className="w-8 h-8 text-blue-500" />;
    if (description?.includes('Cloud')) return <Cloud className="w-8 h-8 text-gray-400" />;
    return <Sun className="w-8 h-8 text-yellow-400 fill-yellow-400" />;
  };

  const handleBack = () => {
    navigate(`/quiz/${destinationId}`, {
      state: { destination, quizAnswers }
    });
  };

  const handleDownload = () => toast.success("Mission files downloaded!");
  const handleShare = () => toast.success("Coordinates shared!");

  const handleSave = async () => {
    if (!user) {
      toast.error("Please login to save your mission");
      navigate('/login');
      return;
    }

    try {
      const formattedTrip = {
        destinationId: destination._id,
        destinationName: destination.name,
        destinationImage: destination.images?.[0],
        budget: tripData.summary.budget,
        currency: currency,
        status: 'upcoming',
        startDate: new Date(),
        endDate: new Date(Date.now() + (tripData.itinerary.length * 24 * 60 * 60 * 1000)),
        itinerary: tripData.itinerary.map(day => ({
          day: day.day,
          activities: day.activities.map(act => `${act.time} - ${act.activity} at ${act.location}`),
          mapLink: ''
        }))
      };

      await tripApiService.createTrip(formattedTrip);
      toast.success("Mission saved to Secure Cloud!");
      navigate('/dashboard');
    } catch (error) {
      console.error('Error saving trip:', error);
      toast.error("Cloud synchronization failed.");
    }
  };

  const bgImage = destination?.images?.[0] || 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200';

  if (!destination) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#4facfe] to-[#00f2fe] text-white p-6 text-center">
        <Cloud className="w-24 h-24 mb-6 animate-float opacity-50" />
        <h2 className="text-4xl font-black mb-4 tracking-tighter uppercase italic">Mission Error</h2>
        <p className="text-xl mb-8 font-medium">Destination coordinates lost. Please RTB (Return To Base).</p>
        <Button onClick={() => navigate('/')} className="bg-white text-blue-600 hover:bg-white/90 rounded-full px-12 py-8 text-2xl font-black shadow-2xl transition-all hover:scale-105">
          Go Home
        </Button>
      </div>
    );
  }

  if (isGenerating) {
    return (
      <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-[#4facfe] to-[#00f2fe] dark:from-slate-900 dark:to-slate-950 flex flex-col items-center justify-center p-6 text-center">

        {/* Decorative elements for loading */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[20%] left-[15%] opacity-20 animate-float">
            <Cloud className="w-32 h-32 text-white fill-white" />
          </div>
          <div className="absolute bottom-[20%] right-[15%] opacity-10 animate-float animation-delay-2000">
            <Cloud className="w-48 h-48 text-white fill-white" />
          </div>
        </div>

        <div className="relative z-10 max-w-2xl w-full">
          <div className="mb-12 relative inline-block">
            <div className="w-40 h-40 mx-auto border-[12px] border-white/20 border-t-white rounded-full animate-spin shadow-2xl"></div>
            <Zap className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 text-white animate-pulse" />
          </div>

          <h2 className="text-5xl md:text-7xl font-black text-white mb-6 uppercase italic tracking-tighter drop-shadow-2xl transform -rotate-2">
            AI Synthesis <br /> in Progress
          </h2>
          <p className="text-white/80 text-2xl font-bold tracking-tight mb-12 italic">
            "Neural networks are optimizing your {destination?.name} adventure..."
          </p>

          <div className="w-full bg-white/10 backdrop-blur-md rounded-full h-8 p-1.5 border border-white/20 shadow-2xl mb-6">
            <div
              className="bg-gradient-to-r from-blue-400 to-indigo-500 h-full rounded-full transition-all duration-700 ease-out shadow-[0_0_20px_rgba(59,130,246,0.5)]"
              style={{ width: `${generationProgress}%` }}
            ></div>
          </div>
          <p className="text-white font-black tracking-widest text-xl uppercase italic">
            {Math.round(generationProgress)}% Neural Link Formed
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-[#4facfe] to-[#00f2fe] dark:from-[#4facfe] dark:to-[#a1c4fd] transition-colors duration-1000 font-sans">

      {/* Decorative Clouds */}
      <div className="absolute top-20 left-[10%] opacity-30 dark:opacity-10 animate-float pointer-events-none z-0">
        <Cloud className="w-32 h-32 text-white fill-white drop-shadow-2xl" />
      </div>
      <div className="absolute top-60 right-[5%] opacity-20 dark:opacity-5 animate-float animation-delay-2000 pointer-events-none z-0">
        <Cloud className="w-48 h-48 text-white fill-white drop-shadow-2xl" />
      </div>

      {/* Content wrapper */}
      <div className="relative z-10">
        {/* Navigation Bar */}
        <nav className="bg-white/10 backdrop-blur-2xl border-b border-white/20 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">
              <div className="flex items-center space-x-6">
                <Button
                  variant="ghost"
                  onClick={handleBack}
                  className="text-white hover:bg-white/20 rounded-full font-black px-6 transition-all"
                >
                  <ArrowLeft className="h-5 w-5 mr-2 stroke-[3px]" />
                  Modify Coordinates
                </Button>
                <div className="flex items-center space-x-3">
                  <Globe className="h-6 w-6 text-white" />
                  <h1 className="text-2xl font-black text-white tracking-tighter uppercase italic">AI Mission Report</h1>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <Button variant="outline" size="sm" onClick={handleRegenerate} className="bg-white/10 border-white/20 text-white rounded-full font-black hover:bg-white hover:text-blue-600 px-6 h-12 transition-all">
                  <Sparkles className="w-5 h-5 mr-2" /> Better Version
                </Button>
                <Button onClick={handleSave} className="bg-white hover:bg-white/90 text-blue-600 rounded-full font-black px-10 h-12 shadow-xl transition-all hover:scale-105 uppercase tracking-tighter italic">
                  Add to Trip
                </Button>
              </div>
            </div>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="col-span-1 md:col-span-2">
              <h2 className="text-6xl md:text-8xl font-black text-white mb-4 tracking-tighter drop-shadow-2xl transform -rotate-1">
                {destination?.name} <br /> <span className="text-4xl md:text-6xl opacity-80 uppercase italic">Final Report</span>
              </h2>
              <p className="text-white/90 text-2xl font-bold tracking-tight max-w-2xl drop-shadow-lg italic">
                "{tripData?.summary.description}"
              </p>
            </div>

            {weatherData?.current && (
              <div className="bg-white/90 backdrop-blur-xl border border-[#D6E9FF] rounded-[40px] p-10 shadow-xl transform rotate-1 scale-105">
                <div className="flex items-center justify-between mb-6">
                  {getWeatherIcon(weatherData.current.description)}
                  <span className="text-5xl font-black text-gray-900 tracking-tighter">{weatherData.current.temp}°C</span>
                </div>
                <div>
                  <p className="text-sm font-black text-blue-600 uppercase tracking-widest mb-1 italic">Real-Time Weather</p>
                  <p className="text-2xl font-black text-gray-700 tracking-tight capitalize">{weatherData.current.description}</p>
                  <p className="text-gray-400 font-bold mt-2">Humidity: {weatherData.current.humidity}% • Feels like {weatherData.current.feels_like}°C</p>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Itinerary */}
            <div className="lg:col-span-2 space-y-12">
              <div className="bg-white/90 backdrop-blur-xl border border-[#D6E9FF] rounded-[60px] shadow-xl p-10 md:p-16">
                <div className="flex items-center justify-between mb-16">
                  <h3 className="text-4xl font-black text-gray-900 uppercase italic tracking-tighter flex items-center">
                    <Sparkles className="mr-4 w-10 h-10 text-blue-500" />
                    Daily Operations
                  </h3>
                  <div className="bg-blue-100 dark:bg-blue-100/50 text-blue-600 px-6 py-2 rounded-full font-black uppercase tracking-widest text-sm italic border-2 border-blue-200 dark:border-blue-200">
                    {tripData?.summary.duration}
                  </div>
                </div>

                <div className="space-y-16">
                  {tripData?.itinerary.map((day, idx) => (
                    <div key={day.day} className="relative pl-12 border-l-4 border-gray-100 dark:border-slate-800 animate-fade-in group">
                      <div className="absolute top-0 -left-[14px] w-6 h-6 rounded-full bg-blue-600 border-4 border-white dark:border-slate-900 shadow-xl group-hover:scale-150 transition-transform"></div>

                      <div className="mb-10">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-3xl font-black text-gray-900 dark:text-white uppercase italic tracking-tighter">{day.title}</h4>
                          {day.weather && (
                            <div className="flex items-center gap-3 bg-gray-50 dark:bg-slate-800 px-4 py-2 rounded-2xl">
                              {getWeatherIcon(day.weather.description)}
                              <span className="font-black text-gray-700 dark:text-gray-200 italic">{day.weather.temp}°C</span>
                            </div>
                          )}
                        </div>
                        <p className="text-gray-500 dark:text-gray-400 font-bold text-lg mb-8 italic">Day {idx + 1} Mission Objectives</p>
                      </div>

                      <div className="space-y-8">
                        {day.activities.map((activity, aIdx) => (
                          <div key={aIdx} className="relative bg-gray-50/50 dark:bg-slate-800/50 rounded-[32px] p-8 hover:bg-white dark:hover:bg-slate-800 transition-all border border-transparent hover:border-blue-500/20 hover:shadow-2xl group/item">
                            <div className="flex flex-col md:flex-row gap-8 items-start">
                              <div className="w-32 py-2 px-4 bg-black dark:bg-white text-white dark:text-black rounded-xl text-center font-black italic tracking-tighter uppercase shadow-lg transform -rotate-2">
                                {activity.time}
                              </div>
                              <div className="flex-1">
                                <h5 className="text-2xl font-black text-gray-900 dark:text-white mb-3 tracking-tight group-hover/item:text-blue-600 transition-colors uppercase italic">{activity.activity}</h5>
                                <p className="text-gray-600 dark:text-gray-400 font-medium text-lg leading-relaxed mb-6">{activity.description}</p>

                                <div className="flex flex-wrap gap-4">
                                  <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 px-4 py-2 rounded-full font-black text-sm uppercase italic tracking-widest">
                                    <MapPin className="w-4 h-4" /> {activity.location}
                                  </div>
                                  <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 px-4 py-2 rounded-full font-black text-sm uppercase italic tracking-widest">
                                    <Clock className="w-4 h-4" /> {activity.duration}
                                  </div>
                                  <div className="flex items-center gap-2 bg-purple-50 dark:bg-purple-900/20 text-purple-600 px-4 py-2 rounded-full font-black text-sm uppercase italic tracking-widest">
                                    <DollarSign className="w-4 h-4" /> {activity.cost}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-12">
              {/* Mission Summary Card */}
              <div className="bg-black text-white rounded-[50px] shadow-3xl p-10 md:p-14 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl -mr-32 -mt-32 transition-all group-hover:bg-blue-600/40" />

                <h3 className="text-3xl font-black mb-10 uppercase italic tracking-tighter relative z-10 flex items-center">
                  <Zap className="mr-3 text-blue-400" />
                  Vitals
                </h3>

                <div className="space-y-8 relative z-10">
                  <div className="flex items-center justify-between border-b border-white/10 pb-6">
                    <div className="flex items-center gap-4">
                      <DollarSign className="text-emerald-400 w-8 h-8" />
                      <span className="font-black uppercase tracking-widest text-xs italic opacity-60">Est. Load</span>
                    </div>
                    <span className="text-3xl font-black tracking-tighter">{currency} {tripData?.summary.budget?.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-white/10 pb-6">
                    <div className="flex items-center gap-4">
                      <Star className="text-yellow-400 w-8 h-8" />
                      <span className="font-black uppercase tracking-widest text-xs italic opacity-60">Luxury Factor</span>
                    </div>
                    <span className="text-3xl font-black tracking-tighter">{tripData?.summary.rating}/5</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Clock className="text-blue-400 w-8 h-8" />
                      <span className="font-black uppercase tracking-widest text-xs italic opacity-60">Optimal Window</span>
                    </div>
                    <span className="text-2xl font-black tracking-tighter uppercase italic">{tripData?.summary.bestTime}</span>
                  </div>
                </div>

                <Button onClick={handleSave} className="w-full mt-12 bg-blue-600 hover:bg-blue-700 py-10 rounded-[32px] text-2xl font-black uppercase italic tracking-tighter transition-all hover:scale-105 shadow-2xl">
                  Add to Dashboard
                </Button>
              </div>

              {/* Accommodations */}
              <div className="bg-white px-10 py-14 rounded-[50px] shadow-3xl border border-gray-100">
                <h3 className="text-3xl font-black text-gray-900 mb-10 uppercase italic tracking-tighter flex items-center">
                  <Bookmark className="mr-3 text-blue-600" />
                  Base Camps
                </h3>
                <div className="space-y-6">
                  {tripData?.recommendations.accommodation.map((rec, i) => (
                    <div key={i} className="p-6 rounded-[32px] bg-gray-50 hover:bg-blue-50 transition-all border-2 border-transparent hover:border-blue-500/20 group">
                      <div className="flex justify-between items-start mb-4">
                        <h4 className="font-black text-xl text-gray-900 group-hover:text-blue-600 transition-colors uppercase italic">{rec.name}</h4>
                        <Badge className="bg-blue-600 font-black italic">{rec.price}</Badge>
                      </div>
                      <p className="text-gray-500 font-bold mb-2 flex items-center gap-2"><MapPin className="w-4 h-4" /> {rec.location}</p>
                      <p className="text-gray-400 font-bold text-sm uppercase tracking-widest">{rec.type} • ⭐ {rec.rating}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Intel */}
              <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-[50px] shadow-3xl p-10 md:p-14 border border-white/40">
                <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-10 uppercase italic tracking-tighter flex items-center">
                  <Sparkles className="mr-3 text-purple-600" />
                  AI Intel
                </h3>
                <div className="space-y-6">
                  {tripData?.recommendations.tips.map((tip, i) => (
                    <div key={i} className="flex gap-4 p-4 rounded-2xl bg-purple-50/50 dark:bg-purple-900/10 border-l-4 border-purple-500">
                      <Zap className="w-6 h-6 text-purple-500 flex-shrink-0" />
                      <p className="text-gray-600 dark:text-gray-300 font-bold leading-snug">{tip}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripGenerator;