import { useState } from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Eye, EyeOff, Cloud, MapPin, Paperclip } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from "sonner";
import { useAuth } from '../context/AuthContext';

const Signup = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const navigate = useNavigate();
  const { signup, googleLogin } = useAuth();

  // Hardcoded images from Landing Page for consistency
  const polaroidImages = [
    "https://images.unsplash.com/photo-1506929562872-bb421503ef21",
    "https://images.unsplash.com/photo-1599394022918-6c2776530abb"
  ];

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords don't match. Please make sure your passwords match.");
      return;
    }

    setIsLoading(true);

    try {
      await signup({
        username: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        password: formData.password
      });
      toast.success("Welcome to WanderWise! Your account has been created successfully.");
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.message || "Failed to create account. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setIsGoogleLoading(true);
      await googleLogin(credentialResponse.credential);
      toast.success("Welcome to WanderWise! You've signed up with Google successfully.");
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.message || "Google signup failed");
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleGoogleError = () => {
    toast.error('Google signup failed');
  };

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <div className="min-h-screen w-full relative overflow-x-hidden bg-gradient-to-b from-[#4facfe] to-[#00f2fe] dark:from-[#4facfe] dark:to-[#a1c4fd] bg-fixed flex font-sans transition-colors duration-1000">

        {/* Decorative Clouds (Fixed Position) */}
        <div className="absolute top-10 left-10 opacity-80 dark:opacity-20 animate-float pointer-events-none z-0 transition-opacity duration-500">
          <Cloud className="w-24 h-24 text-white fill-white drop-shadow-xl" />
        </div>
        <div className="absolute top-20 right-20 opacity-60 dark:opacity-10 animate-float animation-delay-2000 pointer-events-none z-0 transition-opacity duration-500">
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

          {/* Left Side: Branding and Hero Elements - Visible on desktop */}
          <div className="hidden lg:flex flex-col items-center justify-center w-full lg:w-1/2 space-y-12">
            {/* Roamy Logo Style Title */}
            <div className="text-center">
              <Link to="/" className="inline-block group">
                <h1 className="text-5xl xl:text-6xl font-black text-white drop-shadow-md tracking-tight transform -rotate-2 group-hover:scale-105 transition-transform duration-300">
                  WanderWise
                </h1>
              </Link>
              <p className="text-lg text-white/90 mt-3 font-medium max-w-md mx-auto text-center leading-relaxed">
                "Join the community of explorers today."
              </p>
            </div>

            {/* 3D Collage Container */}
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

          {/* Right Side - Signup Form */}
          <div className="w-full lg:w-1/2 max-w-md">
            <div className="bg-white/20 backdrop-blur-2xl border border-white/30 shadow-2xl rounded-[20px] p-5 lg:p-6 max-h-[90vh] overflow-y-auto transform hover:scale-[1.01] transition-all duration-500">
              <div className="text-center mb-8">
                <div className="lg:hidden mb-4">
                  <h1 className="text-3xl font-black text-blue-600 dark:text-white transform -rotate-2">WanderWise</h1>
                </div>
                <h2 className="text-xl font-black text-white mt-1 drop-shadow-sm">Create Account</h2>
                <p className="text-white/80 mt-1 font-medium italic drop-shadow-sm text-xs">Sign up to get started</p>
              </div>

              {/* Google Signup Button */}
              <div className="w-full mb-8 flex justify-center">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                  theme="filled_blue"
                  size="large"
                  text="signup_with"
                  shape="pill"
                  width="300"
                  disabled={isGoogleLoading}
                />
              </div>

              <div className="relative mb-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300 dark:border-slate-700"></div>
                </div>
                <div className="relative flex justify-center text-[10px] uppercase tracking-wider font-bold">
                  <span className="px-3 bg-transparent text-white/60">Or continue with email</span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="firstName" className="font-bold text-white/80 ml-1 text-xs">First Name</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      type="text"
                      placeholder="John"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                      className="rounded-xl border-2 border-white/20 bg-white/10 focus:bg-white/20 focus:border-white h-9 focus:ring-4 focus:ring-white/10 transition-all font-bold text-white placeholder-white/40 text-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="lastName" className="font-bold text-white/80 ml-1 text-xs">Last Name</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      type="text"
                      placeholder="Doe"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                      className="rounded-xl border-2 border-white/20 bg-white/10 focus:bg-white/20 focus:border-white h-9 focus:ring-4 focus:ring-white/10 transition-all font-bold text-white placeholder-white/40 text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="email" className="font-bold text-white/80 ml-1 text-xs">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="rounded-xl border-2 border-white/20 bg-white/10 focus:bg-white/20 focus:border-white h-9 focus:ring-4 focus:ring-white/10 transition-all font-bold text-white placeholder-white/40 text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="password" className="font-bold text-white/80 ml-1 text-xs">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a strong password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      className="rounded-xl border-2 border-white/20 bg-white/10 focus:bg-white/20 focus:border-white h-9 focus:ring-4 focus:ring-white/10 transition-all font-bold pr-10 text-white placeholder-white/40 text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-white/60 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="confirmPassword" className="font-bold text-white/80 ml-1 text-xs">Confirm Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      required
                      className="rounded-xl border-2 border-white/20 bg-white/10 focus:bg-white/20 focus:border-white h-9 focus:ring-4 focus:ring-white/10 transition-all font-bold pr-10 text-white placeholder-white/40 text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-3 text-white/60 hover:text-white transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-full py-2.5 font-bold text-sm shadow-lg shadow-blue-500/30 hover:shadow-xl hover:scale-[1.02] active:scale-95 transition-all duration-300 mt-2 h-10"
                >
                  {isLoading ? "Creating..." : "Create Account"}
                </Button>
              </form>

              <div className="mt-6 text-center bg-white/10 p-3 rounded-xl border border-white/20">
                <p className="text-xs text-white/80">
                  Already have an account?{' '}
                  <Link to="/login" className="text-white hover:text-blue-100 font-black underline underline-offset-4 decoration-2 transition-all ml-1">
                    Sign in here
                  </Link>
                </p>
              </div>
              <div className="mt-4 text-center">
                <Link to="/" className="text-sm font-bold text-gray-500 hover:text-blue-600 transition-colors">
                  Back to Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default Signup;