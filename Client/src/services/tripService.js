// Real-time trip generation service with weather and destination data

// Weather API configuration
const WEATHER_API_KEY = 'YOUR_OPENWEATHER_API_KEY'; // You'll need to get a free API key from OpenWeatherMap
const WEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5';

// Mock weather data for demo purposes
const MOCK_WEATHER_DATA = {
  'bali': {
    current: {
      temp: 28,
      feels_like: 32,
      humidity: 75,
      description: 'Partly Cloudy'
    },
    forecast: [
      { day: 'Today', temp: 28, description: 'Partly Cloudy' },
      { day: 'Tomorrow', temp: 29, description: 'Sunny' },
      { day: 'Day 3', temp: 27, description: 'Light Rain' }
    ]
  },
  'tokyo': {
    current: {
      temp: 22,
      feels_like: 24,
      humidity: 65,
      description: 'Clear Sky'
    },
    forecast: [
      { day: 'Today', temp: 22, description: 'Clear Sky' },
      { day: 'Tomorrow', temp: 20, description: 'Cloudy' },
      { day: 'Day 3', temp: 18, description: 'Light Rain' }
    ]
  },
  'paris': {
    current: {
      temp: 18,
      feels_like: 20,
      humidity: 70,
      description: 'Cloudy'
    },
    forecast: [
      { day: 'Today', temp: 18, description: 'Cloudy' },
      { day: 'Tomorrow', temp: 16, description: 'Light Rain' },
      { day: 'Day 3', temp: 19, description: 'Partly Cloudy' }
    ]
  },
  'newyork': {
    current: {
      temp: 15,
      feels_like: 17,
      humidity: 60,
      description: 'Clear Sky'
    },
    forecast: [
      { day: 'Today', temp: 15, description: 'Clear Sky' },
      { day: 'Tomorrow', temp: 12, description: 'Cloudy' },
      { day: 'Day 3', temp: 14, description: 'Partly Cloudy' }
    ]
  },
  'iceland': {
    current: {
      temp: 8,
      feels_like: 6,
      humidity: 80,
      description: 'Light Rain'
    },
    forecast: [
      { day: 'Today', temp: 8, description: 'Light Rain' },
      { day: 'Tomorrow', temp: 6, description: 'Cloudy' },
      { day: 'Day 3', temp: 7, description: 'Partly Cloudy' }
    ]
  },
  'santorini': {
    current: {
      temp: 25,
      feels_like: 27,
      humidity: 55,
      description: 'Sunny'
    },
    forecast: [
      { day: 'Today', temp: 25, description: 'Sunny' },
      { day: 'Tomorrow', temp: 26, description: 'Clear Sky' },
      { day: 'Day 3', temp: 24, description: 'Partly Cloudy' }
    ]
  }
};

