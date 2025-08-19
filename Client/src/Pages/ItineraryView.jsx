import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { Textarea } from "@/Components/ui/textarea";
import { Badge } from "@/Components/ui/badge";
import { Plus, Edit, Trash2, MapPin, Calendar, Save, ArrowLeft } from 'lucide-react';
import { tripApiService } from '../services/tripApiService';
import { toast } from 'react-hot-toast';

const ItineraryView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingDay, setEditingDay] = useState(null);
  const [newActivity, setNewActivity] = useState('');

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        if (id) {
          const tripData = await tripApiService.getTrip(id);
          setTrip(tripData);
        } else {
          // If no ID, show a default/new trip view
          const mockTrip = {
            _id: 'new',
            destinationId: {
              name: 'Sample Destination',
              country: 'Country',
              images: ['https://images.unsplash.com/photo-1502602898536-47ad22581b52']
            },
            startDate: new Date(),
            endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            itinerary: [
              {
                day: 1,
                activities: ['Arrival and check-in at hotel', 'Walk around city center', 'Dinner at local restaurant'],
                mapLink: ''
              },
              {
                day: 2,
                activities: ['Visit main attractions', 'Local cuisine experience', 'Cultural activities'],
                mapLink: ''
              },
              {
                day: 3,
                activities: ['Shopping and souvenirs', 'Final sightseeing', 'Departure preparation'],
                mapLink: ''
              }
            ]
          };
          setTrip(mockTrip);
        }
      } catch (error) {
        toast.error('Failed to load trip details');
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchTrip();
  }, [id, navigate]);

  const addDay = () => {
    if (!trip) return;
    
    const newDay = {
      day: trip.itinerary.length + 1,
      activities: [],
      mapLink: ''
    };
    
    setTrip({
      ...trip,
      itinerary: [...trip.itinerary, newDay]
    });
  };

  const addActivity = (dayIndex) => {
    if (!newActivity.trim()) return;
    
    const updatedItinerary = [...trip.itinerary];
    updatedItinerary[dayIndex].activities.push(newActivity.trim());
    
    setTrip({
      ...trip,
      itinerary: updatedItinerary
    });
    
    setNewActivity('');
    setEditingDay(null);
  };

  const removeActivity = (dayIndex, activityIndex) => {
    const updatedItinerary = [...trip.itinerary];
    updatedItinerary[dayIndex].activities.splice(activityIndex, 1);
    
    setTrip({
      ...trip,
      itinerary: updatedItinerary
    });
  };

  const saveItinerary = async () => {
    try {
      if (trip._id !== 'new') {
        await tripApiService.updateTrip(trip._id, { itinerary: trip.itinerary });
        toast.success('Itinerary saved successfully!');
      } else {
        toast.info('Please create a trip first to save the itinerary');
      }
    } catch (error) {
      toast.error('Failed to save itinerary');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Trip not found</h2>
          <Button onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <Button
                variant="ghost"
                onClick={() => navigate('/dashboard')}
                className="mb-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <h1 className="text-3xl font-bold text-gray-900">
                {trip.destinationId.name} Itinerary
              </h1>
              <div className="flex items-center mt-2 text-gray-600">
                <Calendar className="h-4 w-4 mr-2" />
                <span>
                  {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
                </span>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button onClick={addDay} variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add Day
              </Button>
              <Button onClick={saveItinerary}>
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Itinerary Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {trip.itinerary.map((day, dayIndex) => (
            <Card key={dayIndex}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Day {day.day}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingDay(editingDay === dayIndex ? null : dayIndex)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Activity
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {day.activities.map((activity, activityIndex) => (
                    <div key={activityIndex} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="flex-1">{activity}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeActivity(dayIndex, activityIndex)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  
                  {editingDay === dayIndex && (
                    <div className="flex space-x-2 mt-4">
                      <Input
                        placeholder="Enter new activity..."
                        value={newActivity}
                        onChange={(e) => setNewActivity(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && addActivity(dayIndex)}
                        className="flex-1"
                      />
                      <Button onClick={() => addActivity(dayIndex)}>
                        Add
                      </Button>
                      <Button variant="outline" onClick={() => setEditingDay(null)}>
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-center space-x-4">
          <Button 
            variant="outline" 
            onClick={() => navigate(`/journal/${trip._id}`)}
          >
            Open Journal
          </Button>
          <Button 
            onClick={() => navigate('/experience-discovery')}
          >
            Discover Experiences
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ItineraryView;
