const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// AI Inference Stub Endpoint
app.post('/api/process', (req, res) => {
  const { imagePath } = req.body;

  // Simulate AI processing delay
  setTimeout(() => {
    const stubResponse = {
      disease: {
        tb: 'Detected: No (confidence 0.12)',
        pneumonia: 'Detected: Yes (confidence 0.87)',
        fracture: 'Detected: No (confidence 0.03)',
        covid: 'Detected: No (confidence 0.05)',
      },
      explainability: 'Opacity detected in lower left lung zone. Characteristic infiltrates visible in pneumonic pattern.',
      overlayImageUrl: '/placeholders/heatmap.png',
      confidenceScore: 0.87,
      processingTime: '2.34s',
    };

    res.json(stubResponse);
  }, 1500);
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'AI service running' });
});

const PORT = process.env.AI_PORT || 3001;
app.listen(PORT, () => {
  console.log(`AI Stub service running on port ${PORT}`);
});

module.exports = app;
