import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext.jsx';
import { Line } from 'react-chartjs-2';
import GenerateHistogram from './Histogram.jsx';
import ScatterPlot from './ScatterPlot.jsx';
import './VideoCharts.css'

const VideoCharts = () => {

  const {
    loadingChart,
    viewsChartButton,
    chartData,
    chartOptions,
    buttonClicked,
    videoArtificialData
  } = useContext(AppContext);

  const [chartType, setChartType] = useState(null);
  const [anyButtonClicked, setAnyButtonClicked] = useState(false);

  const statCardStyle = {
    background: 'linear-gradient(135deg, rgba(30,30,30,0.95), rgba(42,42,42,0.9))',
    color: '#f1f1f1',
    padding: '1.25rem',
    borderRadius: '16px',
    fontWeight: 500,
    fontSize: '1rem',
    boxShadow: 'inset 0 0 0.5px rgba(255,255,255,0.1), 0 8px 24px rgba(0,0,0,0.3)',
    margin: '3rem auto',
    border: '1px solid rgba(255,255,255,0.06)',
    backdropFilter: 'blur(6px)',
    WebkitBackdropFilter: 'blur(6px)',
    transition: 'all 0.3s ease',
    transform: 'translateZ(0)',
    width: '83%'
  };

  const chartCardStyle = {
    display: anyButtonClicked ? 'block' : 'none',
  };

  return (
    <div>
      {(loadingChart && buttonClicked) && <p style={{ textAlign: 'center' }}>Loading chart...</p>}

      <div style={statCardStyle}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
          }}>
          <button
            onClick={() => {
              setChartType('Line')
              setAnyButtonClicked(true)
            }}
            className={`chart-toggle-button ${chartType === 'Line' ? 'active' : ''} left`}>
            Line
          </button>

          <button
            onClick={() => {
              setChartType('Histogram')
              setAnyButtonClicked(true)
            }}
            className={`chart-toggle-button ${chartType === 'Histogram' ? 'active' : ''} center`}>
            Histogram
          </button>

          <button
            onClick={() => {
              setChartType('Scatter')
              setAnyButtonClicked(true)
            }}
            className={`chart-toggle-button ${chartType === 'Scatter' ? 'active' : ''} right`}>
            Scatter
          </button>
        </div>

        <div style={chartCardStyle}>
          {chartData && !loadingChart && ( chartType === 'Line' ) && (
            <div style={{
              background: '#393939',
              padding: '1.5rem',
              borderRadius: '12px',
              border: 'none',
              boxShadow: 'inset 0 0 0.5px rgba(255,255,255,0.1), 0 8px 24px rgba(0,0,0,0.3)',
              alignItems: 'center',
              margin: '3rem auto',
              animation: 'fadeInChart 1s ease-in',
              width: '100%',
              maxWidth: '83%',
            }}
            >
              <Line data={chartData} options={chartOptions} />
            </div>
          )}

          {chartData && !loadingChart && ( chartType === 'Histogram' )  && (
            <div style={{
              background: '#393939',
              padding: '1.5rem',
              borderRadius: '12px',
              border: 'none',
              boxShadow: 'inset 0 0 0.5px rgba(255,255,255,0.1), 0 8px 24px rgba(0,0,0,0.3)',
              animation: 'fadeInChart 1s ease-in',
              margin: '3rem auto',
              width: '100%',
              maxWidth: '83%',
            }}
            >
              <GenerateHistogram data={videoArtificialData} binNumber={7}/>
            </div>
          )}

          {chartData && !loadingChart && ( chartType === 'Scatter' ) && (
            <div style={{
              background: '#393939',
              padding: '1.5rem',
              borderRadius: '12px',
              border: 'none',
              boxShadow: 'inset 0 0 0.5px rgba(255,255,255,0.1), 0 8px 24px rgba(0,0,0,0.3)',
              animation: 'fadeInChart 1s ease-in',
              margin: '3rem auto',
              width: '100%',
              maxWidth: '83%',
            }}
            >
              <ScatterPlot videosData={videoArtificialData} />
            </div>
          )
          }
        </div>
      </div>
    </div>
  );
}

export default VideoCharts;