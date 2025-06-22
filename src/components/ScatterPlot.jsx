import React, { useMemo } from 'react';
import { Scatter } from 'react-chartjs-2';
import { numberLabel } from './HypothesisChecker.jsx';
import {
  Chart as ChartJS,
  PointElement,
  LinearScale,
  Tooltip,
  Title,
} from 'chart.js';

ChartJS.register(PointElement, LinearScale, Tooltip, Title);

export function precisionFinder (views) {
  let allDifferent = false;
  const { divide, ac } = label(views);
  let precision = 0;
   while (!allDifferent) {
     // console.log(precision);
     const viewsPrecision = views.map(v => Number(v / divide).toFixed(precision));

     allDifferent = true;
     for (let i = 1; i < viewsPrecision.length; i++) {
       if (viewsPrecision[i] === viewsPrecision[i - 1]) {
         allDifferent = false;
         precision++;
         break;
       }
     }
   }
   return precision;
}

export function makeTicks (viewData, numTicks = 10, differentFormat = false) {
  let views;

  if (differentFormat) views = viewData;
  else views = viewData.map(v => v.y);

  const min = 0
  const max = Math.max(...views);

  const { divide, ac } = label(views);

  const step = Math.ceil((max - min) / (numTicks - 1) / divide) * divide;
  const start = Math.floor(min / step) * step;
  const end = Math.ceil(max / step) * step;

  const ticks = [];
  for (let val = start; val <= end; val += step) {
    ticks.push(val);
  }
  return ticks;
}

function label (viewData) {
  const average = viewData.reduce((acc, x) => acc + x, 0) / viewData.length;
  // console.log(`Average Views are: ${average}`);
  return numberLabel(average);
}

function xiCorr(X, Y, ties = true) {
  const n = X.length;

  const order = X
    .map((val, i) => [i, val])
    .sort((a, b) => a[1] - b[1])
    .map(pair => pair[0]);

  const l = order.map(i =>
    Y.filter(y => y >= Y[i]).length
  );

  let r = [...l];

  if (ties) {
    for (let j = 0; j < n; j++) {
      const tieValue = r[j];
      const tieIndices = r.reduce((acc, val, idx) => {
        if (val === tieValue) acc.push(idx);
        return acc;
      }, []);

      if (tieIndices.length > 1) {
        const shuffled = shuffleArray(
          Array.from({ length: tieIndices.length }, (_, i) => tieValue - i)
        );
        for (let k = 0; k < tieIndices.length; k++) {
          r[tieIndices[k]] = shuffled[k];
        }
      }
    }

    const numerator = n * sumAbsDiffs(r);
    const denominator = 2 * l.reduce((sum, val) => sum + val * (n - val), 0);
    return 1 - numerator / denominator;
  } else {
    r = order.map(i => Y.filter(y => y >= Y[i]).length);
    const numerator = 3 * sumAbsDiffs(r);
    const denominator = n ** 2 - 1;
    return 1 - numerator / denominator;
  }
}

function sumAbsDiffs(arr) {
  let total = 0;
  for (let i = 1; i < arr.length; i++) {
    total += Math.abs(arr[i] - arr[i - 1]);
  }
  return total;
}

function shuffleArray(arr) {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

const ScatterPlot = ({ videosData }) => {
  const { chartData, chartOptions, precision } = useMemo(() => {
    let videoData = videosData
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

    const scatterPoints = [];
    for (let i = 1; i < videoData.length; i++) {
      const gapInDays = (videoData[i].dateObj - videoData[i - 1].dateObj) / (1000 * 60 * 60 * 24);
      scatterPoints.push({
        x: gapInDays,
        y: videoData[i].views,
      });
    }

    // console.log(scatterPoints);
    const X = scatterPoints.map(p => p.x);
    const Y = scatterPoints.map(p => p.y);
    const xiCorrCoeff = xiCorr(X, Y, true);
    console.log(`This is the Xi-Correlation Coefficient: ${xiCorrCoeff}.`);

    const { divide, ac } = label(scatterPoints.map(p => p.y));
    const ticks = makeTicks(scatterPoints, 10);
    const precision = precisionFinder(ticks);


    const chartData = {
      datasets: [
        {
          label: 'Views vs Upload Gap',
          data: scatterPoints,
          backgroundColor: '#cd1f20',
          pointRadius: 4,
        },
      ],
    };

    const chartOptions = {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: 'Views vs Upload Gap (in Days)',
          font: {
            size: 25,
            family: 'Segoe UI',
            weight: 'bold',
          },
          color: '#cd1f20',
          padding: { top: 10, bottom: 30 },
        },
        tooltip: {
          callbacks: {
            label: (ctx) =>
              `Gap: ${ctx.parsed.x.toFixed(1)} days, Views: ${ctx.parsed.y.toLocaleString()}`,
          },
        },
        legend: {
          display: false,
        },
      },
      scales: {
        x: {
          title: {
            display: true,
            text: 'Upload Gap (days)',
            font: { size: 15, weight: 'bold' },
            color: '#333',
          },
          ticks: { color: '#333' },
          grid: { color: '#eee' },
        },
        y: {
          title: {
            display: true,
            text: 'Views',
            font: { size: 15, weight: 'bold' },
            color: '#333',
          },
          min: 0,
          max: Math.max(...ticks),
          ticks: {
            stepSize: ticks[1] - ticks[0],
            color: '#333',
            callback: (v) => `${(v / divide).toFixed(precision)}${ac}`,
          },
          grid: { color: '#eee' },
        },
      },
    };

    return { chartData, chartOptions, precision };
  }, [videosData]);

  return <Scatter data={chartData} options={chartOptions} />;
};

export default ScatterPlot;