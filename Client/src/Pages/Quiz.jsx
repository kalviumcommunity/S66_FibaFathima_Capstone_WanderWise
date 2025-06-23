import { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { ArrowLeft, ArrowRight, MapPin, Compass } from 'lucide-react';
import { toast } from "sonner";
import { getDestinationImage } from '../lib/utils';

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

  const bgImage = getDestinationImage(destination?.name) || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80';

  return (
    <div 
      className="min-h-screen relative overflow-hidden"
      style={{
        backgroundImage: `url('${bgImage}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-gray-800/70 to-slate-900/80"></div>
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            onClick={handleBack}
            className="flex items-center gap-2 text-green-200 hover:text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-600/20 rounded-lg">
              <Compass className="w-5 h-5 text-emerald-400" />
            </div>
            <h1 className="text-xl font-semibold text-white">
              Planning for {destination?.name}
            </h1>
          </div>
          
          <div className="text-sm text-green-200 bg-white/10 px-3 py-1 rounded-full">
            {currentQuestion + 1} of {questions.length}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-white/20 rounded-full h-3 mb-8 backdrop-blur-sm">
          <div 
            className="bg-gradient-to-r from-emerald-500 to-teal-600 h-3 rounded-full transition-all duration-500 shadow-lg"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        {/* Question Card */}
        <Card className="max-w-2xl mx-auto bg-white/10 backdrop-blur-sm border-white/20 shadow-2xl">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-3xl font-bold text-white mb-2">
              {questions[currentQuestion].question}
            </CardTitle>
            <p className="text-green-200 text-lg">
              Help us create your perfect WanderWise itinerary
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {questions[currentQuestion].options.map((option) => (
                <Button
                  key={option.value}
                  variant={answers[currentQuestion] === option.value ? "default" : "outline"}
                  onClick={() => handleAnswer(option.value)}
                  className={`h-auto p-6 flex flex-col items-center gap-3 transition-all duration-300 ${
                    answers[currentQuestion] === option.value
                      ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-0 shadow-lg scale-105"
                      : "bg-white/10 border-white/30 text-white hover:bg-white/20 hover:border-emerald-400 hover:scale-105"
                  }`}
                >
                  <span className="text-3xl">{option.icon}</span>
                  <span className="font-medium text-lg">{option.label}</span>
                </Button>
              ))}
            </div>
            
            <div className="flex justify-between pt-8">
              <Button
                variant="outline"
                onClick={handleBack}
                className="flex items-center gap-2 border-white/30 text-white hover:bg-white/20"
              >
                <ArrowLeft className="w-4 h-4" />
                Previous
              </Button>
              
              <Button
                onClick={handleNext}
                disabled={!answers[currentQuestion]}
                className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-lg"
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

        {/* Decorative elements */}
        <div className="absolute top-20 right-10 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-40 h-40 bg-teal-500/10 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
};

export default Quiz; 