import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { TooltipProvider } from "@/Components/ui/tooltip";
import { Toaster } from 'react-hot-toast';

// Pages
import Index from './Pages/Index';
import Login from './Pages/Login';
import SignUp from './Pages/SignUp';
import Dashboard from './Pages/Dashboard';
import Destinations from './Pages/Destinations';
import DestinationDetail from './Pages/DestinationDetail';
import ItineraryView from './Pages/ItineraryView';
import ExperienceDiscovery from './Pages/ExperienceDiscovery';
import Journal from './Pages/Journal';
import Reflection from './Pages/Reflection';
import Admin from './Pages/Admin';
import BudgetPlanner from './Pages/BudgetPlanner';
import Quiz from './Pages/Quiz';
import TripGenerator from './Pages/TripGenerator';
import About from './Pages/About';

// Components
import ProtectedRoute from './Components/ProtectedRoute';

// Styles
import './App.css';

function App() {
  return (
    <AuthProvider>
      <TooltipProvider>
        <div className="App">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/about" element={<About />} />

              {/* Public destination routes */}
              <Route path="/destinations" element={<Destinations />} />
              <Route path="/destinations/:id" element={<DestinationDetail />} />

              {/* Protected routes */}
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/itinerary" element={<ProtectedRoute><ItineraryView /></ProtectedRoute>} />
              <Route path="/itinerary/:id" element={<ProtectedRoute><ItineraryView /></ProtectedRoute>} />
              <Route path="/experience-discovery" element={<ProtectedRoute><ExperienceDiscovery /></ProtectedRoute>} />
              <Route path="/journal/:tripId" element={<ProtectedRoute><Journal /></ProtectedRoute>} />
              <Route path="/reflection" element={<ProtectedRoute><Reflection /></ProtectedRoute>} />
              <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
              <Route path="/budget-planner" element={<ProtectedRoute><BudgetPlanner /></ProtectedRoute>} />
              <Route path="/quiz/:destinationId" element={<ProtectedRoute><Quiz /></ProtectedRoute>} />
              <Route path="/trip-generator" element={<ProtectedRoute><TripGenerator /></ProtectedRoute>} />
            </Routes>
            <Toaster 
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
                success: {
                  duration: 3000,
                  iconTheme: {
                    primary: '#10b981',
                    secondary: '#fff',
                  },
                },
                error: {
                  duration: 4000,
                  iconTheme: {
                    primary: '#ef4444',
                    secondary: '#fff',
                  },
                },
              }}
            />
        </div>
      </TooltipProvider>
    </AuthProvider>
  );
}

export default App;
