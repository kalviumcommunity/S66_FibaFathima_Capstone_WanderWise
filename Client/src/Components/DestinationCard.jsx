import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Star, ArrowRight, Heart } from 'lucide-react';
import { useState } from 'react';

const DestinationCard = ({ destination, onClick, className = "", onFavorite, isFavorited = false }) => {
  const [isFavorite, setIsFavorite] = useState(isFavorited);

  const handleFavoriteClick = (e) => {
    e.stopPropagation(); // Prevent card click when clicking favorite button
    setIsFavorite(!isFavorite);
    if (onFavorite) {
      onFavorite(destination, !isFavorite);
    }
  };

  return (
    <Card 
      className={`group cursor-pointer hover:shadow-2xl transition-all duration-500 border-0 bg-gradient-to-br from-green-50 to-emerald-50 backdrop-blur-sm overflow-hidden hover:scale-105 animate-fade-in hover:from-green-100 hover:to-emerald-100 ${className}`}
      onClick={() => onClick(destination)}
    >
      <div className="relative">
        <img 
          src={destination.image} 
          alt={destination.name}
          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-green-900/20 to-transparent group-hover:from-green-900/30 transition-all duration-500"></div>
        
        {/* Favorite Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleFavoriteClick}
          className={`absolute top-3 left-3 w-8 h-8 p-0 rounded-full transition-all duration-300 ${
            isFavorite 
              ? 'bg-red-500 hover:bg-red-600 text-white' 
              : 'bg-white/90 hover:bg-white text-gray-600 hover:text-red-500'
          }`}
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
        </Button>

        {destination.popular && (
          <div className="absolute top-3 left-12 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
            ⭐ Popular
          </div>
        )}
        <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm rounded-full px-2 py-1 flex items-center space-x-1 shadow-lg">
          <Star className="w-4 h-4 text-yellow-500 fill-current" />
          <span className="text-sm font-medium text-gray-700">{destination.rating}</span>
        </div>
      </div>
      <CardContent className="p-6 bg-gradient-to-br from-white to-green-50">
        <h4 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">
          {destination.name}
        </h4>
        <p className="text-gray-600 mb-4">{destination.description}</p>
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            className="text-green-600 hover:text-green-700 hover:bg-green-50 p-0 h-auto font-medium group-hover:translate-x-2 transition-all duration-300"
          >
            Plan Trip
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DestinationCard; 