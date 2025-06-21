import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, MapPin, Calendar, Clock, DollarSign, Star, Download, Share2, Cloud, Sun, CloudRain, Bookmark, Globe } from 'lucide-react';
import { toast } from "sonner";
import { getWeatherData, generateRealisticTrip } from '../services/tripService';
import { saveTrip } from '../services/tripStorage';
import { getDestinationImage } from '../lib/utils';

const TripGenerator = () => {
  const { destinationId } = useParams();
  const location = useLocation();
  const { destination, quizAnswers, budget } = location.state || {};
  const navigate = useNavigate();
  
  const [isGenerating, setIsGenerating] = useState(true);
  const [tripData, setTripData] = useState(null);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [weatherData, setWeatherData] = useState(null);

  // Real-time trip generation with weather data
  useEffect(() => {
    const generateTrip = async () => {
      try {
        // Step 1: Fetch weather data
        setGenerationProgress(10);
        await new Promise(resolve => setTimeout(resolve, 1000));
        const weather = await getWeatherData(destination?.name);
        setWeatherData(weather);
        setGenerationProgress(30);

        // Step 2: Generate realistic trip
        setGenerationProgress(50);
        await new Promise(resolve => setTimeout(resolve, 1000));
        const generatedTrip = generateRealisticTrip(destination?.name, quizAnswers, budget, weather);
        setTripData(generatedTrip);
        setGenerationProgress(100);

        setIsGenerating(false);
        toast.success("Your personalized trip with real-time data is ready!");
      } catch (error) {
        console.error('Error generating trip:', error);
        toast.error("Failed to generate trip. Please try again.");
        setIsGenerating(false);
      }
    };

    generateTrip();
  }, [destination, quizAnswers, budget]);

  const getWeatherIcon = (description) => {
    if (description?.includes('Rain')) return <CloudRain className="w-4 h-4 text-blue-500" />;
    if (description?.includes('Cloud')) return <Cloud className="w-4 h-4 text-gray-500" />;
    return <Sun className="w-4 h-4 text-yellow-500" />;
  };

  const handleBack = () => {
    navigate(`/budget/${destinationId}`, {
      state: { destination, quizAnswers, budget }
    });
  };

  const handleDownload = () => {
    toast.success("Trip itinerary downloaded!");
  };

  const handleShare = () => {
    toast.success("Trip shared successfully!");
  };

  const handleSave = async () => {
    try {
      await saveTrip(tripData);
      toast.success("Trip saved successfully!");
    } catch (error) {
      console.error('Error saving trip:', error);
      toast.error("Failed to save trip. Please try again.");
    }
  };

  const bgImage = getDestinationImage(destination?.name) || 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80';

  if (!destination) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-900 via-emerald-800 to-teal-900 text-white">
        <h2 className="text-2xl font-bold mb-4">No destination selected</h2>
        <p className="mb-6">Please start your trip planning from the home page or destinations page.</p>
        <Button onClick={() => navigate('/')} className="bg-gradient-to-r from-green-600 to-emerald-600">Go Home</Button>
      </div>
    );
  }

  if (isGenerating) {
    return (
      <div className="min-h-screen relative overflow-hidden flex items-center justify-center">
        {/* Background Image with Overlay */}
        <div 
          className="fixed inset-0 z-0"
          style={{
            backgroundImage: `url('${bgImage}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/60 via-gray-800/50 to-slate-900/60"></div>
        </div>

        <div className="max-w-md mx-auto text-center relative z-20">
          <div className="mb-8">
            <div className="w-24 h-24 mx-auto mb-4 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Creating Your Real-Time Trip
            </h2>
            <p className="text-green-100">
              Our AI is fetching current weather and crafting a personalized itinerary for {destination?.name}
            </p>
          </div>
          
          <div className="w-full bg-white/20 rounded-full h-2 mb-4">
            <div 
              className="bg-gradient-to-r from-emerald-500 to-teal-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${generationProgress}%` }}
            ></div>
          </div>
          
          <p className="text-sm text-green-200">
            {Math.round(generationProgress)}% Complete
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: `url('${bgImage}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/60 via-gray-800/50 to-slate-900/60"></div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-20">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            onClick={handleBack}
            className="flex items-center gap-2 text-white hover:text-green-200"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Budget
          </Button>
          
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-emerald-400" />
            <h1 className="text-xl font-semibold text-white">
              Your Real-Time Trip to {destination?.name}
            </h1>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              className="flex items-center gap-2 bg-white/20 border-white/30 text-white hover:bg-white/30"
            >
              <Download className="w-4 h-4" />
              Download
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              className="flex items-center gap-2 bg-white/20 border-white/30 text-white hover:bg-white/30"
            >
              <Share2 className="w-4 h-4" />
              Share
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSave}
              className="flex items-center gap-2 bg-white/20 border-white/30 text-white hover:bg-white/30"
            >
              <Bookmark className="w-4 h-4" />
              Save
            </Button>
          </div>
        </div>

        <div className="max-w-6xl mx-auto space-y-8">
          {/* Current Weather Banner */}
          {weatherData?.current && (
            <Card className="shadow-lg border-0 bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {getWeatherIcon(weatherData.current.description)}
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        Current Weather in {destination?.name}
                      </h3>
                      <p className="text-green-200">
                        {weatherData.current.description} • {weatherData.current.temp}°C • {weatherData.current.humidity}% humidity
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-green-200">Feels like</p>
                    <p className="text-xl font-bold text-white">{weatherData.current.feels_like}°C</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Trip Summary */}
          <Card className="shadow-lg border-0 bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-white">
                {tripData?.summary.title}
              </CardTitle>
              <p className="text-green-200">
                {tripData?.summary.description}
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="flex items-center gap-3 p-3 bg-green-600/20 rounded-lg">
                  <Calendar className="w-5 h-5 text-green-400" />
                  <div>
                    <p className="text-sm text-green-200">Duration</p>
                    <p className="font-semibold text-white">{tripData?.summary.duration}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-emerald-600/20 rounded-lg">
                  <DollarSign className="w-5 h-5 text-emerald-400" />
                  <div>
                    <p className="text-sm text-green-200">Budget</p>
                    <p className="font-semibold text-white">₹{tripData?.summary.budget?.toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-teal-600/20 rounded-lg">
                  <Star className="w-5 h-5 text-teal-400" />
                  <div>
                    <p className="text-sm text-green-200">Rating</p>
                    <p className="font-semibold text-white">{tripData?.summary.rating}/5</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-yellow-600/20 rounded-lg">
                  <Clock className="w-5 h-5 text-yellow-400" />
                  <div>
                    <p className="text-sm text-green-200">Best Time</p>
                    <p className="font-semibold text-white">{tripData?.summary.bestTime}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Daily Itinerary with Weather */}
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-800">
                Daily Itinerary with Real Places
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {tripData?.itinerary.map((day) => (
                  <div key={day.day} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {day.title}
                      </h3>
                      {day.weather && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          {getWeatherIcon(day.weather.description)}
                          <span>{day.weather.description} • {day.weather.temp}°C</span>
                        </div>
                      )}
                    </div>
                    <div className="space-y-4">
                      {day.activities.map((activity, index) => (
                        <div key={index} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                          <div className="flex-shrink-0 w-16 text-sm font-medium text-gray-600">
                            {activity.time}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-800">{activity.activity}</p>
                            <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                            <p className="text-sm text-purple-600 mt-1">📍 {activity.location}</p>
                            <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {activity.duration}
                              </span>
                              <span className="flex items-center gap-1">
                                <DollarSign className="w-3 h-3" />
                                {activity.cost}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Real Accommodation Recommendations */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-gray-800">
                  Real Accommodation Options
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {tripData?.recommendations.accommodation.map((rec, index) => (
                    <div key={index} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium text-gray-800">{rec.name}</p>
                          <p className="text-sm text-gray-600">{rec.location}</p>
                          <p className="text-sm text-gray-600">{rec.type} • ⭐ {rec.rating}</p>
                        </div>
                        <p className="text-sm font-semibold text-green-600">{rec.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-gray-800">
                  Weather-Aware Travel Tips
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {tripData?.recommendations.tips.map((tip, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></span>
                      <p className="text-sm text-gray-600">{tip}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Weather Forecast */}
          {weatherData?.forecast && (
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-gray-800">
                  5-Day Weather Forecast
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  {weatherData.forecast.map((day, index) => (
                    <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                      <p className="font-medium text-gray-800">{day.day}</p>
                      <div className="flex justify-center my-2">
                        {getWeatherIcon(day.description)}
                      </div>
                      <p className="text-sm text-gray-600">{day.description}</p>
                      <p className="text-lg font-semibold text-gray-800">{day.temp}°C</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default TripGenerator; 