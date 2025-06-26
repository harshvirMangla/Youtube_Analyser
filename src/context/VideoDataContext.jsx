import React, { createContext, useContext, useState } from "react";

const VideoDataContext = createContext();

export function VideoDataProvider({ children }) {
  const [videoData, setVideoData] = useState([]);
  return (
    <VideoDataContext.Provider value={{ videoData, setVideoData }}>
      {children}
    </VideoDataContext.Provider>
  );
}

export function useVideoData() {
  return useContext(VideoDataContext);
}