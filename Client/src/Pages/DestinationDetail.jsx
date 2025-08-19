import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import { MapPin, Calendar, Users, Star, Heart, ArrowLeft } from 'lucide-react';
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
    setShowQuiz(true);
  };

  const handleQuizSubmit = async () => {
    try {
      // Create trip with quiz answers
      const tripData = {
        destinationId: destination._id,
        startDate: new Date(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        itinerary: [
          {
            day: 1,
            activities: ['Arrival and check-in', 'Explore local area'],
            mapLink: ''
          },
          {
            day: 2,
            activities: ['Visit main attractions', 'Local cuisine experience'],
            mapLink: ''
          },
          {
            day: 3,
            activities: ['Cultural activities', 'Shopping'],
            mapLink: ''
          }
        ]
      };

      const trip = await tripApiService.createTrip(tripData);

      toast.success('Trip planned successfully!');
      navigate(`/itinerary/${trip._id}`); // Navigate to specific itinerary
    } catch (error) {
      toast.error('Failed to create trip');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (!destination) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Destination not found</h2>
          <Button onClick={() => navigate('/destinations')}>
            Back to Destinations
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/destinations')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Destinations
          </Button>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative h-96 bg-gray-900">
        {destination.images && destination.images[0] && (
          <img
            src={destination.images[0]}
            alt={destination.name}
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-white">
            <h1 className="text-4xl font-bold mb-2">{destination.name}</h1>
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <MapPin className="h-5 w-5 mr-1" />
                <span>{destination.location}, {destination.country}</span>
              </div>
              {destination.rating > 0 && (
                <div className="flex items-center">
                  <Star className="h-5 w-5 mr-1 text-yellow-400" />
                  <span>{destination.rating.toFixed(1)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>About {destination.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{destination.description}</p>
              </CardContent>
            </Card>

            {/* Activities */}
            {destination.activities && destination.activities.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Activities</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {destination.activities.map((activity, index) => (
                      <Badge key={index} variant="secondary">
                        {activity}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Popular Attractions */}
            {destination.popularAttractions && destination.popularAttractions.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Popular Attractions</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {destination.popularAttractions.map((attraction, index) => (
                      <li key={index} className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-emerald-500" />
                        {attraction}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Trip Planning */}
            <Card>
              <CardHeader>
                <CardTitle>Plan Your Trip</CardTitle>
                <CardDescription>
                  Create a personalized itinerary for {destination.name}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {destination.bestSeason && (
                  <div>
                    <h4 className="font-medium mb-2">Best Season</h4>
                    <p className="text-sm text-gray-600">{destination.bestSeason}</p>
                  </div>
                )}
                <Button onClick={handlePlanTrip} className="w-full">
                  <Calendar className="h-4 w-4 mr-2" />
                  Plan Trip
                </Button>
              </CardContent>
            </Card>

            {/* Quick Quiz Modal */}
            {showQuiz && (
              <Card>
                <CardHeader>
                  <CardTitle>Quick Planning Quiz</CardTitle>
                  <CardDescription>
                    Help us create the perfect itinerary for you
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      What's your travel style?
                    </label>
                    <select 
                      className="w-full p-2 border rounded-md"
                      onChange={(e) => setQuizAnswers({...quizAnswers, style: e.target.value})}
                    >
                      <option value="">Select...</option>
                      <option value="adventure">Adventure</option>
                      <option value="culture">Culture</option>
                      <option value="relaxation">Relaxation</option>
                      <option value="luxury">Luxury</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Trip duration?
                    </label>
                    <select 
                      className="w-full p-2 border rounded-md"
                      onChange={(e) => setQuizAnswers({...quizAnswers, duration: e.target.value})}
                    >
                      <option value="">Select...</option>
                      <option value="weekend">Weekend (2-3 days)</option>
                      <option value="week">Week (7 days)</option>
                      <option value="extended">Extended (10+ days)</option>
                    </select>
                  </div>

                  <div className="flex space-x-2">
                    <Button variant="outline" onClick={() => setShowQuiz(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleQuizSubmit} className="flex-1">
                      Create Trip
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DestinationDetail;