// Real destination data for popular cities
const DESTINATION_DATA = {
  'bali': {
    name: 'Bali, Indonesia',
    coordinates: { lat: -8.3405, lon: 115.0920 },
    realPlaces: {
      adventure: [
        { name: 'Mount Batur Sunrise Trek', location: 'Kintamani', duration: '4 hours', cost: '₹2,500', description: 'Hike to the summit for breathtaking sunrise views' },
        { name: 'Nusa Penida Island Tour', location: 'Nusa Penida', duration: '10 hours', cost: '₹4,500', description: 'Visit Kelingking Beach and Angel Billabong' },
        { name: 'Ayung River White Water Rafting', location: 'Ubud', duration: '3 hours', cost: '₹3,200', description: 'Class II-III rapids through tropical jungle' }
      ],
      culture: [
        { name: 'Ubud Palace & Sacred Monkey Forest', location: 'Ubud', duration: '3 hours', cost: '₹800', description: 'Explore traditional Balinese architecture' },
        { name: 'Tanah Lot Temple', location: 'Tabanan', duration: '4 hours', cost: '₹1,200', description: 'Famous sea temple on a rock formation' },
        { name: 'Traditional Balinese Dance Show', location: 'Ubud', duration: '2 hours', cost: '₹1,500', description: 'Legong and Barong dance performances' }
      ],
      relaxation: [
        { name: 'Ubud Spa & Wellness Retreat', location: 'Ubud', duration: '3 hours', cost: '₹3,500', description: 'Traditional Balinese massage and treatments' },
        { name: 'Rice Terrace Walk', location: 'Tegalalang', duration: '2 hours', cost: '₹500', description: 'Peaceful walk through UNESCO rice terraces' },
        { name: 'Beach Yoga Session', location: 'Canggu', duration: '1.5 hours', cost: '₹800', description: 'Sunrise yoga on the beach' }
      ],
      foodie: [
        { name: 'Ubud Food Market Tour', location: 'Ubud', duration: '3 hours', cost: '₹1,800', description: 'Sample local street food and traditional dishes' },
        { name: 'Balinese Cooking Class', location: 'Ubud', duration: '4 hours', cost: '₹2,500', description: 'Learn to cook traditional Balinese cuisine' },
        { name: 'Wine Tasting at Hatten Wines', location: 'Sanur', duration: '2 hours', cost: '₹1,500', description: 'Local Indonesian wine tasting' }
      ]
    },
    accommodation: [
      { name: 'Four Seasons Resort Bali', type: 'Luxury', location: 'Sayan, Ubud', price: '₹45,000/night', rating: 4.8 },
      { name: 'Alila Ubud', type: 'Boutique', location: 'Ubud', price: '₹18,000/night', rating: 4.6 },
      { name: 'Puri Garden Hotel & Hostel', type: 'Budget', location: 'Ubud', price: '₹2,500/night', rating: 4.2 }
    ]
  },
  'tokyo': {
    name: 'Tokyo, Japan',
    coordinates: { lat: 35.6762, lon: 139.6503 },
    realPlaces: {
      adventure: [
        { name: 'Tokyo Skytree Observation Deck', location: 'Sumida', duration: '2 hours', cost: '₹2,200', description: 'Panoramic views from Japan\'s tallest tower' },
        { name: 'Robot Restaurant Show', location: 'Shibuya', duration: '2 hours', cost: '₹4,500', description: 'Futuristic robot and laser show' },
        { name: 'Tsukiji Outer Market Food Tour', location: 'Tsukiji', duration: '3 hours', cost: '₹2,800', description: 'Explore the famous fish market area' }
      ],
      culture: [
        { name: 'Senso-ji Temple', location: 'Asakusa', duration: '2 hours', cost: '₹500', description: 'Tokyo\'s oldest Buddhist temple' },
        { name: 'Meiji Shrine', location: 'Shibuya', duration: '2 hours', cost: '₹300', description: 'Shinto shrine in forested Yoyogi Park' },
        { name: 'Traditional Tea Ceremony', location: 'Ginza', duration: '1.5 hours', cost: '₹2,000', description: 'Authentic Japanese tea ceremony' }
      ],
      relaxation: [
        { name: 'Odaiba Onsen Theme Park', location: 'Odaiba', duration: '4 hours', cost: '₹3,500', description: 'Hot spring baths with city views' },
        { name: 'Shinjuku Gyoen National Garden', location: 'Shinjuku', duration: '2 hours', cost: '₹400', description: 'Peaceful garden with cherry blossoms' },
        { name: 'Tokyo Tower Spa', location: 'Minato', duration: '2 hours', cost: '₹2,500', description: 'Relaxing spa with city skyline views' }
      ],
      foodie: [
        { name: 'Sushi Making Class', location: 'Ginza', duration: '3 hours', cost: '₹4,500', description: 'Learn to make authentic sushi' },
        { name: 'Ramen Tasting Tour', location: 'Shinjuku', duration: '3 hours', cost: '₹2,200', description: 'Visit famous ramen shops' },
        { name: 'Sake Brewery Tour', location: 'Fussa', duration: '4 hours', cost: '₹3,500', description: 'Traditional sake brewing process' }
      ]
    },
    accommodation: [
      { name: 'The Ritz-Carlton Tokyo', type: 'Luxury', location: 'Roppongi', price: '₹65,000/night', rating: 4.9 },
      { name: 'Hotel Gracery Shinjuku', type: 'Boutique', location: 'Shinjuku', price: '₹12,000/night', rating: 4.4 },
      { name: 'UNPLAN Kagurazaka', type: 'Budget', location: 'Shinjuku', price: '₹3,500/night', rating: 4.1 }
    ]
  },
  'paris': {
    name: 'Paris, France',
    coordinates: { lat: 48.8566, lon: 2.3522 },
    realPlaces: {
      adventure: [
        { name: 'Eiffel Tower Summit', location: 'Champ de Mars', duration: '2 hours', cost: '₹3,500', description: 'Climb to the top for panoramic city views' },
        { name: 'Seine River Cruise', location: 'Seine River', duration: '1 hour', cost: '₹1,800', description: 'Bateaux Mouches river cruise' },
        { name: 'Catacombs of Paris', location: '14th Arrondissement', duration: '1.5 hours', cost: '₹2,200', description: 'Underground ossuary with millions of remains' }
      ],
      culture: [
        { name: 'Louvre Museum', location: '1st Arrondissement', duration: '4 hours', cost: '₹2,500', description: 'World\'s largest art museum' },
        { name: 'Notre-Dame Cathedral', location: 'Île de la Cité', duration: '2 hours', cost: '₹800', description: 'Gothic cathedral (exterior visit)' },
        { name: 'Palace of Versailles', location: 'Versailles', duration: '6 hours', cost: '₹3,500', description: 'Royal palace and gardens' }
      ],
      relaxation: [
        { name: 'Luxembourg Gardens', location: '6th Arrondissement', duration: '2 hours', cost: '₹300', description: 'Peaceful gardens with fountains' },
        { name: 'Thermes de Cluny', location: '5th Arrondissement', duration: '2 hours', cost: '₹2,800', description: 'Roman baths and museum' },
        { name: 'Parc des Buttes-Chaumont', location: '19th Arrondissement', duration: '2 hours', cost: '₹200', description: 'Beautiful park with lake and temple' }
      ],
      foodie: [
        { name: 'French Pastry Workshop', location: 'Le Marais', duration: '3 hours', cost: '₹4,200', description: 'Learn to make croissants and macarons' },
        { name: 'Wine Tasting in Montmartre', location: 'Montmartre', duration: '2 hours', cost: '₹2,500', description: 'French wine and cheese tasting' },
        { name: 'Food Market Tour', location: 'Rue Mouffetard', duration: '3 hours', cost: '₹2,800', description: 'Explore local food markets' }
      ]
    },
    accommodation: [
      { name: 'The Ritz Paris', type: 'Luxury', location: 'Place Vendôme', price: '₹85,000/night', rating: 4.9 },
      { name: 'Hotel Le Bristol', type: 'Boutique', location: '8th Arrondissement', price: '₹25,000/night', rating: 4.7 },
      { name: 'Generator Paris', type: 'Budget', location: '10th Arrondissement', price: '₹4,500/night', rating: 4.0 }
    ]
  },
  'newyork': {
    name: 'New York, USA',
    coordinates: { lat: 40.7128, lon: -74.0060 },
    realPlaces: {
      adventure: [
        { name: 'Empire State Building Observatory', location: 'Midtown Manhattan', duration: '2 hours', cost: '₹3,200', description: 'Iconic skyscraper with city views' },
        { name: 'Brooklyn Bridge Walk', location: 'Brooklyn Bridge', duration: '1.5 hours', cost: '₹500', description: 'Historic bridge with Manhattan skyline views' },
        { name: 'Central Park Bike Tour', location: 'Central Park', duration: '3 hours', cost: '₹2,500', description: 'Explore the famous urban park' }
      ],
      culture: [
        { name: 'Metropolitan Museum of Art', location: 'Upper East Side', duration: '4 hours', cost: '₹1,500', description: 'World-class art museum' },
        { name: 'Broadway Show', location: 'Theater District', duration: '3 hours', cost: '₹8,000', description: 'Experience world-famous theater' },
        { name: 'Statue of Liberty & Ellis Island', location: 'New York Harbor', duration: '4 hours', cost: '₹2,800', description: 'Iconic American landmarks' }
      ],
      relaxation: [
        { name: 'High Line Park Walk', location: 'Chelsea', duration: '2 hours', cost: '₹300', description: 'Elevated park with city views' },
        { name: 'Spa Day at Mandarin Oriental', location: 'Columbus Circle', duration: '3 hours', cost: '₹12,000', description: 'Luxury spa experience' },
        { name: 'Bryant Park Reading Room', location: 'Midtown', duration: '2 hours', cost: '₹200', description: 'Peaceful outdoor reading space' }
      ],
      foodie: [
        { name: 'Pizza Tour of Brooklyn', location: 'Brooklyn', duration: '3 hours', cost: '₹3,500', description: 'Sample famous NYC pizza' },
        { name: 'Chinatown Food Crawl', location: 'Chinatown', duration: '3 hours', cost: '₹2,800', description: 'Authentic Chinese cuisine tour' },
        { name: 'Chelsea Market Food Tour', location: 'Chelsea', duration: '2 hours', cost: '₹2,200', description: 'Gourmet food market exploration' }
      ]
    },
    accommodation: [
      { name: 'The Plaza Hotel', type: 'Luxury', location: 'Central Park South', price: '₹95,000/night', rating: 4.9 },
      { name: 'The Standard High Line', type: 'Boutique', location: 'Meatpacking District', price: '₹35,000/night', rating: 4.6 },
      { name: 'HI NYC Hostel', type: 'Budget', location: 'Upper West Side', price: '₹4,500/night', rating: 4.0 }
    ]
  },
  'iceland': {
    name: 'Iceland',
    coordinates: { lat: 64.9631, lon: -19.0208 },
    realPlaces: {
      adventure: [
        { name: 'Golden Circle Tour', location: 'South Iceland', duration: '8 hours', cost: '₹8,500', description: 'Geysir, Gullfoss, and Thingvellir National Park' },
        { name: 'Blue Lagoon Experience', location: 'Grindavík', duration: '3 hours', cost: '₹6,500', description: 'Famous geothermal spa' },
        { name: 'Northern Lights Hunt', location: 'Various Locations', duration: '4 hours', cost: '₹5,500', description: 'Aurora borealis viewing tour' }
      ],
      culture: [
        { name: 'Reykjavik City Walk', location: 'Reykjavik', duration: '2 hours', cost: '₹2,000', description: 'Explore the capital city' },
        { name: 'Viking Museum Visit', location: 'Reykjavik', duration: '2 hours', cost: '₹1,800', description: 'Learn about Viking history' },
        { name: 'Icelandic Horse Riding', location: 'Countryside', duration: '3 hours', cost: '₹4,500', description: 'Ride unique Icelandic horses' }
      ],
      relaxation: [
        { name: 'Secret Lagoon Hot Springs', location: 'Flúðir', duration: '2 hours', cost: '₹3,500', description: 'Natural hot spring experience' },
        { name: 'Sólheimajökull Glacier Walk', location: 'South Iceland', duration: '4 hours', cost: '₹7,500', description: 'Guided glacier exploration' },
        { name: 'Reykjavik Spa Day', location: 'Reykjavik', duration: '3 hours', cost: '₹5,500', description: 'Relaxing spa treatments' }
      ],
      foodie: [
        { name: 'Icelandic Food Tour', location: 'Reykjavik', duration: '3 hours', cost: '₹4,500', description: 'Sample traditional Icelandic cuisine' },
        { name: 'Whale Watching & Seafood', location: 'Húsavík', duration: '5 hours', cost: '₹6,500', description: 'Marine life and fresh seafood' },
        { name: 'Coffee Culture Tour', location: 'Reykjavik', duration: '2 hours', cost: '₹2,500', description: 'Explore Reykjavik\'s coffee scene' }
      ]
    },
    accommodation: [
      { name: 'Blue Lagoon Retreat Hotel', type: 'Luxury', location: 'Grindavík', price: '₹75,000/night', rating: 4.9 },
      { name: 'ION Adventure Hotel', type: 'Boutique', location: 'Nesjavellir', price: '₹45,000/night', rating: 4.7 },
      { name: 'KEX Hostel', type: 'Budget', location: 'Reykjavik', price: '₹6,500/night', rating: 4.2 }
    ]
  },
  'santorini': {
    name: 'Santorini, Greece',
    coordinates: { lat: 36.3932, lon: 25.4615 },
    realPlaces: {
      adventure: [
        { name: 'Santorini Volcano Hike', location: 'Nea Kameni', duration: '4 hours', cost: '₹4,500', description: 'Hike the active volcano' },
        { name: 'Sunset Sailing Cruise', location: 'Aegean Sea', duration: '5 hours', cost: '₹8,500', description: 'Catamaran cruise around the island' },
        { name: 'Oia to Fira Hike', location: 'Caldera Path', duration: '3 hours', cost: '₹2,500', description: 'Scenic coastal walking trail' }
      ],
      culture: [
        { name: 'Ancient Thera Ruins', location: 'Mesa Vouno', duration: '2 hours', cost: '₹1,500', description: 'Ancient Greek archaeological site' },
        { name: 'Akrotiri Archaeological Site', location: 'Akrotiri', duration: '2 hours', cost: '₹1,800', description: 'Minoan Bronze Age settlement' },
        { name: 'Traditional Greek Dance Show', location: 'Fira', duration: '2 hours', cost: '₹2,500', description: 'Authentic Greek cultural performance' }
      ],
      relaxation: [
        { name: 'Santorini Wine Tasting', location: 'Various Wineries', duration: '3 hours', cost: '₹4,500', description: 'Local wine and sunset views' },
        { name: 'Thermal Springs Swim', location: 'Palea Kameni', duration: '2 hours', cost: '₹3,500', description: 'Natural hot springs in the sea' },
        { name: 'Santorini Spa Experience', location: 'Oia', duration: '2 hours', cost: '₹6,500', description: 'Luxury spa with caldera views' }
      ],
      foodie: [
        { name: 'Greek Cooking Class', location: 'Oia', duration: '4 hours', cost: '₹5,500', description: 'Learn to cook traditional Greek dishes' },
        { name: 'Santorini Food & Wine Tour', location: 'Various Locations', duration: '4 hours', cost: '₹6,500', description: 'Local cuisine and wine tasting' },
        { name: 'Seafood Dinner with Views', location: 'Ammoudi Bay', duration: '2 hours', cost: '₹4,500', description: 'Fresh seafood with sunset views' }
      ]
    },
    accommodation: [
      { name: 'Katikies Hotel', type: 'Luxury', location: 'Oia', price: '₹85,000/night', rating: 4.9 },
      { name: 'Mystique Hotel', type: 'Boutique', location: 'Oia', price: '₹55,000/night', rating: 4.8 },
      { name: 'Caveland Hostel', type: 'Budget', location: 'Karterados', price: '₹5,500/night', rating: 4.1 }
    ]
  }
};

