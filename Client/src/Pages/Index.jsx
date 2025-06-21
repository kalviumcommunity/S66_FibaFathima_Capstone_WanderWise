import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Users, Calendar, Star, ArrowRight, Compass } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import DestinationCard from '../Components/DestinationCard';
import { destinations } from '../data/destinations';
import { toggleFavorite } from '../services/tripStorage';
import { toast } from "sonner";

const Index = () => {
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  // Get only popular destinations for the main page
  const popularDestinations = destinations.filter(dest => dest.popular);

  const handleDestinationClick = (destination) => {
    // Allow both logged in and non-logged in users to access the quiz
    navigate(`/quiz/${destination.id}`, { state: { destination } });
  };

  const handleLogout = () => {
    logout();
    // Optionally navigate to home page after logout
    navigate('/');
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
        <div className="absolute inset-0 bg-gradient-to-br from-green-900/40 via-emerald-800/30 to-teal-900/40"></div>
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
                  onClick={handleLogout}
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

      {/* Popular Destinations */}
      <section className="py-16 relative z-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-fade-in">
            <h3 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">Popular Destinations</h3>
            <p className="text-green-100 max-w-2xl mx-auto text-lg drop-shadow-md">
              Choose from our curated selection of amazing destinations and start planning your dream trip
            </p>
            <Button
              onClick={() => navigate('/destinations')}
              className="mt-6 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border border-white/30 transition-all duration-300 hover:scale-105"
            >
              <Compass className="w-4 h-4 mr-2" />
              Explore All Destinations
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {popularDestinations.map((destination, index) => (
              <DestinationCard
                key={destination.id}
                destination={destination}
                onClick={handleDestinationClick}
                onFavorite={handleFavoriteToggle}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              />
            ))}
          </div>
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