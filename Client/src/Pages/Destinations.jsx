import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Search, Filter, Star, ArrowLeft } from 'lucide-react';
import { toast } from "sonner";
import DestinationCard from '../Components/DestinationCard';
import { destinations, categories, continents } from '../data/destinations';
import { toggleFavorite, isDestinationFavorited } from '../services/tripStorage';

const Destinations = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedContinent, setSelectedContinent] = useState('all');
  const [showPopularOnly, setShowPopularOnly] = useState(false);

  // Filter destinations based on search and filters
  const filteredDestinations = useMemo(() => {
    return destinations.filter(destination => {
      const matchesSearch = destination.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           destination.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           destination.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'all' || destination.category === selectedCategory;
      const matchesContinent = selectedContinent === 'all' || destination.continent.toLowerCase() === selectedContinent;
      const matchesPopular = !showPopularOnly || destination.popular;

      return matchesSearch && matchesCategory && matchesContinent && matchesPopular;
    });
  }, [searchQuery, selectedCategory, selectedContinent, showPopularOnly]);

  const handleDestinationClick = (destination) => {
    navigate(`/quiz/${destination.id}`, { state: { destination } });
  };

  const handleBack = () => {
    navigate('/');
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedContinent('all');
    setShowPopularOnly(false);
    toast.success("Filters cleared!");
  };

  const handleFavoriteToggle = (destination, isFavorited) => {
    try {
      toggleFavorite(destination);
      toast.success(isFavorited ? "Removed from favorites!" : "Added to favorites!");
    } catch {
      toast.error("Failed to update favorites");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            onClick={handleBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Button>
          
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-green-600" />
            <h1 className="text-2xl font-bold text-gray-800">
              Explore Destinations
            </h1>
          </div>
          
          <div className="text-sm text-gray-500">
            {filteredDestinations.length} destinations found
          </div>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8 shadow-lg border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5 text-green-600" />
              Search & Filter Destinations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search destinations, activities, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-gray-200 focus:border-green-500 focus:ring-green-500"
              />
            </div>

            {/* Filter Options */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full p-2 border border-gray-200 rounded-md focus:border-green-500 focus:ring-green-500"
                >
                  {categories.map(category => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Continent Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Continent</label>
                <select
                  value={selectedContinent}
                  onChange={(e) => setSelectedContinent(e.target.value)}
                  className="w-full p-2 border border-gray-200 rounded-md focus:border-green-500 focus:ring-green-500"
                >
                  {continents.map(continent => (
                    <option key={continent.value} value={continent.value}>
                      {continent.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Popular Only Toggle */}
              <div className="flex items-center">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showPopularOnly}
                    onChange={(e) => setShowPopularOnly(e.target.checked)}
                    className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Popular Only</span>
                </label>
              </div>

              {/* Clear Filters */}
              <div className="flex items-end">
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className="w-full"
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Destinations Grid */}
        {filteredDestinations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredDestinations.map((destination, index) => (
              <DestinationCard
                key={destination.id}
                destination={destination}
                onClick={handleDestinationClick}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
                isFavorited={isDestinationFavorited(destination.id)}
                onFavorite={handleFavoriteToggle}
              />
            ))}
          </div>
        ) : (
          <Card className="text-center py-12 shadow-lg border-0">
            <CardContent>
              <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No destinations found</h3>
              <p className="text-gray-500 mb-4">
                Try adjusting your search terms or filters to find more destinations.
              </p>
              <Button onClick={clearFilters} className="bg-green-600 hover:bg-green-700">
                Clear All Filters
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Destinations; 