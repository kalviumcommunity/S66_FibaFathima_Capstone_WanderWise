import { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams, Link } from 'react-router-dom';
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import {
  Users,
  Calendar,
  Wallet,
  Sparkles,
  User,
  Heart,
  Users2,
  ArrowRight,
  Cloud,
  ChevronLeft
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { destinationService } from '../services/destinationService';

const Quiz = () => {
  const { destinationId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [destination, setDestination] = useState(location.state?.destination || null);

  // Quiz State
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    type: '',
    days: '',
    travelers: '',
    budget: '',
    currency: 'INR',
    extra: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!destination && destinationId) {
      setIsLoading(true);
      destinationService.getDestinationById(destinationId)
        .then(setDestination)
        .catch((err) => {
          console.error(err);
          toast.error("Cloud connection failed. Retrying...");
        })
        .finally(() => setIsLoading(false));
    }
  }, [destination, destinationId]);

  const typeOptions = [
    { id: 'solo', label: 'Solo Traveler', icon: <User className="w-8 h-8 text-blue-500" /> },
    { id: 'couple', label: 'Couple', icon: <Heart className="w-8 h-8 text-red-500" /> },
    { id: 'family', label: 'Family Trip', icon: <Users2 className="w-8 h-8 text-emerald-500" /> },
    { id: 'friends', label: 'Friends Squad', icon: <Users className="w-8 h-8 text-purple-500" /> },
  ];

  const handleNext = () => {
    if (step === 1 && !formData.type) {
      toast.error("Specify your squad type! 🚀");
      return;
    }
    if (step === 2 && (!formData.days || parseInt(formData.days) <= 0)) {
      toast.error("How many solar days are we planning? ⏳");
      return;
    }
    if (step === 3 && (!formData.travelers || parseInt(formData.travelers) <= 0)) {
      toast.error("How many lifeforms are joining? 🛸");
      return;
    }
    if (step === 4 && (!formData.budget || parseInt(formData.budget) <= 0)) {
      toast.error("Specify your energy units (budget)! 💰");
      return;
    }

    if (step < 5) {
      setStep(step + 1);
    } else {
      handleFinish();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      navigate('/destinations');
    }
  };

  const handleFinish = () => {
    setIsLoading(true);
    // Simulate AI analysis
    setTimeout(() => {
      navigate(`/generate-trip/${destinationId}`, {
        state: {
          destination,
          quizAnswers: formData,
          budget: formData.budget,
          currency: formData.currency
        }
      });
    }, 1500);
  };

  if (isLoading && step === 1) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#4facfe] to-[#00f2fe] flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-white border-t-transparent shadow-2xl"></div>
      </div>
    );
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-4xl font-black text-white mb-8 tracking-tighter uppercase italic drop-shadow-lg text-center">
              Who's coming?
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {typeOptions.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setFormData({ ...formData, type: opt.id })}
                  className={`p-6 rounded-[32px] border-2 transition-all duration-300 flex flex-col items-center gap-4 ${formData.type === opt.id
                      ? 'bg-white border-blue-400 shadow-2xl scale-105 z-10'
                      : 'bg-white/20 border-white/20 text-white hover:bg-white/30'
                    }`}
                >
                  <div className={`p-4 rounded-2xl ${formData.type === opt.id ? 'bg-blue-50' : 'bg-white/10'}`}>
                    {opt.icon}
                  </div>
                  <span className={`font-black uppercase tracking-widest text-xs ${formData.type === opt.id ? 'text-blue-600' : 'text-white'}`}>
                    {opt.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        );
      case 2:
        return (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-4xl font-black text-white mb-8 tracking-tighter uppercase italic drop-shadow-lg text-center">
              Trip Duration?
            </h2>
            <div className="space-y-6">
              <p className="text-white/80 font-bold italic text-center">"Time is the currency of adventure."</p>
              <div className="relative group">
                <Calendar className="absolute left-6 top-1/2 transform -translate-y-1/2 text-white/50 w-6 h-6" />
                <Input
                  type="number"
                  placeholder="Number of days"
                  value={formData.days}
                  onChange={(e) => setFormData({ ...formData, days: e.target.value })}
                  className="h-20 pl-16 bg-white/10 border-2 border-white/20 rounded-3xl text-2xl font-black text-white placeholder-white/30 focus:bg-white/20 transition-all text-center"
                />
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-4xl font-black text-white mb-8 tracking-tighter uppercase italic drop-shadow-lg text-center">
              Traveler Count?
            </h2>
            <div className="space-y-6">
              <p className="text-white/80 font-bold italic text-center">"Strength in numbers, joy in company."</p>
              <div className="relative group">
                <Users className="absolute left-6 top-1/2 transform -translate-y-1/2 text-white/50 w-6 h-6" />
                <Input
                  type="number"
                  placeholder="How many people?"
                  value={formData.travelers}
                  onChange={(e) => setFormData({ ...formData, travelers: e.target.value })}
                  className="h-20 pl-16 bg-white/10 border-2 border-white/20 rounded-3xl text-2xl font-black text-white placeholder-white/30 focus:bg-white/20 transition-all text-center"
                />
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-4xl font-black text-white mb-8 tracking-tighter uppercase italic drop-shadow-lg text-center">
              Budget Limit?
            </h2>
            <div className="space-y-6">
              <div className="flex justify-center gap-2 mb-4">
                {['INR', 'USD', 'EUR'].map(curr => (
                  <button
                    key={curr}
                    onClick={() => setFormData({ ...formData, currency: curr })}
                    className={`px-4 py-2 rounded-xl font-black text-xs transition-all ${formData.currency === curr ? 'bg-white text-blue-600 shadow-lg' : 'bg-white/10 text-white'
                      }`}
                  >
                    {curr}
                  </button>
                ))}
              </div>
              <div className="relative group">
                <Wallet className="absolute left-6 top-1/2 transform -translate-y-1/2 text-white/50 w-6 h-6" />
                <Input
                  type="number"
                  placeholder="Total budget amount"
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                  className="h-20 pl-16 bg-white/10 border-2 border-white/20 rounded-3xl text-2xl font-black text-white placeholder-white/30 focus:bg-white/20 transition-all text-center"
                />
              </div>
            </div>
          </div>
        );
      case 5:
        return (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-4xl font-black text-white mb-8 tracking-tighter uppercase italic drop-shadow-lg text-center">
              Extra Vibes?
            </h2>
            <div className="space-y-6">
              <p className="text-white/80 font-bold italic text-center">"Anything specific we should tell the AI?"</p>
              <textarea
                placeholder="E.g. I love hidden cafes, high-adrenaline spots, or vintage markets..."
                value={formData.extra}
                onChange={(e) => setFormData({ ...formData, extra: e.target.value })}
                className="w-full h-40 p-6 bg-white/10 border-2 border-white/20 rounded-[32px] text-lg font-bold text-white placeholder-white/30 focus:bg-white/20 transition-all focus:outline-none resize-none"
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-[#4facfe] to-[#00f2fe] dark:from-[#4facfe] dark:to-[#a1c4fd] flex flex-col p-6 font-sans transition-colors duration-1000">

      {/* Decorative BG Elements */}
      <div className="absolute top-[10%] left-[5%] opacity-30 animate-float pointer-events-none">
        <Cloud className="w-32 h-32 text-white fill-white drop-shadow-2xl" />
      </div>
      <div className="absolute bottom-[20%] right-[10%] opacity-20 animate-float animation-delay-2000 pointer-events-none">
        <Cloud className="w-48 h-48 text-white fill-white drop-shadow-2xl" />
      </div>

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between mb-12">
        <button
          onClick={handleBack}
          className="bg-white/20 backdrop-blur-md p-4 rounded-full border border-white/20 shadow-xl transition-all hover:scale-110 active:scale-95"
        >
          <ChevronLeft className="h-6 w-6 text-white stroke-[3px]" />
        </button>
        <div className="flex-1 flex justify-center px-4">
          <div className="max-w-xs w-full h-2 bg-white/20 rounded-full overflow-hidden border border-white/10">
            <div
              className="h-full bg-white transition-all duration-700 shadow-[0_0_15px_rgba(255,255,255,0.5)]"
              style={{ width: `${(step / 5) * 100}%` }}
            ></div>
          </div>
        </div>
        <div className="bg-white/20 backdrop-blur-md py-2 px-4 rounded-2xl border border-white/20">
          <span className="text-white font-black italic tracking-tighter">{step}/5</span>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center relative z-20">
        <div className="w-full max-w-lg mb-12">
          {renderStep()}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="relative z-50 py-8 flex flex-col items-center gap-6">
        <Button
          onClick={handleNext}
          disabled={isLoading}
          className="w-full max-w-lg mx-auto flex items-center justify-center bg-white text-blue-600 hover:bg-blue-50 rounded-[32px] py-12 text-3xl font-black shadow-2xl transition-all transform hover:scale-105 active:scale-95"
        >
          {step === 5 ? (
            <>
              {isLoading ? "Synthesizing..." : "Generate Mission"} <Sparkles className="ml-3 w-8 h-8" />
            </>
          ) : (
            <>
              Next Step <ArrowRight className="ml-3 w-8 h-8 stroke-[3px]" />
            </>
          )}
        </Button>
      </div>

    </div>
  );
};

export default Quiz;