// Get real-time weather data
export const getWeatherData = async (destination) => {
  try {
    // Normalize destination name for better matching
    const normalizedDestination = destination?.toLowerCase().replace(/[^a-z]/g, '');
    
    // For demo purposes, use mock data instead of real API
    // In production, you would use the real weather API
    if (MOCK_WEATHER_DATA[normalizedDestination]) {
      return MOCK_WEATHER_DATA[normalizedDestination];
    }
    
    // Fallback weather data
    return {
      current: {
        temp: 20,
        feels_like: 22,
        humidity: 65,
        description: 'Partly Cloudy'
      },
      forecast: [
        { day: 'Today', temp: 20, description: 'Partly Cloudy' },
        { day: 'Tomorrow', temp: 18, description: 'Cloudy' },
        { day: 'Day 3', temp: 21, description: 'Sunny' }
      ]
    };

    // Real API implementation (commented out for demo)
    /*
    const destinationData = getDestinationData(destination);
    if (!destinationData?.coordinates) {
      throw new Error('Destination coordinates not found');
    }

    const { lat, lon } = destinationData.coordinates;
    const response = await fetch(
      `${WEATHER_BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch weather data');
    }
    
    const weatherData = await response.json();
    return {
      current: {
        temp: Math.round(weatherData.main.temp),
        feels_like: Math.round(weatherData.main.feels_like),
        humidity: weatherData.main.humidity,
        description: weatherData.weather[0].description
      }
    };
    */
  } catch (error) {
    console.error('Error fetching weather data:', error);
    // Return fallback data
    return {
      current: {
        temp: 20,
        feels_like: 22,
        humidity: 65,
        description: 'Partly Cloudy'
      }
    };
  }
};

