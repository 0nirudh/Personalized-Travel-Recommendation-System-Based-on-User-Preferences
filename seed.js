require('dotenv').config();
const mongoose = require('mongoose');
const Destination = require('./models/Destination');

// All destination data (migrated from data.js)
const destinations = [
  { name: "Paris", country: "France", seasons: ["spring", "summer", "fall"], budget: { min: 22000, max: 29500 }, groupTypes: ["single", "couple", "family"], activities: ["sightseeing", "shopping", "food"], description: "The city of lights, known for Eiffel Tower, Louvre, and cuisine." },
  { name: "Tokyo", country: "Japan", seasons: ["spring", "fall"], budget: { min: 25000, max: 30000 }, groupTypes: ["single", "couple", "family"], activities: ["sightseeing", "food", "culture"], description: "Modern city with traditional temples, cherry blossoms in spring." },
  { name: "Bali", country: "Indonesia", seasons: ["summer", "fall"], budget: { min: 21000, max: 26500 }, groupTypes: ["single", "couple", "family"], activities: ["beach", "relaxation", "adventure"], description: "Tropical paradise with beaches, volcanoes, and culture." },
  { name: "New York", country: "USA", seasons: ["spring", "summer", "fall"], budget: { min: 27500, max: 30000 }, groupTypes: ["single", "couple", "family"], activities: ["sightseeing", "shopping", "entertainment"], description: "The Big Apple, with skyscrapers, Broadway, and diverse neighborhoods." },
  { name: "Switzerland", country: "Switzerland", seasons: ["winter", "spring", "summer", "fall"], budget: { min: 28000, max: 30000 }, groupTypes: ["couple", "family"], activities: ["adventure", "nature", "skiing"], description: "Alps with skiing in winter, hiking in summer." },
  { name: "Thailand", country: "Thailand", seasons: ["winter", "spring"], budget: { min: 22000, max: 27000 }, groupTypes: ["single", "couple", "family"], activities: ["beach", "food", "culture"], description: "Tropical beaches, temples, and delicious street food." },
  { name: "Iceland", country: "Iceland", seasons: ["summer"], budget: { min: 29000, max: 30000 }, groupTypes: ["single", "couple"], activities: ["nature", "adventure", "geyser"], description: "Land of fire and ice, with glaciers, volcanoes, and northern lights." },
  { name: "Dubai", country: "UAE", seasons: ["winter", "spring"], budget: { min: 24000, max: 29000 }, groupTypes: ["single", "couple", "family"], activities: ["shopping", "luxury", "desert"], description: "Modern city with skyscrapers, shopping malls, and desert safaris." },
  { name: "Australia", country: "Australia", seasons: ["summer", "fall"], budget: { min: 26000, max: 30000 }, groupTypes: ["couple", "family"], activities: ["beach", "wildlife", "adventure"], description: "Kangaroos, Great Barrier Reef, and vibrant cities." },
  { name: "Morocco", country: "Morocco", seasons: ["fall", "winter"], budget: { min: 22000, max: 26000 }, groupTypes: ["couple", "family"], activities: ["culture", "food", "desert"], description: "Medinas, spices, Sahara desert, and Atlas mountains." },
  { name: "London", country: "UK", seasons: ["spring", "summer", "fall"], budget: { min: 27000, max: 30000 }, groupTypes: ["single", "couple", "family"], activities: ["sightseeing", "culture", "shopping"], description: "Historic city with Big Ben, Buckingham Palace, and world-class museums." },
  { name: "Barcelona", country: "Spain", seasons: ["spring", "summer", "fall"], budget: { min: 24000, max: 29000 }, groupTypes: ["couple", "family"], activities: ["sightseeing", "beach", "food", "culture"], description: "Gaudi's architecture, Mediterranean beaches, and vibrant nightlife." },
  { name: "Amsterdam", country: "Netherlands", seasons: ["spring", "summer", "fall"], budget: { min: 25000, max: 29500 }, groupTypes: ["single", "couple"], activities: ["culture", "cycling", "food"], description: "Canals, museums, cycling culture, and liberal atmosphere." },
  { name: "Sydney", country: "Australia", seasons: ["summer", "fall"], budget: { min: 27000, max: 30000 }, groupTypes: ["couple", "family"], activities: ["beach", "sightseeing", "adventure"], description: "Opera House, Harbour Bridge, and beautiful beaches." },
  { name: "Rio de Janeiro", country: "Brazil", seasons: ["summer", "fall"], budget: { min: 22000, max: 26000 }, groupTypes: ["single", "couple"], activities: ["beach", "adventure", "culture"], description: "Christ the Redeemer, Carnival, beaches, and vibrant culture." },
  { name: "Cape Town", country: "South Africa", seasons: ["summer", "fall"], budget: { min: 24000, max: 28500 }, groupTypes: ["couple", "family"], activities: ["nature", "adventure", "wine"], description: "Table Mountain, vineyards, wildlife safaris, and coastal beauty." },
  { name: "Prague", country: "Czech Republic", seasons: ["spring", "summer", "fall"], budget: { min: 22000, max: 26000 }, groupTypes: ["couple", "family"], activities: ["culture", "food", "sightseeing"], description: "Medieval architecture, beer culture, and affordable European charm." },
  { name: "Goa", country: "India", seasons: ["winter", "spring"], budget: { min: 10000, max: 17000 }, groupTypes: ["single", "couple", "family"], activities: ["beach", "food", "culture", "relaxation"], description: "Beautiful beaches, Portuguese heritage, seafood, and vibrant nightlife." },
  { name: "Kerala", country: "India", seasons: ["winter", "spring"], budget: { min: 11000, max: 18000 }, groupTypes: ["couple", "family"], activities: ["nature", "culture", "food", "relaxation"], description: "Backwaters, houseboats, Ayurveda, tea plantations, and tropical beaches." },
  { name: "Rajasthan", country: "India", seasons: ["winter", "spring"], budget: { min: 10500, max: 17500 }, groupTypes: ["couple", "family"], activities: ["culture", "adventure", "sightseeing"], description: "Palaces, forts, desert safaris, and rich Rajasthani heritage." },
  { name: "Himachal Pradesh", country: "India", seasons: ["summer", "fall"], budget: { min: 11000, max: 18000 }, groupTypes: ["single", "couple", "family"], activities: ["nature", "adventure", "relaxation"], description: "Himalayan mountains, trekking, Shimla, Manali, and hill stations." },
  { name: "Kashmir", country: "India", seasons: ["summer", "fall"], budget: { min: 12000, max: 19000 }, groupTypes: ["couple", "family"], activities: ["nature", "adventure", "culture"], description: "Dal Lake, houseboats, Mughal gardens, and stunning valley views." },
  { name: "Agra & Taj Mahal", country: "India", seasons: ["winter", "spring"], budget: { min: 10000, max: 15000 }, groupTypes: ["couple", "family"], activities: ["sightseeing", "culture", "history"], description: "Taj Mahal, Agra Fort, Fatehpur Sikri, and Mughal architecture." },
  { name: "Jaipur", country: "India", seasons: ["winter", "spring"], budget: { min: 10500, max: 17000 }, groupTypes: ["couple", "family"], activities: ["sightseeing", "culture", "shopping"], description: "Pink City, Amber Fort, palaces, and traditional markets." },
  { name: "Udaipur", country: "India", seasons: ["winter", "spring"], budget: { min: 11000, max: 17500 }, groupTypes: ["couple", "family"], activities: ["sightseeing", "culture", "relaxation"], description: "City of Lakes, palaces, Lake Pichola, and romantic ambiance." },
  { name: "Varanasi", country: "India", seasons: ["winter", "spring"], budget: { min: 10000, max: 14500 }, groupTypes: ["single", "couple"], activities: ["culture", "spirituality", "food"], description: "Ganges River, ghats, temples, and ancient spiritual significance." },
  { name: "Mumbai", country: "India", seasons: ["winter", "spring"], budget: { min: 11500, max: 19000 }, groupTypes: ["single", "couple", "family"], activities: ["sightseeing", "food", "entertainment", "shopping"], description: "Bollywood, Gateway of India, street food, and bustling metropolis." },
  { name: "Delhi", country: "India", seasons: ["winter", "spring"], budget: { min: 11000, max: 18000 }, groupTypes: ["single", "couple", "family"], activities: ["sightseeing", "culture", "food", "history"], description: "Red Fort, India Gate, Qutub Minar, and Mughal monuments." },
  { name: "Darjeeling", country: "India", seasons: ["spring", "summer", "fall"], budget: { min: 12000, max: 17000 }, groupTypes: ["couple", "family"], activities: ["nature", "tea", "adventure"], description: "Tea plantations, Himalayan views, toy train, and cool mountain air." },
  { name: "Andaman & Nicobar", country: "India", seasons: ["winter", "spring"], budget: { min: 13000, max: 20000 }, groupTypes: ["couple", "family"], activities: ["beach", "adventure", "nature", "snorkeling"], description: "Pristine beaches, coral reefs, tribal culture, and island hopping." },
  { name: "Ladakh", country: "India", seasons: ["summer", "fall"], budget: { min: 12500, max: 19500 }, groupTypes: ["single", "couple"], activities: ["adventure", "nature", "culture"], description: "High-altitude desert, monasteries, Pangong Lake, and trekking." },
  { name: "Rishikesh", country: "India", seasons: ["spring", "summer", "fall"], budget: { min: 10000, max: 15000 }, groupTypes: ["single", "couple"], activities: ["adventure", "spirituality", "nature"], description: "Yoga capital, Ganges rafting, temples, and adventure sports." },
  { name: "Chennai", country: "India", seasons: ["winter", "spring"], budget: { min: 10500, max: 16000 }, groupTypes: ["single", "family"], activities: ["beach", "food", "culture", "sightseeing"], description: "Marina Beach, temples, South Indian cuisine, and colonial architecture." },
  { name: "Kolkata", country: "India", seasons: ["winter", "spring"], budget: { min: 10000, max: 15000 }, groupTypes: ["family", "couple"], activities: ["culture", "food", "history", "sightseeing"], description: "Victoria Memorial, Howrah Bridge, Durga Puja, and Bengali culture." },
  { name: "Hyderabad", country: "India", seasons: ["winter", "spring"], budget: { min: 11000, max: 17000 }, groupTypes: ["single", "family"], activities: ["food", "culture", "sightseeing", "shopping"], description: "Charminar, biryani, Golconda Fort, and IT hub with rich history." },
  { name: "Pune", country: "India", seasons: ["winter", "spring"], budget: { min: 10000, max: 15000 }, groupTypes: ["single", "couple"], activities: ["nature", "culture", "food", "adventure"], description: "Hill stations nearby, Aga Khan Palace, street food, and pleasant climate." },
  { name: "Ahmedabad", country: "India", seasons: ["winter", "spring"], budget: { min: 10000, max: 14500 }, groupTypes: ["couple", "family"], activities: ["culture", "history", "food", "shopping"], description: "Sabarmati Ashram, Gandhi's legacy, textile markets, and Gujarati cuisine." },
  { name: "Chandigarh", country: "India", seasons: ["winter", "spring", "fall"], budget: { min: 10500, max: 15500 }, groupTypes: ["family", "couple"], activities: ["nature", "culture", "shopping", "relaxation"], description: "Planned city, Rock Garden, Sukhna Lake, and modern architecture." },
  { name: "Amritsar", country: "India", seasons: ["winter", "spring"], budget: { min: 10000, max: 14000 }, groupTypes: ["family", "couple"], activities: ["culture", "spirituality", "history", "food"], description: "Golden Temple, Wagah Border, Sikh heritage, and Punjabi hospitality." },
  { name: "Mysore", country: "India", seasons: ["winter", "spring"], budget: { min: 10000, max: 14500 }, groupTypes: ["couple", "family"], activities: ["culture", "history", "nature", "food"], description: "Mysore Palace, silk sarees, Chamundi Hill, and royal heritage." },
  { name: "Coorg", country: "India", seasons: ["winter", "spring"], budget: { min: 11000, max: 16000 }, groupTypes: ["couple", "family"], activities: ["nature", "adventure", "food", "relaxation"], description: "Coffee plantations, trekking, waterfalls, and Kodava culture." },
  { name: "Gangtok", country: "India", seasons: ["spring", "summer", "fall"], budget: { min: 11500, max: 18000 }, groupTypes: ["couple", "family"], activities: ["nature", "adventure", "culture"], description: "Sikkim capital, monasteries, Kanchenjunga views, and mountain trekking." },
  { name: "Shimla", country: "India", seasons: ["summer", "fall"], budget: { min: 11000, max: 16000 }, groupTypes: ["couple", "family"], activities: ["nature", "history", "relaxation"], description: "Queen of hills, colonial architecture, apple orchards, and pleasant weather." },
  { name: "Nainital", country: "India", seasons: ["summer", "fall"], budget: { min: 11000, max: 16000 }, groupTypes: ["family", "couple"], activities: ["nature", "adventure", "relaxation"], description: "Lake town, boating, hiking, Naini Lake, and Himalayan views." },
  { name: "Ooty", country: "India", seasons: ["spring", "summer", "fall"], budget: { min: 11500, max: 16500 }, groupTypes: ["family", "couple"], activities: ["nature", "relaxation", "adventure"], description: "Nilgiri hills, tea estates, botanical gardens, and colonial bungalows." },
  { name: "Mahabaleshwar", country: "India", seasons: ["summer", "fall"], budget: { min: 11000, max: 15500 }, groupTypes: ["family", "couple"], activities: ["nature", "adventure", "relaxation"], description: "Strawberry farms, viewpoints, lakes, and monsoon retreat." },
  { name: "Singapore", country: "Singapore", seasons: ["winter", "spring"], budget: { min: 25000, max: 29000 }, groupTypes: ["single", "couple", "family"], activities: ["sightseeing", "food", "shopping", "luxury"], description: "Clean city-state, Marina Bay Sands, Gardens by the Bay, and amazing food." },
  { name: "Bangkok", country: "Thailand", seasons: ["winter", "spring"], budget: { min: 23000, max: 27000 }, groupTypes: ["single", "couple", "family"], activities: ["sightseeing", "food", "culture", "shopping"], description: "Temples, street food, night markets, and vibrant city life." },
  { name: "Seoul", country: "South Korea", seasons: ["spring", "fall"], budget: { min: 26000, max: 29500 }, groupTypes: ["single", "couple"], activities: ["culture", "food", "sightseeing", "entertainment"], description: "K-pop, palaces, street food, modern skyscrapers, and Korean BBQ." },
  { name: "Rome", country: "Italy", seasons: ["spring", "fall"], budget: { min: 25000, max: 29000 }, groupTypes: ["couple", "family"], activities: ["sightseeing", "culture", "food", "history"], description: "Colosseum, Vatican City, pasta, gelato, and ancient history." },
  { name: "Venice", country: "Italy", seasons: ["spring", "summer", "fall"], budget: { min: 26000, max: 29500 }, groupTypes: ["couple"], activities: ["sightseeing", "culture", "romance", "food"], description: "Canals, gondolas, St. Mark's Square, and romantic waterways." },
  { name: "Berlin", country: "Germany", seasons: ["spring", "summer", "fall"], budget: { min: 24000, max: 28000 }, groupTypes: ["single", "couple"], activities: ["culture", "history", "entertainment", "food"], description: "Berlin Wall, museums, nightlife, and modern German culture." },
  { name: "Vienna", country: "Austria", seasons: ["spring", "summer", "fall"], budget: { min: 25000, max: 28500 }, groupTypes: ["couple", "family"], activities: ["culture", "music", "sightseeing", "food"], description: "Classical music, palaces, coffee houses, and imperial history." },
  { name: "Athens", country: "Greece", seasons: ["spring", "summer", "fall"], budget: { min: 23000, max: 27000 }, groupTypes: ["couple", "family"], activities: ["history", "culture", "beach", "food"], description: "Acropolis, ancient ruins, Mediterranean food, and island hopping." },
  { name: "Istanbul", country: "Turkey", seasons: ["spring", "summer", "fall"], budget: { min: 22000, max: 26500 }, groupTypes: ["couple", "family"], activities: ["culture", "history", "food", "shopping"], description: "Hagia Sophia, bazaars, Bosphorus, and blend of East-West cultures." },
  { name: "Dubrovnik", country: "Croatia", seasons: ["spring", "summer", "fall"], budget: { min: 23000, max: 27000 }, groupTypes: ["couple", "family"], activities: ["sightseeing", "beach", "culture", "adventure"], description: "Game of Thrones locations, Adriatic coast, old city walls." },
  { name: "Edinburgh", country: "UK", seasons: ["spring", "summer", "fall"], budget: { min: 25000, max: 29000 }, groupTypes: ["couple", "family"], activities: ["culture", "history", "festival", "nature"], description: "Edinburgh Castle, festivals, Scotch whisky, and Scottish highlands nearby." },
  { name: "Vancouver", country: "Canada", seasons: ["summer", "fall"], budget: { min: 27000, max: 30000 }, groupTypes: ["couple", "family"], activities: ["nature", "adventure", "culture", "food"], description: "Stanley Park, mountains, seafood, and diverse neighborhoods." },
  { name: "Buenos Aires", country: "Argentina", seasons: ["spring", "summer", "fall"], budget: { min: 23000, max: 27000 }, groupTypes: ["single", "couple"], activities: ["culture", "food", "entertainment", "history"], description: "Tango, beef, European architecture, and vibrant nightlife." },
  { name: "Mexico City", country: "Mexico", seasons: ["winter", "spring"], budget: { min: 22000, max: 26500 }, groupTypes: ["single", "couple", "family"], activities: ["culture", "food", "history", "entertainment"], description: "Ancient pyramids, museums, street food, and colorful culture." },
  { name: "Marrakech", country: "Morocco", seasons: ["fall", "winter", "spring"], budget: { min: 21000, max: 25000 }, groupTypes: ["couple", "family"], activities: ["culture", "food", "shopping", "adventure"], description: "Jemaa el-Fnaa square, souks, riads, and desert nearby." }
];

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Destination.deleteMany({});
    console.log('🗑️  Cleared existing destinations');

    // Insert all destinations
    const result = await Destination.insertMany(destinations);
    console.log(`🌍 Seeded ${result.length} destinations into MongoDB`);

    // Show summary
    const indianCount = result.filter(d => d.country === 'India').length;
    const internationalCount = result.length - indianCount;
    console.log(`   📍 ${indianCount} Indian destinations`);
    console.log(`   🌏 ${internationalCount} International destinations`);

    await mongoose.connection.close();
    console.log('✅ Database connection closed');
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
}

seedDatabase();
