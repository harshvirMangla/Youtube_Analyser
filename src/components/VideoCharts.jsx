import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext.jsx';
import { Line } from 'react-chartjs-2';
import GenerateHistogram from './Histogram.jsx';
import ScatterPlot from './ScatterPlot.jsx';

const VideoCharts = () => {

  const {
    loadingChart,
    viewsChartButton,
    chartData,
    chartOptions,
    buttonClicked,
    videoArtificialData
  } = useContext(AppContext);

  return (
    <div>
      {(loadingChart && buttonClicked) && <p style={{ textAlign: 'center' }}>Loading chart...</p>}

      {chartData && viewsChartButton && !loadingChart && (
        <div style={{
          background: '#fff',
          padding: '1.5rem',
          borderRadius: '12px',
          border: '3px dashed #cd201f',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          alignItems: 'center',
          margin: '2rem auto',
          animation: 'fadeInChart 1s ease-in',
          width: '100%',
          maxWidth: '83%',
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
      )
      }
    </div>
  );
}

export default VideoCharts;