import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { Textarea } from "@/Components/ui/textarea";
import { Badge } from "@/Components/ui/badge";
import { Plus, Edit, Trash2, MapPin, Calendar, Save, ArrowLeft, Cloud, Globe, Sparkles, Zap, Trash } from 'lucide-react';
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
        toast.success('Neural records updated!');
      } else {
        toast.info('Synthesize mission first to save changes.');
      }
    } catch (error) {
      toast.error('Synchronization failed.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#4facfe] to-[#00f2fe] dark:from-slate-900 dark:to-slate-950">
        <div className="w-24 h-24 border-8 border-white/20 border-t-white rounded-full animate-spin shadow-2xl"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-[#4facfe] to-[#00f2fe] dark:from-slate-900 dark:to-slate-950 transition-colors duration-500 font-sans">

      {/* Decorative Clouds */}
      <div className="absolute top-20 left-[10%] opacity-30 dark:opacity-10 animate-float pointer-events-none z-0">
        <Cloud className="w-32 h-32 text-white fill-white drop-shadow-2xl" />
      </div>
      <div className="absolute top-60 right-[5%] opacity-20 dark:opacity-5 animate-float animation-delay-2000 pointer-events-none z-0">
        <Cloud className="w-48 h-48 text-white fill-white drop-shadow-2xl" />
      </div>

      {/* Night Mode Stars */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none hidden dark:block z-0">
        {[...Array(30)].map((_, i) => (
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
        {/* Navigation Bar */}
        <nav className="bg-white/10 backdrop-blur-2xl border-b border-white/20 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">
              <div className="flex items-center space-x-6">
                <Button
                  variant="ghost"
                  onClick={() => navigate('/dashboard')}
                  className="text-white hover:bg-white/20 rounded-full font-black px-6 transition-all"
                >
                  <ArrowLeft className="h-5 w-5 mr-2 stroke-[3px]" />
                  Base
                </Button>
                <div className="flex items-center space-x-3">
                  <span className="bg-white p-2 rounded-xl shadow-xl transform rotate-6">
                    <Globe className="h-6 w-6 text-blue-600" />
                  </span>
                  <h1 className="text-2xl font-black text-white tracking-tighter uppercase italic">Mission Log</h1>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <Button onClick={addDay} variant="outline" className="bg-white/10 border-white/20 text-white rounded-full font-black hover:bg-white hover:text-blue-600 px-6 h-12 transition-all">
                  <Plus className="w-5 h-5 mr-2" /> Add Log
                </Button>
                <Button onClick={saveItinerary} className="bg-black hover:bg-blue-600 text-white rounded-full font-black px-10 h-12 shadow-xl transition-all hover:scale-105 uppercase tracking-tighter italic">
                  <Save className="w-5 h-5 mr-2" /> Commit Changes
                </Button>
              </div>
            </div>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header Info */}
          <div className="mb-12">
            <h2 className="text-6xl md:text-8xl font-black text-white mb-4 tracking-tighter drop-shadow-2xl transform -rotate-1">
              {trip.destinationId.name} <br /> <span className="text-4xl md:text-6xl opacity-80 uppercase italic">Itinerary Edit</span>
            </h2>
            <div className="flex items-center gap-4 bg-white/20 backdrop-blur-md px-6 py-3 rounded-full border border-white/20 text-white font-black w-fit shadow-2xl">
              <Calendar className="h-6 w-6 text-blue-300" />
              <span className="text-xl tracking-tight">
                {new Date(trip.startDate).toLocaleDateString()} — {new Date(trip.endDate).toLocaleDateString()}
              </span>
            </div>
          </div>

          <div className="space-y-12">
            {trip.itinerary.map((day, dayIndex) => (
              <Card key={dayIndex} className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl rounded-[50px] shadow-3xl border border-white/40 dark:border-slate-800 overflow-hidden transform hover:scale-[1.01] transition-all duration-500">
                <CardHeader className="p-10 md:p-14 bg-gradient-to-r from-gray-50 to-transparent dark:from-slate-800/50">
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 bg-black dark:bg-white text-white dark:text-black rounded-[24px] flex items-center justify-center font-black text-3xl shadow-2xl transform -rotate-6">
                        {day.day}
                      </div>
                      <div>
                        <span className="text-sm font-black text-blue-600 dark:text-blue-400 uppercase tracking-[0.3em] italic">Mission Segment</span>
                        <h4 className="text-4xl font-black text-gray-900 dark:text-white uppercase tracking-tighter italic">Day Operation</h4>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => setEditingDay(editingDay === dayIndex ? null : dayIndex)}
                      className="rounded-full border-2 border-blue-600 text-blue-600 font-black hover:bg-blue-600 hover:text-white px-8 h-14 text-lg transition-all shadow-xl"
                    >
                      <Plus className="h-6 w-6 mr-2 stroke-[3px]" />
                      New Task
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-10 md:p-14 pt-0">
                  <div className="space-y-6">
                    {day.activities.map((activity, activityIndex) => (
                      <div key={activityIndex} className="flex items-center justify-between p-8 bg-gray-50 dark:bg-slate-800/50 rounded-[32px] border-2 border-transparent hover:border-blue-500/20 hover:bg-white dark:hover:bg-slate-800 transition-all group">
                        <div className="flex items-center gap-6">
                          <div className="w-3 h-3 rounded-full bg-blue-600 animate-pulse"></div>
                          <span className="text-2xl font-bold text-gray-700 dark:text-gray-200 group-hover:text-blue-600 transition-colors">{activity}</span>
                        </div>
                        <Button
                          variant="ghost"
                          onClick={() => removeActivity(dayIndex, activityIndex)}
                          className="w-14 h-14 rounded-2xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all opacity-0 group-hover:opacity-100"
                        >
                          <Trash className="h-7 w-7" />
                        </Button>
                      </div>
                    ))}

                    {editingDay === dayIndex && (
                      <div className="flex flex-col md:flex-row gap-4 mt-12 bg-blue-50/50 dark:bg-blue-900/10 p-8 rounded-[40px] border-2 border-blue-100 dark:border-blue-900/30 animate-fade-in-up">
                        <Input
                          placeholder="What's the next objective?"
                          value={newActivity}
                          onChange={(e) => setNewActivity(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && addActivity(dayIndex)}
                          className="flex-1 bg-white dark:bg-slate-800 h-16 rounded-2xl px-6 text-xl font-medium border-2 border-transparent focus:border-blue-500 shadow-xl"
                        />
                        <div className="flex gap-4">
                          <Button onClick={() => addActivity(dayIndex)} className="h-16 px-10 rounded-2xl bg-black dark:bg-white text-white dark:text-black font-black text-xl uppercase italic shadow-2xl hover:scale-105 transition-all">
                            Deploy
                          </Button>
                          <Button variant="ghost" onClick={() => setEditingDay(null)} className="h-16 px-8 rounded-2xl font-black text-gray-400 hover:text-red-500 transition-all">
                            Abort
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Quick Actions Footer */}
          <div className="mt-20 flex flex-col md:flex-row items-center justify-center gap-8">
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate(`/journal/${trip._id}`)}
              className="bg-white/10 backdrop-blur-md border-2 border-white/20 text-white rounded-full px-12 py-10 text-2xl font-black hover:bg-white hover:text-black transition-all shadow-2xl uppercase italic tracking-tighter"
            >
              Secure Journal <Zap className="ml-4 w-8 h-8 text-yellow-400" />
            </Button>
            <Button
              size="lg"
              onClick={() => navigate('/experience-discovery')}
              className="bg-black dark:bg-white text-white dark:text-black rounded-full px-12 py-10 text-2xl font-black hover:bg-blue-600 hover:text-white transition-all shadow-2xl uppercase italic tracking-tighter scale-110"
            >
              Scout Intel <ArrowLeft className="ml-4 w-8 h-8 rotate-180 stroke-[3px]" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItineraryView;
