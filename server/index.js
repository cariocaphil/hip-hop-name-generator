const express = require('express');
const {
  ENV_FILE_PATH,
  getOpenAIModel,
  getPort,
  isOpenAIApiKeyConfigured,
  loadEnv,
} = require('./config');
const { generateHipHopNameWithOpenAI } = require('./generateHipHopName');

const FRIENDLY_UPSTREAM_ERROR = 'Unable to generate a name right now. Please try again.';

const AUTH_ERROR_CODES = new Set([
  'invalid_api_key',
  'invalid_organization',
  'authentication_error',
]);

/**
 * Extract safe, structured fields from an OpenAI / SDK error (never logs secrets).
 */
function getUpstreamErrorDetails(error) {
  const nested = error?.error && typeof error.error === 'object' ? error.error : null;

  return {
    httpStatus: error?.status ?? nested?.status ?? null,
    code: error?.code ?? nested?.code ?? null,
    type: error?.type ?? nested?.type ?? null,
    message: error?.message ?? nested?.message ?? 'Unknown error',
    requestID:
      error?.requestID ||
      error?.request_id ||
      error?._request_id ||
      nested?.requestID ||
      null,
  };
}

/**
 * Map upstream OpenAI failures to an HTTP status for our API.
 * - 429 stays 429
 * - auth/config failures -> 503
 * - everything else upstream -> 503
 */
function mapUpstreamErrorToHttpStatus(error) {
  if (error?.code === 'EMPTY_MODEL_OUTPUT') {
    return 502;
  }

  const { httpStatus, code } = getUpstreamErrorDetails(error);

  if (httpStatus === 429) {
    return 429;
  }

  if (httpStatus === 401 || httpStatus === 403 || AUTH_ERROR_CODES.has(code)) {
    return 503;
  }

  return 503;
}

function createApp({ generateName = generateHipHopNameWithOpenAI } = {}) {
  const app = express();

  app.use(express.json({ limit: '16kb' }));

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true });
  });

  app.post('/api/generate-hip-hop-name', async (req, res) => {
    const realName =
      typeof req.body?.realName === 'string' ? req.body.realName.trim() : '';
    const furtherInformation =
      typeof req.body?.furtherInformation === 'string' ? req.body.furtherInformation : '';
    const prefix = typeof req.body?.prefix === 'string' ? req.body.prefix : '';

    if (!realName) {
      return res.status(400).json({
        error: 'Please enter a real name to generate a hip-hop name.',
      });
    }

    if (!isOpenAIApiKeyConfigured()) {
      console.error('Name generation failed: OPENAI_API_KEY is not configured', {
        httpStatus: null,
        code: 'missing_api_key',
        type: 'configuration_error',
        message: 'OPENAI_API_KEY is missing or empty',
        requestID: null,
      });
      return res.status(503).json({
        error: 'Name generation is temporarily unavailable. Please try again later.',
      });
    }

    try {
      const hipHopName = await generateName({ realName, furtherInformation, prefix });
      return res.json({ hipHopName });
    } catch (error) {
      const details = getUpstreamErrorDetails(error);
      const responseStatus = mapUpstreamErrorToHttpStatus(error);

      console.error('OpenAI name generation failed', details);

      if (error?.code === 'EMPTY_MODEL_OUTPUT') {
        return res.status(502).json({
          error: 'The name generator returned an empty result. Please try again.',
        });
      }

      return res.status(responseStatus).json({
        error: FRIENDLY_UPSTREAM_ERROR,
      });
    }
  });

  return app;
}

function startServer() {
  const dotenvResult = loadEnv();

  if (dotenvResult.error) {
    console.warn('Could not load project-root .env', {
      path: ENV_FILE_PATH,
      message: dotenvResult.error.message,
    });
  } else {
    console.log('Loaded environment from project-root .env', { path: ENV_FILE_PATH });
  }

  // Read config only after dotenv has run.
  const port = getPort();
  const model = getOpenAIModel();
  const apiKeyConfigured = isOpenAIApiKeyConfigured();

  const app = createApp();
  return app.listen(port, () => {
    console.log(`API server listening on http://localhost:${port}`);
    console.log('OpenAI configuration', {
      apiKeyConfigured,
      model,
      // Never log the key or Authorization headers.
    });
  });
}

if (require.main === module) {
  startServer();
}

module.exports = {
  FRIENDLY_UPSTREAM_ERROR,
  createApp,
  getUpstreamErrorDetails,
  mapUpstreamErrorToHttpStatus,
  startServer,
};
