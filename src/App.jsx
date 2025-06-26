import { Routes, Route } from 'react-router-dom';
import React from 'react';
import Input from './components/InputSection';
import Dashboard from './components/Dashboard';
import VideoCharts from './components/VideoCharts';
import VideoViewsChart from './components/VideoViewsChart.jsx';

function App() {
  return (
    <Routes>
      <Route path="/" element={<VideoViewsChart />} />
      <Route path="/input" element={<Input />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/charts" element={<VideoCharts />} />
    </Routes>
  );
}

export default App;