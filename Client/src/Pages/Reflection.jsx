import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import { Calendar, TrendingUp, Heart, MapPin, ArrowLeft } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { journalService } from '../services/journalService';
import { toast } from 'react-hot-toast';

const Reflection = () => {
  const navigate = useNavigate();
  const [journalData, setJournalData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJournalData = async () => {
      try {
        const data = await journalService.getJournalAnalytics();
        setJournalData(data);
      } catch (error) {
        // If no data available, use mock data
        const mockData = {
          trips: [
            {
              id: '1',
              destination: 'Paris, France',
              startDate: '2024-01-15',
              endDate: '2024-01-22',
              totalEntries: 8,
              averageMood: 4.2,
              entries: [
                { date: '2024-01-15', mood: 5, title: 'Arrival in Paris' },
                { date: '2024-01-16', mood: 4, title: 'Eiffel Tower Visit' },
                { date: '2024-01-17', mood: 3, title: 'Rainy Day at Louvre' },
                { date: '2024-01-18', mood: 5, title: 'Montmartre Adventure' },
                { date: '2024-01-19', mood: 4, title: 'Seine River Cruise' },
                { date: '2024-01-20', mood: 4, title: 'Versailles Day Trip' },
                { date: '2024-01-21', mood: 5, title: 'Cooking Class' },
                { date: '2024-01-22', mood: 3, title: 'Departure Day' }
              ]
            },
            {
              id: '2',
              destination: 'Tokyo, Japan',
              startDate: '2024-03-10',
              endDate: '2024-03-17',
              totalEntries: 6,
              averageMood: 4.5,
              entries: [
                { date: '2024-03-10', mood: 5, title: 'Tokyo Arrival' },
                { date: '2024-03-11', mood: 4, title: 'Shibuya Crossing' },
                { date: '2024-03-12', mood: 5, title: 'Temple Visits' },
                { date: '2024-03-13', mood: 4, title: 'Sushi Making' },
                { date: '2024-03-14', mood: 5, title: 'Mount Fuji Day' },
                { date: '2024-03-17', mood: 4, title: 'Sayonara Tokyo' }
              ]
            }
          ],
          moodTrends: [
            { month: 'Jan', averageMood: 4.2, entries: 8 },
            { month: 'Feb', averageMood: 0, entries: 0 },
            { month: 'Mar', averageMood: 4.5, entries: 6 },
            { month: 'Apr', averageMood: 0, entries: 0 },
            { month: 'May', averageMood: 0, entries: 0 },
            { month: 'Jun', averageMood: 0, entries: 0 }
          ],
          totalTrips: 2,
          totalEntries: 14,
          averageOverallMood: 4.35,
          favoriteDestinations: ['Paris, France', 'Tokyo, Japan'],
          mostActiveMonth: 'January'
        };

        setJournalData(mockData);
        toast.info('Using sample data - start journaling to see your personal insights!');
      } finally {
        setLoading(false);
      }
    };

    fetchJournalData();
  }, []);

  const getMoodEmoji = (mood) => {
    const moods = {
      1: '😢',
      2: '😕',
      3: '😐',
      4: '😊',
      5: '😍'
    };
    return moods[Math.round(mood)] || '😐';
  };

  const getMoodColor = (mood) => {
    if (mood >= 4.5) return 'text-emerald-600';
    if (mood >= 3.5) return 'text-green-600';
    if (mood >= 2.5) return 'text-yellow-600';
    if (mood >= 1.5) return 'text-orange-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (!journalData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">No journal data found</h2>
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
          <Button
            variant="ghost"
            onClick={() => navigate('/dashboard')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Travel Reflection
          </h1>
          <p className="text-gray-600">
            Insights and memories from your travel journeys
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <MapPin className="h-8 w-8 text-emerald-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Trips</p>
                  <p className="text-2xl font-bold text-gray-900">{journalData.totalTrips}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Journal Entries</p>
                  <p className="text-2xl font-bold text-gray-900">{journalData.totalEntries}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Heart className="h-8 w-8 text-red-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Average Mood</p>
                  <p className={`text-2xl font-bold ${getMoodColor(journalData.averageOverallMood)}`}>
                    {getMoodEmoji(journalData.averageOverallMood)} {journalData.averageOverallMood.toFixed(1)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Most Active</p>
                  <p className="text-2xl font-bold text-gray-900">{journalData.mostActiveMonth}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Mood Timeline */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Mood Timeline</CardTitle>
            <CardDescription>
              Track your emotional journey throughout your travels
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={journalData.moodTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis domain={[0, 5]} />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="averageMood" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Trip Summaries */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {journalData.trips.map((trip) => (
            <Card key={trip.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{trip.destination}</span>
                  <Badge className={getMoodColor(trip.averageMood)}>
                    {getMoodEmoji(trip.averageMood)} {trip.averageMood.toFixed(1)}
                  </Badge>
                </CardTitle>
                <CardDescription>
                  {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Journal Entries:</span>
                    <span className="font-medium">{trip.totalEntries}</span>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Daily Mood</h4>
                    <ResponsiveContainer width="100%" height={100}>
                      <BarChart data={trip.entries}>
                        <XAxis dataKey="date" hide />
                        <YAxis domain={[0, 5]} hide />
                        <Tooltip 
                          labelFormatter={(value) => new Date(value).toLocaleDateString()}
                          formatter={(value, name) => [`${getMoodEmoji(value)} ${value}`, 'Mood']}
                        />
                        <Bar dataKey="mood" fill="#10b981" radius={[2, 2, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Highlights</h4>
                    <div className="space-y-1">
                      {trip.entries
                        .filter(entry => entry.mood >= 4)
                        .slice(0, 3)
                        .map((entry, index) => (
                          <div key={index} className="text-sm text-gray-600">
                            • {entry.title}
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Insights */}
        <Card>
          <CardHeader>
            <CardTitle>Travel Insights</CardTitle>
            <CardDescription>
              Patterns and discoveries from your travel experiences
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Favorite Destinations</h4>
                <div className="space-y-2">
                  {journalData.favoriteDestinations.map((destination, index) => (
                    <div key={index} className="flex items-center">
                      <Heart className="h-4 w-4 text-red-500 mr-2" />
                      <span className="text-gray-700">{destination}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Travel Patterns</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>• You tend to be happiest during cultural activities</p>
                  <p>• Your mood peaks in the middle of trips</p>
                  <p>• You write most entries during exciting experiences</p>
                  <p>• Spring and winter are your preferred travel seasons</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Reflection;
