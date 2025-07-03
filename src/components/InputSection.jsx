import React, { useContext, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import { MdSend } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { api_key, base_url, getChannelIdByUsername } from '../API/youtube.js';
import './InputSection.css';
import { getSessionId } from './Dashboard.jsx';

const sessionId = getSessionId();
console.log(sessionId);

const Input = () => {
  const BASE_URL = base_url;
  const API_KEY = api_key;
  const navigate = useNavigate();
  const {
    username,
    setUsername,
    setInitButton,
    channelId,
    shouldNavigateToChannelStats,
    setShouldNavigateToChannelStats,
    setChannelId,
    channelStats,
    setChannelStats,
    resetStates,
    shouldNavigateToHistory,
    setShouldNavigateToHistory,
    prevChannelId,
    setPrevChannelId,
    timeEntryInDB,
    setTimeEntryInDB,
    prevChannelStats,
    setPrevChannelStats,
    prevTimeEntryInDB,
    setPrevTimeEntryInDB,
  } = useContext(AppContext);

  useEffect(() => {
    setShouldNavigateToChannelStats(false);
  }, [shouldNavigateToChannelStats]);

  useEffect(() => {
    if (shouldNavigateToHistory) {
      setShouldNavigateToHistory(false);
      navigate('/history');
    }
  }, [shouldNavigateToHistory]);

  const handleSubmit = async () => {
    const id = await fetchChannelId(username);
    // console.log(`Channel ID: ${id}`);
    if (id) {
      if (id !== channelId) {
        setChannelId(id);
      }
      const stats = await fetchChannelStats(id);
      setChannelStats(stats);
      console.log(stats);
      console.log('Saving Channel Stats in the state');
    } else {
      alert('Channel not found.');
    }
  };

  const fetchChannelId = async (username) => {
    return await getChannelIdByUsername(username);

    // let hash = 0;
    // for (let i = 0; i < username.length; i++) {
    //   hash = username.charCodeAt(i) + ((hash << 5) - hash);
    //   hash = hash & hash;
    // }
    // return (Math.abs(hash) % 10000) + 1;
  };

  const fetchChannelStats = async (id) => {
    const res = await fetch(`${BASE_URL}/channels?part=snippet,statistics&id=${id}&key=${API_KEY}`);
    const data = await res.json();
    const channel = data.items?.[0];
    // return {
    //   title: 'Harshvir Mangla',
    //   description: 'Attention is all you need!',
    //   publishedAt: '10-09-2004',
    //   subscribers: 82518391,
    //   totalViews: 91818302634,
    //   totalVideos: 155,
    // };
    return {
      title: channel.snippet.title,
      description: channel.snippet.description,
      publishedAt: channel.snippet.publishedAt,
      subscribers: channel.statistics.subscriberCount,
      totalViews: channel.statistics.viewCount,
      totalVideos: channel.statistics.videoCount
    }
  };

  const storeInDB = async () => {
    const now = new Date();
    console.log('Storing in DB Working');
    const time = now.toISOString();
    setTimeEntryInDB(time);
    console.log(`timeEntryInDB: ${timeEntryInDB}`);
    const data = {
      channelId: channelId,
      sessionId: sessionId,
      channelName: username,
      time: time,
    };

    const copier = 'http://localhost:3000/api/history';
    const copier2 = 'http://192.168.1.15:3000/api/history';

    const response = await fetch(copier, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    // console.log("Saved:", result);
    // console.log("Data:", data);
  };

  const storeChannelStats = async () => {
    console.log(channelStats);
    console.log(timeEntryInDB);
    const data = {
      ...channelStats,
      time: timeEntryInDB,
      channelId: channelId,
      sessionId: sessionId,
    }

    const copier = 'http://localhost:3000/api/channel';
    const response = await fetch(copier, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    console.log(result);
  };

  useEffect(() => {
    if (shouldNavigateToChannelStats) {
      setShouldNavigateToChannelStats(false);
      navigate('/dashboard');
    }
  }, [shouldNavigateToChannelStats]);

  useEffect(() => {
    const store = async () => {
      await storeInDB();
      // console.log('Storing in DB');
    };

    if (channelId && channelId !== prevChannelId && channelStats && channelStats !== prevChannelStats) {
      console.log('Working!');
      store();
      setPrevChannelId(channelId);
      setPrevChannelStats(channelStats);
    }
  }, [channelId, prevChannelId, channelStats, prevChannelStats]);

  useEffect(() => {
    const storeStats = async () => {
      await storeChannelStats();
    }

    if (timeEntryInDB && timeEntryInDB !== prevTimeEntryInDB) {
      console.log(`Time Entry: ${timeEntryInDB}`);
      storeStats();
      setPrevTimeEntryInDB(timeEntryInDB);
    }
  }, [timeEntryInDB, prevTimeEntryInDB]);

  return (
    <>
      <div
        style={{
          textAlign: 'left',
          display: 'flex',
          marginLeft: '2rem',
          marginTop: '1rem',
        }}
      >
        <h2 style={{ color: '#c6c6c6' }}>Youtube Analyser</h2>
      </div>
      <div
        style={{
          height: '80vh',
          backgroundColor: '#0e0e0e',
          color: '#c8c8c8',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          alignItems: 'center',
          overflow: 'hidden',
          padding: '2rem',
        }}
      >
        <div
          style={{
            flex: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <h1
            style={{
              fontSize: '2.5rem',
              fontWeight: 'bold',
              background:
                'linear-gradient(to right, #4285f4, #9b59b6, #e74c3c)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Hello, Nerd
          </h1>
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#181818',
            gap: '1rem',
            width: '100%',
            padding: '1rem',
            borderRadius: '25px',
            border: '0.3px solid #e2e2e2',
            alignItems: 'left',
            maxWidth: '800px',
          }}
        >
          <div style={{ display: 'flex', width: '100%' }}>
            <input
              type="text"
              placeholder="Enter YouTube username"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                // console.log(`Resetting States`);
                resetStates();
              }}
              style={{
                flex: 1,
                padding: '1.2rem 1rem',
                borderRadius: '20px',
                border: 'none',
                // border: '0.3px solid #e2e2e2',
                outline: 'none',
                fontSize: '1rem',
                backgroundColor: '#181818',
                color: '#bababa',
                width: '300px',
                boxShadow: 'none',
              }}
            />

            <button
              onClick={async () => {
                setInitButton(true);
                await handleSubmit();
                setTimeout(() => {
                  setInitButton(false);
                  // console.log('Tanu Choora')
                  setShouldNavigateToChannelStats(true);
                }, 600);
              }}
              className="btnSend"
            >
              <MdSend size={20} color="#bababa" />
            </button>
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
            }}
            onClick={() => {
              setShouldNavigateToHistory(true);
            }}
          >
            <button className="btnHistory">History</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Input;
