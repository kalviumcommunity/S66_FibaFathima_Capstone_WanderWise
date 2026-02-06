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
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-[#4facfe] to-[#00f2fe] dark:from-[#4facfe] dark:to-[#a1c4fd] transition-colors duration-1000 font-sans">

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
            <h1 className="text-5xl md:text-6xl font-black text-white mb-4 tracking-tight drop-shadow-lg transform -rotate-1">
              Explore the World
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto font-medium leading-relaxed drop-shadow-md">
              "Find your next adventure from our curated list of amazing destinations."
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white/90 backdrop-blur-xl border border-[#D6E9FF] rounded-[32px] shadow-xl p-8 mb-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  type="text"
                  placeholder="Where to next?"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 rounded-2xl border-2 border-transparent bg-gray-50/50 dark:bg-gray-50/50 focus:bg-white focus:border-blue-500 h-14 transition-all text-gray-900 font-bold"
                />
              </div>

              {/* Country Filter */}
              <div className="relative">
                <select
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  className="w-full h-14 rounded-2xl border-2 border-transparent bg-gray-50/50 dark:bg-gray-50/50 px-6 focus:outline-none focus:border-blue-500 transition-all text-gray-900 font-bold appearance-none"
                >
                  <option value="all">All Countries</option>
                  {countries.map(country => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-400">
                  <Filter className="h-4 w-4" />
                </div>
              </div>

              {/* Sort */}
              <div className="relative">
                <select
                  value={selectedSort}
                  onChange={(e) => setSelectedSort(e.target.value)}
                  className="w-full h-14 rounded-2xl border-2 border-transparent bg-gray-50/50 dark:bg-gray-50/50 px-6 focus:outline-none focus:border-blue-500 transition-all text-gray-900 font-bold appearance-none"
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

          {/* Destinations Grid - 2x2 Grid as requested */}
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
            <div className="grid grid-cols-2 gap-6 md:gap-10 lg:gap-14 px-2">
              {filteredDestinations.map((destination) => {
                const isSaved = isDestinationSaved(destination._id);

                return (
                  <div key={destination._id} className="group relative bg-[#F0F7FF] border border-[#CFE8FF] shadow-lg rounded-[32px] hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] transition-all duration-500 transform hover:-translate-y-3 overflow-hidden flex flex-col h-full">
                    <div className="relative h-48 lg:h-56 overflow-hidden">
                      <img
                        src={getDestinationImage(destination)}
                        alt={destination.name}
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-70 group-hover:opacity-60 transition-opacity"></div>

                      <button
                        className={`absolute top-4 right-4 p-3 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 active:scale-90 z-20 ${isSaved ? 'bg-white text-red-500' : 'bg-black/30 backdrop-blur-xl text-white hover:bg-white hover:text-red-500'}`}
                        onClick={(e) => { e.stopPropagation(); handleSaveDestination(destination._id, isSaved); }}
                      >
                        {savingDestination === destination._id ? (
                          <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                          <Heart className={`h-5 w-5 ${isSaved ? 'fill-current' : ''}`} />
                        )}
                      </button>

                      {destination.isPopular && (
                        <div className="absolute top-4 left-4 z-20">
                          <span className="bg-orange-500 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-2xl flex items-center gap-1 uppercase tracking-wider">
                            <Star className="w-3 h-3 fill-current" /> Popular
                          </span>
                        </div>
                      )}

                      <div className="absolute bottom-4 left-6 right-6 text-white z-20">
                        <div className="flex justify-between items-end">
                          <div>
                            <div className="flex items-center text-white/90 text-[10px] font-bold mb-1 uppercase tracking-[0.2em]">
                              <MapPin className="w-3 h-3 mr-1" />
                              {destination.country}
                            </div>
                            <h3 className="text-2xl font-black leading-tight drop-shadow-lg">{destination.name}</h3>
                          </div>
                          <div className="flex items-center bg-white/20 backdrop-blur-xl px-3 py-1 rounded-xl border border-white/20">
                            <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                            <span className="font-black text-base">{destination.rating?.toFixed(1)}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 flex flex-col flex-1">
                      <p className="text-gray-500 text-sm mb-6 line-clamp-2 leading-relaxed font-bold">
                        {destination.description}
                      </p>

                      <div className="flex items-center justify-between mt-auto">
                        <div className="flex flex-col">
                          <span className="text-[10px] text-gray-400 uppercase font-black tracking-[0.2em] mb-0.5">Starting from</span>
                          <span className="text-xl font-black text-blue-600 dark:text-blue-400">${destination.price}</span>
                        </div>

                        <Link to={`/destination/${destination._id}`}>
                          <Button className="rounded-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-5 font-black text-base shadow-[0_10px_30px_-10px_rgba(37,99,235,0.5)] hover:shadow-[0_15px_40px_-10px_rgba(37,99,235,0.6)] hover:scale-105 active:scale-95 transition-all duration-300">
                            Explore <Plane className="w-5 h-5 ml-2" />
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
  );
};

export default Destinations; 