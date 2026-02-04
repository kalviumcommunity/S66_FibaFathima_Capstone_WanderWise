import { useState, useEffect } from 'react';
import { Button } from "@/Components/ui/button";
import { Card, CardContent } from "@/Components/ui/card";
import { MapPin, Users, Calendar, Star, ArrowRight, Search, Heart, Plane } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { destinationService } from '../services/destinationService';

const Index = () => {
  const { isLoggedIn } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [wishlist, setWishlist] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadDestinations = async () => {
      try {
        console.log('🔍 Loading destinations...');
        setLoading(true);
        
        console.log('📡 Testing direct API call...');
        
        const data = await destinationService.getDestinations({ sort: 'popular' });
        console.log('✅ Destinations loaded:', data);
        setDestinations(data);
      } catch (error) {
        console.error('❌ Error loading destinations:', error);
        // Set empty array to prevent UI crashes
        setDestinations([]);
      } finally {
        setLoading(false);
      }
    };
    
    loadDestinations();
  }, []);

  const handleDestinationClick = (destination) => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    navigate(`/quiz/${destination._id || destination.id}`, { state: { destination } });
  };

  const toggleWishlist = (destinationId) => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    
    setWishlist(prev => 
      prev.includes(destinationId) 
        ? prev.filter(id => id !== destinationId)
        : [...prev, destinationId]
    );
  };

  const filteredDestinations = destinations.filter(destination =>
    (searchTerm ? 
      (destination.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      destination.description.toLowerCase().includes(searchTerm.toLowerCase())) :
      true  // Show all destinations by default, not just popular ones
    )
  );

  return (
    <div className="min-h-screen relative overflow-hidden">
        {/* Clean white background with subtle pattern */}
        <div className="fixed inset-0 z-0 bg-white">
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-20 left-10 w-2 h-2 bg-green-500 rounded-full"></div>
            <div className="absolute top-40 right-20 w-3 h-3 bg-green-400 rounded-full"></div>
            <div className="absolute bottom-32 left-1/4 w-2 h-2 bg-green-600 rounded-full"></div>
            <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-green-500 rounded-full"></div>
            <div className="absolute bottom-20 right-10 w-3 h-3 bg-green-400 rounded-full"></div>
            <div className="absolute top-1/4 left-1/3 w-1 h-1 bg-green-600 rounded-full"></div>
          </div>
        </div>

      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 relative shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">WanderWise</h1>
          </div>

          <div className="flex items-center space-x-4">
            {!isLoggedIn ? (
              <>
                <Button
                  variant="ghost"
                  onClick={() => navigate('/login')}
                  className="text-gray-700 hover:text-green-600 transition-colors duration-200"
                >
                  Login
                </Button>
                <Button
                  onClick={() => navigate('/signup')}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors duration-200"
                >
                  Sign Up
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  onClick={() => navigate('/dashboard')}
                  className="text-gray-700 hover:text-green-600 transition-colors duration-200"
                >
                  Dashboard
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden z-20">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-10 left-5 w-64 h-64 bg-green-100 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-emerald-100 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-1000"></div>
          <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-green-50 rounded-full mix-blend-multiply filter blur-xl opacity-15 animate-pulse animation-delay-2000"></div>
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="animate-fade-in">
            <div className="inline-block mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                <MapPin className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <h2 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
              Plan Your Perfect
              <span className="block text-green-600 relative">
                Adventure
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-green-400 rounded-full"></div>
              </span>
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              Discover amazing destinations, answer a quick quiz, and get a personalized AI-powered travel itinerary tailored just for you!
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-12 animate-fade-in animation-delay-500">
            <div className="flex items-center space-x-2 text-gray-700 bg-green-50 rounded-full px-4 py-2 transition-colors duration-200 hover:bg-green-100">
              <Users className="w-5 h-5 text-green-600" />
              <span className="font-medium">Personalized Plans</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-700 bg-green-50 rounded-full px-4 py-2 transition-colors duration-200 hover:bg-green-100">
              <Calendar className="w-5 h-5 text-green-600" />
              <span className="font-medium">AI-Powered Itineraries</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-700 bg-green-50 rounded-full px-4 py-2 transition-colors duration-200 hover:bg-green-100">
              <Star className="w-5 h-5 text-yellow-500" />
              <span className="font-medium">Budget Optimization</span>
            </div>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-8 relative z-20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-green-600 w-5 h-5" />
              <input
                type="text"
                placeholder="Search destinations, countries, or activities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-full text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 shadow-sm"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-green-600 transition-colors"
                >
                  ✕
                </button>
              )}
            </div>
            {searchTerm && (
              <p className="text-green-600 text-center mt-2 text-sm">
                Found {filteredDestinations.length} destination{filteredDestinations.length !== 1 ? 's' : ''}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Explore Destinations */}
      <section className="py-16 relative z-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-fade-in">
            <h3 className="text-4xl font-bold text-gray-900 mb-4">
              {searchTerm ? 'Search Results' : 'Explore Destinations'}
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              {searchTerm 
                ? `Showing results for "${searchTerm}"`
                : 'Choose from our curated selection of amazing destinations and start planning your dream trip'
              }
            </p>
          </div>
          
          {loading ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
              <h4 className="text-2xl font-semibold text-gray-900 mb-3">Loading destinations...</h4>
              <p className="text-gray-600 text-lg">
                Finding the perfect places for your next adventure
              </p>
            </div>
          ) : filteredDestinations.length === 0 && searchTerm ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-12 h-12 text-green-600" />
              </div>
              <h4 className="text-2xl font-semibold text-gray-900 mb-3">No destinations found</h4>
              <p className="text-gray-600 text-lg">
                Try adjusting your search terms or browse our popular destinations
              </p>
              <Button
                onClick={() => setSearchTerm('')}
                className="mt-6 bg-green-600 hover:bg-green-700 text-white"
              >
                Clear Search
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredDestinations.map((destination, index) => (
                <Card 
                  key={destination._id || destination.id}
                  className="group cursor-pointer hover:shadow-xl transition-all duration-300 border border-gray-200 bg-white overflow-hidden hover:border-green-300 hover:-translate-y-1"
                  style={{ animationDelay: `${index * 100}ms` }}
                  onClick={() => handleDestinationClick(destination)}
                >
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10"></div>
                    <img 
                      src={destination.images?.[0] || '/placeholder-image.jpg'} 
                      alt={destination.name}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-all duration-500"
                    />
                    
                    {/* Wishlist Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist(destination._id || destination.id);
                      }}
                      className="absolute top-3 left-3 bg-white rounded-full p-2 shadow-md hover:scale-110 transition-transform duration-200"
                    >
                      {wishlist.includes(destination._id || destination.id) ? (
                        <Heart className="w-4 h-4 text-red-500 fill-current" />
                      ) : (
                        <Heart className="w-4 h-4 text-gray-500 hover:text-red-500 transition-colors" />
                      )}
                    </button>
                    
                    {destination.isPopular && (
                      <div className="absolute top-3 left-12 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                        ⭐ Popular
                      </div>
                    )}
                    <div className="absolute top-3 right-3 bg-white rounded-full px-2 py-1 flex items-center space-x-1 shadow-md">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium text-gray-700">{destination.rating}</span>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <h4 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">
                      {destination.name}
                    </h4>
                    <p className="text-gray-600 mb-4">{destination.description}</p>
                    <div className="flex items-center justify-between">
                      <Button
                        variant="ghost"
                        className="text-green-600 hover:text-green-700 hover:bg-green-50 p-0 h-auto font-medium"
                      >
                        Plan Trip
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </Button>
                      {wishlist.includes(destination._id || destination.id) && (
                        <span className="text-xs text-green-600 font-medium">In Wishlist</span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-green-50 relative z-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-fade-in">
            <h3 className="text-4xl font-bold text-gray-900 mb-4">Why Choose WanderWise?</h3>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Our AI-powered platform makes travel planning effortless and personalized
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center animate-fade-in animation-delay-200 bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-green-100 hover:border-green-200 hover:-translate-y-2">
              <div className="relative mb-6">
                <div className="w-20 h-20 bg-green-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                  <Users className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-400 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              </div>
              <h4 className="text-2xl font-semibold text-gray-900 mb-3">Personalized Experience</h4>
              <p className="text-gray-600 text-lg">
                Answer a quick quiz and get travel plans tailored to your preferences, budget, and style.
              </p>
            </div>
            
            <div className="text-center animate-fade-in animation-delay-400 bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-green-100 hover:border-green-200 hover:-translate-y-2">
              <div className="relative mb-6">
                <div className="w-20 h-20 bg-green-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                  <Calendar className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-400 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              </div>
              <h4 className="text-2xl font-semibold text-gray-900 mb-3">AI-Powered Planning</h4>
              <p className="text-gray-600 text-lg">
                Our intelligent system creates detailed day-by-day itineraries with activities, dining, and more.
              </p>
            </div>
            
            <div className="text-center animate-fade-in animation-delay-600 bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-green-100 hover:border-green-200 hover:-translate-y-2">
              <div className="relative mb-6">
                <div className="w-20 h-20 bg-green-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                  <Star className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-400 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              </div>
              <h4 className="text-2xl font-semibold text-gray-900 mb-3">Budget Optimization</h4>
              <p className="text-gray-600 text-lg">
                Get the most out of your budget with smart recommendations and cost-effective alternatives.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-green-50 to-white relative z-20">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 right-0 w-64 h-64 bg-green-100 rounded-full mix-blend-multiply filter blur-2xl opacity-10 animate-float"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-100 rounded-full mix-blend-multiply filter blur-2xl opacity-10 animate-float animation-delay-1000"></div>
        </div>
        <div className="container mx-auto px-4 text-center animate-fade-in relative z-10">
          <div className="inline-block mb-6">
            <div className="w-16 h-16 bg-green-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
              <Plane className="w-8 h-8 text-white" />
            </div>
          </div>
          <h3 className="text-4xl font-bold text-gray-900 mb-4">Ready to Start Your Adventure?</h3>
          <p className="text-gray-600 mb-8 max-w-xl mx-auto text-lg">
            Join thousands of travelers who trust WanderWise to plan their perfect trips
          </p>
          <Button 
            size="lg"
            onClick={() => navigate('/signup')}
            className="bg-green-600 hover:bg-green-700 text-white px-12 py-4 text-xl transition-all duration-300 hover:scale-105 hover:shadow-lg"
          >
            Get Started Free
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16 relative z-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <h4 className="text-xl font-bold">WanderWise</h4>
            </div>
            <p className="text-gray-400 text-center md:text-right">
              © 2024 WanderWise. Making travel planning effortless.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index; 