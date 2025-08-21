import React, { useEffect, useState, useRef, useContext } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getChannelIdByUsername, api_key } from '../API/youtube.js';
import { AppContext } from '../context/AppContext.jsx';
import './Dashboard.css';
import { getSessionId } from './Dashboard.jsx';

const sessionId = getSessionId();
const API_KEY = api_key;
const BASE_URL = 'https://www.googleapis.com/youtube/v3';
const key = 'AIzaSyBmKerncsz6PJOozcUbd9TlP50WTYrq01c';

const genAI = new GoogleGenerativeAI(key);

function calculatePercentile(arr, percentile) {
  if (arr.length === 0) return 0;
  const sorted = [...arr].sort((a, b) => a - b);
  const index = (percentile / 100) * (sorted.length - 1);
  const lower = Math.floor(index);
  const upper = Math.ceil(index);
  return lower === upper ? sorted[lower] : (sorted[lower] + sorted[upper]) / 2;
}

async function generateSummary(data) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const [longestGap, shortestGap, averageGap, p25, p50, p75] = data;

  const prompt = `
  You are a YouTube analytics assistant.
  
  Given the following statistics about the gaps between video uploads on a channel:
  - Longest gap between uploads: ${longestGap.toFixed(2)} days
  - Shortest gap between uploads: ${shortestGap.toFixed(2)} days
  - Average gap between uploads: ${averageGap.toFixed(2)} days
  - 25th percentile gap: ${p25.toFixed(2)} days
  - 50th percentile gap (median): ${p50.toFixed(2)} days
  - 75th percentile gap: ${p75.toFixed(2)} days
  
  Write a detailed, highly professional and human-like summary analyzing the channel's upload consistency. Mention whether the channel uploads regularly, occasionally, or irregularly, and infer the overall upload discipline.
  Do not use Markdown, asterisks, or any special formatting.
    `;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
}

const ConsistencyChecker = () => {
  const {
    channelId,
    videoArtificialData,
    consistencySummary,
    setConsistencySummary,
    consistencyStats,
    setConsistencyStats,
    timeEntryInDB,
    persistentNavigatingFromHistory,
  } = useContext(AppContext);

  const videoData = videoArtificialData;
  const [loading, setLoading] = useState(true);
  const hasGenerated = useRef(false);

  const saveToDB = async (statsData, summary) => {
    try {
      console.log('Saving summary to DB');
      const data = {
        sessionId,
        channelId,
        time: timeEntryInDB,
        longestGap: statsData.longestGap,
        shortestGap: statsData.shortestGap,
        averageGap: statsData.averageGap,
        percentile25: statsData._25p,
        percentile50: statsData._50p,
        percentile75: statsData._75p,
        summary: summary
      };

      const response = await fetch('http://localhost:3000/api/consistency', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        console.log('Consistency stats saved to database');
      }
    } catch (error) {
      console.error('Failed to save consistency stats:', error);
    }
  };

  useEffect(() => {
    if (consistencySummary && consistencyStats) {
      console.log('Leaving');
      setLoading(false);
    }
    else if (!hasGenerated.current && videoData.length > 1) {
      hasGenerated.current = true;
      // console.log('Happening');
      const dates = videoData
        .map(video => new Date(video.snippet.publishedAt))
        .sort((a, b) => a - b);

      const gaps = [];
      let totalGap = 0;
      for (let i = 1; i < dates.length; i++) {
        const difference = (dates[i] - dates[i - 1]) / (1000 * 3600 * 24);
        gaps.push(difference);
        totalGap += difference;
      }

      const longestGap = Math.max(...gaps);
      const shortestGap = Math.min(...gaps);
      const averageGap = totalGap / gaps.length;

      const percentile = (arr, p) => {
        const sorted = [...arr].sort((a, b) => a - b);
        const index = (p / 100) * (sorted.length - 1);
        const lower = Math.floor(index), upper = Math.ceil(index);
        return lower === upper ? sorted[lower] : (sorted[lower] + sorted[upper]) / 2;
      };

      const _25p = percentile(gaps, 25);
      const _50p = percentile(gaps, 50);
      const _75p = percentile(gaps, 75);

      const statsData = { longestGap, shortestGap, averageGap, _25p, _50p, _75p };
      setConsistencyStats(statsData);

      const promptData = [longestGap, shortestGap, averageGap, _25p, _50p, _75p];

      generateSummary(promptData).then(text => {
        setConsistencySummary(text);
        setLoading(false);

        saveToDB(statsData, text);
      });
    }
  }, [consistencySummary, consistencyStats]);

  return (
    <div className='dashboard'>
      <div style={{ textAlign: 'center' }}>
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
          Consistency Stats
        </h2>
      </div>

      {(!videoArtificialData || videoArtificialData.length <= 1) ? (
        <div className='statcard' style={{ textAlign: 'center', padding: '2rem' }}>
          <p style={{ color: '#bbb', fontSize: '18px', lineHeight: '1.6' }}>
            {persistentNavigatingFromHistory
              ? 'Video data was not fetched in the previous analysis.'
              : 'No video data available or there was an error fetching it.'}
          </p>
        </div>
      ) : (
        <>
          <div className='statcard'>
            {consistencyStats && (
              <>
                <p><strong>Longest Gap:</strong> {consistencyStats.longestGap.toFixed(2)} days</p>
                <p><strong>Shortest Gap:</strong> {consistencyStats.shortestGap.toFixed(2)} days</p>
                <p><strong>Average Gap:</strong> {consistencyStats.averageGap.toFixed(2)} days</p>
                <p><strong>25th Percentile:</strong> {consistencyStats._25p.toFixed(2)} days</p>
                <p><strong>50th Percentile (Median):</strong> {consistencyStats._50p.toFixed(2)} days</p>
                <p><strong>75th Percentile:</strong> {consistencyStats._75p.toFixed(2)} days</p>
              </>
            )}
          </div>

          <div className='statcard'>
            <div style={{ textAlign: 'center' }}>
              <h2
                style={{ marginTop: '2rem', color: '#c8201f' }}
              >
                Consistency Summary
              </h2>
            </div>

            {loading ? (
              <p>Generating summary...</p>
            ) : (
              <p style={{ lineHeight: '1.6', fontSize: '18px' }}>{consistencySummary}</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default ConsistencyChecker;
