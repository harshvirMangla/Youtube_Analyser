import React, { useEffect, useState, useRef } from 'react';

const hypothesisChecker = ({ viewsData, timeFrame }) => {
  const data = viewsData
    .map(item => ({
      views: parseInt(item.statistics.viewCount, 10),
      date: new Date(item.snippet.publishedAt)
    }))
    .sort((a, b) => a.date - b.date);

  const now = new Date();
  let cutoffDate;

  switch (timeFrame) {
    case '1year':
      cutoffDate = new Date(now.setFullYear(now.getFullYear() - 1));
      break;
    case '6months':
      cutoffDate = new Date(now.setMonth(now.getMonth() - 6));
      break;
    case '3months':
      cutoffDate = new Date(now.setMonth(now.getMonth() - 3));
      break;
    case '1month':
      cutoffDate = new Date(now.setMonth(now.getMonth() - 1));
      break;
    default:
      cutoffDate = new Date(0);
  }

  const prevData = data.filter(d => d.date < cutoffDate);
  const newData = data.filter(d => d.date >= cutoffDate);

  const avg = arr => arr.length ? arr.reduce((acc, x) => acc + x.views, 0) / arr.length : 0;

  const prevAvg = avg(prevData);
  const newAvg = avg(newData);

  let result = "";

  if (prevAvg === 0) {
    result = `The youtuber doesn't have any videos uploaded before {cutoffDate}.}`
  } else
    if (newAvg === 0) {
      result = `The youtuber hasn't uploaded any videos after {cutoffDate}.`
  } else result = (newAvg > prevAvg ? "Recent performance is better!" : "Recent performance has declined.");

  return (
    <div style={{ background: '#ecf0f1', padding: '1rem', borderRadius: '15px', marginBottom: '1.5rem', animation: 'slideUp 0.8s ease-out' }}>
      <h3 style={{ marginBottom: '0.5rem', color: '#c8201f' }}>Hypothesis Tester</h3>
      <p>{result}</p>
    </div>
      );
};

export default hypothesisChecker;