// Get real destination data
export const getDestinationData = (destination) => {
  // Normalize destination name for better matching
  const normalizedDestination = destination?.toLowerCase().replace(/[^a-z]/g, '');
  
  // Map common variations to our data keys
  const destinationMap = {
    'bali': 'bali',
    'indonesia': 'bali',
    'balindonesia': 'bali',
    'tokyo': 'tokyo',
    'japan': 'tokyo',
    'tokyojapan': 'tokyo',
    'paris': 'paris',
    'france': 'paris',
    'parisfrance': 'paris',
    'newyork': 'newyork',
    'usa': 'newyork',
    'newyorkusa': 'newyork',
    'iceland': 'iceland',
    'santorini': 'santorini',
    'greece': 'santorini',
    'santorinigreece': 'santorini'
  };
  
  const destKey = destinationMap[normalizedDestination] || normalizedDestination;
  const destData = DESTINATION_DATA[destKey];
  
  if (!destData) {
    console.warn(`Destination data not available for: ${destination}, using generic data`);
    // Return generic data for unsupported destinations
    return {
      name: destination || 'Unknown Destination',
      coordinates: { lat: 0, lon: 0 },
      realPlaces: {
        adventure: [
          { name: 'Local Adventure Tour', location: 'City Center', duration: '3 hours', cost: '₹2,000', description: 'Explore local adventure spots' },
          { name: 'City Walking Tour', location: 'Downtown', duration: '2 hours', cost: '₹1,500', description: 'Guided walking tour of the city' }
        ],
        culture: [
          { name: 'Local Museum Visit', location: 'City Center', duration: '2 hours', cost: '₹800', description: 'Explore local history and culture' },
          { name: 'Traditional Market Tour', location: 'Market District', duration: '2 hours', cost: '₹1,200', description: 'Experience local culture and shopping' }
        ],
        relaxation: [
          { name: 'City Park Visit', location: 'Central Park', duration: '2 hours', cost: '₹300', description: 'Relax in the city\'s main park' },
          { name: 'Local Spa Experience', location: 'Wellness District', duration: '2 hours', cost: '₹2,500', description: 'Traditional spa treatments' }
        ],
        foodie: [
          { name: 'Local Food Tour', location: 'Food District', duration: '3 hours', cost: '₹2,000', description: 'Sample local cuisine and street food' },
          { name: 'Cooking Class', location: 'Culinary Center', duration: '3 hours', cost: '₹3,000', description: 'Learn to cook local dishes' }
        ]
      },
      accommodation: [
        { name: 'Local Hotel', type: 'Standard', location: 'City Center', price: '₹5,000/night', rating: 4.0 },
        { name: 'Budget Hostel', type: 'Budget', location: 'Downtown', price: '₹2,000/night', rating: 3.5 }
      ]
    };
  }
  
  return destData;
};

