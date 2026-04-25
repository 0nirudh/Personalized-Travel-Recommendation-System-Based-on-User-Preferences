require('dotenv').config();
const express = require('express');
const connectDB = require('./db');
const Destination = require('./models/Destination');

const app = express();

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Connect to MongoDB
connectDB();

// Routes
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.get('/login', (req, res) => {
  res.sendFile(__dirname + '/public/login.html');
});

app.get('/national', (req, res) => {
  res.sendFile(__dirname + '/public/national.html');
});

app.get('/international', (req, res) => {
  res.sendFile(__dirname + '/public/international.html');
});

// API: Get all destinations (for admin/debug)
app.get('/api/destinations', async (req, res) => {
  try {
    const destinations = await Destination.find();
    res.json({ count: destinations.length, destinations });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch destinations' });
  }
});

// API: Add a new destination
app.post('/api/destinations', async (req, res) => {
  try {
    const destination = new Destination(req.body);
    await destination.save();
    res.status(201).json(destination);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// API: Delete a destination
app.delete('/api/destinations/:id', async (req, res) => {
  try {
    const deleted = await Destination.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Destination not found' });
    res.json({ message: 'Deleted', destination: deleted });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API: Seed Database (for Cloud Deployment)
app.get('/api/seed', async (req, res) => {
  try {
    const destinationsData = require('./data');
    await Destination.deleteMany({});
    const result = await Destination.insertMany(destinationsData);
    
    const indianCount = result.filter(d => d.country === 'India').length;
    const internationalCount = result.length - indianCount;
    
    res.json({ 
      message: '✅ Database successfully seeded!',
      total: result.length,
      indian: indianCount,
      international: internationalCount
    });
  } catch (error) {
    console.error('Seeding error:', error);
    res.status(500).json({ error: 'Failed to seed database: ' + error.message });
  }
});

// Main recommendation engine — now powered by MongoDB
app.post('/recommendations', async (req, res) => {
  try {
    const { budget, startDate, endDate, activities, tripType, groupType } = req.body;

    // Determine season from startDate
    const date = new Date(startDate);
    const month = date.getMonth() + 1;

    let season;
    if ([12, 1, 2].includes(month)) season = 'winter';
    else if ([3, 4, 5].includes(month)) season = 'spring';
    else if ([6, 7, 8].includes(month)) season = 'summer';
    else season = 'fall';

    // Build MongoDB query filter
    const query = {};

    // Filter by trip type
    if (tripType === 'national') {
      query.country = 'India';
    } else if (tripType === 'international') {
      query.country = { $ne: 'India' };
    }

    // Filter by group type
    if (groupType) {
      query.groupTypes = groupType;
    }

    // Fetch matching destinations from MongoDB
    const allDestinations = await Destination.find(query).lean();

    // Score and rank results
    const scoredResults = allDestinations.map(dest => {
      const inBudget = dest.budget.min <= budget && dest.budget.max >= budget;
      const budgetDistance = inBudget ? 0 : Math.min(
        Math.abs(dest.budget.min - budget),
        Math.abs(dest.budget.max - budget)
      );
      const seasonMatch = dest.seasons.includes(season);
      const activityMatches = activities.filter(act => dest.activities.includes(act)).length;

      const score =
        (inBudget ? 40 : 20) +
        (seasonMatch ? 30 : 10) +
        (activityMatches * 10);

      return { dest, score, inBudget, seasonMatch, activityMatches, budgetDistance };
    });

    // Try exact matches first
    const exactMatches = scoredResults
      .filter(item => item.inBudget && item.seasonMatch && item.activityMatches > 0)
      .sort((a, b) => b.score - a.score)
      .map(item => ({ ...item.dest, matchType: 'exact' }));

    if (exactMatches.length > 0) {
      return res.json(exactMatches);
    }

    // Fallback to closest matches
    const fallbackMatches = scoredResults
      .sort((a, b) => b.score - a.score)
      .slice(0, 6)
      .map(item => ({ ...item.dest, matchType: 'closest' }));

    res.json(fallbackMatches);
  } catch (error) {
    console.error('Recommendation error:', error);
    res.status(500).json({ error: 'Failed to get recommendations' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});