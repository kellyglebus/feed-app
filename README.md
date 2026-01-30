# GovFeed - Government Opportunities Aggregator

A personalized feed application that aggregates government contracts, grants, federal jobs, and small business opportunities from trusted government data sources.

## Project Overview

GovFeed provides a Twitter/Ground News-style interface for discovering relevant government opportunities. Users select their interests during onboarding, and the feed is automatically personalized to show only relevant content.

## Key Features

### Personalization
- **Interest Capture**: Onboarding flow asks users to select 2+ topics of interest
- **Dynamic Filtering**: Toggle topics on/off to customize feed in real-time
- **Session Persistence**: User preferences saved across page refreshes
- **Global Search**: Search across all opportunities by title

### Feed Experience
- **Infinite Scroll**: Seamless pagination as you scroll
- **Trending Topics**: Shows most active opportunity categories
- **Card-Based UI**: Clean, scannable feed items
- **Data Source Transparency**: Clear indication of data sources

### Technical Features
- **Real API Integration**: Live data from Grants.gov
- **Multiple Data Sources**: Aggregates contracts, grants, jobs, and small business opportunities
- **Component Architecture**: Clean, maintainable React code

## Tech Stack

**Frontend:**
- React (functional components + hooks)
- Session storage for persistence
- Intersection Observer API for infinite scroll

**Backend:**
- Flask (Python)
- RESTful API design
- CORS enabled for local development

**Data Sources:**
- **Grants.gov API** (active) - Federal grant opportunities
- **SAM.gov API** (active - but rate limited) - Government contracts and awards
- **USAJobs** (mock data) - Federal employment opportunities
- **SBA** (mock data) - Small business resources

## Project Structure
```
project/
├── backend/
│   ├── app.py              # Flask API server
│   ├── .env                # API keys (not committed)
│   └── requirements.txt    # Python dependencies
│
└── frontend/
    ├── src/
    │   ├── components/     # Reusable UI components
    │   │   ├── Sidebar.js
    │   │   ├── TopicButton.js
    │   │   ├── TrendingTopics.js
    │   │   ├── DataSources.js
    │   │   ├── SearchBar.js
    │   │   └── FeedItem.js
    │   ├── pages/          # Page-level components
    │   │   ├── Onboarding.js
    │   │   └── Feed.js
    │   ├── App.js
    │   └── index.js
    └── package.json
```

## Getting Started

### Prerequisites
- Python 3.8+
- Node.js 14+
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install Python dependencies:
```bash
pip install flask flask-cors requests python-dotenv --break-system-packages
```

3. Create `.env` file with your API keys:
```
SAM_GOV_API_KEY=your_key_here
```

4. Run the Flask server:
```bash
python app.py
```

Backend will run on `http://127.0.0.1:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

Frontend will run on `http://localhost:3000`

## API Keys

### SAM.gov
- Register at https://sam.gov
- Navigate to Account Details → Request Public API Key
- **Note**: Public API keys are limited to 10 requests/day
- Mock data is used during development to respect rate limits

### Grants.gov
- No authentication required for public search endpoint
- Documentation: https://www.grants.gov/web/grants/developers.html

## API Endpoints

### `GET /topics`
Returns list of available topic categories.

**Response:**
```json
["Government Contracts", "Government Grants", "Federal Jobs", "Small Business"]
```

### `GET /feed`
Returns paginated feed items, optionally filtered by topics and search query.

**Parameters:**
- `page` (optional): Page number (default: 1)
- `per_page` (optional): Items per page (default: 10)
- `topics` (optional): Comma-separated topic filters
- `search` (optional): Search query for titles

**Response:**
```json
{
  "items": [...],
  "page": 1,
  "has_more": true
}
```

### `GET /topic-counts`
Returns count of opportunities per topic.

**Response:**
```json
{
  "Government Contracts": 25,
  "Government Grants": 30,
  "Federal Jobs": 10,
  "Small Business": 15
}
```

## Design Decisions

### Why Session-Based Instead of User Accounts?
- Faster to build and test
- No authentication complexity
- Meets requirement of capturing user interests
- Sufficient for demonstration purposes

### Why Mock Some Data Sources?
- **USAJobs**: API requires organizational justification
- **Small Business**: Demonstrates data structure design
- Shows ability to work with both real and mock data
- Maintains consistent user experience

### Architecture Choices
- **Component-based React**: Reusable, maintainable code
- **Single source of truth**: All state managed in Feed.js
- **Separation of concerns**: Clear frontend/backend boundaries

## Future Enhancements

- [ ] Add user accounts and saved preferences
- [ ] Enable real-time notifications for new opportunities
- [ ] Add filtering by agency, deadline, award amount
- [ ] Implement saved/bookmarked opportunities
- [ ] Add data visualization for trending topics over time
- [ ] Mobile app version

## Notes

- This project was built as a hiring assessment 
- Grants.gov API provides live data with no rate limiting
- SAM.gov API is rate-limited; toggle `USE_REAL_SAM_API` flag in `app.py` for production use
- All mock data is structured to match real API response formats for easy swapping
