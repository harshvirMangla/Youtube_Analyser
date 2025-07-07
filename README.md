# YouTube Analyzer

YouTube Analyzer is a sophisticated full-stack web application designed to provide in-depth analytics for YouTube channels and videos. By integrating the YouTube Data API, MongoDB for data storage, and a React-based frontend with Chart.js visualizations, it delivers comprehensive insights into channel performance, video trends, and upload consistency. The application also leverages Google Generative AI for advanced text summaries and statistical testing for growth analysis.

## Features

- **Channel Statistics**: Displays key metrics such as subscriber count, total views, video count, and channel metadata (title, description, and publish date).
- **Video Analytics**: Visualizes video view trends using interactive line, histogram, and scatter plots powered by Chart.js.
- **Consistency Analysis**: Evaluates upload frequency with metrics like longest, shortest, and average gaps between uploads, complemented by AI-generated summaries using Google Generative AI.
- **Growth Analysis**: Conducts Welch-Satterthwaite t-tests to compare video performance across customizable timeframes (1 month, 3 months, 6 months, or 1 year).
- **Search History**: Tracks analyzed channels with timestamps, allowing users to revisit past analyses seamlessly.
- **Data Persistence**: Efficiently stores channel, video, and history data in MongoDB for quick retrieval and analysis.

## Architecture

- **Backend**: Built with Node.js and Express for robust API handling, MongoDB for scalable data storage, and Mongoose for streamlined schema management.
- **Frontend**: Developed using React with React Router for seamless navigation, Chart.js for dynamic visualizations, and Google Generative AI for intelligent text summaries.
- **API Integration**: Leverages YouTube Data API v3 to fetch real-time channel and video data.

## Prerequisites

To run YouTube Analyzer, ensure the following are installed and configured:

- **Node.js**: Version 16 or higher.
- **MongoDB**: A local instance running on port 27018 (default: `mongodb://localhost:27018/yt_analyzer`).
- **YouTube Data API Key**: Obtain from [Google Cloud Console](https://console.cloud.google.com/).
- **Google Generative AI Key**: Obtain from [Google AI Platform](https://ai.google.dev/).

## Installation

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Verify that MongoDB is running locally on port 27018.
4. Start the backend server:
   ```bash
   npm start
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure API keys:
   - In `frontend/src/API/youtube.js`, set the YouTube API key:
     ```javascript
     export const api_key = 'YOUR_YOUTUBE_API_KEY';
     ```
   - In `frontend/src/components/ConsistencyChecker.jsx`, set the Google Generative AI key:
     ```javascript
     const key = 'YOUR_GOOGLE_AI_KEY';
     ```
4. Start the development server:
   ```bash
   npm start
   ```

## Usage

1. **Launch the Application**:
   - Start the backend server (`npm start` in `backend/`).
   - Start the frontend server (`npm start` in `frontend/`).
   - Access the application at `http://localhost:3000`.

2. **Analyze a Channel**:
   - Input a YouTube username in the provided form.
   - View comprehensive channel statistics on the dashboard, including subscriber count, total views, and video count.
   - Navigate to the following sections:
     - **Video Charts**: Explore video view trends through interactive line, histogram, or scatter plots.
     - **Consistency Checker**: Review upload frequency metrics and AI-generated summaries.
     - **Growth Analysis**: Analyze video performance across selected timeframes using statistical tests.
     - **History**: Access past searches with timestamps for quick reference.

## API Endpoints

The backend provides the following RESTful API endpoints:

- **POST `/api/analysis`**: Stores video statistics for a specified channel.
- **GET `/api/analysis`**: Retrieves all video data, sorted by publish date.
- **POST `/api/history`**: Saves search history entries (channel ID, name, and timestamp).
- **GET `/api/history`**: Fetches all history entries, sorted by timestamp in descending order.
- **GET `/api/history/:sessionId`**: Retrieves history entries for a specific session ID.
- **GET `/api/analysis/:sessionId/:channelId/:time`**: Fetches video data for a session, channel, and timestamp.
- **POST `/api/channel`**: Stores channel statistics.
- **GET `/api/channel/:sessionId/:channelId/:time`**: Retrieves channel data for a session, channel, and timestamp.

## File Structure

- **backend/**:
  - `index.js`: Configures the Express server and API routes.
  - `Models/`: Contains Mongoose schemas (`VideoStats.js`, `MainHistory.js`, `ChannelStats.js`).
- **frontend/src/**:
  - `components/`: Houses React components for the UI (`InputSection.jsx`, `Dashboard.jsx`, etc.).
  - `context/AppContext.jsx`: Manages global application state.
  - `API/youtube.js`: Provides utility functions for YouTube API integration.
  - `*.css`: Includes styles for components.
- **docs/screenshots/**: Optional directory for storing documentation images or screenshots.

## Notes

- **API Quotas**: The YouTube Data API has usage limits. Monitor quotas in the [Google Cloud Console](https://console.cloud.google.com/) and adjust `maxResults` in `Dashboard.jsx` if necessary.
- **MongoDB Configuration**: Ensure a local MongoDB instance is running on `mongodb://localhost:27018/yt_analyzer`.
- **Error Handling**: The application includes robust mechanisms to handle invalid inputs and API errors gracefully.
- **Performance Optimization**: For large datasets, chart rendering may slow down. Optimize by adjusting data sampling in `Dashboard.jsx`.

## Contributing

We welcome contributions to enhance features, fix bugs, or improve documentation. Please submit issues or pull requests via the project's GitHub repository.

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.

## Acknowledgments

YouTube Analyzer was built using the following technologies:
- **Node.js** and **Express** for the backend.
- **MongoDB** and **Mongoose** for data storage and management.
- **React** and **React Router** for the frontend.
- **Chart.js** for data visualizations.
- **Google Generative AI** for intelligent text summaries.

Thank you for using YouTube Analyzer, a powerful tool for unlocking actionable insights into YouTube channel performance.
