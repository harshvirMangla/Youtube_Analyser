import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import Video from './Models/VideoStats.js';
import History from './Models/MainHistory.js';
import Channel  from './Models/ChannelStats.js';
const app = express();
const mongoURI = 'mongodb://localhost:27018/yt_analyzer'

const PORT = process.env.PORT || 3000;
app.use(cors());
app.use(express.json({ limit: '100mb' }));

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}.`);
});

app.post('/api/analysis', async (req, res) => {
  try {
    const data = req.body;

    if (!Array.isArray(data)) {
      return res.status(400).json({ error: "Expected an array of videos" });
    }

    const inserted = await Video.insertMany(data);
    // console.log("Video added successfully.", data);
    res.status(201).json(inserted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/analysis', async (req, res) => {
  try {
    const videos = await Video.find().sort({ 'snippet.publishedAt': 1 });
    res.json(videos);
  } catch (err) {
    console.error("❌ Error fetching videos:", err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/history', async (req, res) => {
  try {
    const { channelId, time, sessionId, channelName } = req.body;

    if (!channelId || !time) {
      return res.status(400).json({ error: 'channelId and time are required.' });
    }

    const entry = new History({ sessionId, channelId, channelName, time });
    const saved = await entry.save();

    res.status(201).json(saved);
  } catch (err) {
    console.error('❌ Failed to save history:', err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/history', async (req, res) => {
  try {
    const allHistory = await History.find().sort({ time: -1 });
    res.status(200).json(allHistory);
  } catch (err) {
    console.error("❌ Error fetching history:", err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/history/:sessionId', async (req, res) => {
  const { sessionId } = req.params;
  try {
    const history = await History.find({ sessionId }).sort({ time: -1 });
    res.json(history);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/analysis/:sessionId/:channelId/:time', async (req, res) => {
  const { sessionId, channelId, time } = req.params;
  try {
    const videos = await Video.find({ sessionId, channelId, time });
    res.json(videos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/channel', async (req, res) => {
  try {
    const data = req.body;
    const inserted = await Channel.insertOne(data);
    res.status(201).json(inserted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/channel/:sessionId/:channelId/:time', async (req, res) => {
  const { sessionId, channelId, time } = req.params;
  try {
    const channels = await Channel.find({ sessionId, channelId, time });
    res.json(channels);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});