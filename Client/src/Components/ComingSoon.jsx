import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/Components/ui/button";
import { ArrowLeft, Construction, Cloud, Globe, Sparkles } from 'lucide-react';

const ComingSoon = ({ feature }) => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-[#4facfe] to-[#00f2fe] dark:from-slate-900 dark:to-slate-950 transition-colors duration-500 font-sans flex items-center justify-center p-6">

            {/* Decorative Clouds */}
            <div className="absolute top-20 left-[10%] opacity-30 dark:opacity-10 animate-float pointer-events-none z-0">
                <Cloud className="w-32 h-32 text-white fill-white drop-shadow-2xl" />
            </div>
            <div className="absolute bottom-20 right-[10%] opacity-20 dark:opacity-5 animate-float animation-delay-2000 pointer-events-none z-0">
                <Cloud className="w-48 h-48 text-white fill-white drop-shadow-2xl" />
            </div>

            {/* Night Mode Stars */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none hidden dark:block z-0">
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

            <div className="relative z-10 max-w-2xl w-full">
                <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-3xl rounded-[60px] shadow-3xl p-12 md:p-20 border border-white/40 dark:border-slate-800 text-center transform hover:scale-[1.02] transition-all duration-500">
                    <div className="w-32 h-32 bg-blue-100 dark:bg-blue-900/30 rounded-[40px] flex items-center justify-center mx-auto mb-10 shadow-2xl transform rotate-12 group-hover:rotate-0 transition-transform">
                        <Construction className="w-16 h-16 text-blue-600 dark:text-blue-400" />
                    </div>

                    <h2 className="text-5xl md:text-6xl font-black text-gray-900 dark:text-white mb-6 uppercase italic tracking-tighter drop-shadow-sm">
                        Building <br /> The Future
                    </h2>

                    <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 font-bold mb-12 italic leading-relaxed">
                        The <span className="text-blue-600 dark:text-blue-400 underline underline-offset-8 decoration-4">{feature}</span> module is currently being synthesized by our neural core.
                    </p>

                    <Button
                        onClick={() => navigate('/dashboard')}
                        className="w-full bg-black dark:bg-white text-white dark:text-black hover:bg-blue-600 dark:hover:bg-blue-500 hover:text-white rounded-full py-10 text-2xl font-black shadow-[0_20px_40px_rgba(0,0,0,0.3)] transition-all duration-500 uppercase italic tracking-tighter"
                    >
                        <ArrowLeft className="w-8 h-8 mr-4 stroke-[3px]" />
                        Back To Base
                    </Button>

                    <div className="mt-12 flex items-center justify-center gap-4 opacity-40">
                        <Globe className="w-6 h-6" />
                        <Sparkles className="w-6 h-6" />
                        <span className="font-black uppercase tracking-widest text-xs italic">WanderWise Global Intel</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ComingSoon;
