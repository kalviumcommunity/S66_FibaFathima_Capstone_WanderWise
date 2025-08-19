import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { Textarea } from "@/Components/ui/textarea";
import { Badge } from "@/Components/ui/badge";
import { Plus, Edit, Trash2, Calendar, Heart, ArrowLeft, Save } from 'lucide-react';
import { journalService } from '../services/journalService';
import { toast } from 'react-hot-toast';

const Journal = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const [journal, setJournal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddEntry, setShowAddEntry] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [newEntry, setNewEntry] = useState({
    title: '',
    content: '',
    mood: 3,
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    const fetchJournal = async () => {
      try {
        if (tripId) {
          try {
            const journalData = await journalService.getJournalByTrip(tripId);
            setJournal(journalData);
          } catch (error) {
            // If journal doesn't exist, create one
            if (error.message?.includes('not found')) {
              const newJournal = await journalService.createJournal({ tripId });
              setJournal(newJournal.journal);
            } else {
              throw error;
            }
          }
        }
      } catch (error) {
        toast.error('Failed to load journal');
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };

    if (tripId) {
      fetchJournal();
    }
  }, [tripId, navigate]);

  const handleAddEntry = async () => {
    try {
      if (!newEntry.title.trim() || !newEntry.content.trim()) {
        toast.error('Please fill in all fields');
        return;
      }

      const entryData = {
        ...newEntry,
        date: new Date(newEntry.date)
      };

      const response = await journalService.addEntry(journal._id, entryData);

      setJournal({
        ...journal,
        entries: [response.entry, ...journal.entries]
      });

      setNewEntry({
        title: '',
        content: '',
        mood: 3,
        date: new Date().toISOString().split('T')[0]
      });
      setShowAddEntry(false);

      toast.success('Journal entry added!');
    } catch (error) {
      toast.error('Failed to add entry');
    }
  };

  const handleUpdateEntry = async (entryId, updatedEntry) => {
    try {
      await journalService.updateEntry(journal._id, entryId, updatedEntry);

      const updatedEntries = journal.entries.map(entry =>
        entry._id === entryId ? { ...entry, ...updatedEntry } : entry
      );

      setJournal({
        ...journal,
        entries: updatedEntries
      });

      setEditingEntry(null);
      toast.success('Entry updated!');
    } catch (error) {
      toast.error('Failed to update entry');
    }
  };

  const handleDeleteEntry = async (entryId) => {
    try {
      await journalService.deleteEntry(journal._id, entryId);

      const updatedEntries = journal.entries.filter(entry => entry._id !== entryId);

      setJournal({
        ...journal,
        entries: updatedEntries
      });

      toast.success('Entry deleted!');
    } catch (error) {
      toast.error('Failed to delete entry');
    }
  };

  const getMoodEmoji = (mood) => {
    const moods = {
      1: '😢',
      2: '😕',
      3: '😐',
      4: '😊',
      5: '😍'
    };
    return moods[mood] || '😐';
  };

  const getMoodColor = (mood) => {
    const colors = {
      1: 'bg-red-100 text-red-800',
      2: 'bg-orange-100 text-orange-800',
      3: 'bg-yellow-100 text-yellow-800',
      4: 'bg-green-100 text-green-800',
      5: 'bg-emerald-100 text-emerald-800'
    };
    return colors[mood] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (!journal) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Journal not found</h2>
          <Button onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <Button
                variant="ghost"
                onClick={() => navigate('/dashboard')}
                className="mb-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <h1 className="text-3xl font-bold text-gray-900">
                Travel Journal
              </h1>
              <p className="text-gray-600 mt-1">
                {journal.tripId.destinationId.name}, {journal.tripId.destinationId.country}
              </p>
            </div>
            <Button onClick={() => setShowAddEntry(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Entry
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Add Entry Form */}
        {showAddEntry && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>New Journal Entry</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Date</label>
                <Input
                  type="date"
                  value={newEntry.date}
                  onChange={(e) => setNewEntry({...newEntry, date: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Title</label>
                <Input
                  placeholder="Entry title..."
                  value={newEntry.title}
                  onChange={(e) => setNewEntry({...newEntry, title: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Content</label>
                <Textarea
                  placeholder="Write about your experience..."
                  value={newEntry.content}
                  onChange={(e) => setNewEntry({...newEntry, content: e.target.value})}
                  rows={4}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Mood (1-5)</label>
                <select
                  value={newEntry.mood}
                  onChange={(e) => setNewEntry({...newEntry, mood: parseInt(e.target.value)})}
                  className="w-full p-2 border rounded-md"
                >
                  <option value={1}>1 - Very Sad 😢</option>
                  <option value={2}>2 - Sad 😕</option>
                  <option value={3}>3 - Neutral 😐</option>
                  <option value={4}>4 - Happy 😊</option>
                  <option value={5}>5 - Very Happy 😍</option>
                </select>
              </div>
              <div className="flex space-x-2">
                <Button onClick={handleAddEntry}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Entry
                </Button>
                <Button variant="outline" onClick={() => setShowAddEntry(false)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Journal Entries */}
        <div className="space-y-6">
          {journal.entries.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <h3 className="text-lg font-medium text-gray-900 mb-2">No entries yet</h3>
                <p className="text-gray-600 mb-4">Start documenting your travel experiences!</p>
                <Button onClick={() => setShowAddEntry(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Entry
                </Button>
              </CardContent>
            </Card>
          ) : (
            journal.entries.map((entry) => (
              <Card key={entry._id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center space-x-2">
                        <span>{entry.title}</span>
                        <Badge className={getMoodColor(entry.mood)}>
                          {getMoodEmoji(entry.mood)} {entry.mood}/5
                        </Badge>
                      </CardTitle>
                      <CardDescription>
                        <Calendar className="h-4 w-4 inline mr-1" />
                        {new Date(entry.date).toLocaleDateString()}
                      </CardDescription>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingEntry(entry._id)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteEntry(entry._id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 whitespace-pre-wrap">{entry.content}</p>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-center space-x-4">
          <Button 
            variant="outline" 
            onClick={() => navigate('/reflection')}
          >
            View Reflection
          </Button>
          <Button 
            onClick={() => navigate(`/itinerary/${journal.tripId._id}`)}
          >
            Back to Itinerary
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Journal;
