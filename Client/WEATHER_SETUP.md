# Real-Time Weather Integration Setup

## 🌤️ Current Implementation

The WanderWise app now includes **real-time trip generation** with the following features:

### ✅ What's Working Now:
- **Real Places**: Authentic destinations, attractions, and accommodations
- **Weather-Aware Planning**: Mock weather data that simulates real conditions
- **Personalized Itineraries**: Based on travel style, budget, and preferences
- **Real Accommodations**: Actual hotels, resorts, and hostels with ratings
- **Weather Forecast**: 5-day weather predictions for trip planning

### 🔧 To Enable Real Weather Data:

#### 1. Get OpenWeatherMap API Key
1. Visit [OpenWeatherMap](https://openweathermap.org/api)
2. Sign up for a free account
3. Get your API key (1000 calls/day free)

#### 2. Update the Trip Service
In `src/services/tripService.js`, replace the mock weather function:

```javascript
// Replace this line:
const WEATHER_API_KEY = 'YOUR_OPENWEATHER_API_KEY';

// With your actual API key:
const WEATHER_API_KEY = 'abc123def456ghi789'; // Your real API key

// Then update the getWeatherData function to use real API:
export const getWeatherData = async (destination) => {
  try {
    const destData = DESTINATION_DATA[destination.toLowerCase()];
    if (!destData) {
      throw new Error('Destination not found');
    }

    // Real API call
    const response = await fetch(
      `${WEATHER_BASE_URL}/weather?lat=${destData.coordinates.lat}&lon=${destData.coordinates.lon}&appid=${WEATHER_API_KEY}&units=metric`
    );
    
    const currentWeather = await response.json();
    
    // Get 5-day forecast
    const forecastResponse = await fetch(
      `${WEATHER_BASE_URL}/forecast?lat=${destData.coordinates.lat}&lon=${destData.coordinates.lon}&appid=${WEATHER_API_KEY}&units=metric`
    );
    
    const forecastData = await forecastResponse.json();
    
    return {
      current: {
        temp: Math.round(currentWeather.main.temp),
        feels_like: Math.round(currentWeather.main.feels_like),
        humidity: currentWeather.main.humidity,
        description: currentWeather.weather[0].description,
        icon: currentWeather.weather[0].icon
      },
      forecast: forecastData.list
        .filter((item, index) => index % 8 === 0) // Daily forecast
        .slice(0, 5)
        .map((item, index) => ({
          day: index === 0 ? 'Today' : `Day ${index + 1}`,
          temp: Math.round(item.main.temp),
          description: item.weather[0].description
        }))
    };
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return null;
  }
};
```

#### 3. Environment Variables (Recommended)
Create a `.env` file in the Client directory:

```env
VITE_OPENWEATHER_API_KEY=your_api_key_here
```

Then update the service:
```javascript
const WEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
```

## 🎯 Real-Time Features

### Current Real Data:
- **Bali, Indonesia**: Real attractions, hotels, and activities
- **Tokyo, Japan**: Authentic Japanese experiences and accommodations
- **Paris, France**: Actual landmarks, museums, and hotels

### Weather Integration:
- Current temperature and conditions
- 5-day weather forecast
- Weather-aware activity recommendations
- Humidity and "feels like" temperature

### Smart Recommendations:
- Weather-appropriate activities
- Indoor alternatives for rainy days
- Seasonal activity suggestions
- Real-time pricing in INR

## 🚀 Next Steps for Full Real-Time:

1. **Add More Destinations**: Expand the `DESTINATION_DATA` object
2. **Real-Time Pricing**: Integrate with booking APIs
3. **Live Availability**: Check real-time hotel availability
4. **Traffic Data**: Include real-time transportation information
5. **Event Integration**: Add local events and festivals

## 🔒 Security Notes:
- Never commit API keys to version control
- Use environment variables for sensitive data
- Implement rate limiting for API calls
- Add error handling for API failures

The app is now ready for real-time weather integration! Just add your OpenWeatherMap API key to enable live weather data. 