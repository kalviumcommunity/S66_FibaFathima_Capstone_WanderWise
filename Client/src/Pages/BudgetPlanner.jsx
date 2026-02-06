import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
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
  Star,
  Cloud,
  ChevronRight,
  Wallet,
  Sparkles
} from 'lucide-react';
import { getDestinationImage } from '../lib/utils';
import { destinationService } from '../services/destinationService';

const BudgetPlanner = () => {
  const { destinationId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [destination, setDestination] = useState(null);

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
    { id: 'budget', name: 'Budget-Friendly', description: 'Affordable options, hostels', icon: '💰' },
    { id: 'balanced', name: 'Balanced', description: 'Mix of comfort and value', icon: '⚖️' },
    { id: 'luxury', name: 'Luxury', description: 'Premium 5-star experiences', icon: '✨' }
  ];

  const tripDurations = [
    '3-5 days', '5-7 days', '7-10 days', '10-14 days', '2-3 weeks', '1 month+'
  ];

  const travelerOptions = [
    '1', '2', '3-4', '5-6', '7+'
  ];

  const exchangeRates = {
    INR: 1, USD: 0.012, EUR: 0.011, GBP: 0.0095, JPY: 1.8,
    AUD: 0.018, CAD: 0.016, SGD: 0.016, AED: 0.044, SAR: 0.045
  };

  useEffect(() => {
    if (destinationId) {
      destinationService.getDestinationById(destinationId)
        .then(setDestination)
        .catch(console.error);
    }
  }, [destinationId]);

  useEffect(() => {
    if (budget && selectedCurrency) {
      const rate = exchangeRates[selectedCurrency];
      const inrAmount = parseFloat(budget) / rate;
      setConvertedAmount(inrAmount.toFixed(0));
    }
  }, [budget, selectedCurrency]);

  const handleGenerateTrip = () => {
    if (!budget || !convertedAmount) {
      return;
    }

    setIsLoading(true);
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

  const bgImage = getDestinationImage(destination?.name) || 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200';

  if (!destination) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#4facfe] to-[#00f2fe] text-white p-6 text-center">
        <Cloud className="w-24 h-24 mb-6 animate-float opacity-50" />
        <h2 className="text-4xl font-black mb-4 tracking-tighter">No destination selected</h2>
        <p className="text-xl mb-8 font-medium">Please select a destination to start your journey.</p>
        <Button onClick={() => navigate('/')} className="bg-white text-blue-600 hover:bg-white/90 rounded-full px-12 py-8 text-2xl font-black shadow-2xl transition-all hover:scale-105">
          Go Home
        </Button>
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

      {/* Content wrapper */}
      <div className="relative z-10">
        {/* Navigation Bar */}
        <nav className="bg-white/10 backdrop-blur-2xl border-b border-white/20 sticky top-0 z-50 transition-all">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">
              <div className="flex items-center space-x-6">
                <Button
                  variant="ghost"
                  onClick={() => navigate(-1)}
                  className="text-white hover:bg-white/20 rounded-full font-black px-6 transition-all"
                >
                  <ArrowLeft className="h-5 w-5 mr-2 stroke-[3px]" />
                  Back
                </Button>
                <div className="flex items-center space-x-3 group">
                  <div className="bg-white p-2 rounded-xl shadow-xl transform group-hover:rotate-6 transition-transform">
                    <Wallet className="h-6 w-6 text-blue-600" />
                  </div>
                  <h1 className="text-2xl font-black text-white tracking-tighter uppercase italic">Budget Planner</h1>
                </div>
              </div>
              <div className="flex items-center space-x-4 bg-white/20 px-4 py-2 rounded-full border border-white/20">
                <Sparkles className="h-5 w-5 text-yellow-400 fill-yellow-400 animate-pulse" />
                <span className="text-white text-sm font-black tracking-widest uppercase">AI Logic Active</span>
              </div>
            </div>
          </div>
        </nav>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
          {/* Hero Section */}
          <div className="text-center mb-16 relative">
            <h2 className="text-6xl md:text-8xl font-black text-white mb-6 drop-shadow-2xl tracking-tighter leading-tight transform -rotate-1">
              Your Dream Trip <br className="hidden md:block" /> Starts Here.
            </h2>
            <p className="text-white/90 text-2xl font-bold tracking-tight max-w-2xl mx-auto drop-shadow-lg italic">
              "Set your budget, pick your style, and let the magic happen."
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Left Column: Form Sections */}
            <div className="space-y-10">
              <Card className="bg-white/90 backdrop-blur-xl border border-[#D6E9FF] rounded-[40px] shadow-xl overflow-hidden transform transition-all hover:scale-[1.01]">
                <CardHeader className="p-10 pb-4">
                  <CardTitle className="text-3xl font-black text-gray-900 flex items-center tracking-tighter uppercase italic">
                    <div className="p-3 bg-blue-100 dark:bg-blue-100/50 rounded-2xl mr-4">
                      <DollarSign className="h-8 w-8 text-blue-600" />
                    </div>
                    Financial Power
                  </CardTitle>
                  <CardDescription className="text-lg font-bold text-gray-500">
                    What's your total spending limit for this mission?
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-10 pt-4 space-y-8">
                  {/* Currency Selection Grid */}
                  <div>
                    <Label className="text-sm font-black text-gray-400 uppercase tracking-[0.2em] mb-4 block">Select Currency</Label>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                      {currencies.map((currency) => (
                        <button
                          key={currency.code}
                          onClick={() => setSelectedCurrency(currency.code)}
                          className={`p-4 rounded-2xl border-2 transition-all duration-300 transform font-bold flex flex-col items-center justify-center ${selectedCurrency === currency.code
                            ? 'bg-blue-600 border-blue-500 text-white shadow-xl -translate-y-1'
                            : 'bg-gray-100/50 dark:bg-slate-800/50 border-transparent text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 hover:border-blue-300'
                            }`}
                        >
                          <span className="text-2xl mb-1">{currency.flag}</span>
                          <span className="text-xs tracking-tighter">{currency.code}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Budget Input Section */}
                  <div>
                    <Label className="text-sm font-black text-gray-400 uppercase tracking-[0.2em] mb-4 block">Amount Limit</Label>
                    <div className="relative group">
                      <span className="absolute left-6 top-1/2 transform -translate-y-1/2 text-3xl font-black text-blue-600 dark:text-blue-400 group-focus-within:scale-110 transition-transform">
                        {getCurrencySymbol(selectedCurrency)}
                      </span>
                      <Input
                        type="number"
                        placeholder="0.00"
                        value={budget}
                        onChange={(e) => setBudget(e.target.value)}
                        className="pl-20 h-24 bg-gray-50/50 dark:bg-gray-50/50 border-2 border-transparent focus:border-blue-500 rounded-3xl text-4xl font-black text-gray-900 transition-all shadow-inner"
                      />
                    </div>
                  </div>

                  {/* Converted Display Card */}
                  {convertedAmount && (
                    <div className="bg-gradient-to-r from-blue-600 to-blue-400 rounded-[32px] p-8 shadow-2xl relative overflow-hidden group">
                      <Sparkles className="absolute -right-4 -top-4 w-24 h-24 text-white/10 rotate-12 group-hover:scale-110 transition-transform" />
                      <div className="flex items-center justify-between relative z-10">
                        <span className="text-white/80 font-black uppercase tracking-widest text-sm italic">In Local Currency (INR)</span>
                        <span className="text-white font-black text-4xl tracking-tighter drop-shadow-lg">₹{parseInt(convertedAmount).toLocaleString()}</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-white/90 backdrop-blur-xl border border-[#D6E9FF] rounded-[40px] shadow-xl overflow-hidden transform transition-all hover:scale-[1.01]">
                <CardHeader className="p-10 pb-4">
                  <CardTitle className="text-3xl font-black text-gray-900 flex items-center tracking-tighter uppercase italic">
                    <div className="p-3 bg-purple-100 dark:bg-purple-100/50 rounded-2xl mr-4">
                      <Calendar className="h-8 w-8 text-purple-600" />
                    </div>
                    Mission Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-10 pt-4 space-y-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <Label className="text-sm font-black text-gray-400 uppercase tracking-[0.2em] mb-4 block">Total Days</Label>
                      <select
                        value={tripDuration}
                        onChange={(e) => setTripDuration(e.target.value)}
                        className="w-full h-16 bg-gray-50/50 dark:bg-gray-50/50 border-2 border-transparent focus:border-purple-500 rounded-2xl text-xl font-black text-gray-900 px-6 transition-all appearance-none cursor-pointer"
                      >
                        {tripDurations.map((duration) => (
                          <option key={duration} value={duration} className="bg-white">{duration}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <Label className="text-sm font-black text-gray-400 uppercase tracking-[0.2em] mb-4 block">Squad Size</Label>
                      <select
                        value={travelers}
                        onChange={(e) => setTravelers(e.target.value)}
                        className="w-full h-16 bg-gray-50/50 dark:bg-gray-50/50 border-2 border-transparent focus:border-purple-500 rounded-2xl text-xl font-black text-gray-900 px-6 transition-all appearance-none cursor-pointer"
                      >
                        {travelerOptions.map((option) => (
                          <option key={option} value={option} className="bg-white">{option} {option === '1' ? 'Lone Wolf' : 'Travelers'}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-black text-gray-400 uppercase tracking-[0.2em] mb-4 block">Vibe & Style</Label>
                    <div className="grid grid-cols-1 gap-4">
                      {travelStyles.map((style) => (
                        <button
                          key={style.id}
                          onClick={() => setTravelStyle(style.id)}
                          className={`p-6 rounded-[24px] border-2 transition-all duration-500 text-left flex items-center group relative overflow-hidden ${travelStyle === style.id
                            ? 'bg-purple-600 border-purple-500 text-white shadow-2xl scale-[1.02]'
                            : 'bg-gray-50/50 dark:bg-slate-800/50 border-transparent text-gray-900 dark:text-white hover:bg-white dark:hover:bg-slate-800 hover:border-purple-300'
                            }`}
                        >
                          <span className="text-4xl mr-6 group-hover:scale-125 transition-transform duration-500">{style.icon}</span>
                          <div>
                            <div className="text-xl font-black italic tracking-tight">{style.name}</div>
                            <div className={`text-sm font-medium ${travelStyle === style.id ? 'text-white/80' : 'text-gray-500'}`}>{style.description}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column: Preview & Action */}
            <div className="lg:sticky lg:top-32 space-y-10">
              {/* Destination Teaser */}
              <div className="relative rounded-[40px] overflow-hidden group shadow-3xl aspect-[4/3] border-4 border-white">
                <img src={bgImage} alt={destination?.name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
                <div className="absolute bottom-10 left-10">
                  <Badge className="mb-4 bg-white/20 backdrop-blur-md text-white border-white/20 font-black tracking-widest px-4 py-2 text-sm uppercase italic">Selected Mission</Badge>
                  <h3 className="text-5xl font-black text-white tracking-tighter drop-shadow-xl">{destination?.name}</h3>
                  <div className="flex items-center text-white/90 font-bold mt-2 text-xl">
                    <MapPin className="h-5 w-5 mr-2 text-blue-400 fill-blue-400" />
                    <span>Adventure Location</span>
                  </div>
                </div>
              </div>

              {/* Action Button Section */}
              <div className="space-y-6">
                <Button
                  onClick={handleGenerateTrip}
                  disabled={!budget || isLoading}
                  className={`w-full py-12 text-3xl font-black rounded-[40px] shadow-[0_20px_50px_rgba(37,99,235,0.4)] transition-all duration-500 group relative overflow-hidden transform hover:-translate-y-2 active:scale-95 ${!budget ? 'bg-gray-100 dark:bg-slate-800 text-gray-400' : 'bg-black dark:bg-white text-white dark:text-black hover:bg-blue-600 dark:hover:bg-blue-500 hover:text-white'
                    }`}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 via-white/10 to-blue-600/0 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

                  {isLoading ? (
                    <div className="flex items-center space-x-4">
                      <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent"></div>
                      <span className="animate-pulse">Building AI Plan...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-6">
                      <Sparkles className="h-10 w-10 group-hover:rotate-12 transition-transform" />
                      <span className="uppercase italic tracking-tighter">Generate Mission</span>
                      <ArrowRight className="h-10 w-10 group-hover:translate-x-4 transition-transform stroke-[4px]" />
                    </div>
                  )}
                </Button>

                <p className="text-center text-white/70 font-black tracking-widest text-sm uppercase italic drop-shadow-md">
                  Powered by Advanced Neural Travel Engines
                </p>
              </div>

              {/* Summary Stats */}
              <div className="grid grid-cols-2 gap-6">
                {[
                  { label: 'Daily Budget', value: `₹${convertedAmount ? (parseInt(convertedAmount) / 5).toLocaleString() : '0'}` },
                  { label: 'Confidence', value: '98%' }
                ].map((stat, i) => (
                  <div key={i} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-[32px] p-8 text-center">
                    <div className="text-white/60 font-black uppercase tracking-widest text-xs mb-2 italic">{stat.label}</div>
                    <div className="text-white text-3xl font-black tracking-tighter">{stat.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetPlanner; 