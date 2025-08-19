import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { Badge } from "@/Components/ui/badge";
import { Search, MapPin, Star, Clock, Users, ArrowLeft } from 'lucide-react';
import { toast } from 'react-hot-toast';

const ExperienceDiscovery = () => {
  const navigate = useNavigate();
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Experiences' },
    { id: 'cultural', name: 'Cultural' },
    { id: 'adventure', name: 'Adventure' },
    { id: 'food', name: 'Food & Drink' },
    { id: 'nature', name: 'Nature' },
    { id: 'historical', name: 'Historical' },
    { id: 'entertainment', name: 'Entertainment' }
  ];

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        // This would normally fetch from the API
        // const experienceData = await experienceService.getExperiences();
        
        // Mock data for now
        const mockExperiences = [
          {
            id: '1',
            title: 'Seine River Cruise',
            description: 'Enjoy a romantic evening cruise along the Seine River with dinner and live music.',
            category: 'cultural',
            location: 'Paris, France',
            duration: '3 hours',
            price: 89,
            rating: 4.8,
            participants: '2-50',
            image: 'https://images.unsplash.com/photo-1502602898536-47ad22581b52'
          },
          {
            id: '2',
            title: 'Cooking Class with Local Chef',
            description: 'Learn to cook authentic French cuisine with a professional chef in a traditional kitchen.',
            category: 'food',
            location: 'Paris, France',
            duration: '4 hours',
            price: 120,
            rating: 4.9,
            participants: '4-12',
            image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136'
          },
          {
            id: '3',
            title: 'Montmartre Walking Tour',
            description: 'Explore the artistic heart of Paris with a knowledgeable local guide.',
            category: 'cultural',
            location: 'Montmartre, Paris',
            duration: '2.5 hours',
            price: 35,
            rating: 4.7,
            participants: '1-20',
            image: 'https://images.unsplash.com/photo-1549144511-f099e773c147'
          },
          {
            id: '4',
            title: 'Versailles Palace Day Trip',
            description: 'Visit the magnificent Palace of Versailles with skip-the-line access and guided tour.',
            category: 'historical',
            location: 'Versailles, France',
            duration: '8 hours',
            price: 95,
            rating: 4.6,
            participants: '1-30',
            image: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e'
          },
          {
            id: '5',
            title: 'Wine Tasting in Champagne Region',
            description: 'Discover the secrets of champagne making with tastings at prestigious houses.',
            category: 'food',
            location: 'Champagne, France',
            duration: '6 hours',
            price: 150,
            rating: 4.9,
            participants: '2-16',
            image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3'
          },
          {
            id: '6',
            title: 'Hot Air Balloon Over Loire Valley',
            description: 'Experience breathtaking views of castles and vineyards from above.',
            category: 'adventure',
            location: 'Loire Valley, France',
            duration: '3 hours',
            price: 220,
            rating: 4.8,
            participants: '2-8',
            image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d'
          }
        ];
        
        setExperiences(mockExperiences);
      } catch (error) {
        toast.error('Failed to load experiences');
      } finally {
        setLoading(false);
      }
    };

    fetchExperiences();
  }, []);

  const filteredExperiences = experiences.filter(experience => {
    const matchesSearch = experience.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         experience.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || experience.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleBookExperience = (experienceId) => {
    toast.success('Experience booking feature coming soon!');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/dashboard')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Discover Local Experiences
          </h1>
          <p className="text-gray-600">
            Find unique activities and experiences to make your trip unforgettable
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search experiences..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            {/* Category Filter */}
            <div className="md:w-64">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Experiences Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExperiences.map((experience) => (
            <Card key={experience.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-w-16 aspect-h-9">
                <img
                  src={experience.image}
                  alt={experience.title}
                  className="w-full h-48 object-cover"
                />
              </div>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{experience.title}</CardTitle>
                    <CardDescription className="flex items-center mt-1">
                      <MapPin className="h-4 w-4 mr-1" />
                      {experience.location}
                    </CardDescription>
                  </div>
                  <Badge variant="secondary" className="ml-2">
                    {categories.find(c => c.id === experience.category)?.name}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {experience.description}
                </p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="h-4 w-4 mr-2" />
                    {experience.duration}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="h-4 w-4 mr-2" />
                    {experience.participants} people
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Star className="h-4 w-4 mr-2 text-yellow-400" />
                    {experience.rating} rating
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="text-lg font-bold text-emerald-600">
                    €{experience.price}
                  </div>
                  <Button 
                    size="sm"
                    onClick={() => handleBookExperience(experience.id)}
                  >
                    Book Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredExperiences.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No experiences found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExperienceDiscovery;
