import { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, MapPin } from 'lucide-react';
import { toast } from "sonner";

const Quiz = () => {
  const { destinationId } = useParams();
  const location = useLocation();
  const destination = location.state?.destination;
  const navigate = useNavigate();
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const questions = [
    {
      id: 1,
      question: "What type of traveler are you?",
      options: [
        { value: "adventure", label: "Adventure Seeker", icon: "🏔️" },
        { value: "culture", label: "Culture Enthusiast", icon: "🏛️" },
        { value: "relaxation", label: "Relaxation & Wellness", icon: "🧘" },
        { value: "foodie", label: "Food & Culinary", icon: "🍜" }
      ]
    },
    {
      id: 2,
      question: "How long do you plan to stay?",
      options: [
        { value: "weekend", label: "Weekend (2-3 days)", icon: "📅" },
        { value: "week", label: "A Week (5-7 days)", icon: "📆" },
        { value: "extended", label: "Extended Stay (10-14 days)", icon: "🗓️" },
        { value: "month", label: "A Month or More", icon: "📊" }
      ]
    },
    {
      id: 3,
      question: "What's your preferred accommodation style?",
      options: [
        { value: "luxury", label: "Luxury Hotels", icon: "🏨" },
        { value: "boutique", label: "Boutique Hotels", icon: "🏩" },
        { value: "budget", label: "Budget-Friendly", icon: "🏠" },
        { value: "unique", label: "Unique Experiences", icon: "🏕️" }
      ]
    },
    {
      id: 4,
      question: "What activities interest you most?",
      options: [
        { value: "outdoor", label: "Outdoor Activities", icon: "🏃" },
        { value: "shopping", label: "Shopping & Markets", icon: "🛍️" },
        { value: "nightlife", label: "Nightlife & Entertainment", icon: "🎉" },
        { value: "historical", label: "Historical Sites", icon: "🏺" }
      ]
    },
    {
      id: 5,
      question: "How do you prefer to get around?",
      options: [
        { value: "public", label: "Public Transportation", icon: "🚇" },
        { value: "walking", label: "Walking & Exploring", icon: "🚶" },
        { value: "private", label: "Private Transport", icon: "🚗" },
        { value: "mix", label: "Mix of Everything", icon: "🔄" }
      ]
    }
  ];

  const handleAnswer = (answer) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion]: answer
    }));
  };

  const handleNext = () => {
    if (!answers[currentQuestion]) {
      toast.error("Please select an answer before continuing.");
      return;
    }
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      // Quiz completed, navigate to budget planner
      navigate(`/budget/${destinationId}`, { 
        state: { 
          destination, 
          quizAnswers: answers 
        } 
      });
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    } else {
      navigate('/', { state: { destination } });
    }
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            onClick={handleBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-blue-600" />
            <h1 className="text-xl font-semibold text-gray-800">
              Planning for {destination?.name}
            </h1>
          </div>
          
          <div className="text-sm text-gray-500">
            {currentQuestion + 1} of {questions.length}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
          <div 
            className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        {/* Question Card */}
        <Card className="max-w-2xl mx-auto shadow-lg border-0">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl font-bold text-gray-800 mb-2">
              {questions[currentQuestion].question}
            </CardTitle>
            <p className="text-gray-600">
              Help us create your perfect itinerary
            </p>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {questions[currentQuestion].options.map((option) => (
                <Button
                  key={option.value}
                  variant={answers[currentQuestion] === option.value ? "default" : "outline"}
                  onClick={() => handleAnswer(option.value)}
                  className={`h-auto p-6 flex flex-col items-center gap-3 transition-all duration-200 ${
                    answers[currentQuestion] === option.value
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0 shadow-lg"
                      : "hover:bg-gray-50 hover:border-blue-300"
                  }`}
                >
                  <span className="text-2xl">{option.icon}</span>
                  <span className="font-medium">{option.label}</span>
                </Button>
              ))}
            </div>
            
            <div className="flex justify-between pt-6">
              <Button
                variant="outline"
                onClick={handleBack}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Previous
              </Button>
              
              <Button
                onClick={handleNext}
                disabled={!answers[currentQuestion]}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              >
                {currentQuestion === questions.length - 1 ? (
                  <>
                    Continue to Budget
                    <ArrowRight className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    Next
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Quiz; 