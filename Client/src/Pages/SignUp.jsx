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
      {/* Clean white background */}
      <div className="fixed inset-0 z-0 bg-white"></div>

      <div className="max-w-6xl w-full grid md:grid-cols-2 gap-8 items-center relative z-20">
        {/* Left Panel - Benefits */}
        <div className="space-y-6">
          <Link to="/" className="text-sm text-gray-600 hover:text-gray-800 inline-flex items-center">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Home
          </Link>
          <div className="text-center md:text-left">
            <div className="inline-flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                <Globe className="h-8 w-8 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">WanderWise</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900">
              Join <span className="text-green-600">WanderWise</span> Today
            </h2>
            <p className="text-gray-600">Sign up to start planning your next adventure</p>
          </div>
          
          <div className="bg-green-50 p-6 rounded-xl shadow-sm w-full max-w-sm border border-green-200">
            <h3 className="text-md font-semibold mb-4 text-gray-900">Benefits of joining WanderWise:</h3>
            <ul className="space-y-3 text-sm text-gray-700">
              <li className="flex items-center">
                <span className="text-green-600 mr-2">✓</span> Personalized Travel Experience
              </li>
              <li className="flex items-center">
                <span className="text-green-600 mr-2">✓</span> AI-Powered Travel Companion
              </li>
              <li className="flex items-center">
                <span className="text-green-600 mr-2">✓</span> Budget-Friendly Travel
              </li>
              <li className="flex items-center">
                <span className="text-green-600 mr-2">✓</span> Discover Like Never Before
              </li>
            </ul>
          </div>
        </div>

        {/* Right Panel - Signup Form */}
        <Card className="bg-white border border-gray-200 shadow-sm w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-900">Create Account</CardTitle>
            <CardDescription className="text-gray-600">
              Start your journey with personalized travel planning
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Google Signup Button */}
            <div className="w-full mb-6 flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                theme="outline"
                size="large"
                text="signup_with"
                shape="rectangular"
                width="100%"
                disabled={isGoogleLoading}
              />
            </div>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with email</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-gray-700 font-medium">First Name</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    type="text"
                    placeholder="John"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    className="border border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-green-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-gray-700 font-medium">Last Name</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    type="text"
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    className="border border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-green-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 font-medium">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="border border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-green-500"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700 font-medium">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    className="border border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-green-500 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-500 hover:text-green-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-gray-700 font-medium">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                    className="border border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-green-500 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3 text-gray-500 hover:text-green-600"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="text-green-600 hover:text-green-700 font-medium">
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