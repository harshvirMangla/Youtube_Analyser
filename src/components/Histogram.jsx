import React from 'react';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

import { Bar } from 'react-chartjs-2';

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

const GenerateHistogram = React.memo(({data, binNumber = 10}) => {
  const views = data.map(v => v.statistics.viewCount);

  const max = Math.max(...views);
  const min = Math.min(...views);
  const rawBinSize = (max - min) / binNumber;

  const getNiceBinSize = (rawSize) => {
    const magnitude = Math.pow(10, Math.floor(Math.log10(rawSize)));

    const normalized = rawSize / magnitude;

    let nice;
    if (normalized <= 1) nice = 1;
    else if (normalized <= 2) nice = 2;
    else if (normalized <= 2.5) nice = 2.5;
    else if (normalized <= 3) nice = 3;
    else if (normalized <= 4) nice = 4;
    else if (normalized <= 5) nice = 5;
    else if (normalized <= 6) nice = 6;
    else if (normalized <= 7) nice = 7;
    else if (normalized <= 8) nice = 8;
    else if (normalized <= 9) nice = 9;
    else nice = 10;

    return nice * magnitude;
  }

  const binSize = getNiceBinSize(rawBinSize);
  const binCount = Math.ceil((max - min) / binSize);
  // console.log(max, min, binCount);

  const bins = new Array(binCount).fill(0);

  views.forEach(view => {
    const binIndex = Math.floor((view - min) / binSize);
    bins[binIndex]++;
  });

  // console.log(bins);

  const labelHelper = (binSize) => {
    if (binSize <= 1000) {
      return {number: 1, ac: ''}
    }
    else if (binSize < 1000000) {
      return {number: 1000, ac: 'K'}
    }
    else if (binSize < 1000000000) {
      return {number: 1000000, ac: 'M'}
    }
    else return {number: 1000000000, ac: 'B'}
  }

  const {number, ac} = labelHelper(binSize);

  const labels = bins.map((_, i) => {
    return `${(i * binSize) / number}${ac} - ${((i + 1) * binSize) / number}${ac}`;
  })

  // console.log(labels);
  // console.log(bins.length, labels.length);

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Number of Videos',
        data: bins,
        backgroundColor: '#b3b3b3',
        borderRadius: 12,
        barPercentage: 0.8,
        categoryPercentage: 0.9,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Histogram of Video Views',
        color: '#a8a8a8',
        font: {
          size: 25,
          family: 'Segoe UI',
          weight: 'bold',
        },
        padding: {
          top: 10,
          bottom: 20,
        },
      },
      tooltip: {
        callbacks: {
          label: (ctx) => `${ctx.parsed.y} videos`,
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
          text: 'View Ranges',
          font: { size: 15, weight: 'bold' },
          color: '#a8a8a8',
        },
        ticks: { color: '#a8a8a8', maxRotation: 50, minRotation: 0 },
        grid: { display: false },
      },
      y: {
        title: {
          display: true,
          text: 'Number of Videos',
          font: { size: 15, weight: 'bold' },
          color: '#a8a8a8',
        },
        ticks: { color: '#a8a8a8' },
        grid: { color: '#fff' },
      },
    },
  };

  return (
    <Bar data={chartData} options={chartOptions} />
  );
});

export default GenerateHistogram;