const path = require('path');

/**
 * Server-side configuration for OpenAI name generation.
 * Values are read from process.env at call time so they pick up dotenv after startup.
 */
const DEFAULT_OPENAI_MODEL = 'gpt-4.1-nano';
const ENV_FILE_PATH = path.resolve(__dirname, '..', '.env');

function loadEnv() {
  // Always load the project-root .env (not cwd-dependent).
  return require('dotenv').config({ path: ENV_FILE_PATH });
}

function getOpenAIModel() {
  return process.env.OPENAI_MODEL || DEFAULT_OPENAI_MODEL;
}

function getPort() {
  return Number(process.env.PORT) || 3001;
}

function isOpenAIApiKeyConfigured() {
  return Boolean(process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.trim());
}

module.exports = {
  DEFAULT_OPENAI_MODEL,
  ENV_FILE_PATH,
  loadEnv,
  getOpenAIModel,
  getPort,
  isOpenAIApiKeyConfigured,
};
