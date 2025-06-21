import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  HeartOff
} from 'lucide-react';
import { getDestinationImage } from '../lib/utils';

const Destinations = () => {
  const [destinations, setDestinations] = useState([]);
  const [filteredDestinations, setFilteredDestinations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedBudget, setSelectedBudget] = useState('all');

  const categories = [
    { id: 'all', name: 'All Destinations' },
    { id: 'beach', name: 'Beach & Coastal' },
    { id: 'mountain', name: 'Mountains & Nature' },
    { id: 'city', name: 'Cities & Culture' },
    { id: 'adventure', name: 'Adventure & Sports' },
    { id: 'relaxation', name: 'Relaxation & Wellness' }
  ];

  const budgetRanges = [
    { id: 'all', name: 'All Budgets' },
    { id: 'budget', name: 'Budget ($500-$1500)' },
    { id: 'mid', name: 'Mid-range ($1500-$3000)' },
    { id: 'luxury', name: 'Luxury ($3000+)' }
  ];

  useEffect(() => {
    // Mock data - replace with actual API call
    const mockDestinations = [
      {
        id: 1,
        name: 'Paris, France',
        country: 'France',
        category: 'city',
        budget: 'mid',
        rating: 4.8,
        reviews: 1247,
        image: 'https://images.unsplash.com/photo-1502602898534-47d3c0c8705b?w=400',
        description: 'The City of Light offers iconic landmarks, world-class museums, and unforgettable cuisine.',
        price: 2500,
        duration: '5-7 days',
        highlights: ['Eiffel Tower', 'Louvre Museum', 'Notre-Dame', 'Champs-Élysées']
      },
      {
        id: 2,
        name: 'Bali, Indonesia',
        country: 'Indonesia',
        category: 'beach',
        budget: 'budget',
        rating: 4.6,
        reviews: 892,
        image: 'https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=400',
        description: 'Tropical paradise with stunning beaches, ancient temples, and vibrant culture.',
        price: 1200,
        duration: '7-10 days',
        highlights: ['Ubud Sacred Monkey Forest', 'Tanah Lot Temple', 'Rice Terraces', 'Beach Clubs']
      },
      {
        id: 3,
        name: 'Tokyo, Japan',
        country: 'Japan',
        category: 'city',
        budget: 'mid',
        rating: 4.7,
        reviews: 1034,
        image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400',
        description: 'A fascinating blend of ultramodern and traditional, offering endless discoveries.',
        price: 2800,
        duration: '6-8 days',
        highlights: ['Shibuya Crossing', 'Senso-ji Temple', 'Tokyo Skytree', 'Tsukiji Market']
      },
      {
        id: 4,
        name: 'New York, USA',
        country: 'United States',
        category: 'city',
        budget: 'mid',
        rating: 4.5,
        reviews: 1567,
        image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400',
        description: 'The Big Apple offers world-famous attractions, diverse neighborhoods, and endless entertainment.',
        price: 2200,
        duration: '5-7 days',
        highlights: ['Times Square', 'Central Park', 'Statue of Liberty', 'Broadway']
      },
      {
        id: 5,
        name: 'Swiss Alps',
        country: 'Switzerland',
        category: 'mountain',
        budget: 'luxury',
        rating: 4.9,
        reviews: 678,
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
        description: 'Breathtaking mountain landscapes perfect for skiing, hiking, and outdoor adventures.',
        price: 4500,
        duration: '7-10 days',
        highlights: ['Zermatt', 'Interlaken', 'Jungfraujoch', 'Lake Geneva']
      },
      {
        id: 6,
        name: 'Santorini, Greece',
        country: 'Greece',
        category: 'beach',
        budget: 'mid',
        rating: 4.8,
        reviews: 945,
        image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=400',
        description: 'Stunning sunsets, white-washed buildings, and crystal-clear waters await.',
        price: 2000,
        duration: '5-7 days',
        highlights: ['Oia Sunset', 'Fira Town', 'Red Beach', 'Wine Tasting']
      },
      {
        id: 7,
        name: 'Machu Picchu',
        country: 'Peru',
        category: 'adventure',
        budget: 'mid',
        rating: 4.7,
        reviews: 723,
        image: 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=400',
        description: 'Ancient Incan citadel set high in the Andes Mountains.',
        price: 1800,
        duration: '4-6 days',
        highlights: ['Inca Trail', 'Sacred Valley', 'Cusco', 'Rainbow Mountain']
      },
      {
        id: 8,
        name: 'Maldives',
        country: 'Maldives',
        category: 'beach',
        budget: 'luxury',
        rating: 4.9,
        reviews: 456,
        image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=400',
        description: 'Overwater bungalows, pristine beaches, and world-class diving.',
        price: 5000,
        duration: '7-10 days',
        highlights: ['Overwater Villas', 'Snorkeling', 'Spa Treatments', 'Island Hopping']
      }
    ];

    setDestinations(mockDestinations);
    setFilteredDestinations(mockDestinations);
  }, []);

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

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(dest => dest.category === selectedCategory);
    }

    // Filter by budget
    if (selectedBudget !== 'all') {
      filtered = filtered.filter(dest => dest.budget === selectedBudget);
    }

    setFilteredDestinations(filtered);
  }, [destinations, searchTerm, selectedCategory, selectedBudget]);

  const getBudgetColor = (budget) => {
    switch (budget) {
      case 'budget': return 'bg-green-600 text-white';
      case 'mid': return 'bg-yellow-600 text-white';
      case 'luxury': return 'bg-purple-600 text-white';
      default: return 'bg-gray-600 text-white';
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80')`,
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
              <Link to="/dashboard">
                <Button variant="ghost" className="text-white hover:text-green-200">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                <Globe className="h-8 w-8 text-emerald-400" />
                <h1 className="text-xl font-semibold text-white">Explore Destinations</h1>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Plane className="h-5 w-5 text-green-400" />
              <span className="text-white text-sm">WanderWise</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-20">
        {/* Search and Filters */}
        <div className="mb-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">
              Discover Your Next Adventure
            </h1>
            <p className="text-green-100 text-lg drop-shadow-md max-w-2xl mx-auto">
              Explore amazing destinations and find the perfect trip for your budget and preferences
            </p>
          </div>
          
          {/* Search Bar */}
          <div className="relative mb-6 max-w-2xl mx-auto">
            <Search className="h-4 w-4 text-emerald-400" />
            <Input
              placeholder="Search destinations, countries, or activities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/20 border-white/30 text-white placeholder-green-200 focus:ring-green-400"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-6 justify-center">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-green-400" />
              <span className="text-sm font-medium text-white">Category:</span>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="text-sm border border-white/30 rounded-md px-3 py-1 bg-white/20 text-white focus:ring-green-400"
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id} className="bg-gray-800">
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4 text-green-400" />
              <span className="text-sm font-medium text-white">Budget:</span>
              <select
                value={selectedBudget}
                onChange={(e) => setSelectedBudget(e.target.value)}
                className="text-sm border border-white/30 rounded-md px-3 py-1 bg-white/20 text-white focus:ring-green-400"
              >
                {budgetRanges.map(budget => (
                  <option key={budget.id} value={budget.id} className="bg-gray-800">
                    {budget.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <p className="text-green-100 text-center">
            Showing {filteredDestinations.length} of {destinations.length} destinations
          </p>
        </div>

        {/* Destinations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDestinations.map((destination) => (
            <Card key={destination.id} className="relative overflow-hidden hover:scale-105 transition-all duration-300 cursor-pointer group bg-transparent border-white/20">
              {/* Background Image */}
              <div 
                className="absolute inset-0 z-0"
                style={{
                  backgroundImage: `url('${destination.image}')`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
              </div>

              {/* Content */}
              <div className="relative z-10 p-6 h-full flex flex-col justify-between">
                {/* Header */}
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1">{destination.name}</h3>
                      <p className="text-green-200 text-sm">{destination.country}</p>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium text-white">{destination.rating}</span>
                      <span className="text-sm text-green-200">({destination.reviews})</span>
                    </div>
                  </div>

                  <p className="text-green-100 text-sm mb-4 line-clamp-2">
                    {destination.description}
                  </p>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4 text-sm text-green-200">
                      <div className="flex items-center space-x-1">
                        <DollarSign className="h-4 w-4" />
                        <span>${destination.price.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{destination.duration}</span>
                      </div>
                    </div>
                    <Badge className={getBudgetColor(destination.budget)}>
                      {destination.budget.charAt(0).toUpperCase() + destination.budget.slice(1)}
                    </Badge>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm font-medium text-green-200 mb-2">Highlights:</p>
                    <div className="flex flex-wrap gap-1">
                      {destination.highlights.slice(0, 3).map((highlight, index) => (
                        <Badge key={index} variant="outline" className="text-xs bg-white/20 border-white/30 text-white">
                          {highlight}
                        </Badge>
                      ))}
                      {destination.highlights.length > 3 && (
                        <Badge variant="outline" className="text-xs bg-white/20 border-white/30 text-white">
                          +{destination.highlights.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2 mt-auto">
                  <Link to={`/quiz/${destination.id}`} className="flex-1">
                    <Button variant="outline" className="w-full bg-white/20 border-white/30 text-white hover:bg-white/30">
                      Take Quiz
                    </Button>
                  </Link>
                  <Link to={`/budget/${destination.id}`} className="flex-1">
                    <Button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
                      Plan Budget
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredDestinations.length === 0 && (
          <div className="text-center py-12">
            <MapPin className="h-12 w-12 text-green-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No destinations found</h3>
            <p className="text-green-200">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Destinations; 