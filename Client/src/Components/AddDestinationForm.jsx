import React, { useState } from 'react';
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Textarea } from "@/Components/ui/textarea";
import { X, Plus, MapPin, DollarSign } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { destinationService } from '../services/destinationService';

const AddDestinationForm = ({ onClose, onDestinationAdded }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    country: '',
    location: '',
    images: [''],
    activities: [''],
    bestSeason: '',
    popularAttractions: [''],
    price: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayChange = (field, index, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayItem = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayItem = (field, index) => {
    if (formData[field].length > 1) {
      setFormData(prev => ({
        ...prev,
        [field]: prev[field].filter((_, i) => i !== index)
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Filter out empty strings from arrays
      const cleanedData = {
        ...formData,
        images: formData.images.filter(img => img.trim() !== ''),
        activities: formData.activities.filter(act => act.trim() !== ''),
        popularAttractions: formData.popularAttractions.filter(attr => attr.trim() !== ''),
        price: parseInt(formData.price)
      };

      await destinationService.createDestination(cleanedData);
      toast.success('Destination added successfully!');
      onDestinationAdded();
      onClose();
    } catch (error) {
      console.error('Error adding destination:', error);
      toast.error(error.message || 'Failed to add destination');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white/95 backdrop-blur-lg border border-emerald-200/50 shadow-2xl">
        <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-emerald-200/50">
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-emerald-700 to-teal-700 bg-clip-text text-transparent flex items-center gap-2">
              <MapPin className="h-6 w-6 text-emerald-600" />
              Add New Destination
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="name" className="text-sm font-medium text-gray-700">Destination Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="e.g., Bali Paradise"
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="country" className="text-sm font-medium text-gray-700">Country *</Label>
                <Input
                  id="country"
                  value={formData.country}
                  onChange={(e) => handleInputChange('country', e.target.value)}
                  placeholder="e.g., Indonesia"
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="location" className="text-sm font-medium text-gray-700">Location *</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="e.g., Bali, Indonesia"
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="price" className="text-sm font-medium text-gray-700 flex items-center gap-1">
                  <DollarSign className="h-4 w-4" />
                  Price (USD) *
                </Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  placeholder="e.g., 1200"
                  required
                  className="mt-1"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description" className="text-sm font-medium text-gray-700">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe what makes this destination special..."
                required
                rows={3}
                className="mt-1"
              />
            </div>

            {/* Best Season */}
            <div>
              <Label htmlFor="bestSeason" className="text-sm font-medium text-gray-700">Best Season to Visit *</Label>
              <Input
                id="bestSeason"
                value={formData.bestSeason}
                onChange={(e) => handleInputChange('bestSeason', e.target.value)}
                placeholder="e.g., April to October (Dry Season)"
                required
                className="mt-1"
              />
            </div>

            {/* Dynamic Arrays */}
            {[
              { field: 'images', label: 'Image URLs', placeholder: 'https://example.com/image.jpg' },
              { field: 'activities', label: 'Activities', placeholder: 'e.g., Beach relaxation' },
              { field: 'popularAttractions', label: 'Popular Attractions', placeholder: 'e.g., Tanah Lot Temple' }
            ].map(({ field, label, placeholder }) => (
              <div key={field}>
                <Label className="text-sm font-medium text-gray-700">{label} *</Label>
                <div className="space-y-2 mt-1">
                  {formData[field].map((item, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={item}
                        onChange={(e) => handleArrayChange(field, index, e.target.value)}
                        placeholder={placeholder}
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeArrayItem(field, index)}
                        disabled={formData[field].length === 1}
                        className="px-3"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addArrayItem(field)}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add {label.slice(0, -1)}
                  </Button>
                </div>
              </div>
            ))}

            {/* Submit Buttons */}
            <div className="flex gap-4 pt-6 border-t border-gray-200">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
              >
                {isLoading ? 'Adding...' : 'Add Destination'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddDestinationForm;
