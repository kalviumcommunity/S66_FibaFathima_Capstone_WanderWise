import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from 'react-hot-toast';

// Pages
import Index from './Pages/Index';
import Login from './Pages/Login';
import SignUp from './Pages/SignUp';
import Dashboard from './Pages/Dashboard';
import Destinations from './Pages/Destinations';
import BudgetPlanner from './Pages/BudgetPlanner';
import Quiz from './Pages/Quiz';
import TripGenerator from './Pages/TripGenerator';
import About from './Pages/About';

// Styles
import './App.css';

function App() {
  return (
    <AuthProvider>
      <TooltipProvider>
        <Router>
          <div className="App">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/destinations" element={<Destinations />} />
              <Route path="/budget-planner" element={<BudgetPlanner />} />
              <Route path="/quiz" element={<Quiz />} />
              <Route path="/trip-generator" element={<TripGenerator />} />
              <Route path="/about" element={<About />} />
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
        </Router>
      </TooltipProvider>
    </AuthProvider>
  );
}

export default App;
