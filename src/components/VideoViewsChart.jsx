import React, { useState, useEffect, useContext } from 'react';
import { Line } from 'react-chartjs-2';
import { useNavigate } from 'react-router-dom';
import { getChannelIdByUsername, api_key } from '../API/youtube.js';
import ConsistencyChecker from './ConsistencyStats';
import HypothesisChecker from './HypothesisChecker.jsx';
import GenerateHistogram from './Histogram.jsx';
import ScatterPlot, { precisionFinder, makeTicks } from './ScatterPlot.jsx';
import GetLists from './DisplaySection.jsx';
import Input from './InputSection';
import Dashboard from './Dashboard';
import { useVideoData } from "../context/VideoDataContext.jsx";
import { AppContext } from '../context/AppContext';

import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js';


ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

const API_KEY = api_key;
const BASE_URL = 'https://www.googleapis.com/youtube/v3';

const generateMockVideoData = () => {
  const startDate = new Date(2022, 0, 1);
  const endDate = new Date(2025, 11, 31);

  const randomDate = () => {
    const timestamp = startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime());
    return new Date(timestamp);
  };

  const videoData = Array.from({ length: 100 }, (_, i) => ({
    snippet: {
      title: `Video ${i + 1}`,
      publishedAt: randomDate().toISOString()
    },
    statistics: {
      viewCount: Math.floor(Math.random() * 1000000).toString()
    }
  }));

  return videoData;
};

function generateFakeYouTubeData(count = 100) {
  const fakeData = [];

  const now = new Date();
  for (let i = 0; i < count; i++) {
    const daysAgo = Math.floor(Math.random() * 365);

    const date = new Date(now);
    date.setDate(now.getDate() - daysAgo);

    const randomHour = Math.floor(Math.random() * 24);
    const randomMinute = Math.floor(Math.random() * 60);
    const randomSecond = Math.floor(Math.random() * 60);
    date.setHours(randomHour, randomMinute, randomSecond);

    fakeData.push({
      snippet: {
        title: `Fake Video Title #${i + 1}`,
        publishedAt: date.toISOString(),
      },
      statistics: {
        viewCount: (Math.random() * 1000000).toFixed(0),
      }
    });
  }

  return fakeData.sort((a, b) => new Date(a.snippet.publishedAt) - new Date(b.snippet.publishedAt));
}


// const videoArtificialData = generateMockVideoData();
// const fakeYoutubeData = generateFakeYouTubeData(1000);
// console.log(videoArtificialData);


