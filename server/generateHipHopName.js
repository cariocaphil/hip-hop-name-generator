const OpenAI = require('openai');
const { getOpenAIModel } = require('./config');
const {
  NAME_GENERATION_INSTRUCTIONS,
  buildNameGenerationInput,
  sanitizeGeneratedName,
} = require('./prompt');

/**
 * Calls OpenAI Responses API and returns a cleaned hip-hop name.
 * @param {{ realName: string, furtherInformation?: string, prefix?: string, client?: import('openai').default }} params
 * @returns {Promise<string>}
 */
async function generateHipHopNameWithOpenAI({
  realName,
  furtherInformation = '',
  prefix = '',
  client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY }),
}) {
  const response = await client.responses.create({
    model: getOpenAIModel(),
    instructions: NAME_GENERATION_INSTRUCTIONS,
    input: buildNameGenerationInput(realName, furtherInformation, prefix),
    max_output_tokens: 40,
  });

  const rawText = typeof response.output_text === 'string' ? response.output_text : '';
  const hipHopName = sanitizeGeneratedName(rawText);

  if (!hipHopName) {
    const emptyError = new Error('Model returned an empty name');
    emptyError.code = 'EMPTY_MODEL_OUTPUT';
    emptyError.requestID = response._request_id;
    throw emptyError;
  }

  return hipHopName;
}

module.exports = {
  generateHipHopNameWithOpenAI,
};
