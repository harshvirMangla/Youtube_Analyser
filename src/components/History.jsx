// import React, { useState, useEffect, useContext } from 'react';
// import './Dashboard.css';
// import { getSessionId } from './Dashboard.jsx';
// import { AppContext } from '../context/AppContext.jsx';
// import { useNavigate } from 'react-router-dom';
//
// const sessionId = getSessionId();
//
// const History = () => {
//   const navigate = useNavigate();
//   const {
//     setUsername,
//     setInputChanged,
//     setChannelStats,
//     setChannelId,
//     setConsistencyStats,
//     setConsistencySummary,
//     navigatingFromHistory,
//     setNavigatingFromHistory,
//     setVideoArtificialData,
//     setConsistencyTime,
//     setPersistentNavigatingFromHistory,
//     setChartData,
//   } = useContext(AppContext);
//
//   const [history, setHistory] = useState([]);
//
//   const resetAllStates = () => {
//     setChannelStats(null);
//     setConsistencyStats(null);
//     setConsistencySummary(null);
//     setVideoArtificialData(null);
//     setConsistencyTime(null);
//     setInputChanged(false);
//     setChartData(null);
//     setChannelId(null);
//     setUsername(null);
//   };
//
//   const fetchHistory = async () => {
//     try {
//       const response = await fetch(`http://localhost:3000/api/history/${sessionId}`);
//       const data = await response.json();
//       setHistory(data);
//     } catch (err) {
//       console.error('Error fetching history:', err);
//     }
//   };
//
//   const handleCardClick = async (item) => {
//     const response = await fetch(`http://localhost:3000/api/analysis/${item.sessionId}/${item.channelId}/${encodeURIComponent(item.time)}`);
//     const data = await response.json();
//     setVideoArtificialData(data);
//
//     const channelResponse = await fetch(`http://localhost:3000/api/channel/${item.sessionId}/${item.channelId}/${encodeURIComponent(item.time)}`);
//     const channelData = await channelResponse.json();
//     setChannelStats(Array.isArray(channelData) && channelData.length > 0 ? channelData[0] : channelData);
//
//     try {
//       const consistencyResponse = await fetch(`http://localhost:3000/api/consistency/${item.sessionId}/${item.channelId}/${encodeURIComponent(item.time)}`);
//       if (consistencyResponse.ok) {
//         const consistencyData = await consistencyResponse.json();
//         if (consistencyData) {
//           setConsistencyTime(consistencyData);
//           setConsistencyStats({
//             longestGap: consistencyData.longestGap,
//             shortestGap: consistencyData.shortestGap,
//             averageGap: consistencyData.averageGap,
//             _25p: consistencyData.percentile25,
//             _50p: consistencyData.percentile50,
//             _75p: consistencyData.percentile75
//           });
//           setConsistencySummary(consistencyData.summary);
//         }
//       }
//     } catch (error) {
//       console.error('Failed to load consistency stats:', error);
//     }
//   };
//
//   const handleDelete = async (item) => {
//     const confirmDelete = window.confirm('Are you sure you want to delete this entry and all associated data?');
//     if (!confirmDelete) return;
//
//     try {
//       await fetch(`http://localhost:3000/api/history/${item.sessionId}/${item.channelId}/${encodeURIComponent(item.time)}`, {
//         method: 'DELETE'
//       });
//
//       fetchHistory();
//     } catch (err) {
//       console.error('Failed to delete history:', err);
//     }
//   };
//
//   useEffect(() => {
//     resetAllStates();
//     fetchHistory();
//     setNavigatingFromHistory(false);
//     setPersistentNavigatingFromHistory(false);
//   }, []);
//
//   useEffect(() => {
//     if (navigatingFromHistory) {
//       setPersistentNavigatingFromHistory(true);
//       navigate('/dashboard');
//       setInputChanged(true);
//       setNavigatingFromHistory(false);
//     }
//   }, [navigatingFromHistory]);
//
//   return (
//     <div>
//       <ul style={{ listStyle: 'none', padding: 0 }} >
//         {history.map((item) => (
//           <li
//             className='statcard'
//             key={item._id}
//             style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
//           >
//             <div onClick={async () => { await handleCardClick(item); setNavigatingFromHistory(true); }} style={{ cursor: 'pointer' }}>
//               <p><strong>Channel Name: </strong>{item.channelName}</p>
//               <p><strong>Channel ID: </strong>{item.channelId}</p>
//               <p><strong>Time: </strong>{new Date(item.time).toLocaleString()}</p>
//             </div>
//             <div style={{ display: 'flex', gap: '0.5rem' }}>
//               <button
//                 className='btn'
//                 onClick={async (e) => {
//                   e.stopPropagation();
//                   setChannelId(item.channelId);
//                   setUsername(item.channelName);
//                   const response = await fetch(`http://localhost:3000/api/analysis/${item.sessionId}/${item.channelId}/${encodeURIComponent(item.time)}`);
//                   const data = await response.json();
//                   setVideoArtificialData(data);
//                   navigate(`/changes/${item._id}`);
//                 }}
//               >
//                 View Changes
//               </button>
//               <button
//                 className='btn btn-delete'
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   handleDelete(item);
//                 }}
//               >
//                 Delete
//               </button>
//             </div>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };
//
// const HistoryPage = () => (
//   <div className='dashboard'>
//     <div style={{ textAlign: 'center' }}>
//       <h2
//         style={{
//           color: '#ffffff',
//           fontSize: '2.5rem',
//           fontWeight: 'bold',
//           background: 'linear-gradient(to right, #4285f4, #9b59b6, #e74c3c)',
//           WebkitBackgroundClip: 'text',
//           WebkitTextFillColor: 'transparent',
//           MozBackgroundClip: 'text',
//           MozTextFillColor: 'transparent',
//           display: 'inline-block',
//           marginBottom: '1rem',
//           textAlign: 'center',
//         }}
//       >
//         Search History
//       </h2>
//     </div>
//     <History />
//   </div>
// );
//
// export default HistoryPage;

