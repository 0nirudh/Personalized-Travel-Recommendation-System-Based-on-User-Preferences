# Travel Recommendation System

A personalized travel recommendation system built with Node.js and Express.js. Users can input their preferences including budget, travel dates, and activities to receive tailored destination suggestions filtered by seasons, budget, and interests.

## Features

- Input budget, travel dates, and preferred activities
- Automatic season detection based on travel dates
- Filtering destinations by budget range, season, and activity interests
- Web-based interface for easy use

## Installation

1. Clone the repository or download the files.
2. Navigate to the project directory.
3. Install dependencies:

   ```
   npm install
   ```

## Usage

1. Start the server:

   ```
   npm start
   ```

   For development with auto-restart:

   ```
   npm run dev
   ```

2. Open your browser and go to `http://localhost:3000`
3. Fill in the form with your preferences and submit to get recommendations.

## API

### POST /recommendations

Accepts JSON with:
- `budget`: number (USD)
- `startDate`: string (YYYY-MM-DD)
- `endDate`: string (YYYY-MM-DD)
- `activities`: array of strings

Returns an array of matching destinations.

## Project Structure

- `server.js`: Main Express server
- `data.js`: Destination data
- `public/index.html`: Frontend interface
- `package.json`: Dependencies and scripts