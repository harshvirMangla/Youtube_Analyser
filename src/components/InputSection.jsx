import React from 'react';
import { MdSend } from 'react-icons/md';


const Input = ({ username, setUsername, handleSubmit, initButton, setInitButton, resetStates }) => {
  return (
    <div style={{
      height: '83vh',
      backgroundColor: '#0e0e0e',
      color: '#c8c8c8',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      alignItems: 'center',
      overflow: 'hidden',
      padding: '2rem'
    }}>

      <div
        style={{
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <h1
          style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            background: 'linear-gradient(to right, #4285f4, #9b59b6, #e74c3c)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Hello, Nerd
        </h1>
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          gap: '1rem',
          width: '100%',
          padding: '1.5rem',
          borderRadius: '25px',
          border: '0.3px solid #e2e2e2',
          justifyContent: 'center',
          alignItems: 'center',
          maxWidth: '800px',
        }}
      >
        <input
          type="text"
          placeholder="Enter YouTube username"
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
            resetStates();
          }}
          style={{
            flex: 1,
            padding: '1.2rem 1rem',
            borderRadius: '20px',
            border: 'none',
            // border: '0.3px solid #e2e2e2',
            outline: 'none',
            fontSize: '1rem',
            backgroundColor: '#181818',
            color: '#bababa',
            width: '300px',
            boxShadow: 'none',
          }}
        />

        <button
          onClick={async () => {
            setInitButton(true);
            await handleSubmit();
            setTimeout(() => setInitButton(false), 600);
          }}
          style={{
            backgroundColor: '#181818',
            color: '#fff',
            padding: '1rem 1.5rem',
            border: 'none',
            borderRadius: '20px',
            cursor: 'pointer',
            fontWeight: 'bold',
            transition: 'transform 0.2s ease',
            transform: initButton ? 'scale(0.95)' : 'scale(1)',
          }}
        >
          <MdSend size={20} color="#bababa" />
        </button>
      </div>
    </div>
  );
};

export default Input;
