import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/Components/ui/button";
import { Star, ShieldCheck, Heart, Home, ArrowLeft, Cloud, Sparkles, Trophy } from 'lucide-react';

const Reflection = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-[#4facfe] to-[#00f2fe] dark:from-slate-900 dark:to-slate-950 flex flex-col font-sans transition-colors duration-500">
      {/* Decorative Elements */}
      <div className="absolute top-20 left-[10%] opacity-30 animate-float pointer-events-none">
        <Cloud className="w-32 h-32 text-white fill-white" />
      </div>
      <div className="absolute top-1/2 right-[5%] opacity-10 animate-pulse pointer-events-none">
        <Sparkles className="w-48 h-48 text-white fill-white" />
      </div>

      <nav className="relative z-10 px-8 py-6 flex items-center justify-between bg-white/10 backdrop-blur-md border-b border-white/20">
        <Button variant="ghost" onClick={() => navigate(-1)} className="text-white hover:bg-white/20 rounded-full font-black px-6">
          <ArrowLeft className="h-5 w-5 mr-2 stroke-[3px]" /> Back
        </Button>
        <h1 className="text-2xl font-black text-white tracking-tighter uppercase italic">Post-Mission Brief</h1>
        <div className="w-24"></div>
      </nav>

      <main className="relative z-10 flex-1 flex flex-col items-center justify-center p-8 text-center">
        <div className="mb-12 relative">
          <Trophy className="w-32 h-32 text-yellow-300 animate-bounce drop-shadow-2xl" />
          <Star className="absolute top-0 -right-4 w-12 h-12 text-white animate-pulse" />
        </div>

        <h2 className="text-5xl md:text-7xl font-black text-white mb-6 uppercase italic tracking-tighter drop-shadow-2xl">
          Mission Accomplished
        </h2>

        <p className="text-white/80 text-xl md:text-2xl font-bold tracking-tight mb-12 max-w-2xl italic leading-relaxed">
          "Reflecting on the experiences gained and lessons learned. Data upload to soul complete."
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl mb-16">
          <div className="bg-white/20 backdrop-blur-xl p-10 rounded-[50px] border border-white/30 transition-all hover:bg-white/30 text-left">
            <Heart className="w-12 h-12 text-red-400 mb-6" />
            <h3 className="text-white font-black text-2xl uppercase italic mb-2">Core Memory</h3>
            <p className="text-white/70 font-bold">The sunset over the ancient ridge remain vivid in the neural banks.</p>
          </div>
          <div className="bg-white/20 backdrop-blur-xl p-10 rounded-[50px] border border-white/30 transition-all hover:bg-white/30 text-left">
            <ShieldCheck className="w-12 h-12 text-emerald-400 mb-6" />
            <h3 className="text-white font-black text-2xl uppercase italic mb-2">Skill Gained</h3>
            <p className="text-white/70 font-bold">Local navigation and cultural synthesis expanded by 24%.</p>
          </div>
        </div>

        <Button
          onClick={() => navigate('/dashboard')}
          size="lg"
          className="bg-white text-blue-600 hover:bg-blue-50 rounded-full px-16 py-10 text-3xl font-black shadow-2xl transition-all hover:scale-110 uppercase italic tracking-tighter"
        >
          Return to HQ <Home className="ml-4 w-10 h-10" />
        </Button>
      </main>
    </div>
  );
};

export default Reflection;
