import React, { useEffect, useState, useRef } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getChannelIdByUsername, api_key } from '../API/youtube.js';

const API_KEY = api_key;
const BASE_URL = 'https://www.googleapis.com/youtube/v3';

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
  
  Write a concise, professional and human-like summary (3–4 sentences) analyzing the channel's upload consistency. Mention whether the channel uploads regularly, occasionally, or irregularly, and infer the overall upload discipline.
    `;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
}

const ConsistencyChecker = ({ videoData }) => {
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(true);
  const hasGenerated = useRef(false);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (!hasGenerated.current && videoData.length > 1) {
      hasGenerated.current = true;
      console.log('Happening');
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

      setStats({ longestGap, shortestGap, averageGap, _25p, _50p, _75p });

      const promptData = [longestGap, shortestGap, averageGap, _25p, _50p, _75p];

      generateSummary(promptData).then(text => {
        setSummary(text);
        setLoading(false);
      });
    }
  }, [hasGenerated, videoData]);

  return (
    <div style={{ background: '#ecf0f1', padding: '1rem', borderRadius: '15px', marginBottom: '1.5rem', animation: 'slideUp 0.8s ease-out' }}>
      <h3 style={{ marginBottom: '0.5rem', color: '#c8201f' }}>Consistency Stats</h3>

      {stats && (
        <>
          <p><strong>Longest Gap:</strong> {stats.longestGap.toFixed(2)} days</p>
          <p><strong>Shortest Gap:</strong> {stats.shortestGap.toFixed(2)} days</p>
          <p><strong>Average Gap:</strong> {stats.averageGap.toFixed(2)} days</p>
          <p><strong>25th Percentile:</strong> {stats._25p.toFixed(2)} days</p>
          <p><strong>50th Percentile (Median):</strong> {stats._50p.toFixed(2)} days</p>
          <p><strong>75th Percentile:</strong> {stats._75p.toFixed(2)} days</p>
        </>
      )}

      <h3 style={{ marginTop: '2rem', color: '#c8201f' }}>
        Consistency Summary</h3>
      {loading ? <p>Generating summary...</p> : <p>{summary}</p>}
    </div>
  );
};

export default ConsistencyChecker;
