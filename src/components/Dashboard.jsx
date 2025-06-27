import { v4 as uuidv4 } from 'uuid';
import React, { useContext, useEffect } from 'react';
import { AppContext } from '../context/AppContext.jsx';
import { useNavigate } from 'react-router-dom';
import { makeTicks, precisionFinder } from './ScatterPlot.jsx';
import './Dashboard.css';
import { api_key, base_url } from '../API/youtube.js';
import videoViewsChart from './VideoViewsChart.jsx';

const sessionId = uuidv4();

const Dashboard = () => {
  const API_KEY = api_key;
  const BASE_URL = base_url;
  const navigate = useNavigate();

  const {
    channelStats,
    channelId,
    chartData,
    videoArtificialData,
    setVideoArtificialData,
    viewsChartButton,
    setViewsChartButton,
    buttonClicked,
    setChartData,
    inputChanged,
    chartOptions,
    setChartOptions,
    setInputChanged,
    setButtonClicked,
    setLoadingChart,
    setShouldNavigate,
    consistentButton,
    setConsistentButton,
    consistentButtonClicked,
    setConsistentButtonClicked,
    hypothesisButton,
    setHypothesisButton,
    hypothesisButtonClicked,
    setHypothesisButtonClicked,
    setSelectedTimeframe,
    setTimeFrameButtonSelector,
    shouldNavigateToVideoCharts,
    setShouldNavigateToVideoCharts,
    shouldNavigateToListPage,
    setShouldNavigateToListPage,
    shouldNavigateToConsistent,
    setShouldNavigateToConsistent,
    shouldNavigateToHypothesis,
    setShouldNavigateToHypothesis,
  } = useContext(AppContext);

  useEffect(() => {
    if (shouldNavigateToVideoCharts) {
      setShouldNavigateToVideoCharts(false);
      navigate('/charts');
    }
  }, [shouldNavigateToVideoCharts]);

  useEffect(() => {
    if (shouldNavigateToListPage) {
      setShouldNavigateToListPage(false);
      navigate('/list');
    }
  }, [shouldNavigateToListPage]);

  useEffect(() => {
    if (shouldNavigateToConsistent) {
      setShouldNavigateToConsistent(false);
      navigate('/consistent');
    }
  }, [shouldNavigateToConsistent]);

  useEffect(() => {
    if (shouldNavigateToHypothesis) {
      setShouldNavigateToHypothesis(false);
      setSelectedTimeframe(null);
      navigate('/hypothesis');
    }
  }, [shouldNavigateToHypothesis]);

  const saveAnalysis = async () => {
    const response = await fetch("http://localhost:3000/api/analysis", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(videoArtificialData)
    });

    const result = await response.json();
    console.log("Saved:", result);
  };

  useEffect(() => {
    if (Array.isArray(videoArtificialData) && videoArtificialData.length > 0) {
      console.log('📤 Saving in Database');
      saveAnalysis();
    }
    else {
      console.log('⚠️ No data to save or data not ready');
    }
  }, [videoArtificialData]);

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
        channelId: channelId,
        sessionId: sessionId,
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

        // allStats = allStats.map(video => ({
        //   ...video,
        //   sessionId: sessionId,
        //   channelId: channelId,
        // }));

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

        // console.log('I have set it.')
        setVideoArtificialData(allStats);
        // saveAnalysis();
        // console.log('I have set it.')

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
              backgroundColor: 'rgba(64,0,0,0.47)',
              tension: 0.4,
              pointRadius: 1.2,
              borderWidth: 2,
              fill: true,
              yAxisID: 'y1',
            },
            {
              label: 'Cumulative Views',
              data: cumulativeViews,
              borderColor: '#a8a8a8',
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
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
                color: '#bdbdbd',
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
              color: '#b8b8b8',
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
                color: '#b6b6b6',
                font: {
                  size: 15,
                  weight: 'bold',
                },
              },
              ticks: {
                color: '#b6b6b6',
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
                color: '#b6b6b6',
              },
              min: 0,
              max: Math.max(...ticksCumulative),
              ticks: {
                color: '#b6b6b6',
                stepSize: ticksCumulative[1] - ticksCumulative[0],
                callback: (value) => `${(value / retCumulative.number).toFixed(precisionCumulative)}${retCumulative.ac}`,
              },
              grid: {
                color: '#ffffff',
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

  const buttonStyle = {
    backgroundColor: '#cd201f',
    color: '#fff',
    padding: '0.8rem 1.2rem',
    borderRadius: '8px',
    fontWeight: 'bold',
    border: 'none',
    cursor: 'pointer',
    fontSize: '0.95rem',
    transition: 'all 0.2s ease',
    // boxShadow: '2px 2px 6px rgba(0,0,0,0.6)',
    boxShadow: '3px 3px 6px rgba(192,34,34,0.2)',
    display: 'flex',
    justifyContent: 'space-between',
  };

  const divStyle = {
    backgroundColor: '#272727',
    color: '#fff',
    padding: '0.8rem 1.2rem',
    borderRadius: '18px',
    fontWeight: 'bold',
    border: 'none',
    cursor: 'pointer',
    fontSize: '0.95rem',
    transition: 'all 0.2s ease',
    margin: '2rem 0rem 2rem 0rem',
    boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
  };

  const statCardStyle = {
    background: 'linear-gradient(135deg, rgba(30,30,30,0.95), rgba(42,42,42,0.9))',
    color: '#f1f1f1',
    padding: '1.25rem 1.75rem',
    borderRadius: '16px',
    fontWeight: 500,
    fontSize: '1rem',
    boxShadow: 'inset 0 0 0.5px rgba(255,255,255,0.1), 0 8px 24px rgba(0,0,0,0.3)',
    marginBottom: '2rem',
    marginTop: '2rem',
    border: '1px solid rgba(255,255,255,0.06)',
    borderLeft: '7px solid #a12929',
    backdropFilter: 'blur(6px)',
    WebkitBackdropFilter: 'blur(6px)',
    transition: 'all 0.3s ease',
    transform: 'translateZ(0)',
  };

  if (channelStats){
    return (
      <div
        style={{
          backgroundColor: '#1a1a1a',
          padding: '2rem',
          border: '1px solid #2c2c2c',
          borderRadius: '20px',
          margin: '3rem auto',
          width: '100%',
          maxWidth: '83%',
          overflow: 'hidden',
          color: '#e2e2e2',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
          animation: 'slideUp 0.8s ease-out',
        }}
      >
        <div style = {{textAlign: 'center'}}>
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
            {channelStats.title}
          </h2>
        </div>

        <div className='statcard'>
          <p><strong>Description:</strong> {channelStats.description}</p>
        </div>

        <div className='statcard'>
          <p><strong>Published:</strong> {new Date(channelStats.publishedAt).toLocaleDateString()}</p>
        </div>

        <div className='statcard'>
          <p><strong>Subscribers:</strong> {parseInt(channelStats.subscribers).toLocaleString()}</p>
        </div>

        <div className='statcard'>
          <p><strong>Total Views:</strong> {parseInt(channelStats.totalViews).toLocaleString()}</p>
        </div>

        <div style={statCardStyle}>
          <p><strong>Total Videos:</strong> {channelStats.totalVideos}</p>
        </div>

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1rem',
            marginTop: '3rem',
            justifyContent: 'space-between',
          }}
        >
          <button
            onClick={async () => {
              setButtonClicked(true);
              setViewsChartButton(!viewsChartButton);
              await fetchVideoStats(channelId);
              setTimeout(() => {
                setButtonClicked(false)
                setShouldNavigateToVideoCharts(true)
              }, 600);
            }}
            className="btn"
            style={buttonStyle}
          >
            📈 Show Video Views Chart
          </button>

          <button
            onClick={async () => {
              await fetchVideoStats(channelId);
              setTimeout(() => {
                setShouldNavigateToListPage(true)
              }, 600);
            }}
            className="btn"
            style={buttonStyle}
          >
            🎬 Show Recent Videos
          </button>

          <button
            onClick={async () => {
              await fetchVideoStats(channelId);
              // setConsistentButtonClicked(true);
              // setConsistentButton(!consistentButton);
              setTimeout(() => setShouldNavigateToConsistent(true), 600);
            }}
            className="btn"
            style={{
              ...buttonStyle,
              // cursor: consistentButtonClicked && consistentButton ? 'progress' : 'pointer',
            }}
          >
            📊 Consistency Checker
          </button>

          <button
            onClick={async () => {
              await fetchVideoStats(channelId);
              setTimeout(() => setShouldNavigateToHypothesis(true), 600);
            }}
            className="btn"
            style={{
              ...buttonStyle,
              // cursor: hypothesisButtonClicked && hypothesisButton ? 'progress' : 'pointer',
            }}
          >
            📈 Growth Analysis
          </button>
        </div>
      </div>
    )
  }
};

export default Dashboard;