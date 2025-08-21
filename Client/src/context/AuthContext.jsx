import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check authentication status on app load
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // Check if user has valid session
        if (authService.isAuthenticated()) {
          const userData = await authService.getProfile();
          setUser(userData);
          setIsLoggedIn(true);
          authService.storeUser(userData);
        } else {
          // Check if there's stored user data
          const storedUser = authService.getStoredUser();
          if (storedUser && authService.isAuthenticated()) {
            setUser(storedUser);
            setIsLoggedIn(true);
          } else {
            // Clear invalid data
            authService.logout();
            setUser(null);
            setIsLoggedIn(false);
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        // Clear invalid data
        authService.logout();
        setUser(null);
        setIsLoggedIn(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (credentials) => {
    try {
      setLoading(true);
      const response = await authService.login(credentials);
      setUser(response.user);
      setIsLoggedIn(true);
      authService.storeUser(response.user);
      return response;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (userData) => {
    try {
      setLoading(true);
      const response = await authService.signup(userData);
      setUser(response.user);
      setIsLoggedIn(true);
      authService.storeUser(response.user);
      return response;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setIsLoggedIn(false);
  };

  const updateProfile = async (profileData) => {
    try {
      setLoading(true);
      const updatedUser = await authService.updateProfile(profileData);
      setUser(updatedUser);
      authService.storeUser(updatedUser);
      return updatedUser;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async (passwordData) => {
    try {
      setLoading(true);
      const response = await authService.changePassword(passwordData);
      return response;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const googleLogin = async (credential) => {
    try {
      setLoading(true);
      const response = await authService.googleLogin(credential);
      setUser(response.user);
      setIsLoggedIn(true);
      authService.storeUser(response.user);
      return response;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const saveDestination = async (destinationId) => {
    try {
      const response = await authService.saveDestination(destinationId);
      // Update user's saved destinations
      if (user) {
        const updatedUser = { ...user };
        if (!updatedUser.savedDestinations) {
          updatedUser.savedDestinations = [];
        }
        updatedUser.savedDestinations.push(destinationId);
        setUser(updatedUser);
        authService.storeUser(updatedUser);
      }
      return response;
    } catch (error) {
      throw error;
    }
  };

  const removeDestination = async (destinationId) => {
    try {
      const response = await authService.removeDestination(destinationId);
      // Update user's saved destinations
      if (user) {
        const updatedUser = { ...user };
        if (updatedUser.savedDestinations) {
          updatedUser.savedDestinations = updatedUser.savedDestinations.filter(
            id => id !== destinationId
          );
        }
        setUser(updatedUser);
        authService.storeUser(updatedUser);
      }
      return response;
    } catch (error) {
      throw error;
    }
  };

  const getSavedDestinations = async () => {
    try {
      const savedDestinations = await authService.getSavedDestinations();
      return savedDestinations;
    } catch (error) {
      throw error;
    }
  };

  const isAdmin = () => {
    return user && user.role === 'admin';
  };

  const value = {
    isLoggedIn,
    user,
    loading,
    login,
    signup,
    logout,
    googleLogin,
    updateProfile,
    changePassword,
    saveDestination,
    removeDestination,
    getSavedDestinations,
    isAdmin
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 