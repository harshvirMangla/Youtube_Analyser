import { Routes, Route } from 'react-router-dom';
import React from 'react';
import Input from './components/InputSection';
import Dashboard from './components/Dashboard';
import VideoCharts from './components/VideoCharts';
import VideoViewsChart from './components/VideoViewsChart';
import GetListsPage from './components/GetListsPage';
import ConsistencyChecker from './components/ConsistencyStats';
import HypothesisDisplay from './components/HypothesisDisplay.jsx';
import HistoryPage from './components/History';

function App() {
  return (
    <Routes>
      <Route path="/" element={<VideoViewsChart />} />
      <Route path="/input" element={<Input />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/charts" element={<VideoCharts />} />
      <Route path="/list" element={<GetListsPage />} />
      <Route path="/consistent" element={<ConsistencyChecker />} />
      <Route path="/hypothesis" element={<HypothesisDisplay />} />
      <Route path="/history" element={<HistoryPage />} />
    </Routes>
  );
}

export default App;