// Generate realistic trip based on preferences and weather
export const generateRealisticTrip = (destination, quizAnswers, budget, weatherData) => {
  if (!destination) {
    return {
      destination: 'Unknown',
      summary: 'No destination selected. Please start your trip planning from the home page.',
      itinerary: [],
      accommodation: [],
      weather: weatherData || {},
      budget: budget || 0,
      quizAnswers: quizAnswers || {},
    };
  }
  const destData = getDestinationData(destination);
  if (!destData) {
    throw new Error('Unable to generate trip data for this destination');
  }

  const travelStyle = quizAnswers[0] || 'culture';
  const duration = quizAnswers[1] || 'week';
  const accommodation = quizAnswers[2] || 'budget';
  const activities = quizAnswers[3] || 'historical';
  const transport = quizAnswers[4] || 'mix';

  // Calculate trip duration
  const days = duration === 'weekend' ? 3 : duration === 'week' ? 7 : duration === 'extended' ? 12 : 30;
  const actualDays = Math.min(days, 7); // Limit to 7 days for demo

  // Generate day-by-day itinerary
  const itinerary = [];
  const availablePlaces = destData.realPlaces[travelStyle] || destData.realPlaces.culture || destData.realPlaces.adventure;

  for (let day = 1; day <= actualDays; day++) {
    const dayActivities = [];
    const weather = weatherData?.forecast[day - 1] || weatherData?.forecast[0];

    // Morning activity (9 AM - 12 PM)
    if (availablePlaces && availablePlaces.length > 0) {
      const morningActivity = availablePlaces[Math.floor(Math.random() * availablePlaces.length)];
      dayActivities.push({
        time: "09:00",
        activity: morningActivity.name,
        location: morningActivity.location,
        duration: morningActivity.duration,
        cost: morningActivity.cost,
        description: morningActivity.description,
        weather: weather
      });
    }

    // Afternoon activity (2 PM - 5 PM)
    if (availablePlaces && availablePlaces.length > 1) {
      const afternoonActivity = availablePlaces[Math.floor(Math.random() * availablePlaces.length)];
      dayActivities.push({
        time: "14:00",
        activity: afternoonActivity.name,
        location: afternoonActivity.location,
        duration: afternoonActivity.duration,
        cost: afternoonActivity.cost,
        description: afternoonActivity.description,
        weather: weather
      });
    }

    // Evening activity (7 PM - 10 PM)
    if (availablePlaces && availablePlaces.length > 2) {
      const eveningActivity = availablePlaces[Math.floor(Math.random() * availablePlaces.length)];
      dayActivities.push({
        time: "19:00",
        activity: eveningActivity.name,
        location: eveningActivity.location,
        duration: eveningActivity.duration,
        cost: eveningActivity.cost,
        description: eveningActivity.description,
        weather: weather
      });
    }

    itinerary.push({
      day,
      title: `Day ${day}`,
      activities: dayActivities,
      weather: weather
    });
  }

  // Select accommodation based on preference
  const selectedAccommodation = destData.accommodation.find(acc => 
    acc.type.toLowerCase() === accommodation
  ) || destData.accommodation[1]; // Default to mid-range

  return {
    destination: destData,
    summary: {
      title: `Perfect ${travelStyle.charAt(0).toUpperCase() + travelStyle.slice(1)} Trip to ${destData.name}`,
      description: `A carefully curated ${duration} journey designed for ${travelStyle} enthusiasts. Experience the best of ${destData.name} with personalized activities, real accommodations, and current weather conditions.`,
      highlights: [
        "Real places and authentic experiences",
        "Current weather-optimized activities",
        "Budget-optimized recommendations",
        "Local insider tips and hidden gems"
      ]
    },
    itinerary,
    recommendations: {
      accommodation: [selectedAccommodation],
      transport: generateTransportRecommendations(destData.name, transport),
      tips: generateLocalTips(destData.name, travelStyle, weatherData)
    },
    budget,
    quizAnswers,
    weatherData
  };
};

