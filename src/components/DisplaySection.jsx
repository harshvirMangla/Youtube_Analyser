import React from 'react';

const GetLists = React.memo(({ videoData }) => {
  if (!videoData || videoData.length === 0) return <p>No video data available.</p>;

  return (
    <div style={{ padding: '1rem' }}>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {[...videoData]
          .sort((a, b) => new Date(b.snippet.publishedAt) - new Date(a.snippet.publishedAt))
          .slice(0, 10)
          .map((video, index) => (
            <li
              key={index}
              style={{
                background: '#f9f9f9',
                marginBottom: '1rem',
                padding: '1rem',
                borderRadius: '8px',
                borderLeft: '5px solid #cd1f20'
              }}
            >
              <h3 style={{ marginBottom: '0.5rem' }}>{video.snippet.title}</h3>
              <p><strong>Views:</strong> {Number(video.statistics.viewCount).toLocaleString()}</p>
              <p><strong>Likes:</strong> {video.statistics.likeCount ? Number(video.statistics.likeCount).toLocaleString() : 'N/A'}</p>
              <p><strong>Comments:</strong> {video.statistics.commentCount ? Number(video.statistics.commentCount).toLocaleString() : 'N/A'}</p>
            </li>
          ))}
      </ul>
    </div>
  );
});

export default GetLists;
