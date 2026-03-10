import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/Components/ui/button";
import { ArrowLeft, Rocket } from 'lucide-react';

const ComingSoon = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#4facfe] to-[#00f2fe] dark:from-slate-900 dark:to-slate-950 flex items-center justify-center p-4">
            <div className="text-center">
                <Rocket className="w-24 h-24 text-white mx-auto mb-8 animate-bounce" />
                <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tighter drop-shadow-xl">
                    Coming Soon
                </h1>
                <p className="text-xl md:text-2xl text-white/80 mb-12 max-w-lg mx-auto font-medium">
                    We're crafting something extraordinary. This feature will be available in the next update.
                </p>
                <Button
                    onClick={() => navigate(-1)}
                    className="bg-white text-blue-600 hover:bg-blue-50 font-black rounded-full px-10 py-6 text-xl shadow-2xl hover:scale-105 transition-all"
                >
                    <ArrowLeft className="mr-2 h-6 w-6" /> Go Back
                </Button>
            </div>
        </div>
    );
};

export default ComingSoon;
