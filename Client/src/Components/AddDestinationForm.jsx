import React, { useState } from 'react';
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Textarea } from "@/Components/ui/textarea";
import { X, Plus, MapPin, DollarSign } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { destinationService } from '../services/destinationService';

const AddDestinationForm = ({ onClose, onDestinationAdded, initialData = null }) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    description: initialData?.description || '',
    country: initialData?.country || '',
    location: initialData?.location || '',
    images: initialData?.images?.length ? initialData.images : [''],
    activities: initialData?.activities?.length ? initialData.activities : [''],
    bestSeason: initialData?.bestSeason || '',
    popularAttractions: initialData?.popularAttractions?.length ? initialData.popularAttractions : [''],
    price: initialData?.price || ''
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

      if (initialData?._id) {
        await destinationService.updateDestination(initialData._id, cleanedData);
        toast.success('Destination updated successfully!');
      } else {
        await destinationService.createDestination(cleanedData);
        toast.success('Destination added successfully!');
      }
      
      onDestinationAdded();
      onClose();
    } catch (error) {
      console.error('Error saving destination:', error);
      toast.error(error.message || 'Failed to save destination');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white/95 backdrop-blur-lg border border-emerald-200/50 shadow-2xl animate-in fade-in zoom-in duration-300">
        <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-emerald-200/50">
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-emerald-700 to-teal-700 bg-clip-text text-transparent flex items-center gap-2">
              <MapPin className="h-6 w-6 text-emerald-600" />
              {initialData ? 'Edit Destination' : 'Add New Destination'}
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 rounded-full hover:bg-black/5"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-semibold text-gray-700">Destination Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="e.g., Bali Paradise"
                  required
                  className="border-emerald-100 focus:border-emerald-500 focus:ring-emerald-500 transition-all"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="country" className="text-sm font-semibold text-gray-700">Country *</Label>
                <Input
                  id="country"
                  value={formData.country}
                  onChange={(e) => handleInputChange('country', e.target.value)}
                  placeholder="e.g., Indonesia"
                  required
                  className="border-emerald-100 focus:border-emerald-500 focus:ring-emerald-500 transition-all"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location" className="text-sm font-semibold text-gray-700">Location *</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="e.g., Bali, Indonesia"
                  required
                  className="border-emerald-100 focus:border-emerald-500 focus:ring-emerald-500 transition-all"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price" className="text-sm font-semibold text-gray-700 flex items-center gap-1">
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
                  className="border-emerald-100 focus:border-emerald-500 focus:ring-emerald-500 transition-all"
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-semibold text-gray-700">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe what makes this destination special..."
                required
                rows={4}
                className="border-emerald-100 focus:border-emerald-500 focus:ring-emerald-500 transition-all"
              />
            </div>

            {/* Best Season */}
            <div className="space-y-2">
              <Label htmlFor="bestSeason" className="text-sm font-semibold text-gray-700">Best Season to Visit *</Label>
              <Input
                id="bestSeason"
                value={formData.bestSeason}
                onChange={(e) => handleInputChange('bestSeason', e.target.value)}
                placeholder="e.g., April to October (Dry Season)"
                required
                className="border-emerald-100 focus:border-emerald-500 focus:ring-emerald-500 transition-all"
              />
            </div>

            {/* Dynamic Arrays */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                { field: 'images', label: 'Image URLs', placeholder: 'https://example.com/image.jpg' },
                { field: 'activities', label: 'Activities', placeholder: 'e.g., Beach relaxation' },
                { field: 'popularAttractions', label: 'Popular Attractions', placeholder: 'e.g., Tanah Lot Temple' }
              ].map(({ field, label, placeholder }) => (
                <div key={field} className={field === 'images' ? 'md:col-span-2' : ''}>
                  <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-3">
                    {label} *
                  </Label>
                  <div className="space-y-3">
                    {formData[field].map((item, index) => (
                      <div key={index} className="flex gap-2 group">
                        <Input
                          value={item}
                          onChange={(e) => handleArrayChange(field, index, e.target.value)}
                          placeholder={placeholder}
                          className="flex-1 border-emerald-50 focus:border-emerald-400 focus:ring-emerald-400 transition-all"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeArrayItem(field, index)}
                          disabled={formData[field].length === 1}
                          className="text-red-400 hover:text-red-600 hover:bg-red-50"
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
                      className="w-full border-dashed border-emerald-200 text-emerald-600 hover:bg-emerald-50 hover:border-emerald-300 transition-all"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add {label.slice(0, -1)}
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4 pt-8 border-t border-emerald-100">
              <Button
                type="button"
                variant="ghost"
                onClick={onClose}
                className="flex-1 text-gray-500 hover:bg-gray-100"
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-lg shadow-emerald-200 transition-all transform hover:-translate-y-0.5"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Saving...
                  </div>
                ) : (
                  initialData ? 'Update Destination' : 'Add Destination'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddDestinationForm;
