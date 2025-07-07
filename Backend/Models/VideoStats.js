import mongoose from 'mongoose';

const videoSchema = new mongoose.Schema({
  channelId: String,
  channelName: String,
  sessionId: String,
  time: String,
  snippet: {
    title: String,
    publishedAt: String,
  },
  statistics: {
    viewCount: Number,
  },
});

const Video = mongoose.model('Video', videoSchema);

export default Video;