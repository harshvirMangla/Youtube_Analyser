// import React, { useContext, useEffect, useState, useMemo } from 'react';
// import { AppContext } from '../context/AppContext.jsx';
// import { api_key, base_url } from '../API/youtube.js';
// import { getSessionId } from './Dashboard.jsx';
//
// const ChangesPage = () => {
//   const {
//     channelId,
//     videoArtificialData: prevVideosRaw,
//     setVideoArtificialData,
//     username,
//     channelStats
//   } = useContext(AppContext);
//
//   const [latestVideos, setLatestVideos] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [timeEntryInDB, setTimeEntryInDB] = useState(null);
//   const [isStoring, setIsStoring] = useState(false);
//
//   const sessionId = getSessionId();
//
//   const prevVideos = useMemo(() =>
//     prevVideosRaw?.map(video => ({
//       title: video.snippet.title,
//       views: parseInt(video.statistics.viewCount),
//       publishedAt: new Date(video.snippet.publishedAt),
//     })) || [], [prevVideosRaw]
//   );
//
//   const fetchLatestVideos = async (channelId) => {
//     try {
//       let allStats = [];
//       let videoIds = [];
//       let nextPageToken = null;
//
//       while (true) {
//         let url = `${base_url}/search?key=${api_key}&channelId=${channelId}&part=snippet,id&type=video&maxResults=50`;
//         if (nextPageToken) url += `&pageToken=${nextPageToken}`;
//
//         const res = await fetch(url);
//         const data = await res.json();
//
//         nextPageToken = data.nextPageToken || null;
//         const items = data.items || [];
//         const ids = items
//           .filter(item => item.id.kind === 'youtube#video')
//           .map(item => item.id.videoId);
//
//         videoIds.push(...ids);
//         if (!nextPageToken) break;
//       }
//
//       for (let i = 0; i < videoIds.length; i += 50) {
//         const chunk = videoIds.slice(i, i + 50).join(',');
//         const statsRes = await fetch(`${base_url}/videos?part=snippet,statistics&id=${chunk}&key=${api_key}`);
//         const statsData = await statsRes.json();
//         allStats.push(...statsData.items);
//       }
//
//       return allStats.map(video => ({
//         title: video.snippet.title,
//         views: parseInt(video.statistics.viewCount),
//         publishedAt: new Date(video.snippet.publishedAt),
//       }));
//     } catch (error) {
//       console.error('Error fetching videos:', error);
//       return [];
//     }
//   };
//
//   const checkRecentEntry = async (channelId) => {
//     try {
//       const response = await fetch(`http://localhost:3000/api/history?channelId=${channelId}`);
//       const data = await response.json();
//       if (data && data.length > 0) {
//         const latestEntry = data[0];
//         const entryTime = new Date(latestEntry.time);
//         const now = new Date();
//         const timeDiff = (now - entryTime) / 1000; // Time difference in seconds
//         return timeDiff < 30; // True if entry exists within 30 seconds
//       }
//       return false;
//     } catch (error) {
//       console.error('Error checking recent entry:', error);
//       return false;
//     }
//   };
//
//   const storeInDB = async () => {
//     const now = new Date();
//     const time = now.toISOString();
//     setTimeEntryInDB(time);
//     const data = {
//       channelId: channelId,
//       sessionId: sessionId,
//       channelName: username,
//       time: time,
//     };
//
//     const response = await fetch('http://localhost:3000/api/history', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(data),
//     });
//
//     return await response.json();
//   };
//
//   const storeChannelStats = async () => {
//     const data = {
//       ...channelStats,
//       time: timeEntryInDB,
//       channelId: channelId,
//       sessionId: sessionId,
//     };
//
//     const response = await fetch('http://localhost:3000/api/channel', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(data),
//     });
//
//     return await response.json();
//   };
//
//   const saveAnalysis = async () => {
//     const databaseVideoItems = latestVideos.map(
//       (video) => ({
//         snippet: {
//           title: video.title,
//           publishedAt: video.publishedAt.toISOString()
//         },
//         statistics: {
//           viewCount: video.views.toString()
//         },
//         channelId: channelId,
//         sessionId: sessionId,
//         channelName: username,
//         time: timeEntryInDB,
//       })
//     );
//
//     const response = await fetch('http://localhost:3000/api/analysis', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(databaseVideoItems),
//     });
//
//     return await response.json();
//   };
//
//   useEffect(() => {
//     const fetchAndStoreData = async () => {
//       if (!channelId || isStoring) return;
//
//       setIsStoring(true);
//
//       // Check if data was stored in the last 30 seconds
//       const hasRecentEntry = await checkRecentEntry(channelId);
//       if (hasRecentEntry) {
//         console.log('Data already stored within the last 30 seconds, skipping.');
//         setLoading(false);
//         setIsStoring(false);
//         return;
//       }
//
//       // Fetch latest videos
//       const latest = await fetchLatestVideos(channelId);
//       setLatestVideos(latest);
//
//       // Store data in sequence
//       await storeInDB();
//       if (timeEntryInDB) {
//         await storeChannelStats();
//         if (latest.length > 0) {
//           await saveAnalysis();
//         }
//       }
//
//       setLoading(false);
//       setIsStoring(false);
//     };
//
//     if (channelId && prevVideos.length > 0) {
//       fetchAndStoreData();
//     }
//   }, []); // Empty dependency array to run only on mount
//
//   const compareVideos = () => {
//     if (!prevVideos || prevVideos.length === 0 || !latestVideos) return [];
//     return latestVideos.map(video => {
//       const prev = prevVideos.find(v => v.title === video.title);
//       return {
//         title: video.title,
//         prevViews: prev ? prev.views : 0,
//         latestViews: video.views,
//         change: prev ? video.views - prev.views : video.views,
//       };
//     });
//   };
//
//   const comparison = compareVideos();
//
//   const dashboardStyle = {
//     backgroundColor: '#1a1a1a',
//     padding: '2rem',
//     border: '1px solid #2c2c2c',
//     borderRadius: '20px',
//     margin: '3rem auto',
//     width: '100%',
//     maxWidth: '83%',
//     overflow: 'hidden',
//     color: '#e2e2e2',
//     boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
//     animation: 'slideUp 0.8s ease-out',
//     minHeight: '80vh'
//   };
//
//   const headerStyle = {
//     color: '#ffffff',
//     fontSize: '2.5rem',
//     fontWeight: 'bold',
//     background: 'linear-gradient(to right, #4285f4, #9b59b6, #e74c3c)',
//     WebkitBackgroundClip: 'text',
//     WebkitTextFillColor: 'transparent',
//     MozBackgroundClip: 'text',
//     MozTextFillColor: 'transparent',
//     display: 'inline-block',
//     marginBottom: '2rem',
//     textAlign: 'center',
//     width: '100%'
//   };
//
//   const tableWrapperStyle = {
//     background: 'linear-gradient(135deg, rgba(30,30,30,0.95), rgba(42,42,42,0.9))',
//     padding: '1.5rem',
//     borderRadius: '16px',
//     boxShadow: 'inset 0 0 0.5px rgba(255,255,255,0.1), 0 8px 24px rgba(0,0,0,0.3)',
//     border: '1px solid rgba(255,255,255,0.06)',
//     borderLeft: '7px solid #a12929',
//     backdropFilter: 'blur(6px)',
//     WebkitBackdropFilter: 'blur(6px)',
//     overflow: 'hidden'
//   };
//
//   const tableStyle = {
//     width: '100%',
//     borderCollapse: 'collapse',
//     fontSize: '0.95rem'
//   };
//
//   const thStyle = {
//     borderBottom: '2px solid #555',
//     padding: '1rem 0.75rem',
//     textAlign: 'left',
//     fontWeight: '600',
//     color: '#f1f1f1',
//     backgroundColor: 'rgba(42,42,42,0.5)'
//   };
//
//   const tdStyle = {
//     borderBottom: '1px solid rgba(255,255,255,0.1)',
//     padding: '0.875rem 0.75rem',
//     color: '#e2e2e2'
//   };
//
//   const loadingStyle = {
//     textAlign: 'center',
//     fontSize: '1.1rem',
//     color: '#9b59b6',
//     padding: '2rem'
//   };
//
//   return (
//     <div style={dashboardStyle}>
//       <div style={{ textAlign: 'center' }}>
//         <h1 style={headerStyle}>
//           {username}'s Channel Changes
//         </h1>
//       </div>
//
//       {loading ? (
//         <div style={loadingStyle}>
//           Loading latest video stats...
//         </div>
//       ) : (
//         <div style={tableWrapperStyle}>
//           <table style={tableStyle}>
//             <thead>
//             <tr>
//               <th style={thStyle}>Video Title</th>
//               <th style={thStyle}>Previous Views</th>
//               <th style={thStyle}>Latest Views</th>
//               <th style={thStyle}>Change</th>
//             </tr>
//             </thead>
//             <tbody>
//             {comparison.map((video, index) => (
//               <tr
//                 key={video.title}
//                 style={{
//                   backgroundColor: index % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent'
//                 }}
//               >
//                 <td style={{...tdStyle, fontWeight: '500', maxWidth: '300px'}}>{video.title}</td>
//                 <td style={tdStyle}>{video.prevViews.toLocaleString()}</td>
//                 <td style={tdStyle}>{video.latestViews.toLocaleString()}</td>
//                 <td style={{
//                   ...tdStyle,
//                   color: video.change >= 0 ? '#4ade80' : '#ef4444',
//                   fontWeight: '600'
//                 }}>
//                   {video.change >= 0 ? '+' : ''}{video.change.toLocaleString()}
//                 </td>
//               </tr>
//             ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// };
//
// export default ChangesPage;

