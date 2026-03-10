import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from "@/Components/ui/button";
import { Book, Camera, MapPin, PenTool, ArrowRight, ArrowLeft, Cloud, Zap } from 'lucide-react';

const Journal = () => {
  const navigate = useNavigate();
  const { tripId } = useParams();

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-[#4facfe] to-[#00f2fe] dark:from-slate-900 dark:to-slate-950 flex flex-col font-sans transition-colors duration-500">
      {/* Decorative Elements */}
      <div className="absolute top-20 right-[10%] opacity-30 animate-float pointer-events-none">
        <Cloud className="w-32 h-32 text-white fill-white" />
      </div>

      <nav className="relative z-10 px-8 py-6 flex items-center justify-between bg-white/10 backdrop-blur-md border-b border-white/20">
        <Button variant="ghost" onClick={() => navigate(-1)} className="text-white hover:bg-white/20 rounded-full font-black px-6">
          <ArrowLeft className="h-5 w-5 mr-2 stroke-[3px]" /> Back
        </Button>
        <h1 className="text-2xl font-black text-white tracking-tighter uppercase italic">Mission Log</h1>
        <div className="w-24"></div>
      </nav>

      <main className="relative z-10 flex-1 flex flex-col items-center justify-center p-8 text-center">
        <div className="mb-12 relative">
          <div className="bg-white p-6 rounded-[32px] shadow-2xl transform rotate-6 hover:rotate-0 transition-transform">
            <Book className="w-20 h-20 text-blue-600" />
          </div>
          <PenTool className="absolute -bottom-4 -right-4 w-12 h-12 text-white drop-shadow-lg" />
        </div>

        <h2 className="text-5xl md:text-7xl font-black text-white mb-6 uppercase italic tracking-tighter drop-shadow-2xl">
          Travel Journal
        </h2>

        <p className="text-white/80 text-xl font-bold tracking-tight mb-12 max-w-2xl italic leading-relaxed">
          "Every journey tells a story. Document your mission objectives and captured memories in your encrypted neural journal."
        </p>

        <div className="w-full max-w-4xl bg-white/10 backdrop-blur-2xl p-12 rounded-[60px] border border-white/30 shadow-3xl mb-16 text-left">
          <div className="flex items-center gap-6 mb-8 border-b border-white/10 pb-6">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg">
              <Zap className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h3 className="text-white font-black text-2xl uppercase italic tracking-tighter">Day 1: Arrival</h3>
              <p className="text-white/60 font-bold uppercase tracking-widest text-xs">Mission Initialized • Entry #001</p>
            </div>
          </div>
          <p className="text-white/90 text-lg font-medium italic leading-relaxed mb-8">
            The air is different here. Atmosphere analysis suggests optimal conditions for exploration. Scanned the perimeter and secured base camp...
          </p>
          <div className="flex gap-4">
            <div className="w-32 h-32 bg-white/20 rounded-3xl border-2 border-dashed border-white/30 flex items-center justify-center group cursor-pointer hover:bg-white/30 transition-all">
              <Camera className="w-8 h-8 text-white opacity-50 group-hover:opacity-100" />
            </div>
          </div>
        </div>

        <Button
          onClick={() => navigate('/reflection')}
          size="lg"
          className="bg-black text-white hover:bg-blue-600 rounded-full px-12 py-10 text-3xl font-black shadow-2xl transition-all hover:scale-105 uppercase italic tracking-tighter"
        >
          Final Reflection <ArrowRight className="ml-4 w-10 h-10" />
        </Button>
      </main>
    </div>
  );
};

export default Journal;
