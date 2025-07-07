import React, { useState, useEffect, useContext } from 'react';
import './Dashboard.css';
import { getSessionId } from './Dashboard.jsx';
import { AppContext } from '../context/AppContext.jsx';
import { useNavigate } from 'react-router-dom';

const sessionId = getSessionId();
console.log(sessionId);

const History = () => {
  const navigate = useNavigate();

  const {
    setChannelStats,
    navigatingFromHistory,
    setNavigatingFromHistory,
    setVideoArtificialData,
  } = useContext(AppContext);

  const [history, setHistory] = useState([]);

  const handleCardClick = async (item) => {
    // const response = await fetch(`http://localhost:3000/api/analysis/${item.sessionId}/${item.channelId}/${item.time}`);
    const response = await fetch(`http://localhost:3000/api/analysis/${item.sessionId}/${item.channelId}/${encodeURIComponent(item.time)}`);
    const data = await response.json();
    setVideoArtificialData(data);
    console.log(item.sessionId, item.channelId, item.time);
    // console.log(`Video Artificial Data Response: ${data}`);
    // console.log('Video Artificial Data Response:', data);

    const channelResponse = await fetch(`http://localhost:3000/api/channel/${item.sessionId}/${item.channelId}/${encodeURIComponent(item.time)}`);
    const channelData = await channelResponse.json();
    setChannelStats(channelData);
    console.log('Channel Data: ', channelData);
  }

  useEffect(() => {
    const fetchHistory = async () => {
      const response = await fetch(`http://localhost:3000/api/history/${sessionId}`);
      const data = await response.json();
      console.log('Fetched history:', data);
      setHistory(data);
    };

    if (sessionId) {
      fetchHistory();
    }
  }, [sessionId]);

  // useEffect(() => {
  //   setNavigatingFromHistory(false);
  //   setVideoArtificialData(null);
  // })

  useEffect(() => {
    setNavigatingFromHistory(false);
    setVideoArtificialData(null);
  }, []);

  useEffect(() => {
    if (navigatingFromHistory) {
      navigate('/dashboard');
    }
  }, [navigatingFromHistory]);

  return (
    <div>
      <ul style={{ listStyle: 'none', padding: 0 }} >
        {history.map((item) => (
          <li
            className='statcard'
            key={item._id}
            onClick={async () => {
              await handleCardClick(item);
              setNavigatingFromHistory(true);
            }}
          >
            <div>
              <p><strong>Channel Name: </strong>{item.channelName}</p>
              <p><strong>Channel ID: </strong>{item.channelId}</p>
              <p><strong>Time: </strong>{new Date(item.time).toLocaleString()}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
};

const HistoryPage = () => {
  return (
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
  )
};

export default HistoryPage;