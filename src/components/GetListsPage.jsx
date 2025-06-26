import React from 'react';
// import { useLocation } from 'react-router-dom';
import GetLists from './DisplaySection.jsx';
import { useVideoData } from "../context/VideoDataContext.jsx";

const GetListsPage = () => {
  // const location = useLocation();
  // const videoData = location.state?.videoData || [];
  const { videoData } = useVideoData();

  return (
    <div>
      <div style={{ maxWidth: '1630px', margin: '2rem auto', background: '#ececec', padding: '1rem', border: '3px dashed #cd201f', borderRadius: '15px', marginBottom: '1.5rem', animation: 'slideUp 0.8s ease-out' }}>
        <h1 style={{ textAlign: 'center', color: '#c8201f', margin: '1rem 0' }}>
          Top Videos
        </h1>
        <GetLists videoData={videoData} />
      </div>
    </div>
  );
};

export default GetListsPage;