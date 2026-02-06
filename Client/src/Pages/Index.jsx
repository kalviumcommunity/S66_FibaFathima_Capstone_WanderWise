import { useState, useEffect } from 'react';
import { Button } from "@/Components/ui/button";
import { Card } from "@/Components/ui/card";
import { MapPin, ArrowRight, Search, Heart, Star, Sun, Moon, Cloud, Paperclip } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from 'next-themes';
import { destinationService } from '../services/destinationService';

const Index = () => {
  const { isLoggedIn } = useAuth();
  const { theme, setTheme } = useTheme();
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadDestinations = async () => {
      try {
        const data = await destinationService.getDestinations({ sort: 'popular' });
        setDestinations(data);
      } catch (error) {
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

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-[#4facfe] to-[#00f2fe] dark:from-[#4facfe] dark:to-[#a1c4fd] transition-colors duration-1000 font-sans">

      {/* Decorative Clouds (approximated with CSS shapes for 3D feel) */}
      <div className="absolute top-10 left-10 opacity-80 dark:opacity-20 animate-float transition-opacity duration-500">
        <Cloud className="w-24 h-24 text-white fill-white drop-shadow-xl" />
      </div>
      <div className="absolute top-20 right-20 opacity-60 dark:opacity-10 animate-float animation-delay-2000 transition-opacity duration-500">
        <Cloud className="w-32 h-32 text-white fill-white drop-shadow-xl" />
      </div>

      {/* Decorative Clouds (approximated with CSS shapes for 3D feel) */}
      <div className="absolute top-10 left-10 opacity-80 dark:opacity-20 animate-float transition-opacity duration-500">
        <Cloud className="w-24 h-24 text-white fill-white drop-shadow-xl" />
      </div>
      <div className="absolute top-20 right-20 opacity-60 dark:opacity-10 animate-float animation-delay-2000 transition-opacity duration-500">
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

      {/* Header with Dark Mode Toggle */}
      <div className="absolute top-6 right-6 z-50">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/30"
        >
          <Sun className="h-6 w-6 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-6 w-6 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </Button>
      </div>

      {/* Main Content Area */}
      <div className="container mx-auto px-4 min-h-screen flex flex-col items-center justify-center relative z-10 pt-20">

        {/* Roamy Logo Style Title */}
        <h1 className="text-6xl md:text-8xl font-black text-[#0F172A] drop-shadow-md mb-8 tracking-tight transform -rotate-2">
          WanderWise
        </h1>

        {/* 3D Collage Container */}
        <div className="relative w-full max-w-sm md:max-w-md aspect-square mb-12">

          {/* Polaroid 1 (Left Back) */}
          <div className="absolute top-4 left-0 w-64 h-80 bg-white p-3 rounded-xl shadow-2xl transform -rotate-12 transition-transform hover:rotate-0 hover:z-30 duration-300 hover:scale-105">
            <div className="w-full h-5/6 bg-gray-200 overflow-hidden rounded-lg mb-4">
              <img
                src={destinations[0]?.images?.[0] || "https://images.unsplash.com/photo-1506929562872-bb421503ef21"}
                className="w-full h-full object-cover"
                alt="Travel"
              />
            </div>
            <div className="h-1/6 bg-white flex items-center justify-center">
              <span className="font-handwriting text-gray-600 font-bold transform -rotate-2">Dream dest.</span>
            </div>
          </div>

          {/* Polaroid 2 (Right Middle) */}
          <div className="absolute top-10 right-0 w-64 h-80 bg-white p-3 rounded-xl shadow-2xl transform rotate-6 z-10 transition-transform hover:rotate-0 hover:z-30 duration-300 hover:scale-105">
            <div className="w-full h-5/6 bg-gray-200 overflow-hidden rounded-lg mb-4">
              <img
                src={destinations[1]?.images?.[0] || "https://images.unsplash.com/photo-1599394022918-6c2776530abb"}
                className="w-full h-full object-cover"
                alt="Adventure"
              />
            </div>
            <div className="h-1/6 bg-white flex items-center justify-center">
              <span className="font-handwriting text-gray-600 font-bold transform rotate-1">Explore</span>
            </div>
          </div>

          {/* Polaroid 3 (Bottom Front) */}
          <div className="absolute bottom-0 left-12 w-64 h-80 bg-white p-3 rounded-xl shadow-2xl transform -rotate-3 z-20 transition-transform hover:rotate-0 hover:z-30 duration-300 hover:scale-105">
            <div className="w-full h-5/6 bg-gray-200 overflow-hidden rounded-lg mb-4">
              <img
                src={destinations[2]?.images?.[0] || "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1"}
                className="w-full h-full object-cover"
                alt="Journey"
              />
            </div>
            <div className="h-1/6 bg-white flex items-center justify-center">
              <span className="font-handwriting text-gray-600 font-bold">Wander</span>
            </div>
          </div>

          {/* 3D Elements */}
          <div className="absolute -top-4 -left-4 z-40 animate-bounce">
            <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center shadow-lg border-4 border-white">
              <MapPin className="w-8 h-8 text-white fill-white" />
            </div>
          </div>

          <div className="absolute -bottom-8 right-8 z-40 transform rotate-45">
            <Paperclip className="w-24 h-24 text-gray-100 drop-shadow-xl" />
          </div>
        </div>

        {/* Call to Action */}
        <div className="w-full max-w-md space-y-4">
          <Button
            onClick={() => isLoggedIn ? navigate('/destinations') : navigate('/signup')}
            className="w-full bg-white/95 backdrop-blur-xl border border-[#BFE3FF] text-blue-600 font-bold text-xl py-8 rounded-full shadow-2xl hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.2)] hover:scale-105 transition-all duration-300"
          >
            Get Started
          </Button>

          <p className="text-[#475569] text-center text-sm font-medium">
            {isLoggedIn ? "Welcome back! Ready for your next adventure?" : "Join millions of travelers discovering the world."}
          </p>
        </div>

      </div>

      {/* Decorative Bottom Wave/Cloud */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
        <svg className="relative block w-full h-[100px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="fill-white dark:fill-white/20 opacity-30"></path>
        </svg>
      </div>
    </div>
  );
};

export default Index;