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
  Loader2
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
                <ArrowLeft className="h-5 w-5" />
                <span>Back to Home</span>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Explore Destinations</h1>
                <p className="text-gray-600 mt-1">Discover amazing places around the world</p>
              </div>
            </div>
            {isLoggedIn && (
              <Link to="/dashboard">
                <Button variant="outline" className="flex items-center space-x-2">
                  <Globe className="h-4 w-4" />
                  <span>My Dashboard</span>
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search destinations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Country Filter */}
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Countries</option>
              {countries.map(country => (
                <option key={country} value={country}>{country}</option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>

            {/* Results Count */}
            <div className="flex items-center justify-end text-sm text-gray-600">
              {filteredDestinations.length} destination{filteredDestinations.length !== 1 ? 's' : ''} found
            </div>
          </div>
        </div>

        {/* Destinations Grid */}
        {filteredDestinations.length === 0 ? (
          <div className="text-center py-12">
            <Globe className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No destinations found</h3>
            <p className="text-gray-600">Try adjusting your search criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDestinations.map((destination) => {
              const isSaved = isDestinationSaved(destination._id);
              
              return (
                <Card key={destination._id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <div className="relative">
                    <img
                      src={getDestinationImage(destination)}
                      alt={destination.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-4 right-4">
                      <Button
                        size="sm"
                        variant="ghost"
                        className={`rounded-full p-2 ${
                          isSaved ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-white/80 hover:bg-white'
                        }`}
                        onClick={() => handleSaveDestination(destination._id, isSaved)}
                        disabled={savingDestination === destination._id}
                      >
                        {savingDestination === destination._id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : isSaved ? (
                          <Heart className="h-4 w-4 fill-current" />
                        ) : (
                          <Heart className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    {destination.isPopular && (
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-orange-500 text-white">Popular</Badge>
                      </div>
                    )}
                  </div>
                  
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <CardTitle className="text-lg font-semibold text-gray-900 mb-1">
                          {destination.name}
                        </CardTitle>
                        <div className="flex items-center text-sm text-gray-600 mb-2">
                          <MapPin className="h-4 w-4 mr-1" />
                          {destination.country}
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-medium">{destination.rating?.toFixed(1) || 'N/A'}</span>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {destination.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {destination.price > 0 && (
                          <div className="flex items-center text-sm text-gray-600">
                            <DollarSign className="h-4 w-4 mr-1" />
                            <span>From ${destination.price}</span>
                          </div>
                        )}
                        {destination.bestSeason && (
                          <div className="flex items-center text-sm text-gray-600">
                            <Calendar className="h-4 w-4 mr-1" />
                            <span>{destination.bestSeason}</span>
                          </div>
                        )}
                      </div>
                      
                      <Link to={`/destination/${destination._id}`}>
                        <Button size="sm" className="flex items-center space-x-1">
                          <Plane className="h-4 w-4" />
                          <span>Explore</span>
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Destinations; 