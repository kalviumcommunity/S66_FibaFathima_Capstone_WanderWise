import { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, MapPin, Calculator, DollarSign } from 'lucide-react';
import { toast } from "sonner";

const BudgetPlanner = () => {
  const { destinationId } = useParams();
  const location = useLocation();
  const { destination, quizAnswers } = location.state || {};
  const navigate = useNavigate();
  
  const [selectedCurrency, setSelectedCurrency] = useState('INR');
  const [budget, setBudget] = useState({
    accommodation: '',
    food: '',
    activities: '',
    transportation: '',
    shopping: '',
    misc: ''
  });

  const currencies = [
    { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'GBP', symbol: '£', name: 'British Pound' },
    { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
    { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
    { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
    { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar' }
  ];

  const budgetCategories = [
    { key: 'accommodation', label: 'Accommodation', icon: '🏨', description: 'Hotels, resorts, or other stays' },
    { key: 'food', label: 'Food & Dining', icon: '🍽️', description: 'Restaurants, cafes, and meals' },
    { key: 'activities', label: 'Activities & Tours', icon: '🎯', description: 'Sightseeing, tours, and experiences' },
    { key: 'transportation', label: 'Transportation', icon: '🚗', description: 'Flights, local transport, and travel' },
    { key: 'shopping', label: 'Shopping', icon: '🛍️', description: 'Souvenirs, gifts, and purchases' },
    { key: 'misc', label: 'Miscellaneous', icon: '💡', description: 'Other expenses and emergencies' }
  ];

  const handleBudgetChange = (key, value) => {
    setBudget(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const calculateTotal = () => {
    return Object.values(budget).reduce((total, value) => {
      return total + (parseFloat(value) || 0);
    }, 0);
  };

  const handleGenerateTrip = () => {
    const total = calculateTotal();
    if (total === 0) {
      toast.error("Please enter at least some budget amounts.");
      return;
    }

    // Navigate to AI trip generation page
    navigate(`/generate-trip/${destinationId}`, {
      state: {
        destination,
        quizAnswers,
        budget: {
          ...budget,
          currency: selectedCurrency,
          total: total
        }
      }
    });
  };

  const handleBack = () => {
    navigate(`/quiz/${destinationId}`, {
      state: { destination, quizAnswers }
    });
  };

  const selectedCurrencyData = currencies.find(c => c.code === selectedCurrency);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            onClick={handleBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Quiz
          </Button>
          
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-green-600" />
            <h1 className="text-xl font-semibold text-gray-800">
              Budget for {destination?.name}
            </h1>
          </div>
          
          <div className="text-sm text-gray-500">
            Step 2 of 3
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Currency Selection */}
          <Card className="mb-8 shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-green-600" />
                Select Currency
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {currencies.map((currency) => (
                  <Button
                    key={currency.code}
                    variant={selectedCurrency === currency.code ? "default" : "outline"}
                    onClick={() => setSelectedCurrency(currency.code)}
                    className={`h-auto p-4 flex flex-col items-center gap-2 ${
                      selectedCurrency === currency.code
                        ? "bg-gradient-to-r from-green-500 to-blue-600 text-white border-0"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <span className="text-lg font-semibold">{currency.symbol}</span>
                    <span className="text-xs">{currency.code}</span>
                    <span className="text-xs opacity-75">{currency.name}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Budget Categories */}
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="w-5 h-5 text-green-600" />
                Set Your Budget
              </CardTitle>
              <p className="text-gray-600">
                Allocate your budget across different categories for {destination?.name}
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {budgetCategories.map((category) => (
                  <div key={category.key} className="space-y-3">
                    <Label className="flex items-center gap-2 text-sm font-medium">
                      <span className="text-lg">{category.icon}</span>
                      {category.label}
                    </Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                        {selectedCurrencyData?.symbol}
                      </span>
                      <Input
                        type="number"
                        placeholder="0"
                        value={budget[category.key]}
                        onChange={(e) => handleBudgetChange(category.key, e.target.value)}
                        className="pl-8 border-gray-200 focus:border-green-500 focus:ring-green-500"
                      />
                    </div>
                    <p className="text-xs text-gray-500">{category.description}</p>
                  </div>
                ))}
              </div>

              {/* Total Budget Display */}
              <div className="mt-8 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-800">Total Budget:</span>
                  <span className="text-2xl font-bold text-green-600">
                    {selectedCurrencyData?.symbol}{calculateTotal().toLocaleString()}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {selectedCurrencyData?.name} ({selectedCurrencyData?.code})
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between mt-8">
                <Button
                  variant="outline"
                  onClick={handleBack}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Quiz
                </Button>
                
                <Button
                  onClick={handleGenerateTrip}
                  disabled={calculateTotal() === 0}
                  className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700"
                >
                  Generate My Trip
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BudgetPlanner; 