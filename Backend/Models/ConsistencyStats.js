import mongoose from 'mongoose';

const consistencySchema = new mongoose.Schema({
  sessionId: String,
  channelId: String,
  time: String,
  longestGap: Number,
  shortestGap: Number,
  averageGap: Number,
  percentile25: Number,
  percentile50: Number,
  percentile75: Number,
  summary: String,
  createdAt: { type: Date, default: Date.now }
});

const ConsistencyStats = mongoose.model('ConsistencyStats', consistencySchema);

export default ConsistencyStats;