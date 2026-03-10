import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/Components/ui/button";
import { Sparkles, ArrowRight, Map, Compass, Camera, ArrowLeft, Cloud } from 'lucide-react';

const ExperienceDiscovery = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-[#4facfe] to-[#00f2fe] dark:from-slate-900 dark:to-slate-950 flex flex-col font-sans transition-colors duration-500">
      {/* Decorative Elements */}
      <div className="absolute top-20 left-[10%] opacity-30 animate-float pointer-events-none">
        <Cloud className="w-32 h-32 text-white fill-white" />
      </div>
      <div className="absolute bottom-20 right-[10%] opacity-20 animate-float animation-delay-2000 pointer-events-none">
        <Cloud className="w-48 h-48 text-white fill-white" />
      </div>

      <nav className="relative z-10 px-8 py-6 flex items-center justify-between bg-white/10 backdrop-blur-md border-b border-white/20">
        <Button variant="ghost" onClick={() => navigate(-1)} className="text-white hover:bg-white/20 rounded-full font-black px-6">
          <ArrowLeft className="h-5 w-5 mr-2 stroke-[3px]" /> Back
        </Button>
        <h1 className="text-2xl font-black text-white tracking-tighter uppercase italic">Scout Intel</h1>
        <div className="w-24"></div>
      </nav>

      <main className="relative z-10 flex-1 flex flex-col items-center justify-center p-8 text-center">
        <div className="mb-12 relative">
          <Compass className="w-32 h-32 text-white animate-spin-slow drop-shadow-2xl" />
          <Sparkles className="absolute -top-4 -right-4 w-12 h-12 text-yellow-300 animate-pulse" />
        </div>

        <h2 className="text-5xl md:text-7xl font-black text-white mb-6 uppercase italic tracking-tighter drop-shadow-2xl">
          Experience <br /> Discovery
        </h2>

        <p className="text-white/80 text-xl md:text-2xl font-bold tracking-tight mb-12 max-w-2xl italic leading-relaxed">
          "Uncovering the hidden gems and local secrets of your destination. Our AI is analyzing regional data to find your perfect match."
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl mb-16">
          {[
            { icon: Map, label: "Hidden Paths", desc: "Secret trails & views" },
            { icon: Camera, label: "Photo Intel", desc: "Optimal capture spots" },
            { icon: Sparkles, label: "Local Magic", desc: "Authentic rituals" }
          ].map((item, i) => (
            <div key={i} className="bg-white/20 backdrop-blur-xl p-8 rounded-[40px] border border-white/30 transform hover:scale-105 transition-all">
              <item.icon className="w-12 h-12 text-white mx-auto mb-4" />
              <h3 className="text-white font-black text-xl mb-2 uppercase italic">{item.label}</h3>
              <p className="text-white/70 font-bold text-sm">{item.desc}</p>
            </div>
          ))}
        </div>

        <Button
          // Actually diagram says Itinerary -> Experience Discovery -> Travel Journal -> Reflection -> Home
          // So next is Travel Journal.
          onClick={() => navigate('/trips')} // Using /trips as a generic way to find journal or similar if ID is not available here. 
          // Let's assume we can go to Journal if we have a trip ID, but here it's a generic page.
          // For the sake of the flow diagram: Itinerary -> Experience Discovery -> Travel Journal.
          size="lg"
          className="bg-white text-blue-600 hover:bg-blue-50 rounded-full px-12 py-10 text-3xl font-black shadow-2xl transition-all hover:scale-105 uppercase italic tracking-tighter"
        >
          Continue to Journal <ArrowRight className="ml-4 w-10 h-10" />
        </Button>
      </main>
    </div>
  );
};

export default ExperienceDiscovery;
