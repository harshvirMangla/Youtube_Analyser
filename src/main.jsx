// import { getChannelIdByUsername, fetchChannelDetails, getChannelVideoDetails } from './API/youtube.js';
//
// const username = 'srkledits';
// const channelId = await getChannelIdByUsername(username);
// console.log("Channel ID:", channelId);
//
// // const stats = await fetchChannelDetails(channelId);
// //
// // console.log("\nChannel Stats:");
// // console.log(`Title: ${stats.title}`);
// // console.log(`Description: ${stats.description}`);
// // console.log(`Country: ${stats.country}`);
// // console.log(`Published At: ${stats.publishedAt}`);
// // console.log(`Subscribers: ${stats.subscribers}`);
// // console.log(`Total Views: ${stats.totalViews}`);
// // console.log(`Total Videos: ${stats.totalVideos}`);
// // console.log(`Banner Image: ${stats.bannerImage}`);
// // console.log(`Keywords: ${stats.keywords}`);
//
// getChannelVideoDetails(channelId);

// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import App from './App.jsx';
//
// ReactDOM.createRoot(document.getElementById('root')).render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );
//
// import { getChannelIdByUsername, getChannelVideoDetails } from './API/youtube.js';
//
// function VideoViewsChart() {
//   const [videoData, setVideoData] = useState([]);
//
//   useEffect(() => {
//     async function fetchData() {
//       const channelId = await getChannelIdByUsername('srkledits');
//       const data = await getChannelVideoDetails(channelId);
//       setVideoData(data);
//     }
//
//     fetchData();
//   }, []);
//
//   return (
//     <div>
//       <h2>Video Views (Sample)</h2>
//       <pre>{JSON.stringify(videoData, null, 2)}</pre>
//     </div>
//   );
// }
//
// export default VideoViewsChart;

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import { VideoDataProvider } from './context/VideoDataContext.jsx';
import { AppProvider } from './context/AppContext.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AppProvider>
        <VideoDataProvider>
          <App />
        </VideoDataProvider>
      </AppProvider>
    </BrowserRouter>
  </React.StrictMode>
);