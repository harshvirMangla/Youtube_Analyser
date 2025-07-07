import mongoose from 'mongoose';

const historySchema = new mongoose.Schema({
  channelId: String,
  sessionId: String,
  channelName: String,
  time: String,
});

const History = mongoose.model('History', historySchema);

export default History;