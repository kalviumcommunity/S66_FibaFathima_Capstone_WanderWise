<<<<<<< Updated upstream
import { useState } from 'react'

import './App.css'
=======
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
>>>>>>> Stashed changes

import Index from "./Pages/Index";
import Login from "./Pages/Login";
import Signup from "./Pages/SignUp";
import Dashboard from "./Pages/Dashboard";
import Quiz from "./Pages/Quiz";
import BudgetPlanner from "./Pages/BudgetPlanner";
import TripGenerator from "./Pages/TripGenerator";
import Destinations from "./Pages/Destinations";

const queryClient = new QueryClient();

<<<<<<< Updated upstream
  return (
    <>
    <h1>Welcome to my capstone</h1>
     
    </>
  )
}
=======
const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster position="top-right" richColors />

        {/* Removed <BrowserRouter> */}
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/destinations" element={<Destinations />} />
          <Route path="/quiz/:destinationId" element={<Quiz />} />
          <Route path="/budget/:destinationId" element={<BudgetPlanner />} />
          <Route path="/generate-trip/:destinationId" element={<TripGenerator />} />
        </Routes>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);
>>>>>>> Stashed changes

export default App;
