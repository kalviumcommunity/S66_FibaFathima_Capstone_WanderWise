import { useNavigate, useParams } from 'react-router-dom';
import { Button } from "@/Components/ui/button";
import { ArrowLeft, Cloud, Sparkles, Zap, BookOpen } from 'lucide-react';

const ComingSoon = () => {
    const navigate = useNavigate();
    const { tripId } = useParams();

    return (
        <div className="min-h-screen w-full relative overflow-hidden bg-gradient-to-b from-[#4facfe] to-[#00f2fe] dark:from-slate-900 dark:to-slate-950 transition-colors duration-1000 font-sans">

            {/* Decorative Clouds */}
            <div className="absolute top-20 left-10 opacity-30 dark:opacity-10 animate-float pointer-events-none z-0">
                <Cloud className="w-32 h-32 text-white fill-white drop-shadow-xl" />
            </div>
            <div className="absolute top-60 right-20 opacity-20 dark:opacity-5 animate-float animation-delay-2000 pointer-events-none z-0">
                <Cloud className="w-48 h-48 text-white fill-white drop-shadow-xl" />
            </div>
            <div className="absolute bottom-20 left-1/4 opacity-25 dark:opacity-10 animate-float animation-delay-4000 pointer-events-none z-0">
                <Cloud className="w-40 h-40 text-white fill-white drop-shadow-xl" />
            </div>

            {/* Night Mode Stars */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none hidden dark:block">
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

            <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4">
                {/* Back Button */}
                <div className="absolute top-8 left-8">
                    <Button
                        variant="ghost"
                        onClick={() => navigate(tripId ? `/itinerary/${tripId}` : '/dashboard')}
                        className="text-white hover:bg-white/20 rounded-full font-black px-6 transition-all"
                    >
                        <ArrowLeft className="h-5 w-5 mr-2 stroke-[3px]" />
                        Back
                    </Button>
                </div>

                {/* Main Content */}
                <div className="text-center max-w-3xl">
                    {/* Animated Icon */}
                    <div className="mb-8 relative">
                        <div className="inline-block relative">
                            <div className="absolute inset-0 bg-white/20 rounded-full blur-3xl animate-pulse"></div>
                            <div className="relative bg-white/10 backdrop-blur-lg border-4 border-white/30 rounded-full p-12 shadow-2xl">
                                <BookOpen className="h-32 w-32 text-white animate-bounce" />
                            </div>
                        </div>
                        <Sparkles className="absolute top-0 right-0 h-12 w-12 text-yellow-300 animate-pulse" />
                        <Zap className="absolute bottom-0 left-0 h-12 w-12 text-yellow-300 animate-pulse animation-delay-1000" />
                    </div>

                    {/* Title */}
                    <h1 className="text-6xl md:text-8xl font-black text-white mb-6 tracking-tighter drop-shadow-2xl transform -rotate-1">
                        Coming Soon! 🚀
                    </h1>

                    {/* Description */}
                    <p className="text-2xl md:text-3xl text-white/90 font-bold mb-4 tracking-tight drop-shadow-lg">
                        Journal Feature
                    </p>
                    <p className="text-lg md:text-xl text-white/80 font-medium mb-12 max-w-2xl mx-auto leading-relaxed">
                        We're working hard to bring you an amazing journal experience where you can document your travel memories, add photos, and share your adventures. Stay tuned!
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button
                            onClick={() => navigate('/dashboard')}
                            className="bg-white text-blue-600 hover:bg-blue-50 font-black rounded-full px-12 py-8 text-xl shadow-2xl hover:scale-105 transition-all"
                        >
                            Back to Dashboard
                        </Button>
                        {tripId && (
                            <Button
                                onClick={() => navigate(`/itinerary/${tripId}`)}
                                variant="outline"
                                className="bg-white/10 backdrop-blur-md border-2 border-white/30 text-white hover:bg-white hover:text-blue-600 font-black rounded-full px-12 py-8 text-xl shadow-2xl transition-all"
                            >
                                View Itinerary
                            </Button>
                        )}
                    </div>

                    {/* Progress Indicator */}
                    <div className="mt-16 bg-white/10 backdrop-blur-lg border border-white/30 rounded-[30px] p-8 shadow-xl">
                        <p className="text-white/70 font-bold text-sm uppercase tracking-widest mb-4">Development Progress</p>
                        <div className="w-full bg-white/20 rounded-full h-4 overflow-hidden">
                            <div className="bg-gradient-to-r from-emerald-500 to-blue-500 h-full rounded-full animate-pulse" style={{ width: '45%' }}></div>
                        </div>
                        <p className="text-white font-black text-lg mt-4">45% Complete</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ComingSoon;
