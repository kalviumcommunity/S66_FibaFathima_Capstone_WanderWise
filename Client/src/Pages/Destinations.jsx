import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import {
  Search,
  MapPin,
  Star,
  DollarSign,
  Calendar,
  Filter,
  Heart,
  Plane,
  ArrowLeft,
  Globe,
  HeartOff,
  Loader2,
  Cloud
} from 'lucide-react';
import { destinationService } from '../services/destinationService';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

const Destinations = () => {
  const [destinations, setDestinations] = useState([]);
  const [filteredDestinations, setFilteredDestinations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('all');
  const [selectedSort, setSelectedSort] = useState('name');
  const [loading, setLoading] = useState(true);
  const [savingDestination, setSavingDestination] = useState(null);
  const [countries, setCountries] = useState([]);

  const { user, isLoggedIn, saveDestination, removeDestination } = useAuth();

  const sortOptions = [
    { value: 'name', label: 'Name A-Z' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'popular', label: 'Most Popular' }
  ];

  // Fetch destinations from API
  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        setLoading(true);
        const data = await destinationService.getDestinations({
          sort: selectedSort
        });
        setDestinations(data);
        setFilteredDestinations(data);

        // Extract unique countries for filter
        const uniqueCountries = [...new Set(data.map(dest => dest.country))].sort();
        setCountries(uniqueCountries);
      } catch (error) {
        console.error('Failed to fetch destinations:', error);
        toast.error('Failed to load destinations');
      } finally {
        setLoading(false);
      }
    };

    fetchDestinations();
  }, [selectedSort]);

  // Filter destinations based on search and country
  useEffect(() => {
    let filtered = destinations;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(dest =>
        dest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dest.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dest.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by country
    if (selectedCountry !== 'all') {
      filtered = filtered.filter(dest => dest.country === selectedCountry);
    }

    setFilteredDestinations(filtered);
  }, [destinations, searchTerm, selectedCountry]);

  // Handle save/unsave destination
  const handleSaveDestination = async (destinationId, isSaved) => {
    if (!isLoggedIn) {
      toast.error('Please login to save destinations');
      return;
    }

    try {
      setSavingDestination(destinationId);

      if (isSaved) {
        await removeDestination(destinationId);
        toast.success('Destination removed from saved list');
      } else {
        await saveDestination(destinationId);
        toast.success('Destination saved to your list');
      }
    } catch (error) {
      console.error('Failed to save/unsave destination:', error);
      toast.error('Failed to update saved destinations');
    } finally {
      setSavingDestination(null);
    }
  };

  // Check if destination is saved by current user
  const isDestinationSaved = (destinationId) => {
    return user?.savedDestinations?.includes(destinationId) || false;
  };

  // Get destination image
  const getDestinationImage = (destination) => {
    if (destination.images && destination.images.length > 0) {
      return destination.images[0];
    }
    // Fallback to a default image
    return 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading destinations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full relative overflow-x-hidden bg-gradient-to-b from-[#4facfe] to-[#00f2fe] dark:from-[#4facfe] dark:to-[#a1c4fd] bg-fixed transition-colors duration-1000 font-sans">

      {/* Decorative Clouds */}
      <div className="absolute top-10 left-10 opacity-40 dark:opacity-20 animate-float pointer-events-none z-0 transition-opacity duration-500">
        <Cloud className="w-24 h-24 text-white fill-white drop-shadow-xl" />
      </div>
      <div className="absolute top-40 right-10 opacity-30 dark:opacity-10 animate-float animation-delay-2000 pointer-events-none z-0 transition-opacity duration-500">
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
        {/* Header */}
        <div className="bg-transparent pt-6 pb-2">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2 text-white hover:text-blue-100 transition-colors">
              <div className="bg-white/20 backdrop-blur-md p-2 rounded-full shadow-md border border-white/20">
                <ArrowLeft className="h-5 w-5 text-white" />
              </div>
            </Link>
            {isLoggedIn && (
              <Link to="/dashboard">
                <Button className="rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-white/20 border border-white/20 shadow-sm">
                  <Globe className="h-4 w-4 mr-2" />
                  My Dashboard
                </Button>
              </Link>
            )}
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 text-center">
            <h1 className="text-3xl md:text-5xl font-black text-white mb-3 tracking-tight drop-shadow-lg transform -rotate-1">
              Explore the World
            </h1>
            <p className="text-lg text-white/90 max-w-2xl mx-auto font-medium leading-relaxed drop-shadow-md">
              "Find your next adventure from our curated list of amazing destinations."
            </p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filters */}
          <div className="py-4">
            <div className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-[20px] shadow-lg p-4 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    type="text"
                    placeholder="Where to next?"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 rounded-xl border-2 border-white/20 bg-white/10 dark:bg-white/10 focus:bg-white/20 focus:border-white h-10 transition-all text-white placeholder-white/50 font-bold text-sm"
                  />
                </div>

                {/* Country Filter */}
                <div className="relative">
                  <select
                    value={selectedCountry}
                    onChange={(e) => setSelectedCountry(e.target.value)}
                    className="w-full h-10 rounded-xl border-2 border-white/20 bg-white/10 dark:bg-white/10 px-4 focus:outline-none focus:border-white transition-all text-white font-bold appearance-none text-sm"
                  >
                    <option value="all">All Countries</option>
                    {countries.map(country => (
                      <option key={country} value={country}>{country}</option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-400">
                    <Globe className="h-4 w-4" />
                  </div>
                </div>

                {/* Sort Filter */}
                <div className="relative">
                  <select
                    value={selectedSort}
                    onChange={(e) => setSelectedSort(e.target.value)}
                    className="w-full h-10 rounded-xl border-2 border-white/20 bg-white/10 dark:bg-white/10 px-4 focus:outline-none focus:border-white transition-all text-white font-bold appearance-none text-sm"
                  >
                    {sortOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-400">
                    <Filter className="h-4 w-4" />
                  </div>
                </div>

                {/* Results Count */}
                <div className="flex items-center justify-center md:justify-end text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
                  {filteredDestinations.length} found
                </div>
              </div>
            </div>

            {/* Destinations Grid - 3x3 Grid as requested */}
            {filteredDestinations.length === 0 ? (
              <div className="text-center py-24 bg-white/20 backdrop-blur-md rounded-[40px] border-4 border-dashed border-white/30">
                <Globe className="h-20 w-20 text-white/50 mx-auto mb-6 animate-pulse" />
                <h3 className="text-3xl font-black text-white mb-3">No destinations found</h3>
                <p className="text-white/70 text-lg">We couldn't find any places matching your search.</p>
                <Button
                  variant="link"
                  onClick={() => { setSearchTerm(''); setSelectedCountry('all'); }}
                  className="mt-6 text-white font-black text-xl underline underline-offset-8 decoration-4"
                >
                  Clear all filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2 px-1 mb-12">
                {filteredDestinations.map((destination) => {
                  const isSaved = isDestinationSaved(destination._id);

                  return (
                    <div key={destination._id} className="group relative bg-white/10 backdrop-blur-lg border border-white/20 shadow-md rounded-xl hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1 overflow-hidden flex flex-col h-full">
                      <div className="relative h-20 md:h-32 lg:h-36 overflow-hidden">
                        <img
                          src={getDestinationImage(destination)}
                          alt={destination.name}
                          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-70 group-hover:opacity-60 transition-opacity"></div>

                        <button
                          className={`absolute top-2 right-2 p-1.5 rounded-full shadow-lg transition-all duration-300 hover:scale-110 active:scale-90 z-20 ${isSaved ? 'bg-white text-red-500' : 'bg-black/30 backdrop-blur-md text-white hover:bg-white hover:text-red-500'}`}
                          onClick={(e) => { e.stopPropagation(); handleSaveDestination(destination._id, isSaved); }}
                        >
                          {savingDestination === destination._id ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                          ) : (
                            <Heart className={`h-5 w-5 ${isSaved ? 'fill-current' : ''}`} />
                          )}
                        </button>

                        {destination.isPopular && (
                          <div className="absolute top-2 left-2 z-20">
                            <span className="bg-orange-500 text-white text-[8px] font-black px-2 py-0.5 rounded-full shadow-lg flex items-center gap-0.5 uppercase tracking-wider">
                              <Star className="w-2 h-2 fill-current" /> Popular
                            </span>
                          </div>
                        )}

                        <div className="absolute bottom-2 left-3 right-3 text-white z-20">
                          <div className="flex justify-between items-end">
                            <div>
                              <div className="flex items-center text-white/90 text-[8px] font-bold mb-0.5 uppercase tracking-wider">
                                <MapPin className="w-2 h-2 mr-0.5" />
                                {destination.country}
                              </div>
                              <h3 className="text-xs md:text-xl font-black leading-tight drop-shadow-md">{destination.name}</h3>
                            </div>
                            <div className="flex items-center bg-white/20 backdrop-blur-md px-1.5 py-0.5 rounded-lg border border-white/20">
                              <Star className="w-3 h-3 text-yellow-400 fill-current mr-0.5" />
                              <span className="font-black text-[10px] md:text-base">{destination.rating?.toFixed(1)}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="p-2 flex flex-col flex-1">
                        <p className="text-white/70 text-[8px] mb-2 line-clamp-2 leading-relaxed font-bold italic">
                          {destination.description}
                        </p>

                        <div className="flex items-center justify-between mt-auto">
                          <div className="flex flex-col">
                            <span className="text-[8px] text-white/50 uppercase font-black tracking-[0.2em] mb-0.5">Starting from</span>
                            <span className="text-base font-black text-white hover:text-blue-100 drop-shadow-sm">${destination.price}</span>
                          </div>

                          <Link to={`/quiz/${destination._id}`} state={{ destination }}>
                            <Button className="rounded-full bg-white/20 hover:bg-white text-blue-600 px-3 py-1 font-black text-[10px] h-7 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 border border-white/20">
                              Explore <Plane className="w-2.5 h-2.5 ml-1" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Destinations;