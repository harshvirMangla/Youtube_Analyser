import React, { useContext, useState } from 'react';
import './Dashboard.css';
import HypothesisChecker from './HypothesisChecker.jsx';
import { AppContext } from '../context/AppContext.jsx';

const HypothesisDisplay = () => {
  const [aButtonClicked, setAButtonClicked] = useState(false);
  const [hypothesisStateClicked, setHypothesisStateClicked] = useState(false);

  const {
    selectedTimeframe,
    setSelectedTimeframe
  } = useContext(AppContext);

  return (
    <div className='dashboard'>
      <div style={{textAlign: 'center'}}>
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
          Hypothesis Testing
        </h2>
      </div>

      <div
        style={{
          width: 'fit-content',
          border: 'none',
          display: 'flex',
          marginBottom: '4rem',
          justifyContent: 'center',
        }}
        className='dashboard'
      >
        <button
          className={`chart-toggle-button ${selectedTimeframe === '1month' ? 'active' : ''} left`}
          onClick={() => {
            setAButtonClicked(true);
            setSelectedTimeframe('1month');
          }}
        >
          1 Month
        </button>

        <button
          className={`chart-toggle-button ${selectedTimeframe === '3months' ? 'active' : ''} center`}
          onClick={() => {
            setAButtonClicked(true);
            setSelectedTimeframe('3months');
          }}
        >
          3 Months
        </button>

        <button
          className={`chart-toggle-button ${selectedTimeframe === '6months' ? 'active' : ''} center`}
          onClick={() => {
            setAButtonClicked(true);
            setSelectedTimeframe('6months');
          }}
        >
          6 Months
        </button>

        <button
          className={`chart-toggle-button ${selectedTimeframe === '1year' ? 'active' : ''} right`}
          onClick={() => {
            setAButtonClicked(true);
            setSelectedTimeframe('1year');
          }}
        >
          1 Year
        </button>
      </div>
      {aButtonClicked && (
        <HypothesisChecker />
      )}
      <></>
    </div>
  )
}

export default HypothesisDisplay;