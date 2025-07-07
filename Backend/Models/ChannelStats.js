import mongoose from 'mongoose';

const channelSchema = new mongoose.Schema({
  sessionId: String,
  channelId: String,
  time: String,
  title: String,
  description: String,
  publishedAt: String,
  subscribers: Number,
  totalViews: Number,
  totalVideos: Number,
});

const Channel = mongoose.model('Channel', channelSchema);

export default Channel;