// import React, { useContext, useEffect, useState, useMemo } from 'react';
// import { AppContext } from '../context/AppContext.jsx';
// import { api_key, base_url } from '../API/youtube.js';
// import { getSessionId } from './Dashboard.jsx';
//
// const ChangesPage = () => {
//   const {
//     channelId,
//     videoArtificialData: prevVideosRaw,
//     username,
//     channelStats
//   } = useContext(AppContext);
//
//   const [latestVideos, setLatestVideos] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [timeEntryInDB, setTimeEntryInDB] = useState(null);
//   const [isStoring, setIsStoring] = useState(false);
//
//   const sessionId = getSessionId();
//
//   const prevVideos = useMemo(() =>
//     prevVideosRaw?.map(video => ({
//       title: video.snippet.title,
//       views: parseInt(video.statistics.viewCount),
//       publishedAt: new Date(video.snippet.publishedAt),
//     })) || [], [prevVideosRaw]
//   );
//
//   const fetchLatestVideos = async (channelId) => {
//     try {
//       let allStats = [];
//       let videoIds = [];
//       let nextPageToken = null;
//
//       while (true) {
//         let url = `${base_url}/search?key=${api_key}&channelId=${channelId}&part=snippet,id&type=video&maxResults=50`;
//         if (nextPageToken) url += `&pageToken=${nextPageToken}`;
//
//         const res = await fetch(url);
//         const data = await res.json();
//
//         nextPageToken = data.nextPageToken || null;
//         const items = data.items || [];
//         const ids = items
//           .filter(item => item.id.kind === 'youtube#video')
//           .map(item => item.id.videoId);
//
//         videoIds.push(...ids);
//         if (!nextPageToken) break;
//       }
//
//       for (let i = 0; i < videoIds.length; i += 50) {
//         const chunk = videoIds.slice(i, i + 50).join(',');
//         const statsRes = await fetch(`${base_url}/videos?part=snippet,statistics&id=${chunk}&key=${api_key}`);
//         const statsData = await statsRes.json();
//         allStats.push(...(statsData.items || []));
//       }
//
//       return allStats.map(video => ({
//         title: video.snippet.title,
//         views: parseInt(video.statistics.viewCount),
//         publishedAt: new Date(video.snippet.publishedAt),
//       }));
//     } catch (error) {
//       console.error('Error fetching videos:', error);
//       return [];
//     }
//   };
//
//   const checkRecentEntry = async (channelId) => {
//     try {
//       const response = await fetch(`http://localhost:3000/api/history?channelId=${channelId}`);
//       const data = await response.json();
//       if (data && data.length > 0) {
//         const latestEntry = data[0];
//         const entryTime = new Date(latestEntry.time);
//         const now = new Date();
//         const timeDiff = (now - entryTime) / 1000;
//         return timeDiff < 30;
//       }
//       return false;
//     } catch (error) {
//       console.error('Error checking recent entry:', error);
//       return false;
//     }
//   };
//
//   const storeInDB = async () => {
//     const now = new Date();
//     const time = now.toISOString();
//     setTimeEntryInDB(time);
//     const data = {
//       channelId,
//       sessionId,
//       channelName: username,
//       time,
//     };
//     const res = await fetch('http://localhost:3000/api/history', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(data),
//     });
//     return await res.json();
//   };
//
//   const storeChannelStats = async () => {
//     const data = {
//       ...channelStats,
//       time: timeEntryInDB,
//       channelId,
//       sessionId,
//     };
//     const res = await fetch('http://localhost:3000/api/channel', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(data),
//     });
//     return await res.json();
//   };
//
//   const saveAnalysis = async () => {
//     const databaseVideoItems = latestVideos.map(video => ({
//       snippet: { title: video.title, publishedAt: video.publishedAt.toISOString() },
//       statistics: { viewCount: video.views.toString() },
//       channelId,
//       sessionId,
//       channelName: username,
//       time: timeEntryInDB,
//     }));
//     const res = await fetch('http://localhost:3000/api/analysis', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(databaseVideoItems),
//     });
//     return await res.json();
//   };
//
//   useEffect(() => {
//     const fetchAndStoreData = async () => {
//       if (!channelId || isStoring) return;
//       setIsStoring(true);
//
//       const hasRecentEntry = await checkRecentEntry(channelId);
//       if (hasRecentEntry) {
//         console.log('Data already stored recently, skipping.');
//         setLoading(false);
//         setIsStoring(false);
//         return;
//       }
//
//       const latest = await fetchLatestVideos(channelId);
//       setLatestVideos(latest);
//
//       const historyResult = await storeInDB();
//       const currentTime = historyResult.time;
//       setTimeEntryInDB(currentTime);
//
//       if (currentTime) {
//         await storeChannelStats();
//         if (latest.length > 0) await saveAnalysis();
//       }
//
//       setLoading(false);
//       setIsStoring(false);
//     };
//
//     fetchAndStoreData();
//   }, [channelId]);
//
//   const comparison = latestVideos.map(video => {
//     const prev = prevVideos.find(v => v.title === video.title);
//     return {
//       title: video.title,
//       prevViews: prev ? prev.views : 0,
//       latestViews: video.views,
//       change: prev ? video.views - prev.views : video.views,
//     };
//   });
//
//   const dashboardStyle = { backgroundColor: '#1a1a1a', padding: '2rem', borderRadius: '20px', margin: '3rem auto', width: '100%', maxWidth: '83%', color: '#e2e2e2', minHeight: '80vh' };
//   const headerStyle = { color: '#fff', fontSize: '2.5rem', fontWeight: 'bold', textAlign: 'center', marginBottom: '2rem' };
//   const tableWrapperStyle = { background: 'rgba(42,42,42,0.9)', padding: '1.5rem', borderRadius: '16px', overflow: 'hidden' };
//   const tableStyle = { width: '100%', borderCollapse: 'collapse' };
//   const thStyle = { borderBottom: '2px solid #555', padding: '0.75rem', textAlign: 'left', color: '#f1f1f1' };
//   const tdStyle = { borderBottom: '1px solid #444', padding: '0.75rem', color: '#e2e2e2' };
//   const loadingStyle = { textAlign: 'center', padding: '2rem', fontSize: '1.1rem', color: '#9b59b6' };
//
//   return (
//     <div style={dashboardStyle}>
//       <h1 style={headerStyle}>{username}'s Channel Changes</h1>
//       {loading ? (
//         <div style={loadingStyle}>Loading latest video stats...</div>
//       ) : (
//         <div style={tableWrapperStyle}>
//           <table style={tableStyle}>
//             <thead>
//             <tr>
//               <th style={thStyle}>Video Title</th>
//               <th style={thStyle}>Previous Views</th>
//               <th style={thStyle}>Latest Views</th>
//               <th style={thStyle}>Change</th>
//             </tr>
//             </thead>
//             <tbody>
//             {comparison.map((video, idx) => (
//               <tr key={video.title} style={{ backgroundColor: idx % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent' }}>
//                 <td style={tdStyle}>{video.title}</td>
//                 <td style={tdStyle}>{video.prevViews.toLocaleString()}</td>
//                 <td style={tdStyle}>{video.latestViews.toLocaleString()}</td>
//                 <td style={{ ...tdStyle, color: video.change >= 0 ? '#4ade80' : '#ef4444', fontWeight: '600' }}>
//                   {video.change >= 0 ? '+' : ''}{video.change.toLocaleString()}
//                 </td>
//               </tr>
//             ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// };
//
// export default ChangesPage;

