import React from 'react';
import { MapPin, Users, Calendar, Star, Globe } from 'lucide-react';
import { Button } from "@/Components/ui/button";
import { useNavigate } from 'react-router-dom';

const About = () => {
  const navigate = useNavigate();
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
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')} 
            className="text-white hover:text-green-200 transition-all duration-300 hover:scale-105"
          >
            Home
          </Button>
        </div>
      </header>

      {/* About Content */}
      <section className="relative py-20 z-20">
        <div className="container mx-auto px-4 max-w-3xl bg-white/10 backdrop-blur-md rounded-xl shadow-lg p-8 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 text-center drop-shadow-lg">About WanderWise</h2>
          <p className="text-lg text-green-100 mb-6 text-center">
            <b>WanderWise</b> is your AI-powered travel companion, designed to make trip planning effortless, personalized, and fun. Whether you're a solo adventurer, a family, or a group of friends, WanderWise helps you discover amazing destinations, plan your itinerary, and optimize your travel budget—all in one place.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="flex flex-col items-center text-center">
              <Users className="w-10 h-10 text-green-300 mb-2" />
              <h3 className="text-2xl font-semibold text-white mb-2">Personalized Planning</h3>
              <p className="text-green-100">Answer a quick quiz about your preferences and get a custom travel plan tailored just for you.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <Calendar className="w-10 h-10 text-emerald-300 mb-2" />
              <h3 className="text-2xl font-semibold text-white mb-2">AI-Powered Itineraries</h3>
              <p className="text-green-100">Receive detailed day-by-day itineraries with activities, dining, and more, powered by smart algorithms.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <Star className="w-10 h-10 text-yellow-300 mb-2" />
              <h3 className="text-2xl font-semibold text-white mb-2">Budget Optimization</h3>
              <p className="text-green-100">Get the most out of your budget with cost-effective recommendations and alternatives.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <Globe className="w-10 h-10 text-blue-300 mb-2" />
              <h3 className="text-2xl font-semibold text-white mb-2">Global Destinations</h3>
              <p className="text-green-100">Explore a curated selection of destinations from around the world, each with unique experiences.</p>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-white mb-4 text-center">How to Use WanderWise</h3>
          <ol className="list-decimal list-inside text-green-100 mb-6 space-y-2">
            <li>Start on the Home page and browse popular destinations or use the search bar to find your dream location.</li>
            <li>Click on a destination to begin a short quiz about your travel style and preferences.</li>
            <li>After the quiz, set your travel budget and preferences in the Budget Planner.</li>
            <li>Let WanderWise generate a personalized itinerary for you, complete with activities, dining, and tips.</li>
            <li>Sign up or log in to save your trips, view your dashboard, and access more features.</li>
          </ol>
          <div className="text-center">
            <Button 
              size="lg"
              onClick={() => navigate('/signup')}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-3 text-lg transition-all duration-300 hover:scale-110 shadow-2xl hover:shadow-3xl"
            >
              Get Started Free
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-900/90 to-gray-800/90 backdrop-blur-sm text-white py-10 relative z-20">
        <div className="absolute inset-0 bg-gradient-to-r from-green-900/20 to-emerald-900/20"></div>
        <div className="container mx-auto px-4 relative text-center">
          <div className="flex flex-col items-center justify-center">
            <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg flex items-center justify-center mb-2">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <h4 className="text-xl font-bold">WanderWise</h4>
            <p className="text-gray-300 mt-2">© 2024 WanderWise. Making travel planning effortless.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default About; 