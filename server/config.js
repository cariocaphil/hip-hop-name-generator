/**
 * Server-side configuration for OpenAI name generation.
 * Keep model selection here (or via OPENAI_MODEL) — never hard-code it at call sites.
 */
const DEFAULT_OPENAI_MODEL = 'gpt-4.1-nano';

const OPENAI_MODEL = process.env.OPENAI_MODEL || DEFAULT_OPENAI_MODEL;

const PORT = Number(process.env.PORT) || 3001;

module.exports = {
  DEFAULT_OPENAI_MODEL,
  OPENAI_MODEL,
  PORT,
};
