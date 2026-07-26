const express = require('express');
const { PORT } = require('./config');
const { generateHipHopNameWithOpenAI } = require('./generateHipHopName');

function createApp({ generateName = generateHipHopNameWithOpenAI } = {}) {
  const app = express();

  app.use(express.json({ limit: '16kb' }));

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true });
  });

  app.post('/api/generate-hip-hop-name', async (req, res) => {
    const name = typeof req.body?.name === 'string' ? req.body.name.trim() : '';
    const additionalInfo =
      typeof req.body?.additionalInfo === 'string' ? req.body.additionalInfo : '';
    const prefix = typeof req.body?.prefix === 'string' ? req.body.prefix : '';

    if (!name) {
      return res.status(400).json({
        error: 'Please enter a real name to generate a hip-hop name.',
      });
    }

    if (!process.env.OPENAI_API_KEY) {
      console.error('Name generation failed: OPENAI_API_KEY is not configured');
      return res.status(503).json({
        error: 'Name generation is temporarily unavailable. Please try again later.',
      });
    }

    try {
      const hipHopName = await generateName({ name, additionalInfo, prefix });
      return res.json({ hipHopName });
    } catch (error) {
      const status = error?.status && Number.isInteger(error.status) ? error.status : 502;
      console.error('OpenAI name generation failed', {
        message: error?.message,
        code: error?.code,
        status: error?.status,
        requestID: error?.requestID || error?._request_id,
      });

      if (error?.code === 'EMPTY_MODEL_OUTPUT') {
        return res.status(502).json({
          error: 'The name generator returned an empty result. Please try again.',
        });
      }

      return res.status(status >= 400 && status < 600 ? status : 502).json({
        error: 'Unable to generate a name right now. Please try again.',
      });
    }
  });

  return app;
}

function startServer() {
  // Load env vars for local development; production should inject them.
  require('dotenv').config();

  const app = createApp();
  return app.listen(PORT, () => {
    console.log(`API server listening on http://localhost:${PORT}`);
  });
}

if (require.main === module) {
  startServer();
}

module.exports = {
  createApp,
  startServer,
};
