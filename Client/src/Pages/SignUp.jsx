import { useState } from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/Components/ui/card";
import { Globe, Eye, EyeOff, ArrowLeft } from 'lucide-react';
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
      <div className="min-h-screen relative overflow-hidden flex items-center justify-center px-4">
      {/* Background Image with Overlay */}
      <div 
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/60 via-gray-800/50 to-slate-900/60"></div>
      </div>

      <div className="max-w-6xl w-full grid md:grid-cols-2 gap-8 items-center relative z-20">
        {/* Left Panel - Benefits */}
        <div className="space-y-6">
          <Link to="/" className="text-sm text-emerald-200 hover:text-emerald-100 inline-flex items-center">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Home
          </Link>
          <div className="text-center md:text-left">
            <div className="inline-flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg flex items-center justify-center">
                <Globe className="h-8 w-8 text-emerald-400" />
              </div>
              <span className="text-xl font-bold text-white">WanderWise</span>
            </div>
            <h2 className="text-3xl font-bold text-white">
              Join <span className="text-emerald-300">WanderWise</span> Today
            </h2>
            <p className="text-emerald-100">Sign up to start planning your next adventure</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl shadow-sm w-full max-w-sm border border-white/20">
            <h3 className="text-md font-semibold mb-4 text-white">Benefits of joining WanderWise:</h3>
            <ul className="space-y-3 text-sm text-emerald-200">
              <li className="flex items-center">
                <span className="text-emerald-400 mr-2">✓</span> Personalized Travel Experience
              </li>
              <li className="flex items-center">
                <span className="text-emerald-400 mr-2">✓</span> AI-Powered Travel Companion
              </li>
              <li className="flex items-center">
                <span className="text-emerald-400 mr-2">✓</span> Budget-Friendly Travel
              </li>
              <li className="flex items-center">
                <span className="text-emerald-400 mr-2">✓</span> Discover Like Never Before
              </li>
            </ul>
          </div>
        </div>

        {/* Right Panel - Signup Form */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20 shadow-xl w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-white">Create Account</CardTitle>
            <CardDescription className="text-emerald-200">
              Start your journey with personalized travel planning
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Google Signup Button */}
            <div className="w-full mb-6 flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                theme="filled_blue"
                size="large"
                text="signup_with"
                shape="rectangular"
                width="100%"
              />
            </div>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/30"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-transparent text-emerald-200">Or continue with email</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-white font-medium">First Name</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    type="text"
                    placeholder="John"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    className="bg-white/20 border-white/30 text-white placeholder-emerald-200 focus:ring-emerald-400"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-white font-medium">Last Name</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    type="text"
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    className="bg-white/20 border-white/30 text-white placeholder-emerald-200 focus:ring-emerald-400"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-white font-medium">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="bg-white/20 border-white/30 text-white placeholder-emerald-200 focus:ring-emerald-400"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-white font-medium">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    className="bg-white/20 border-white/30 text-white placeholder-emerald-200 focus:ring-emerald-400 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-emerald-400 hover:text-emerald-200"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-white font-medium">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                    className="bg-white/20 border-white/30 text-white placeholder-emerald-200 focus:ring-emerald-400 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3 text-emerald-400 hover:text-emerald-200"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white"
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-emerald-200">
                Already have an account?{' '}
                <Link to="/login" className="text-emerald-300 hover:text-emerald-100 font-medium">
                  Sign in here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
    </GoogleOAuthProvider>
  );
};

export default Signup;