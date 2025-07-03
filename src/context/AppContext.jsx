import React, { createContext, useState } from 'react';
import { getChannelIdByUsername, api_key } from '../API/youtube.js';
import { } from '../components/VideoViewsChart.jsx';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {

  const [username, setUsername] = useState('');
  const [channelId, setChannelId] = useState(null);
  const [channelStats, setChannelStats] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [chartOptions, setChartOptions] = useState(null);
  const [loadingChart, setLoadingChart] = useState(false);
  const [buttonClicked, setButtonClicked] = useState(false);
  const [viewsChartButton, setViewsChartButton] = useState(false);
  const [initButton, setInitButton] = useState(false);
  const [consistentButton, setConsistentButton] = useState(false);
  const [consistentButtonClicked, setConsistentButtonClicked] = useState(null);
  const [hypothesisButton, setHypothesisButton] = useState(false);
  const [hypothesisButtonClicked, setHypothesisButtonClicked] = useState(null);
  const [firstTimeFrameSelected, setFirstTimeFrameSelected] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [consistencySummary, setConsistencySummary] = useState(null);
  const [consistencyStats, setConsistencyStats] = useState(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState(null);
  const [timeframeButtonSelector, setTimeFrameButtonSelector] = useState(null);
  const [animateHypothesis, setAnimateHypothesis] = useState(false);
  const [videoArtificialData, setVideoArtificialData] = useState([]);
  const [inputChanged, setInputChanged] = useState(false);
  const [shouldNavigate, setShouldNavigate] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [shouldNavigateToChannelStats, setShouldNavigateToChannelStats] = useState(false);
  const [shouldNavigateToVideoCharts, setShouldNavigateToVideoCharts] = useState(false);
  const [shouldNavigateToListPage, setShouldNavigateToListPage] = useState(false);
  const [shouldNavigateToConsistent, setShouldNavigateToConsistent] = useState(false);
  const [shouldNavigateToHypothesis, setShouldNavigateToHypothesis] = useState(false);
  const [shouldNavigateToHistory, setShouldNavigateToHistory] = useState(false);
  const [prevChannelId, setPrevChannelId] = useState(null);
  const [hasSaved, setHasSaved] = useState(false);
  const [timeEntryInDB, setTimeEntryInDB] = useState(null);
  const [navigatingFromHistory, setNavigatingFromHistory] = useState(false);
  const [prevChannelStats, setPrevChannelStats] = useState(null);
  const [prevTimeEntryInDB, setPrevTimeEntryInDB] = useState(null);

  const handleSubmit = async () => {
    const id = await fetchChannelId(username);
    // console.log(`Channel ID: ${id}`);
    if (id) {
      setChannelId(id);
      const stats = await fetchChannelStats(id);
      setChannelStats(stats);
    } else {
      alert("Channel not found.");
    }
  };

  const fetchChannelId = async (username) => {
    // return await getChannelIdByUsername(username);
    return 15;
  };

  const resetStates = () => {
    setChannelStats(null);
    setVideoArtificialData(null);
    setChartData(null);
    setViewsChartButton(false);
    setChartOptions(null);
    setInputChanged(true);
    setHypothesisButton(false);
    // setSelectedTimeframe(null);
    setTimeFrameButtonSelector(null);
    setConsistentButton(false);
    setConsistencySummary(null);
    // setSavedData(false);
    setHasSaved(false);
  };

  return (
    <AppContext.Provider
      value={{
        username, setUsername,
        channelId, setChannelId,
        channelStats, setChannelStats,
        chartData, setChartData,
        chartOptions, setChartOptions,
        loadingChart, setLoadingChart,
        buttonClicked, setButtonClicked,
        viewsChartButton, setViewsChartButton,
        initButton, setInitButton,
        consistentButton, setConsistentButton,
        consistentButtonClicked, setConsistentButtonClicked,
        hypothesisButton, setHypothesisButton,
        hypothesisButtonClicked, setHypothesisButtonClicked,
        firstTimeFrameSelected, setFirstTimeFrameSelected,
        showSplash, setShowSplash,
        consistencySummary, setConsistencySummary,
        consistencyStats, setConsistencyStats,
        selectedTimeframe, setSelectedTimeframe,
        timeframeButtonSelector, setTimeFrameButtonSelector,
        animateHypothesis, setAnimateHypothesis,
        videoArtificialData, setVideoArtificialData,
        inputChanged, setInputChanged,
        shouldNavigate, setShouldNavigate,
        isNavigating, setIsNavigating,
        shouldNavigateToChannelStats, setShouldNavigateToChannelStats,
        shouldNavigateToVideoCharts, setShouldNavigateToVideoCharts,
        shouldNavigateToListPage, setShouldNavigateToListPage,
        shouldNavigateToConsistent, setShouldNavigateToConsistent,
        shouldNavigateToHypothesis, setShouldNavigateToHypothesis,
        shouldNavigateToHistory, setShouldNavigateToHistory,
        prevChannelId, setPrevChannelId,
        hasSaved, setHasSaved,
        timeEntryInDB, setTimeEntryInDB,
        navigatingFromHistory, setNavigatingFromHistory,
        prevChannelStats, setPrevChannelStats,
        prevTimeEntryInDB, setPrevTimeEntryInDB,
        resetStates
      }}
    >
      {children}
    </AppContext.Provider>
  );
};