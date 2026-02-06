import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/Components/ui/card";
import { Alert, AlertDescription } from "@/Components/ui/alert";
import { Eye, EyeOff, Mail, Lock, Globe, Loader2, HeartPulse } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const { login, googleLogin } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login({ email, password }, rememberMe);
      toast.success('Login successful!');
      navigate('/dashboard');
    } catch (err) {
      const errorMessage = err.message || 'Failed to login. Please check your credentials.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setIsLoading(true);
      await googleLogin(credentialResponse.credential);
      toast.success('Google login successful!');
      navigate('/dashboard');
    } catch (err) {
      const errorMessage = err.message || 'Google login failed';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleError = () => {
    toast.error('Google login failed');
  };

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4 bg-white dark:bg-slate-950 transition-colors duration-500">
        {/* Clean white background */}
        <div className="fixed inset-0 z-0 bg-white dark:bg-slate-950 transition-colors duration-500"></div>

        <div className="w-full max-w-md relative z-20">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Globe className="h-8 w-8 text-green-600" />
              <span className="text-xl font-bold text-gray-900 dark:text-white">WanderWise</span>
            </div>
            <p className="text-gray-600 dark:text-gray-400">Welcome back! Sign in to your account</p>
          </div>

          <Card className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 shadow-sm transition-colors duration-500">
            <CardHeader>
              <CardTitle className="text-2xl text-center text-gray-900 dark:text-white">Sign In</CardTitle>
              <CardDescription className="text-center text-gray-600 dark:text-gray-400">
                Enter your credentials to access your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-green-600" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 border border-gray-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-green-500"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-700 dark:text-gray-300">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-green-600" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10 border border-gray-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-green-500"
                      required
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-gray-500 hover:text-green-600"
                      disabled={isLoading}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="remember-me"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                    />
                    <Label htmlFor="remember-me" className="text-sm text-gray-700 dark:text-gray-300">
                      Remember me
                    </Label>
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Signing in...
                      </>
                    ) : (
                      "Sign In"
                    )}
                  </Button>
                </div>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Don't have an account?{' '}
                  <Link to="/signup" className="text-green-600 hover:text-green-700 font-medium">
                    Sign up here
                  </Link>
                </p>
              </div>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-300 dark:border-gray-700" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white dark:bg-slate-900 px-2 text-gray-500 dark:text-gray-400">Or continue with</span>
                  </div>
                </div>

                <div className="mt-6">
                  <div className="w-full flex justify-center">
                    <GoogleLogin
                      onSuccess={handleGoogleSuccess}
                      onError={handleGoogleError}
                      theme="outline"
                      size="large"
                      text="signin_with"
                      shape="rectangular"
                      width="350"
                    />
                  </div>
                </div>


              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default Login; 