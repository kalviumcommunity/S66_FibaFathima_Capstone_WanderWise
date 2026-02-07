import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { Eye, EyeOff, Mail, Lock, Globe, ArrowLeft, Cloud, MapPin, Paperclip } from 'lucide-react';

const SimpleLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);
    const navigate = useNavigate();
    const { login, googleLogin } = useAuth();

    // Hardcoded images from Landing Page for consistency
    const polaroidImages = [
        "https://images.unsplash.com/photo-1506929562872-bb421503ef21",
        "https://images.unsplash.com/photo-1599394022918-6c2776530abb"
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            console.log('Attempting login with:', { email, password: password.length + ' chars' });
            await login({ email, password });
            toast.success('Login successful!');
            navigate('/dashboard');
        } catch (err) {
            console.error('Login error:', err);
            toast.error(err.message || 'Login failed');
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            setIsGoogleLoading(true);
            await googleLogin(credentialResponse.credential);
            toast.success('Google login successful!');
            navigate('/dashboard');
        } catch (err) {
            const errorMessage = err.message || 'Google login failed';
            toast.error(errorMessage);
        } finally {
            setIsGoogleLoading(false);
        }
    };

    const handleGoogleError = () => {
        toast.error('Google login failed');
    };

    return (
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
            <div className="min-h-screen w-full relative overflow-x-hidden bg-gradient-to-b from-[#4facfe] to-[#00f2fe] dark:from-[#4facfe] dark:to-[#a1c4fd] bg-fixed flex font-sans transition-colors duration-1000">

                {/* Decorative Clouds (Fixed Position) */}
                <div className="absolute top-10 left-10 opacity-80 dark:opacity-20 animate-float pointer-events-none z-0 transition-opacity duration-500">
                    <Cloud className="w-24 h-24 text-white fill-white drop-shadow-xl" />
                </div>
                <div className="absolute bottom-20 right-20 opacity-60 dark:opacity-10 animate-float animation-delay-2000 pointer-events-none z-0 transition-opacity duration-500">
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

                <div className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-center relative z-10 p-4 lg:p-12 gap-12 lg:gap-24">

                    {/* Left Side: Branding (Hidden on small mobile to focus on form, or kept for consistency) - Visible on large screens */}
                    <div className="hidden lg:flex flex-col items-center justify-center w-full lg:w-1/2 space-y-12">
                        {/* Roamy Logo Style Title */}
                        <div className="text-center">
                            <Link to="/" className="inline-block group">
                                <h1 className="text-5xl xl:text-6xl font-black text-white drop-shadow-md tracking-tight transform -rotate-2 group-hover:scale-105 transition-transform duration-300">
                                    WanderWise
                                </h1>
                            </Link>
                            <p className="text-lg text-white/90 mt-3 font-medium max-w-md mx-auto text-center leading-relaxed">
                                "The journey of a thousand miles begins with a single login."
                            </p>
                        </div>

                        {/* 3D Collage Container - Directly from Index.jsx */}
                        <div className="relative w-full max-w-[280px] aspect-square transform scale-90 hover:scale-100 transition-transform duration-500">
                            {/* Polaroid 1 (Left Back) */}
                            <div className="absolute top-0 left-4 w-48 h-56 bg-white p-2 rounded-xl shadow-xl transform -rotate-12 transition-transform hover:rotate-0 hover:z-20 duration-300">
                                <div className="w-full h-5/6 bg-gray-200 overflow-hidden rounded-lg mb-4">
                                    <img
                                        src={polaroidImages[0]}
                                        className="w-full h-full object-cover"
                                        alt="Travel"
                                    />
                                </div>
                                <div className="h-1/6 bg-white"></div>
                            </div>

                            {/* Polaroid 2 (Right Front) */}
                            <div className="absolute top-10 right-4 w-48 h-56 bg-white p-2 rounded-xl shadow-xl transform rotate-6 z-10 transition-transform hover:rotate-0 duration-300">
                                <div className="w-full h-5/6 bg-gray-200 overflow-hidden rounded-lg mb-4">
                                    <img
                                        src={polaroidImages[1]}
                                        className="w-full h-full object-cover"
                                        alt="Adventure"
                                    />
                                </div>
                            </div>

                            {/* 3D Elements */}
                            <div className="absolute -top-6 -left-2 z-20 animate-bounce">
                                <div className="w-14 h-14 bg-red-500 rounded-full flex items-center justify-center shadow-lg border-4 border-white">
                                    <MapPin className="w-7 h-7 text-white fill-white" />
                                </div>
                            </div>

                            <div className="absolute -bottom-4 right-8 z-20 transform rotate-45">
                                <Paperclip className="w-20 h-20 text-white/80 drop-shadow-xl" />
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Login Form */}
                    <div className="w-full lg:w-1/2 max-w-md">
                        <div className="bg-white/20 backdrop-blur-2xl border border-white/30 shadow-2xl rounded-[20px] p-5 lg:p-6 transform hover:scale-[1.01] transition-all duration-500">
                            <div className="text-center mb-8">
                                <div className="lg:hidden mb-4">
                                    <h1 className="text-3xl font-black text-blue-600 dark:text-white transform -rotate-2">WanderWise</h1>
                                </div>
                                <h2 className="text-xl font-black text-white mt-1 drop-shadow-sm">Welcome Back!</h2>
                                <p className="text-white/80 mt-1 font-medium italic drop-shadow-sm text-xs">Ready for your next adventure?</p>
                            </div>

                            {/* Google Login Button */}
                            <div className="w-full mb-6 flex justify-center scale-90 origin-center">
                                <GoogleLogin
                                    onSuccess={handleGoogleSuccess}
                                    onError={handleGoogleError}
                                    theme="filled_blue"
                                    size="large"
                                    text="signin_with"
                                    shape="pill"
                                    width="350"
                                    disabled={isGoogleLoading}
                                />
                            </div>

                            <div className="relative mb-8">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-white/10"></div>
                                </div>
                                <div className="relative flex justify-center text-[10px] uppercase tracking-wider font-bold">
                                    <span className="px-3 bg-transparent text-white/60">Or continue with email</span>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-bold text-white/80 mb-2 ml-1">
                                        Email
                                    </label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                                        </div>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full pl-11 pr-4 py-3 bg-white/10 dark:bg-white/10 border-2 border-white/20 focus:border-white focus:bg-white/20 rounded-xl focus:outline-none focus:ring-4 focus:ring-white/10 transition-all duration-300 text-white placeholder-white/40 font-bold"
                                            placeholder="hello@example.com"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between items-center ml-1 mb-2">
                                        <label className="block text-sm font-bold text-white/80">
                                            Password
                                        </label>
                                        <a href="#" className="text-sm font-bold text-white/90 hover:text-white transition-colors">
                                            Forgot?
                                        </a>
                                    </div>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                                        </div>
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full pl-11 pr-12 py-3 bg-white/10 dark:bg-white/10 border-2 border-white/20 focus:border-white focus:bg-white/20 rounded-xl focus:outline-none focus:ring-4 focus:ring-white/10 transition-all duration-300 text-white placeholder-white/40 font-bold"
                                            placeholder="••••••••"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-white/60 hover:text-white transition-colors"
                                        >
                                            {showPassword ? (
                                                <EyeOff className="h-5 w-5" />
                                            ) : (
                                                <Eye className="h-5 w-5" />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-6 rounded-full font-bold text-sm shadow-lg shadow-blue-500/30 hover:shadow-xl hover:scale-[1.02] active:scale-95 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                                >
                                    {isLoading ? 'Signing In...' : 'Sign In'}
                                </button>
                            </form>

                            <div className="mt-6 text-center bg-white/10 p-3 rounded-[16px] border border-white/20">
                                <p className="text-xs text-white/80">
                                    New here?{' '}
                                    <Link to="/signup" className="text-white hover:text-blue-100 font-black underline underline-offset-4 decoration-2 transition-all">
                                        Create Account
                                    </Link>
                                </p>
                            </div>
                            <div className="mt-4 text-center">
                                <Link to="/" className="text-sm font-bold text-white/80 hover:text-white transition-colors">
                                    ← Back to Home
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </GoogleOAuthProvider>
    );
};

export default SimpleLogin;