import React, { useState, useEffect, useContext } from 'react';
import './Dashboard.css';
import { getSessionId } from './Dashboard.jsx';
import { AppContext } from '../context/AppContext.jsx';
import { useNavigate } from 'react-router-dom';

const sessionId = getSessionId();

const History = () => {
  const navigate = useNavigate();
  const {
    setUsername,
    setInputChanged,
    setChannelStats,
    setChannelId,
    setConsistencyStats,
    setConsistencySummary,
    navigatingFromHistory,
    setNavigatingFromHistory,
    setVideoArtificialData,
    setConsistencyTime,
    setPersistentNavigatingFromHistory,
    setChartData,
  } = useContext(AppContext);

  const [history, setHistory] = useState([]);

  const resetAllStates = () => {
    setChannelStats(null);
    setConsistencyStats(null);
    setConsistencySummary(null);
    setVideoArtificialData(null);
    setConsistencyTime(null);
    setInputChanged(false);
    setChartData(null);
    setChannelId(null);
    setUsername(null);
  };

  const fetchHistory = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/history/${sessionId}`);
      if (!response.ok) throw new Error('Failed to fetch history');
      const data = await response.json();
      console.log('Fetched history:', data);
      setHistory(data);
    } catch (err) {
      console.error('Error fetching history:', err);
    }
  };

  const handleCardClick = async (item) => {
    try {
      const analysisRes = await fetch(`http://localhost:3000/api/analysis/${item.sessionId}/${item.channelId}/${encodeURIComponent(item.time)}`);
      if (!analysisRes.ok) throw new Error('Failed to fetch analysis data');
      const analysisData = await analysisRes.json();
      console.log('API /api/analysis response:', analysisData);
      if (!analysisData || !Array.isArray(analysisData)) {
        console.warn('Invalid analysis data:', analysisData);
        return;
      }
      setVideoArtificialData(analysisData);

      const channelRes = await fetch(`http://localhost:3000/api/channel/${item.sessionId}/${item.channelId}/${encodeURIComponent(item.time)}`);
      if (!channelRes.ok) throw new Error('Failed to fetch channel data');
      const channelData = await channelRes.json();
      setChannelStats(Array.isArray(channelData) && channelData.length > 0 ? channelData[0] : channelData);

      try {
        const consistencyRes = await fetch(`http://localhost:3000/api/consistency/${item.sessionId}/${item.channelId}/${encodeURIComponent(item.time)}`);
        if (consistencyRes.ok) {
          const consistencyData = await consistencyRes.json();
          if (consistencyData) {
            setConsistencyTime(consistencyData);
            setConsistencyStats({
              longestGap: consistencyData.longestGap,
              shortestGap: consistencyData.shortestGap,
              averageGap: consistencyData.averageGap,
              _25p: consistencyData.percentile25,
              _50p: consistencyData.percentile50,
              _75p: consistencyData.percentile75,
            });
            setConsistencySummary(consistencyData.summary);
          }
        }
      } catch (error) {
        console.error('Failed to load consistency stats:', error);
      }

      setNavigatingFromHistory(true);
    } catch (error) {
      console.error('Error in handleCardClick:', error);
    }
  };

  const handleViewChanges = async (e, item) => {
    e.stopPropagation();
    try {
      setChannelId(item.channelId);
      setUsername(item.channelName);
      const res = await fetch(`http://localhost:3000/api/analysis/${item.sessionId}/${item.channelId}/${encodeURIComponent(item.time)}`);
      if (!res.ok) throw new Error('Failed to fetch analysis data');
      const data = await res.json();
      console.log('API /api/analysis response:', data);
      if (!data || !Array.isArray(data)) {
        console.warn('Invalid analysis data:', data);
        return;
      }
      setVideoArtificialData(data);
      navigate(`/changes/${item._id}`);
    } catch (error) {
      console.error('Error in handleViewChanges:', error);
    }
  };

  const handleDelete = async (item) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this entry and all associated data?');
    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://localhost:3000/api/history/${item.sessionId}/${item.channelId}/${encodeURIComponent(item.time)}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete history');
      console.log('Deleted history:', item);
      await fetchHistory();
    } catch (err) {
      console.error('Failed to delete history:', err);
    }
  };

  useEffect(() => {
    resetAllStates();
    fetchHistory();
    setNavigatingFromHistory(false);
    setPersistentNavigatingFromHistory(false);
  }, []);

  useEffect(() => {
    if (navigatingFromHistory) {
      setPersistentNavigatingFromHistory(true);
      navigate('/dashboard');
      setInputChanged(true);
      setNavigatingFromHistory(false);
    }
  }, [navigatingFromHistory]);

  return (
    <div>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {history.map((item) => (
          <li
            className='statcard'
            key={item._id}
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
          >
            <div
              onClick={async () => { await handleCardClick(item); }}
              style={{ cursor: 'pointer' }}
            >
              <p><strong>Channel Name:</strong> {item.channelName}</p>
              <p><strong>Channel ID:</strong> {item.channelId}</p>
              <p><strong>Time:</strong> {new Date(item.time).toLocaleString()}</p>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                className='btn'
                onClick={(e) => handleViewChanges(e, item)}
              >
                View Changes
              </button>
              <button
                className='btn btn-delete'
                onClick={(e) => { e.stopPropagation(); handleDelete(item); }}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

const HistoryPage = () => (
  <div className='dashboard'>
    <div style={{ textAlign: 'center' }}>
      <h2
        style={{
          color: '#ffffff',
          fontSize: '2.5rem',
          fontWeight: 'bold',
          background: 'linear-gradient(to right, #4285f4, #9b59b6, #e74c3c)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          MozBackgroundClip: 'text',
          MozTextFillColor: 'transparent',
          display: 'inline-block',
          marginBottom: '1rem',
          textAlign: 'center',
        }}
      >
        Search History
      </h2>
    </div>
    <History />
  </div>
);

export default HistoryPage;