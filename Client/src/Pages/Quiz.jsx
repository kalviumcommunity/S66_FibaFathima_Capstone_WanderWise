import { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams, Link } from 'react-router-dom';
import { Button } from "@/Components/ui/button";
import { ArrowLeft, Check, Palmtree, Landmark, Leaf, Pizza, History, ShoppingBag, Clock, Cloud, Flame, Camera, Compass } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { destinationService } from '../services/destinationService';

const Quiz = () => {
  const { destinationId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [destination, setDestination] = useState(location.state?.destination || null);

  // State
  const [step, setStep] = useState(1);
  const [preferences, setPreferences] = useState([]);
  const [duration, setDuration] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!destination && destinationId) {
      setIsLoading(true);
      destinationService.getDestinationById(destinationId)
        .then(setDestination)
        .catch((err) => {
          console.error(err);
          toast.error("Failed to load destination. Please try again.");
        })
        .finally(() => setIsLoading(false));
    }
  }, [destination, destinationId]);

  const preferenceOptions = [
    { id: 'popular', label: 'Popular', icon: <Flame className="w-8 h-8 text-orange-500" /> },
    { id: 'museum', label: 'Cultural', icon: <Landmark className="w-8 h-8 text-blue-500" /> },
    { id: 'nature', label: 'Nature', icon: <Leaf className="w-8 h-8 text-emerald-500" /> },
    { id: 'foodie', label: 'Foodie', icon: <Pizza className="w-8 h-8 text-red-500" /> },
    { id: 'history', label: 'History', icon: <History className="w-8 h-8 text-amber-700" /> },
    { id: 'adventure', label: 'Adventure', icon: <Compass className="w-8 h-8 text-indigo-500" /> },
  ];

  const durationOptions = [
    { id: 'weekend', label: 'Short Break', sub: '2-3 Days' },
    { id: 'week', label: 'Classic Trip', sub: '5-7 Days' },
    { id: 'extended', label: 'Slow Travel', sub: '10+ Days' },
  ];

  const togglePreference = (id) => {
    setPreferences(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const handleContinue = () => {
    if (preferences.length === 0) {
      toast.error("Tell us what you like! Select at least one interest. ✨");
      return;
    }
    if (!duration) {
      toast.error("How long is the journey? Select a duration. 🕒");
      return;
    }

    // Navigate to Budget Planner with data
    navigate(`/budget/${destinationId}`, {
      state: {
        destination,
        quizAnswers: {
          styles: preferences,
          duration: duration
        }
      }
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#4facfe] to-[#00f2fe] flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-white border-t-transparent shadow-2xl"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-[#4facfe] to-[#00f2fe] dark:from-[#4facfe] dark:to-[#a1c4fd] flex flex-col p-6 font-sans transition-colors duration-1000">

      {/* Decorative Clouds */}
      <div className="absolute top-10 left-10 opacity-40 dark:opacity-20 animate-float pointer-events-none z-0 transition-opacity duration-500">
        <Cloud className="w-24 h-24 text-white fill-white drop-shadow-xl" />
      </div>
      <div className="absolute bottom-40 right-10 opacity-30 dark:opacity-10 animate-float animation-delay-2000 pointer-events-none z-0 transition-opacity duration-500">
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

      {/* Header */}
      <div className="relative z-10 flex items-center mb-8">
        <Link to={`/destination/${destinationId}`} className="bg-white/20 backdrop-blur-md p-3 rounded-full border border-white/20 shadow-xl transition-all hover:scale-110 active:scale-95">
          <ArrowLeft className="h-6 w-6 text-white" />
        </Link>
        <div className="flex-1 flex justify-center">
          <div className="h-1.5 w-24 bg-white/30 rounded-full overflow-hidden">
            <div className="h-full bg-white w-2/3 animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 max-w-xl mx-auto w-full flex flex-col relative z-20 pb-32">

        <div className="mb-10 text-center">
          <span className="text-6xl drop-shadow-xl block mb-4">🌟</span>
          <h1 className="text-5xl font-black text-[#0F172A] tracking-tighter drop-shadow-lg mb-4 transform -rotate-1">
            Your Perfect Vibe
          </h1>
          <p className="text-[#475569] text-xl font-medium max-w-sm mx-auto drop-shadow-md">
            What should your {destination?.name || 'trip'} be about?
          </p>
        </div>

        {/* Preferences Grid */}
        <div className="grid grid-cols-2 gap-6 mb-12">
          {preferenceOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => togglePreference(option.id)}
              className={`
                                flex flex-col items-center justify-center p-8 rounded-[32px] border-2 transition-all duration-300 transform
                                ${preferences.includes(option.id)
                  ? 'bg-white border-[#BFE3FF] shadow-xl scale-105 rotate-1 z-10 text-blue-600'
                  : 'bg-white/80 border-[#D6E9FF] text-[#1F2937] backdrop-blur-xl hover:bg-white/90 hover:scale-[1.02]'
                }
                            `}
            >
              <div className={`mb-4 p-4 rounded-2xl transition-all ${preferences.includes(option.id) ? 'bg-blue-50' : 'bg-white/10'}`}>
                {option.icon}
              </div>
              <span className="font-black text-lg uppercase tracking-wider">{option.label}</span>
            </button>
          ))}
        </div>

        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-6">
            <Clock className="w-8 h-8 text-white animate-pulse" />
            <h2 className="text-3xl font-black text-white tracking-tight uppercase">Trip Duration</h2>
          </div>

          <div className="space-y-4">
            {durationOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => setDuration(option.id)}
                className={`
                                    w-full flex items-center justify-between p-6 rounded-[28px] border-2 transition-all duration-300 text-left transform
                                    ${duration === option.id
                    ? 'bg-white border-[#BFE3FF] shadow-2xl scale-[1.02] z-10 text-blue-600'
                    : 'bg-white/80 border-[#D6E9FF] text-[#1F2937] backdrop-blur-xl hover:bg-white/90'
                  }
                                `}
              >
                <div className="flex flex-col">
                  <span className="font-black text-2xl tracking-tighter">{option.label}</span>
                  <span className={`text-sm font-bold uppercase tracking-widest ${duration === option.id ? 'text-blue-400' : 'text-white/60'}`}>
                    {option.sub}
                  </span>
                </div>
                {duration === option.id && <Check className="w-8 h-8 text-blue-600 animate-bounce" />}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-10 left-0 right-0 px-8 z-50">
        <Button
          onClick={handleContinue}
          className="w-full max-w-md mx-auto flex items-center justify-center bg-white text-blue-600 hover:bg-blue-50 rounded-full py-10 text-2xl font-black shadow-[0_20px_50px_-10px_rgba(0,0,0,0.3)] transition-all transform hover:scale-105 active:scale-95"
        >
          <Check className="w-8 h-8 mr-3 stroke-[4px]" />
          Plan My Journey
        </Button>
      </div>
    </div>
  );
};

export default Quiz;