// Generate transport recommendations
const generateTransportRecommendations = (destination, transport) => {
  const transportOptions = {
    public: [
      { name: "Metro/Subway Pass", description: "Unlimited rides for your stay", price: "₹800/day" },
      { name: "Bus Network", description: "Comprehensive bus coverage", price: "₹400/day" }
    ],
    walking: [
      { name: "Walking Tours", description: "Guided walking tours", price: "₹1,200/day" },
      { name: "Self-Guided Routes", description: "Curated walking routes", price: "Free" }
    ],
    private: [
      { name: "Private Car Service", description: "Chauffeur-driven car", price: "₹8,000/day" },
      { name: "Airport Transfer", description: "Direct airport pickup", price: "₹2,500" }
    ],
    mix: [
      { name: "Metro + Walking", description: "Best of both worlds", price: "₹1,000/day" },
      { name: "Hop-on Hop-off Bus", description: "Tourist-friendly transport", price: "₹1,500/day" }
    ]
  };

  return transportOptions[transport] || transportOptions.mix;
};

// Generate local tips based on destination and weather
const generateLocalTips = (destination, travelStyle, weatherData) => {
  const tips = [
    "Book popular attractions in advance to avoid queues",
    "Download offline maps for navigation",
    "Learn basic local phrases for better interactions",
    "Keep emergency contacts handy"
  ];

  if (weatherData?.current?.description?.includes('Rain')) {
    tips.push("Pack an umbrella and waterproof gear");
  }

  if (weatherData?.current?.temp > 25) {
    tips.push("Stay hydrated and wear sunscreen");
  }

  if (travelStyle === 'adventure') {
    tips.push("Check weather conditions before outdoor activities");
  }

  return tips;
}; 

// Placeholder tripService for Dashboard.jsx
export const tripService = {
  async getTripsByUser(userId) {
    // TODO: Replace with real API call
    return [];
  }
}; 