import React, { useState, useEffect, useContext, useMemo } from 'react';
import { AppContext } from '../context/AppContext.jsx';
import { api_key, base_url } from '../API/youtube.js';

const ChangesPage = () => {
  const { videoArtificialData: prevVideosRaw, channelId, username } = useContext(AppContext);

  const [latestVideos, setLatestVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('prevVideosRaw:', prevVideosRaw);
  }, [prevVideosRaw]);

  const normalizeTitle = (title) => title?.trim().toLowerCase() || '';

  const prevVideosMap = useMemo(() => {
    const map = {};
    if (!prevVideosRaw || !Array.isArray(prevVideosRaw)) {
      console.warn('prevVideosRaw is invalid:', prevVideosRaw);
      return map;
    }
    prevVideosRaw.forEach(video => {
      if (video.snippet?.title && video.statistics?.viewCount) {
        map[normalizeTitle(video.snippet.title)] = {
          title: video.snippet.title,
          views: Number(video.statistics.viewCount) || 0,
        };
      } else {
        console.warn('Invalid video data:', video);
      }
    });
    console.log('prevVideosMap:', map);
    return map;
  }, [prevVideosRaw]);

  const fetchLatestVideos = async (channelId) => {
    try {
      let allVideos = [];
      let videoIds = [];
      let nextPageToken = null;

      while (true) {
        let url = `${base_url}/search?key=${api_key}&channelId=${channelId}&part=snippet,id&type=video&maxResults=50`;
        if (nextPageToken) url += `&pageToken=${nextPageToken}`;
        const res = await fetch(url);
        const data = await res.json();

        const ids = (data.items || [])
          .filter(item => item.id.kind === 'youtube#video')
          .map(item => item.id.videoId);
        videoIds.push(...ids);

        nextPageToken = data.nextPageToken || null;
        if (!nextPageToken) break;
      }

      for (let i = 0; i < videoIds.length; i += 50) {
        const chunk = videoIds.slice(i, i + 50).join(',');
        const statsRes = await fetch(`${base_url}/videos?part=snippet,statistics&id=${chunk}&key=${api_key}`);
        const statsData = await statsRes.json();
        allVideos.push(...(statsData.items || []));
      }

      const videos = allVideos.map(video => ({
        title: video.snippet.title,
        views: parseInt(video.statistics.viewCount) || 0,
      }));
      console.log('latestVideos:', videos.map(v => ({ title: v.title })));
      return videos;
    } catch (error) {
      console.error('Error fetching latest videos:', error);
      return [];
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!channelId) {
        console.warn('No channelId provided');
        setLoading(false);
        return;
      }
      setLoading(true);
      const latest = await fetchLatestVideos(channelId);
      setLatestVideos(latest);
      setLoading(false);
    };

    fetchData();
  }, [channelId]);

  const comparison = latestVideos.map(video => {
    const prev = prevVideosMap[normalizeTitle(video.title)];
    return {
      title: video.title,
      prevViews: prev ? prev.views : 0,
      latestViews: video.views,
      change: prev ? video.views - prev.views : video.views,
    };
  });

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
  };
  const thStyle = { borderBottom: '2px solid #555', padding: '0.75rem', textAlign: 'left', color: '#f1f1f1' };
  const tdStyle = { borderBottom: '1px solid #444', padding: '0.75rem', color: '#e2e2e2' };

  if (!prevVideosRaw || !Array.isArray(prevVideosRaw) || prevVideosRaw.length === 0) {
    return (
      <div style={{ backgroundColor: '#1a1a1a', padding: '2rem', borderRadius: '20px', margin: '3rem auto', width: '100%', maxWidth: '83%', color: '#e2e2e2', minHeight: '80vh' }}>
        <h1 style={{ color: '#fff', fontSize: '2.5rem', fontWeight: 'bold', textAlign: 'center', marginBottom: '2rem' }}>
          {username || 'Channel'}'s Channel Changes
        </h1>
        <div style={{ textAlign: 'center', padding: '2rem', fontSize: '1.1rem', color: '#e74c3c' }}>
          No previous video data available.
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#1a1a1a', padding: '2rem', borderRadius: '20px', margin: '3rem auto', width: '100%', maxWidth: '83%', color: '#e2e2e2', minHeight: '80vh' }}>
      <h1 style={{ color: '#fff', fontSize: '2.5rem', fontWeight: 'bold', textAlign: 'center', marginBottom: '2rem' }}>
        {username || 'Channel'}'s Channel Changes
      </h1>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '2rem', fontSize: '1.1rem', color: '#9b59b6' }}>
          Loading latest video stats...
        </div>
      ) : (
        <div style={{ background: 'rgba(42,42,42,0.9)', padding: '1.5rem', borderRadius: '16px', overflow: 'hidden' }}>
          <table style={tableStyle}>
            <thead>
            <tr>
              <th style={thStyle}>Video Title</th>
              <th style={thStyle}>Previous Views</th>
              <th style={thStyle}>Latest Views</th>
              <th style={thStyle}>Change</th>
            </tr>
            </thead>
            <tbody>
            {comparison.map((video, idx) => (
              <tr key={video.title} style={{ backgroundColor: idx % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent' }}>
                <td style={tdStyle}>{video.title}</td>
                <td style={tdStyle}>{video.prevViews.toLocaleString()}</td>
                <td style={tdStyle}>{video.latestViews.toLocaleString()}</td>
                <td style={{ ...tdStyle, color: video.change >= 0 ? '#4ade80' : '#ef4444', fontWeight: '600' }}>
                  {video.change >= 0 ? '+' : ''}{video.change.toLocaleString()}
                </td>
              </tr>
            ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ChangesPage;