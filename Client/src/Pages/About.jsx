import { useNavigate } from 'react-router-dom';
import { Globe, Cloud, Sparkles, Users, Rocket, ArrowRight } from 'lucide-react';
import { Button } from "@/Components/ui/button";

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-[#4facfe] to-[#00f2fe] dark:from-[#4facfe] dark:to-[#a1c4fd] transition-colors duration-1000 font-sans">

      {/* Decorative Clouds */}
      <div className="absolute top-20 left-[10%] opacity-30 dark:opacity-10 animate-float pointer-events-none z-0">
        <Cloud className="w-32 h-32 text-white fill-white drop-shadow-2xl" />
      </div>
      <div className="absolute top-60 right-[5%] opacity-20 dark:opacity-5 animate-float animation-delay-2000 pointer-events-none z-0">
        <Cloud className="w-48 h-48 text-white fill-white drop-shadow-2xl" />
      </div>

      {/* Night Mode Stars */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none hidden dark:block z-0">
        {[...Array(30)].map((_, i) => (
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

      <div className="relative z-10">
        {/* Navigation Bar */}
        <nav className="bg-white/10 backdrop-blur-2xl border-b border-white/20 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">
              <div className="flex items-center space-x-3 group cursor-pointer" onClick={() => navigate('/')}>
                <div className="bg-white p-2 rounded-xl shadow-xl transform group-hover:rotate-12 transition-transform">
                  <Globe className="h-6 w-6 text-blue-600" />
                </div>
                <h1 className="text-2xl font-black text-white tracking-tighter uppercase italic">WanderWise</h1>
              </div>
              <Button
                variant="ghost"
                onClick={() => navigate('/')}
                className="text-white hover:bg-white/20 rounded-full font-black px-8 transition-all hover:scale-105"
              >
                Back To Home
              </Button>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="py-24 px-4 text-center">
          <div className="max-w-7xl mx-auto">
            <div className="inline-block bg-white/20 backdrop-blur-md px-6 py-2 rounded-full border border-white/20 text-white font-black tracking-widest uppercase italic mb-8">
              The Future of Travel
            </div>
            <h2 className="text-7xl md:text-9xl font-black text-white mb-8 tracking-tighter drop-shadow-2xl leading-[0.9] transform -rotate-1">
              WE ARE <br /> WANDERWISE.
            </h2>
            <p className="text-white/90 text-2xl md:text-3xl font-bold tracking-tight max-w-3xl mx-auto drop-shadow-lg italic leading-relaxed">
              "We believe every journey should be as unique as the traveler taking it. Our mission is to democratize adventure through artificial intelligence."
            </p>
          </div>
        </section>

        {/* About Card */}
        <section className="py-20 px-4">
          <div className="max-w-5xl mx-auto bg-white/95 dark:bg-white/90 backdrop-blur-3xl rounded-[60px] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] p-12 md:p-20 border border-white/40 dark:border-white/20 relative group overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-32 -mt-32 transition-all group-hover:bg-blue-500/20" />

            <div className="relative z-10 space-y-12">
              <div className="text-center md:text-left">
                <h3 className="text-4xl md:text-5xl font-black text-gray-900 mb-8 tracking-tighter uppercase italic">
                  Our DNA
                </h3>
                <p className="text-xl md:text-2xl text-gray-600 font-bold leading-relaxed">
                  WanderWise is your AI-powered travel companion, designed to make trip planning effortless, personalized, and fun. Discover amazing destinations, plan itineraries, and optimize your travel budget—all in one place.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-16">
                {[
                  { title: "AI Intelligence", desc: "Proprietary neural networks crunching millions of data points to find your perfect vibe.", icon: Sparkles, color: "text-blue-600 bg-blue-100" },
                  { title: "Human Centered", desc: "Designed for travelers, by travelers. We prioritize soul over logic.", icon: Users, color: "text-purple-600 bg-purple-100" },
                  { title: "Global Reach", desc: "From the bustling streets of Tokyo to the hidden gems of Tuscany.", icon: Globe, color: "text-emerald-600 bg-emerald-100" },
                  { title: "Pure Freedom", desc: "No more rigid packages. Just pure, unadulterated exploration.", icon: Rocket, color: "text-orange-600 bg-orange-100" }
                ].map((item, i) => (
                  <div key={i} className="group/item flex items-start gap-6 p-6 rounded-[32px] bg-gray-50/50 dark:bg-gray-50/50 hover:bg-white transition-all border border-transparent hover:border-blue-500/20 hover:shadow-2xl">
                    <div className={`w-16 h-16 rounded-[24px] flex items-center justify-center flex-shrink-0 transition-transform group-hover/item:rotate-12 ${item.color}`}>
                      <item.icon className="w-8 h-8" />
                    </div>
                    <div>
                      <h4 className="text-2xl font-black text-gray-900 mb-2 tracking-tight uppercase italic">{item.title}</h4>
                      <p className="text-gray-500 font-bold leading-snug">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-12 border-t border-gray-200">
                <h3 className="text-3xl font-black text-gray-900 mb-10 tracking-tighter uppercase italic">How It Works</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                  {[
                    "Find your dream location using our neural search.",
                    "Engage with our AI-vibe check quiz.",
                    "Define your budget and mission parameters.",
                    "Deploy your personalized AI itinerary.",
                    "Save, track, and share your adventures."
                  ].map((step, i) => (
                    <div key={i} className="flex items-center gap-6 group/step">
                      <div className="w-10 h-10 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center font-black text-xl group-hover:scale-125 transition-transform">{i + 1}</div>
                      <p className="text-lg font-bold text-gray-600">{step}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-16 text-center">
                <Button
                  size="lg"
                  onClick={() => navigate('/signup')}
                  className="bg-black dark:bg-white text-white dark:text-black hover:bg-blue-600 dark:hover:bg-blue-500 hover:text-white rounded-full px-16 py-10 text-3xl font-black shadow-[0_20px_40px_rgba(0,0,0,0.3)] hover:scale-105 transition-all duration-500 uppercase italic tracking-tighter"
                >
                  Join the Mission <ArrowRight className="ml-4 w-8 h-8 stroke-[3px]" />
                </Button>
                <p className="mt-8 text-gray-400 font-black uppercase tracking-widest text-sm italic">
                  Zero setup. All adventure.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-20 bg-white/10 backdrop-blur-3xl border-t border-white/20">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <div className="flex flex-col items-center">
              <div className="bg-white p-3 rounded-2xl shadow-2xl mb-6">
                <Globe className="h-10 w-10 text-blue-600" />
              </div>
              <h4 className="text-4xl font-black text-white tracking-tighter uppercase italic mb-4">WanderWise</h4>
              <p className="text-white/60 font-medium text-lg max-w-sm mx-auto"> Making travel planning effortless, one line of code at a time.</p>
              <div className="h-px w-32 bg-white/20 my-10" />
              <p className="text-white/40 font-black uppercase tracking-widest text-xs">© 2024 WanderWise Global Intelligence</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default About;