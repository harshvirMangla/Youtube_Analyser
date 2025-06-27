import React, { useContext } from 'react';
// import { useLocation } from 'react-router-dom';
import GetLists from './DisplaySection.jsx';
import { AppContext } from '../context/AppContext.jsx';
import './Dashboard.css';

const GetListsPage = () => {
  const {
    videoArtificialData,
  } = useContext(AppContext);
  const videoData  = videoArtificialData;

  return (
    <div>
      <div
        className='dashboard'
      >
        <div style={{textAlign: 'center'}}>
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
            Top Videos
          </h2>
        </div>
        <GetLists videoData={videoData} />
      </div>
    </div>
  );
};

export default GetListsPage;