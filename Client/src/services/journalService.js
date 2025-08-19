import { apiService } from './api';

class JournalService {
  // Get journal for a specific trip
  async getJournalByTrip(tripId) {
    try {
      const response = await apiService.get(`/journals/trip/${tripId}`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Create a new journal for a trip
  async createJournal(journalData) {
    try {
      const response = await apiService.post('/journals', journalData);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Add an entry to a journal
  async addEntry(journalId, entryData) {
    try {
      const response = await apiService.post(`/journals/${journalId}/entries`, entryData);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Update a journal entry
  async updateEntry(journalId, entryId, entryData) {
    try {
      const response = await apiService.put(`/journals/${journalId}/entries/${entryId}`, entryData);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Delete a journal entry
  async deleteEntry(journalId, entryId) {
    try {
      const response = await apiService.delete(`/journals/${journalId}/entries/${entryId}`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Get journal analytics/reflection data
  async getJournalAnalytics() {
    try {
      // This would be a custom endpoint for analytics
      // For now, we'll aggregate data from existing journals
      const trips = await apiService.get('/trips');
      const analytics = {
        trips: [],
        moodTrends: [],
        totalTrips: 0,
        totalEntries: 0,
        averageOverallMood: 0,
        favoriteDestinations: [],
        mostActiveMonth: 'January'
      };

      // Process trips to get journal data
      for (const trip of trips) {
        try {
          const journal = await this.getJournalByTrip(trip._id);
          if (journal && journal.entries.length > 0) {
            const averageMood = journal.entries.reduce((sum, entry) => sum + entry.mood, 0) / journal.entries.length;
            
            analytics.trips.push({
              id: trip._id,
              destination: `${trip.destinationId.name}, ${trip.destinationId.country}`,
              startDate: trip.startDate,
              endDate: trip.endDate,
              totalEntries: journal.entries.length,
              averageMood: averageMood,
              entries: journal.entries.map(entry => ({
                date: entry.date,
                mood: entry.mood,
                title: entry.title
              }))
            });

            analytics.totalEntries += journal.entries.length;
            analytics.favoriteDestinations.push(`${trip.destinationId.name}, ${trip.destinationId.country}`);
          }
        } catch (error) {
          // Skip trips without journals
          continue;
        }
      }

      analytics.totalTrips = analytics.trips.length;
      
      if (analytics.totalEntries > 0) {
        const totalMoodSum = analytics.trips.reduce((sum, trip) => 
          sum + (trip.averageMood * trip.totalEntries), 0
        );
        analytics.averageOverallMood = totalMoodSum / analytics.totalEntries;
      }

      // Generate mood trends by month (simplified)
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
      analytics.moodTrends = months.map(month => ({
        month,
        averageMood: Math.random() * 2 + 3, // Mock data for now
        entries: Math.floor(Math.random() * 10)
      }));

      return analytics;
    } catch (error) {
      throw error;
    }
  }

  // Get mood statistics
  async getMoodStatistics(tripId = null) {
    try {
      let journals = [];
      
      if (tripId) {
        const journal = await this.getJournalByTrip(tripId);
        journals = journal ? [journal] : [];
      } else {
        // Get all user's trips and their journals
        const trips = await apiService.get('/trips');
        for (const trip of trips) {
          try {
            const journal = await this.getJournalByTrip(trip._id);
            if (journal) journals.push(journal);
          } catch (error) {
            continue;
          }
        }
      }

      const allEntries = journals.flatMap(journal => journal.entries);
      
      if (allEntries.length === 0) {
        return {
          averageMood: 0,
          totalEntries: 0,
          moodDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
          moodTrend: []
        };
      }

      const averageMood = allEntries.reduce((sum, entry) => sum + entry.mood, 0) / allEntries.length;
      
      const moodDistribution = allEntries.reduce((dist, entry) => {
        dist[entry.mood] = (dist[entry.mood] || 0) + 1;
        return dist;
      }, { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 });

      const moodTrend = allEntries
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .map(entry => ({
          date: entry.date,
          mood: entry.mood,
          title: entry.title
        }));

      return {
        averageMood,
        totalEntries: allEntries.length,
        moodDistribution,
        moodTrend
      };
    } catch (error) {
      throw error;
    }
  }
}

export const journalService = new JournalService();
export default journalService;