const VideoViewsChart = () => {

  const {
    username,
    setUsername,
    channelId,
    setChannelId,
    channelStats,
    setChannelStats,
    chartData,
    setChartData,
    chartOptions,
    setChartOptions,
    loadingChart,
    setLoadingChart,
    buttonClicked,
    setButtonClicked,
    viewsChartButton,
    setViewsChartButton,
    initButton,
    setInitButton,
    consistentButton,
    setConsistentButton,
    consistentButtonClicked,
    setConsistentButtonClicked,
    hypothesisButton,
    setHypothesisButton,
    hypothesisButtonClicked,
    setHypothesisButtonClicked,
    firstTimeFrameSelected,
    setFirstTimeFrameSelected,
    showSplash,
    setShowSplash,
    selectedTimeframe,
    setSelectedTimeframe,
    timeframeButtonSelector,
    setTimeFrameButtonSelector,
    animateHypothesis,
    setAnimateHypothesis,
    videoArtificialData,
    setVideoArtificialData,
    inputChanged,
    setInputChanged,
    shouldNavigate,
    setShouldNavigate,
    isNavigating,
    setIsNavigating,
    shouldNavigateToChannelStats,
    setShouldNavigateToChannelStats
  } = useContext(AppContext);

  const navigate = useNavigate();
  const { setVideoData } = useVideoData();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  const fetchChannelId = async (username) => {
    // return await getChannelIdByUsername(username);
    return 15;
  };

  const fetchChannelStats = async (id) => {
    // const res = await fetch(`${BASE_URL}/channels?part=snippet,statistics&id=${id}&key=${API_KEY}`);
    // const data = await res.json();
    // const channel = data.items?.[0];
    return {
      title: 'Harshvir Mangla',
      description: 'Attention is all you need!',
      publishedAt: '10-09-2004',
      subscribers: 82518391,
      totalViews: 91818302634,
      totalVideos: 155
    }
    // return {
    //   title: channel.snippet.title,
    //   description: channel.snippet.description,
    //   publishedAt: channel.snippet.publishedAt,
    //   subscribers: channel.statistics.subscriberCount,
    //   totalViews: channel.statistics.viewCount,
    //   totalVideos: channel.statistics.videoCount
    // }
  }

  const fetchVideoStats = async (channelId) => {
    setLoadingChart(true);
    try {

      // let allStats = [];
      // console.log(`Stats Length: ${allStats.length}`);

      if (!chartData && inputChanged) {
        // setInputChanged(false);
        // let videoIds = [];
        // let nextPageToken = null;
        // let fetchCount = 0;
        //
        // while (fetchCount < 10) {
        //   // console.log('I am running...');
        //
        //   let url = `${BASE_URL}/search?key=${API_KEY}&channelId=${channelId}&part=snippet,id&type=video&maxResults=50`;
        //   if (nextPageToken) {
        //     url += `&pageToken=${nextPageToken}`;
        //   }
        //
        //   const searchRes = await fetch(url);
        //   const searchData = await searchRes.json();
        //
        //   nextPageToken = searchData.nextPageToken || null;
        //   // console.log(searchData);
        //   // console.log(`Next Page Token: ${nextPageToken}`);
        //
        //   const ids = searchData.items
        //     .filter(item => item.id.kind === 'youtube#video')
        //     .map(item => item.id.videoId);
        //
        //   videoIds.push(...ids);
        //
        //   if(!nextPageToken) {break;}
        //   fetchCount++;
        // }
        //
        // const allStats = [];
        // for (let i = 0; i < videoIds.length; i += 50) {
        //   const chunk = videoIds.slice(i, i + 50).join(',');
        //   const statsRes = await fetch(
        //     `${BASE_URL}/videos?part=snippet,statistics&id=${chunk}&key=${API_KEY}`
        //   );
        //   const statsData = await statsRes.json();
        //   allStats.push(...statsData.items);
        // }

        // console.log("I don't have chart Data");
        const allStats = generateFakeYouTubeData(100);

        let sortedData = allStats
          .map(video => ({
            title: video.snippet.title,
            views: parseInt(video.statistics.viewCount),
            dateObj: new Date(video.snippet.publishedAt)
          }))
          .sort((a, b) => a.dateObj - b.dateObj)
          .map(video => ({
            ...video,
            date: video.dateObj.toLocaleDateString()
          }));

        console.log('I have set it.')
        setVideoArtificialData(allStats);
        console.log('I have set it.')

        const movingAverage = (arr, windowSize) => {
          const result = [];
          for (let i = 0; i < arr.length; i++) {
            const start = Math.max(0, i - windowSize + 1);
            const subset = arr.slice(start, i + 1);
            const avg = subset.reduce((acc, curr) => acc + curr, 0) / subset.length;
            result.push(Math.round(avg));
            // console.log(avg);
          }
          return result;
        }

        const views = sortedData.map(video => video.views);
        let cumulative = 0;
        let cumulativeViews = views.map(v => cumulative += v);

        let movingAvgViews = movingAverage(views, 12);
        // console.log(movingAvgViews);

        if (sortedData.length > 40){
          const step = Math.ceil(sortedData.length / 40);
          sortedData = sortedData.filter((_, i) => i % step === 0);
          movingAvgViews = movingAvgViews.filter((_, i) => i % step === 0);
          cumulativeViews = cumulativeViews.filter((_, i) => i % step === 0);
        }

        const acHelper = (views) => {
          const max = Math.max(...views);

          if (max < 1000) return {number: 1, ac: ''}
          else if (max < 1000000) return {number: 1000, ac: 'K'}
          else if (max < 1000000000) return {number: 1000000, ac: 'M'}
          else return {number: 1000000000, ac: 'B'};
        }

        const retCumulative = acHelper(cumulativeViews);
        const retMoving = acHelper(movingAvgViews);

        const ticksMoving = makeTicks(movingAvgViews, 10, true);
        const ticksCumulative = makeTicks(cumulativeViews, 7, true);

        const precisionMoving = precisionFinder(ticksMoving);
        const precisionCumulative = precisionFinder(ticksCumulative);
        // console.log("The following are the ticks:");
        // console.log(ticksMoving, ticksCumulative);
        // console.log(precisionMoving, precisionCumulative);

        setChartData({
          labels: sortedData.map(video => video.date),
          datasets: [
            {
              label: 'Moving Average of Views',
              data: movingAvgViews,
              borderColor: '#cd1f20',
              backgroundColor: 'rgba(205, 31, 32, 0.1)',
              tension: 0.4,
              pointRadius: 1.2,
              borderWidth: 2,
              fill: true,
              yAxisID: 'y1',
            },
            {
              label: 'Cumulative Views',
              data: cumulativeViews,
              borderColor: '#000',
              backgroundColor: '#a5a5a5',
              tension: 0.2,
              pointRadius: 1.2,
              borderWidth: 2,
              yAxisID: 'y',
            },
          ],
        });

        setChartOptions({
          responsive: true,
          plugins: {
            legend: {
              display: true,
              labels: {
                color: '#333',
                font: {
                  size: 14,
                  family: 'Segoe UI',
                  weight: 'bold',
                },
              },
            },
            title: {
              display: true,
              text: 'Channel Growth Over Time',
              color: '#cd1f20',
              font: {
                size: 25,
                family: 'Segoe UI',
                weight: 'bold',
              },
              padding: {
                top: 10,
                bottom: 30,
              },
            },
            tooltip: {
              callbacks: {
                label: function (context) {
                  return `Views: ${context.parsed.y.toLocaleString()}`;
                },
              },
            },
          },
          scales: {
            x: {
              title: {
                display: true,
                text: 'Video Release Date',
                color: '#333',
                font: {
                  size: 15,
                  weight: 'bold',
                },
              },
              ticks: {
                color: '#333',
                size: 10,
                maxTicksLimit: 50,
                autoSkip: true,
                minRotation: 70,
                maxRotation: 90,
              },
              grid: {
                display: false,
              },
            },

            y: {
              position: 'left',
              title: {
                display: true,
                text: 'Cumulative Views',
              },
              min: 0,
              max: Math.max(...ticksCumulative),
              ticks: {
                stepSize: ticksCumulative[1] - ticksCumulative[0],
                callback: (value) => `${(value / retCumulative.number).toFixed(precisionCumulative)}${retCumulative.ac}`,
              },
              grid: {
                color: '#eee',
              },
            },
            y1: {
              position: 'right',
              title: {
                display: true,
                text: 'Moving Average of Views',
                color: '#cd1f20',
              },
              min: 0,
              max: Math.max(...ticksMoving),
              ticks: {
                stepSize: ticksMoving[1] - ticksMoving[0],
                callback: (value) => `${(value / retMoving.number).toFixed(precisionMoving)}${retMoving.ac}`,
                color: '#cd1f20',
              },
              grid: {
                drawOnChartArea: false,
              },
            },
          },
        });
      }
    } catch (err) {
      console.error("Error fetching video chart data:", err);
    }
    setLoadingChart(false);
  };

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

  useEffect(() => {
    if (shouldNavigate && videoArtificialData?.length && !isNavigating) {
      setIsNavigating(true);
      setVideoData(videoArtificialData);
      navigate('/top-videos');
      setShouldNavigate(false);
    }
  }, [videoArtificialData, shouldNavigate, isNavigating]);

  useEffect(() => {
    if (!showSplash) {
      console.log('Trying to Navigate');
      navigate('/input');
    }
  }, [showSplash]);

  useEffect(() => {
    if (shouldNavigateToChannelStats) {
      console.log('Trying to Navigate');
      navigate('/dashboard');
    }
  }, [shouldNavigateToChannelStats]);


  if (showSplash) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '85vh',
        backgroundColor: '#fff',
        animation: 'fadeOut 1s ease 2s forwards'
      }}>
        <img
          src="/yt-logo.png"
          alt="YouTube Logo"
          style={{ width: '500px', animation: 'logoPulse 4s infinite ease-in-out' }}
        />

        <style>{`
          @keyframes logoPulse {
            0% { transform: scale(1); opacity: 1; }
            70% { transform: scale(1.4); opacity: 1; }
            100% { transform: scale(1.8); opacity: 1; }
          }
          @keyframes fadeOut {
            to {
              opacity: 0;
              visibility: hidden;
            }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1630px', margin: '2rem auto', fontFamily: 'Segoe UI, sans-serif', animation: 'fadeIn 1s ease-in' }}>
      <h1 style={{
        fontSize: '1.5rem',
        color: '#bababa',
        margin: '1rem',
        textAlign: 'left',
        alignSelf: 'flex-start'
      }}>
        YouTube Analyser
      </h1>

      <Input handleSubmit={handleSubmit} />

      <Dashboard
        channelStats={channelStats}
        setChannelStats={setChannelStats}
        channelId={channelId}
        setChannelId={setChannelId}
        viewsChartButton={viewsChartButton}
        setViewsChartButton={setViewsChartButton}
        buttonClicked={buttonClicked}
        setButtonClicked={setButtonClicked}
        shouldNavigate={shouldNavigate}
        setShouldNavigate={setShouldNavigate}
        consistentButton={consistentButton}
        setConsistentButton={setConsistentButton}
        consistentButtonClicked={consistentButtonClicked}
        setConsistentButtonClicked={setConsistentButtonClicked}
        hypothesisButton={hypothesisButton}
        setHypothesisButton={setHypothesisButton}
        hypothesisButtonClicked={hypothesisButtonClicked}
        setHypothesisButtonClicked={setHypothesisButtonClicked}
        selectedTimeframe={selectedTimeframe}
        setSelectedTimeframe={setSelectedTimeframe}
        timeframeButtonSelector={timeframeButtonSelector}
        setTimeFrameButtonSelector={setTimeFrameButtonSelector}
      />

      {(loadingChart && buttonClicked) && <p style={{ textAlign: 'center' }}>Loading chart...</p>}

      {chartData && viewsChartButton && !loadingChart && (
        <div style={{
          background: '#fff',
          padding: '1.5rem',
          borderRadius: '12px',
          border: '3px dashed #cd201f',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          animation: 'fadeInChart 1s ease-in',
          display: viewsChartButton ? 'block' : 'none',
        }}
        >
          <Line data={chartData} options={chartOptions} />
        </div>
      )}

      {(chartData && !loadingChart) && (
        <div style={{
          background: '#fff',
          padding: '1.5rem',
          borderRadius: '12px',
          border: '3px dashed #cd201f',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          animation: 'fadeInChart 1s ease-in',
          marginTop: '1.5rem',
          marginBottom: '1.5rem',
          display: viewsChartButton ? 'block' : 'none',
        }}
        >
          <GenerateHistogram data={videoArtificialData} binNumber={7}/>
        </div>
      )}

      {(chartData && !loadingChart) && (
        <div style={{
          background: '#fff',
          padding: '1.5rem',
          borderRadius: '12px',
          border: '3px dashed #cd201f',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          animation: 'fadeInChart 1s ease-in',
          marginTop: '1.5rem',
          marginBottom: '1.5rem',
          display: viewsChartButton ? 'block' : 'none',
        }}
        >
          <ScatterPlot videosData={videoArtificialData} />
        </div>
      )}

      {videoArtificialData && (
        <div style={{ display: consistentButton ? 'block' : 'none' , marginTop: '1.5rem', marginBottom: '1.5rem'}} className="box">
          <ConsistencyChecker videoData={videoArtificialData} />
        </div>
      )}

      <div style={{ display: hypothesisButton ? 'block' : 'none' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            background: '#ececec',
            alignItems: 'center',
            border: '3px dashed #cd201f',
            borderRadius: '12px',
            padding: '1rem',
            marginTop: '1.5rem',
            marginBottom: '1.5rem',
            boxShadow: '0 0 10px rgba(205, 32, 31, 0.1)'
          }}
        >
          <div style={{ flex: 1 }}>
            <h3 style={{ color: '#c8201f', margin: 0 }}>
              Select Timeframe for Growth Analysis
            </h3>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              style={{ backgroundColor: (timeframeButtonSelector === '1month') ? '#fd8d8d' : '#c8201f' }}
              className='action-button innerHypothesis-button'
              onClick={async () => {
                setAnimateHypothesis(false);
                setTimeFrameButtonSelector('1month');
                setTimeout(() => {
                  setSelectedTimeframe("1month");
                  setHypothesisButtonClicked(false);
                  setAnimateHypothesis(true);
                }, firstTimeFrameSelected ? 500 : 0);
                setFirstTimeFrameSelected(true);
              }}
            >1 Month</button>

            <button
              style={{ backgroundColor: (timeframeButtonSelector === '3months') ? '#fd8d8d' : '#c8201f' }}
              className='action-button innerHypothesis-button'
              onClick={async () => {
                setAnimateHypothesis(false);
                setTimeFrameButtonSelector('3months');
                setTimeout(() => {
                  setSelectedTimeframe("3months");
                  setHypothesisButtonClicked(false);
                  setAnimateHypothesis(true);
                }, firstTimeFrameSelected ? 500 : 0);
                setFirstTimeFrameSelected(true);
              }}
            >3 Months</button>

            <button
              style={{ backgroundColor: (timeframeButtonSelector === '6months') ? '#fd8d8d' : '#c8201f' }}
              className='action-button innerHypothesis-button'
              onClick={async () => {
                setAnimateHypothesis(false);
                setTimeFrameButtonSelector('6months');
                setTimeout(() => {
                  setSelectedTimeframe("6months");
                  setHypothesisButtonClicked(false);
                  setAnimateHypothesis(true);
                }, firstTimeFrameSelected ? 500 : 0);
                setFirstTimeFrameSelected(true);
              }}
            >6 Months</button>

            <button
              style={{ backgroundColor: (timeframeButtonSelector === '1year') ? '#fd8d8d' : '#c8201f' }}
              className='action-button innerHypothesis-button'
              onClick={async () => {
                setAnimateHypothesis(false);
                setTimeFrameButtonSelector('1year');
                setTimeout(() => {
                  setSelectedTimeframe("1year");
                  setHypothesisButtonClicked(false);
                  setAnimateHypothesis(true);
                }, firstTimeFrameSelected ? 500 : 0);
                setFirstTimeFrameSelected(true);
              }}
            >1 Year</button>
          </div>
        </div>
      </div>

      {(hypothesisButton && videoArtificialData && selectedTimeframe) && (
        <div style={{ display: hypothesisButton ? 'block' : 'none' }}
        className={`hypothesis-wrapper ${animateHypothesis ? 'animate' : ''}`}>
          <HypothesisChecker
            viewsData={videoArtificialData}
            timeFrame={selectedTimeframe}
          />
        </div>
      )}

      <style>{`
      body {
      background-color: #ffffff;
      margin: 0;
      padding: 0;
      }

      @keyframes fadeIn {
      from { opacity: 0; transform: translateY(-10px); }
      to { opacity: 1; transform: translateY(0); }
      }

      @keyframes slideUp {
      from { opacity: 0; transform: translateY(30px); }
      to { opacity: 1; transform: translateY(0); }
      }

      @keyframes fadeInChart {
      from { opacity: 0; }
      to { opacity: 1; }
      }

      .box {}

      .text {
      color: black;
      }

      .action-button {
      margin-top: 1rem;
      padding: 0.6rem 1.2rem;
      background-color: #cd201f;
      color: white;
      border: none;
      border-radius: 15px;
      cursor: pointer;
      font-weight: 800;
      font-size: 1rem;
      transition: all 0.3s ease;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
      }

      .action-button:hover {
      transform: translateY(-1px);
      box-shadow: 0 0 20px rgba(190, 0, 0, 0.3);
      }

      .innerHypothesis-button {
      margin-top: 1rem;
      margin-bottom: 1rem;
      margin-left: auto;
      margin-right: auto;
      }

      .innerHypothesis-button:hover {
      transform: scale(1.03);
      background-color: #fd8d8d;
      }

      .hypothesis-wrapper {
      opacity: 0;
      transform: translateY(20px);
      transition: opacity 0.5s ease, transform 0.8s ease;
      }

      .hypothesis-wrapper.animate {
      opacity: 1;
      transform: translateY(0);
      transition: opacity 0.5s ease, transform 0.8s ease;
      }

      .clicked-effect {
      animation: pressEffect 0.3s ease-out;
      }

      @keyframes pressEffect {
      0% {
      transform: scale(1);
      box-shadow: 0 0 25px rgba(190, 0, 0, 0.3);
      }
      50% {
      transform: scale(1);
      box-shadow: 0 0 30px rgba(190, 0, 0, 0.4);
      }
      100% {
      transform: scale(1);
      box-shadow: 0 0 25px rgba(190, 0, 0, 0.3);
      }
      }

      `}</style>
    </div>
  );
};

export default VideoViewsChart;