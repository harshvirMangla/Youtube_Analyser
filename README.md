# YouTube Analyzer

YouTube Analyzer is a full-stack web application designed to analyze YouTube channel and video statistics. It leverages the YouTube Data API to fetch data, stores it in MongoDB, and provides a React-based frontend for visualizations and insights. Key features include channel statistics, video view trend analysis, upload consistency evaluation, growth analysis via statistical testing, and search history tracking.

## Features

- **Channel Statistics**: Displays subscriber count, total views, video count, and channel metadata (title, description, publish date).
- **Video Analytics**: Visualizes video view trends through line, histogram, and scatter plots using Chart.js.
- **Consistency Analysis**: Calculates upload frequency metrics (longest, shortest, average gaps, percentiles) and generates summaries using Google Generative AI.
- **Growth Analysis**: Performs Welch-Satterthwaite t-test to compare video performance across selectable timeframes (1 month, 3 months, 6 months, 1 year).
- **Search History**: Tracks analyzed channels with timestamps, enabling users to revisit past analyses.
- **Data Persistence**: Stores channel, video, and history data in MongoDB for efficient retrieval and analysis.

## Architecture

- **Backend**: Node.js with Express for API handling, MongoDB for storage, and Mongoose for schema management.
- **Frontend**: React with React Router for navigation, Chart.js for visualizations, and Google Generative AI for text summaries.
- **API Integration**: Uses YouTube Data API v3 for real-time channel and video data.

## Prerequisites

- **Node.js** (v16 or higher)
- **MongoDB** (local instance running on port 27018)
- **YouTube Data API Key** (obtain from Google Cloud Console)
- **Google Generative AI Key** (obtain from Google AI platform)

## Installation

### Backend
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Ensure MongoDB is running locally on port 27018 (default: `mongodb://localhost:27018/yt_analyzer`).
4. Start the server:
   ```bash
   npm start
   ```

### Frontend
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure API keys:
   - Set YouTube API key in `frontend/src/API/youtube.js`:
     ```javascript
     export const api_key = 'YOUR_YOUTUBE_API_KEY';
     ```
   - Set Google Generative AI key in `frontend/src/components/ConsistencyChecker.jsx`:
     ```javascript
     const key = 'YOUR_GOOGLE_AI_KEY';
     ```
4. Start the development server:
   ```bash
   npm start
   ```

## Usage

1. **Launch Application**:
   - Run the backend server (`npm start` in `backend/`).
   - Run the frontend server (`npm start` in `frontend/`).
   - Access the app at `http://localhost:3000`.

2. **Analyze a Channel**:
   - Enter a YouTube username in the input form.
   - View channel statistics on the dashboard (subscribers, total views, videos).
   - Navigate to:
     - **Video Charts**: Displays line, histogram, or scatter plots of video views.
     - **Consistency Checker**: Shows upload frequency statistics and an AI-generated summary.
     - **Growth Analysis**: Compares recent vs. past video performance using statistical tests.
     - **History**: Lists past searches with timestamps for revisiting analyses.

## API Endpoints

- **POST `/api/analysis`**: Stores video statistics for a channel.
- **GET `/api/analysis`**: Retrieves all video data, sorted by publish date.
- **POST `/api/history`**: Saves search history entries (channel ID, name, timestamp).
- **GET `/api/history`**: Retrieves all history entries, sorted by timestamp (descending).
- **GET `/api/history/:sessionId`**: Fetches history for a specific session ID.
- **GET `/api/analysis/:sessionId/:channelId/:time`**: Retrieves video data for a session, channel, and timestamp.
- **POST `/api/channel`**: Stores channel statistics.
- **GET `/api/channel/:sessionId/:channelId/:time`**: Retrieves channel data for a session, channel, and timestamp.

## File Structure

- `backend/`:
  - `index.js`: Express server with API routes.
  - `Models/`: Mongoose schemas (`VideoStats.js`, `MainHistory.js`, `ChannelStats.js`).
- `frontend/src/`:
  - `components/`: React components for UI (`InputSection.jsx`, `Dashboard.jsx`, etc.).
  - `context/AppContext.jsx`: Manages global state.
  - `API/youtube.js`: YouTube API utility functions.
  - `*.css`: Styles for components.
- `docs/screenshots/`: Optional folder for screenshots or documentation images.

## Notes

- **API Quotas**: YouTube Data API has usage limits; monitor quotas in Google Cloud Console and adjust `maxResults` in `Dashboard.jsx` if needed.
- **MongoDB Setup**: Ensure a local MongoDB instance is running on `mongodb://localhost:27018/yt_analyzer`.
- **Error Handling**: The app includes robust error handling for invalid inputs and API failures.
- **Performance**: Large datasets may slow down chart rendering; optimize by adjusting data sampling in `Dashboard.jsx`.

## Contributing

Contributions are welcome to enhance functionality, fix bugs, or improve documentation. Please submit issues or pull requests via GitHub.

## License

MIT License. See `LICENSE` for details.

## Acknowledgments

- Built with Node.js, Express, MongoDB, React, Chart.js, and Google Generative AI.
- Developed to provide actionable insights for YouTube channel analytics.
