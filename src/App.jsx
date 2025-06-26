import { Routes, Route } from 'react-router-dom';
import React from 'react';
import VideoViewsChart from './components/VideoViewsChart';
import GetListsPage from './components/GetListsPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<VideoViewsChart />} />
      <Route path="/top-videos" element={<GetListsPage />} />
    </Routes>
  );
}

export default App;