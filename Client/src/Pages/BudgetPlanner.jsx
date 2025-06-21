import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  DollarSign, 
  Plane, 
  Calculator,
  ArrowRight,
  ArrowLeft,
  Globe,
  TrendingUp,
  MapPin,
  Calendar,
  Users,
  Star
} from 'lucide-react';
import { getDestinationImage } from '../lib/utils';

const BudgetPlanner = () => {
  const { destinationId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [budget, setBudget] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState('INR');
  const [convertedAmount, setConvertedAmount] = useState('');
  const [tripDuration, setTripDuration] = useState('5-7 days');
  const [travelers, setTravelers] = useState('2');
  const [travelStyle, setTravelStyle] = useState('balanced');
  const [isLoading, setIsLoading] = useState(false);

  const currencies = [
    { code: 'INR', name: 'Indian Rupee', symbol: '₹', flag: '🇮🇳' },
    { code: 'USD', name: 'US Dollar', symbol: '$', flag: '🇺🇸' },
    { code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺' },
    { code: 'GBP', name: 'British Pound', symbol: '£', flag: '🇬🇧' },
    { code: 'JPY', name: 'Japanese Yen', symbol: '¥', flag: '🇯🇵' },
    { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', flag: '🇦🇺' },
    { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', flag: '🇨🇦' },
    { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', flag: '🇸🇬' },
    { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ', flag: '🇦🇪' },
    { code: 'SAR', name: 'Saudi Riyal', symbol: 'ر.س', flag: '🇸🇦' }
  ];

  const travelStyles = [
    { id: 'budget', name: 'Budget-Friendly', description: 'Affordable options, hostels, public transport', icon: '💰' },
    { id: 'balanced', name: 'Balanced', description: 'Mix of comfort and value', icon: '⚖️' },
    { id: 'luxury', name: 'Luxury', description: 'Premium experiences, 5-star hotels', icon: '✨' }
  ];

  const tripDurations = [
    '3-5 days',
    '5-7 days', 
    '7-10 days',
    '10-14 days',
    '2-3 weeks',
    '1 month+'
  ];

  const travelerOptions = [
    '1',
    '2',
    '3-4',
    '5-6',
    '7+'
  ];

  // Mock exchange rates (in real app, you'd fetch from API)
  const exchangeRates = {
    INR: 1,
    USD: 0.012,
    EUR: 0.011,
    GBP: 0.0095,
    JPY: 1.8,
    AUD: 0.018,
    CAD: 0.016,
    SGD: 0.016,
    AED: 0.044,
    SAR: 0.045
  };

  const destination = location.state?.destination;

  useEffect(() => {
    if (budget && selectedCurrency) {
      const rate = exchangeRates[selectedCurrency];
      const inrAmount = parseFloat(budget) / rate;
      setConvertedAmount(inrAmount.toFixed(0));
    }
  }, [budget, selectedCurrency]);

  const handleGenerateTrip = () => {
    if (!budget || !convertedAmount) {
      alert('Please enter your budget');
      return;
    }

    setIsLoading(true);
    
    // Simulate AI processing
    setTimeout(() => {
      setIsLoading(false);
      navigate(`/generate-trip/${destinationId}`, {
        state: {
          destination,
          quizAnswers: location.state?.quizAnswers,
          budget: convertedAmount,
          currency: selectedCurrency,
          duration: tripDuration,
          travelers: travelers,
          style: travelStyle
        }
      });
    }, 2000);
  };

  const getCurrencySymbol = (code) => {
    const currency = currencies.find(c => c.code === code);
    return currency ? currency.symbol : '$';
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

      {/* Header */}
      <div className="bg-white/10 backdrop-blur-md border-b border-white/20 sticky top-0 z-50 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={() => navigate(-1)} className="text-white hover:text-green-200">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div className="flex items-center space-x-2">
                <Calculator className="h-6 w-6 text-green-400" />
                <h1 className="text-xl font-semibold text-white">Budget Planner</h1>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Globe className="h-5 w-5 text-green-400" />
              <span className="text-white text-sm">AI-Powered Trip Planning</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-20">
        {/* Welcome Section */}
        <div className="text-center mb-8 animate-fade-in">
          <h2 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">
            Plan Your Perfect Trip
          </h2>
          <p className="text-green-100 text-lg drop-shadow-md max-w-2xl mx-auto">
            Tell us about your budget and preferences, and our AI will create a personalized itinerary just for you!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Budget Input Section */}
          <div className="space-y-6">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <DollarSign className="h-5 w-5 mr-2 text-green-400" />
                  Your Budget
                </CardTitle>
                <CardDescription className="text-green-200">
                  Enter your budget and we'll convert it to INR for planning
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Currency Selection */}
                <div>
                  <Label className="text-white mb-2 block">Select Currency</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {currencies.map((currency) => (
                      <button
                        key={currency.code}
                        onClick={() => setSelectedCurrency(currency.code)}
                        className={`p-3 rounded-lg border transition-all duration-300 ${
                          selectedCurrency === currency.code
                            ? 'bg-green-600 border-green-500 text-white'
                            : 'bg-white/20 border-white/30 text-white hover:bg-white/30'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">{currency.flag}</span>
                          <span className="font-medium">{currency.code}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Budget Input */}
                <div>
                  <Label className="text-white mb-2 block">Budget Amount</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-400 font-medium">
                      {getCurrencySymbol(selectedCurrency)}
                    </span>
                    <Input
                      type="number"
                      placeholder="Enter your budget"
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                      className="pl-8 bg-white/20 border-white/30 text-white placeholder-green-200 focus:ring-green-400"
                    />
                  </div>
                </div>

                {/* Converted Amount Display */}
                {convertedAmount && (
                  <div className="bg-green-600/20 border border-green-500/30 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-green-200">Converted to INR:</span>
                      <span className="text-white font-bold text-lg">₹{parseInt(convertedAmount).toLocaleString()}</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Trip Preferences */}
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-green-400" />
                  Trip Preferences
                </CardTitle>
                <CardDescription className="text-green-200">
                  Help us understand your travel style
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Trip Duration */}
                <div>
                  <Label className="text-white mb-2 block">Trip Duration</Label>
                  <select
                    value={tripDuration}
                    onChange={(e) => setTripDuration(e.target.value)}
                    className="w-full p-3 bg-white/20 border border-white/30 rounded-lg text-white focus:ring-green-400 focus:border-green-400"
                  >
                    {tripDurations.map((duration) => (
                      <option key={duration} value={duration} className="bg-gray-800">
                        {duration}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Number of Travelers */}
                <div>
                  <Label className="text-white mb-2 block">Number of Travelers</Label>
                  <select
                    value={travelers}
                    onChange={(e) => setTravelers(e.target.value)}
                    className="w-full p-3 bg-white/20 border border-white/30 rounded-lg text-white focus:ring-green-400 focus:border-green-400"
                  >
                    {travelerOptions.map((option) => (
                      <option key={option} value={option} className="bg-gray-800">
                        {option} {option === '1' ? 'person' : 'people'}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Travel Style */}
                <div>
                  <Label className="text-white mb-2 block">Travel Style</Label>
                  <div className="space-y-2">
                    {travelStyles.map((style) => (
                      <button
                        key={style.id}
                        onClick={() => setTravelStyle(style.id)}
                        className={`w-full p-3 rounded-lg border transition-all duration-300 text-left ${
                          travelStyle === style.id
                            ? 'bg-green-600 border-green-500 text-white'
                            : 'bg-white/20 border-white/30 text-white hover:bg-white/30'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <span className="text-xl">{style.icon}</span>
                          <div>
                            <div className="font-medium">{style.name}</div>
                            <div className="text-sm opacity-80">{style.description}</div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Preview and Generate Section */}
          <div className="space-y-6">
            {/* Budget Summary */}
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-green-400" />
                  Budget Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
                    <span className="text-green-200">Budget:</span>
                    <span className="text-white font-bold">
                      {getCurrencySymbol(selectedCurrency)}{parseInt(budget || 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
                    <span className="text-green-200">Duration:</span>
                    <span className="text-white font-bold">{tripDuration}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
                    <span className="text-green-200">Travelers:</span>
                    <span className="text-white font-bold">{travelers}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
                    <span className="text-green-200">Style:</span>
                    <span className="text-white font-bold capitalize">{travelStyle}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* AI Features Preview */}
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Plane className="h-5 w-5 mr-2 text-green-400" />
                  What You'll Get
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                      <MapPin className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-white">Personalized itinerary</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                      <Calendar className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-white">Day-by-day planning</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                      <DollarSign className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-white">Budget-optimized suggestions</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                      <Star className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-white">Local recommendations</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Generate Button */}
            <Button
              onClick={handleGenerateTrip}
              disabled={!budget || isLoading}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-4 text-lg transition-all duration-300 hover:scale-105 shadow-2xl hover:shadow-3xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Generating Your Trip...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <span>Generate AI Trip Plan</span>
                  <ArrowRight className="w-5 h-5" />
                </div>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetPlanner; 