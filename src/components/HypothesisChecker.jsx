import React, { useContext, useEffect, useRef, useState } from 'react';
import { jStat } from 'jstat';
import { AppContext } from '../context/AppContext.jsx';
import './Dashboard.css';

export function numberLabel (number) {
  if (number < 1000) return {divide: 1, ac: ''};
  if (number < 1000000) return {divide: 1000, ac: 'K'};
  if (number < 1000000000) return {divide: 1000000, ac: 'M'};
  else return {divide: 1000000000, ac: 'B'};
}

function WelchSatterthwaiteTtest (prevData, prevVar, prevAvg, newData, newVar, newAvg) {
  if (newData.length < 2 || prevData.length < 2) {
    console.warn("Insufficient data for hypothesis test.");
    return null;
  }

  const deltaAvg = newAvg - prevAvg;
  const combinedVar = newVar / newData.length + prevVar / prevData.length;
  const combinedSD = Math.sqrt(combinedVar);
  const dfNumerator = combinedVar ** 2;
  const term1 = ((newVar / newData.length) ** 2) / (newData.length - 1);
  const term2 = ((prevVar / prevData.length) ** 2) / (prevData.length - 1);
  const dfDenominator = term1 + term2;

  const tValue = deltaAvg / combinedSD;
  const df = dfNumerator / dfDenominator;

  const tCritical = jStat.studentt.inv(0.975, df);

  let result = 0;
  if (tValue > tCritical) result = 1;
  else if (tValue < -tCritical) result = -1;

  return { result, stats: { tValue, df, tCritical } };
}

const HypothesisChecker = () => {
  const {
    videoArtificialData,
    selectedTimeframe
  } = useContext(AppContext);

  const viewsData = videoArtificialData;
  const timeFrame = selectedTimeframe;
  const [testStats, setTestStats] = useState(null);
  const [tTestResult, setTTestResult] = useState(null);

  console.log(videoArtificialData);
  console.log(`timeFrame is ${timeFrame}.`);

  const data = viewsData
    .map(item => ({
      views: parseInt(item.statistics.viewCount, 10),
      date: new Date(item.snippet.publishedAt)
    }))
    .sort((a, b) => a.date - b.date);


  const now = new Date();
  let cutoffDate;

  switch (timeFrame) {
    case '1year': {
      const temp = new Date(now);
      cutoffDate = new Date(temp.setFullYear(temp.getFullYear() - 1));
      break;
    }
    case '6months': {
      const temp = new Date(now);
      cutoffDate = new Date(temp.setMonth(temp.getMonth() - 6));
      break;
    }
    case '3months': {
      const temp = new Date(now);
      cutoffDate = new Date(temp.setMonth(temp.getMonth() - 3));
      break;
    }
    case '1month': {
      const temp = new Date(now);
      cutoffDate = new Date(temp.setMonth(temp.getMonth() - 1));
      break;
    }
    default:
      cutoffDate = new Date(0);
  }

  console.log(cutoffDate);

  const prevData = data.filter(d => d.date < cutoffDate);
  const newData = data.filter(d => d.date >= cutoffDate);

  const avg = arr => arr.length ? arr.reduce((acc, x) => acc + x.views, 0) / arr.length : 0;
  const variance = (arr, mean) => arr.reduce((acc, x) => acc + (x.views - mean) ** 2, 0) / (arr.length - 1);

  const prevAvg = avg(prevData);
  const newAvg = avg(newData);
  const prevVar = variance(prevData, prevAvg);
  const newVar = variance(newData, newAvg);

  let result;
  let error = false;


  if (prevData.length < 2) {
    result = `There are not enough videos before ${cutoffDate.toDateString()} for analysis.`;
    error = true;
  } else {
    if (newData.length < 2) {
      result = `There are not enough videos after ${cutoffDate.toDateString()} for analysis.`;
      error = true;
    }
  }

  const hasRun = useRef(false);

  console.log(`Time frame: ${timeFrame}`);
  console.log(`hasRun: ${hasRun.current}`);

  useEffect(() => {
    hasRun.current = false;
  }, [timeFrame]);

  useEffect(() => {
    if (!hasRun.current && !error) {
      console.log('t Test running')
      hasRun.current = true;
      const {result, stats} = WelchSatterthwaiteTtest(prevData, prevVar, prevAvg, newData, newVar, newAvg);
      setTTestResult(result);
      setTestStats(stats);
    }
  }, [viewsData, timeFrame]);

  if (!error && tTestResult === 1) {
    result = "The recent videos are performing significantly better at a 95% confidence level.";
  }
  else if (!error && tTestResult === -1) {
    result = "The recent videos are performing significantly worse at a 95% confidence level.";
  }
  else if (!error && tTestResult === 0) result = "No significant difference in performance has been detected at the 95% confidence level.";

  return (
      <>
        <div className='statcard'>
          {viewsData.length < 1 ? <p><strong>The youtuber hasn't uploaded enough videos.</strong></p> : ''}
          {error ? <p>{result}</p> : ''}

          {!error && (
            <>
              <p><strong>Average views before {cutoffDate.toDateString()}:</strong> {Number(prevAvg / numberLabel(prevAvg).divide).toFixed(2)}{numberLabel(prevAvg).ac}</p>
              <p><strong>Average views after {cutoffDate.toDateString()}:</strong> {Number(newAvg / numberLabel(newAvg).divide).toFixed(2)}{numberLabel(newAvg).ac}</p>
              <p><strong>Standard Deviation in views before {cutoffDate.toDateString()}:</strong> {Number(Math.sqrt(prevVar) / numberLabel(Math.sqrt(prevVar)).divide).toFixed(2)}{numberLabel(Math.sqrt(prevVar)).ac}</p>
              <p><strong>Standard Deviation in views after {cutoffDate.toDateString()}:</strong> {Number(Math.sqrt(newVar) / numberLabel(Math.sqrt(newVar)).divide).toFixed(2)}{numberLabel(Math.sqrt(newVar)).ac}</p>
            </>
          )}
        </div>

        <div
          style={{
            display: (testStats && !error) ? 'block' : 'none',
          }}
          className='statcard'
        >
          {testStats && !error && (
            <>
              <div style={{textAlign: 'center'}}>
                <h2 style={{ marginTop: '1rem', marginBottom: '1.5rem', color: '#c8201f' }}>Welch-Satterthwaite's t-Test</h2>
              </div>
              <p><strong>t Statistic value:</strong> {Number(testStats.tValue).toFixed(3)}</p>
              <p><strong>Degrees of Freedom (df):</strong> {Number(testStats.df).toFixed(3)}</p>
              <p><strong>Critical t value:</strong> {Number(testStats.tCritical).toFixed(3)}</p>
              <p>{result}</p>
            </>
          )}
        </div>
      </>
      );
};

export default HypothesisChecker;