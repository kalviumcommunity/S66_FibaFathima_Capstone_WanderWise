import { useState } from 'react';
import { Button } from "@/Components/ui/button";
import { Card, CardContent } from "@/Components/ui/card";
import { MapPin, Users, Calendar, Star, ArrowRight, Search, Heart, HeartOff, DollarSign, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const destinations = [
  {
    id: 1,
    name: "Bali, Indonesia",
    image: "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1",
    description: "Tropical paradise with stunning beaches and rich culture",
    rating: 4.8,
    popular: true
  },
  {
    id: 2,
    name: "Tokyo, Japan",
    image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf",
    description: "Modern metropolis blending tradition and innovation",
    rating: 4.9,
    popular: true
  },
  {
    id: 3,
    name: "Paris, France",
    image: "https://images.unsplash.com/photo-1502602898536-47ad22581b52",
    description: "City of love, art, and culinary excellence",
    rating: 4.7,
    popular: false
  },
  {
    id: 4,
    name: "New York, USA",
    image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9",
    description: "The city that never sleeps, full of energy and dreams",
    rating: 4.6,
    popular: false
  },
  {
    id: 5,
    name: "Iceland",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4",
    description: "Land of fire and ice with breathtaking landscapes",
    rating: 4.9,
    popular: true
  },
  {
    id: 6,
    name: "Santorini, Greece",
    image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff",
    description: "Stunning sunsets and white-washed buildings",
    rating: 4.8,
    popular: false
  }
];

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [wishlist, setWishlist] = useState([]);
  const navigate = useNavigate();

  const handleDestinationClick = (destination) => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    navigate(`/quiz/${destination.id}`, { state: { destination } });
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
    destination.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    destination.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-gray-800/70 to-slate-900/80"></div>
      </div>

      {/* Header */}
      <header className="bg-white/10 backdrop-blur-md border-b border-white/20 sticky top-0 z-50 relative">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg flex items-center justify-center">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-green-700 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
              WanderWise
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            {!isLoggedIn ? (
              <>
                <Button 
                  variant="ghost" 
                  onClick={() => navigate('/login')}
                  className="text-white hover:text-green-200 transition-all duration-300 hover:scale-105"
                >
                  Login
                </Button>
                <Button 
                  onClick={() => navigate('/signup')}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  Sign Up
                </Button>
              </>
            ) : (
              <>
                <Button 
                  variant="ghost" 
                  onClick={() => navigate('/dashboard')}
                  className="text-white hover:text-green-200 transition-all duration-300 hover:scale-105"
                >
                  Dashboard
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={() => setIsLoggedIn(false)}
                  className="text-white hover:text-green-200 transition-all duration-300 hover:scale-105"
                >
                  Logout
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden z-20">
        <div className="container mx-auto px-4 text-center relative">
          <div className="animate-fade-in">
            <h2 className="text-5xl md:text-7xl font-bold text-white mb-6 relative drop-shadow-lg">
              Plan Your Perfect
              <span className="block bg-gradient-to-r from-green-300 via-emerald-300 to-teal-300 bg-clip-text text-transparent">
                Adventure
              </span>
            </h2>
            <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto font-medium drop-shadow-md">
              Discover amazing destinations, answer a quick quiz, and get a personalized AI-powered travel itinerary tailored just for you!
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-12 animate-fade-in animation-delay-500">
            <div className="flex items-center space-x-2 text-white bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 transition-all duration-300 hover:scale-105">
              <Users className="w-5 h-5 text-green-300" />
              <span className="font-medium">Personalized Plans</span>
            </div>
            <div className="flex items-center space-x-2 text-white bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 transition-all duration-300 hover:scale-105">
              <Calendar className="w-5 h-5 text-emerald-300" />
              <span className="font-medium">AI-Powered Itineraries</span>
            </div>
            <div className="flex items-center space-x-2 text-white bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 transition-all duration-300 hover:scale-105">
              <Star className="w-5 h-5 text-yellow-300" />
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
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-green-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search destinations, countries, or activities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full text-white placeholder-green-200 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-300"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-green-400 hover:text-white transition-colors"
                >
                  ✕
                </button>
              )}
            </div>
            {searchTerm && (
              <p className="text-green-200 text-center mt-2 text-sm">
                Found {filteredDestinations.length} destination{filteredDestinations.length !== 1 ? 's' : ''}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="py-16 relative z-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-fade-in">
            <h3 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">
              {searchTerm ? 'Search Results' : 'Popular Destinations'}
            </h3>
            <p className="text-green-100 max-w-2xl mx-auto text-lg drop-shadow-md">
              {searchTerm 
                ? `Showing results for "${searchTerm}"`
                : 'Choose from our curated selection of amazing destinations and start planning your dream trip'
              }
            </p>
          </div>
          
          {filteredDestinations.length === 0 && searchTerm ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-12 h-12 text-green-300" />
              </div>
              <h4 className="text-2xl font-semibold text-white mb-3">No destinations found</h4>
              <p className="text-green-100 text-lg">
                Try adjusting your search terms or browse our popular destinations
              </p>
              <Button
                onClick={() => setSearchTerm('')}
                className="mt-6 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
              >
                Clear Search
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredDestinations.map((destination, index) => (
                <Card 
                  key={destination.id}
                  className="group cursor-pointer hover:shadow-2xl transition-all duration-500 border-0 bg-gradient-to-br from-green-50 to-emerald-50 backdrop-blur-sm overflow-hidden hover:scale-105 animate-fade-in hover:from-green-100 hover:to-emerald-100"
                  style={{ animationDelay: `${index * 100}ms` }}
                  onClick={() => handleDestinationClick(destination)}
                >
                  <div className="relative">
                    <img 
                      src={destination.image} 
                      alt={destination.name}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-green-900/20 to-transparent group-hover:from-green-900/30 transition-all duration-500"></div>
                    
                    {/* Wishlist Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist(destination.id);
                      }}
                      className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm rounded-full p-2 shadow-lg hover:scale-110 transition-all duration-300"
                    >
                      {wishlist.includes(destination.id) ? (
                        <Heart className="w-4 h-4 text-red-500 fill-current" />
                      ) : (
                        <Heart className="w-4 h-4 text-gray-600 hover:text-red-500 transition-colors" />
                      )}
                    </button>
                    
                    {destination.popular && (
                      <div className="absolute top-3 left-12 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
                        ⭐ Popular
                      </div>
                    )}
                    <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm rounded-full px-2 py-1 flex items-center space-x-1 shadow-lg">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium text-gray-700">{destination.rating}</span>
                    </div>
                  </div>
                  <CardContent className="p-6 bg-gradient-to-br from-white to-green-50">
                    <h4 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">
                      {destination.name}
                    </h4>
                    <p className="text-gray-600 mb-4">{destination.description}</p>
                    <div className="flex items-center justify-between">
                      <Button
                        variant="ghost"
                        className="text-green-600 hover:text-green-700 hover:bg-green-50 p-0 h-auto font-medium group-hover:translate-x-2 transition-all duration-300"
                      >
                        Plan Trip
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </Button>
                      {wishlist.includes(destination.id) && (
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
      <section className="py-16 bg-white/10 backdrop-blur-sm relative z-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-fade-in">
            <h3 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">Why Choose WanderWise?</h3>
            <p className="text-green-100 max-w-2xl mx-auto text-lg drop-shadow-md">
              Our AI-powered platform makes travel planning effortless and personalized
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center animate-fade-in animation-delay-200 hover:scale-105 transition-transform duration-300">
              <div className="w-20 h-20 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-10 h-10 text-white" />
              </div>
              <h4 className="text-2xl font-semibold text-white mb-3 drop-shadow-md">Personalized Experience</h4>
              <p className="text-green-100 text-lg drop-shadow-sm">
                Answer a quick quiz and get travel plans tailored to your preferences, budget, and style.
              </p>
            </div>
            
            <div className="text-center animate-fade-in animation-delay-400 hover:scale-105 transition-transform duration-300">
              <div className="w-20 h-20 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Calendar className="w-10 h-10 text-white" />
              </div>
              <h4 className="text-2xl font-semibold text-white mb-3 drop-shadow-md">AI-Powered Planning</h4>
              <p className="text-green-100 text-lg drop-shadow-sm">
                Our intelligent system creates detailed day-by-day itineraries with activities, dining, and more.
              </p>
            </div>
            
            <div className="text-center animate-fade-in animation-delay-600 hover:scale-105 transition-transform duration-300">
              <div className="w-20 h-20 bg-gradient-to-r from-teal-600 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Star className="w-10 h-10 text-white" />
              </div>
              <h4 className="text-2xl font-semibold text-white mb-3 drop-shadow-md">Budget Optimization</h4>
              <p className="text-green-100 text-lg drop-shadow-sm">
                Get the most out of your budget with smart recommendations and cost-effective alternatives.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white/10 backdrop-blur-sm relative z-20">
        <div className="container mx-auto px-4 text-center animate-fade-in">
          <h3 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">Ready to Start Your Adventure?</h3>
          <p className="text-green-100 mb-8 max-w-xl mx-auto text-lg drop-shadow-md">
            Join thousands of travelers who trust WanderWise to plan their perfect trips
          </p>
          <Button 
            size="lg"
            onClick={() => navigate('/signup')}
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-12 py-4 text-xl transition-all duration-300 hover:scale-110 shadow-2xl hover:shadow-3xl"
          >
            Get Started Free
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-900/90 to-gray-800/90 backdrop-blur-sm text-white py-16 relative z-20">
        <div className="absolute inset-0 bg-gradient-to-r from-green-900/20 to-emerald-900/20"></div>
        <div className="container mx-auto px-4 relative">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg flex items-center justify-center">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <h4 className="text-xl font-bold">WanderWise</h4>
            </div>
            <p className="text-gray-300 text-center md:text-right">
              © 2024 WanderWise. Making travel planning effortless.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index; 