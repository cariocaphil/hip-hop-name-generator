/**
 * Builds the Responses API prompt so the model returns only a hip-hop name.
 */
function buildNameGenerationInput(name, additionalInfo, prefix) {
  const info = additionalInfo?.trim() ? additionalInfo.trim() : 'none provided';
  const prefixText = prefix?.trim() ? prefix.trim() : 'none';

  return [
    'Create a short, catchy hip-hop stage name.',
    `Real name: ${name}`,
    `Additional information: ${info}`,
    `Preferred prefix (include it when not "none"): ${prefixText}`,
    'Respond with only the stage name. No quotes, markdown, punctuation wrappers, or explanation.',
  ].join('\n');
}

const NAME_GENERATION_INSTRUCTIONS =
  'You invent playful hip-hop stage names. Output only the name itself—no preface, quotes, markdown, or commentary.';

/**
 * Strips common wrappers models still add despite instructions.
 * @param {string} text
 * @returns {string}
 */
function sanitizeGeneratedName(text) {
  const firstLine = text.trim().split(/\r?\n/)[0].trim();
  return firstLine
    .replace(/^["'`“”]+/, '')
    .replace(/["'`“”]+$/, '')
    .replace(/^\*\*?/, '')
    .replace(/\*\*?$/, '')
    .trim();
}

module.exports = {
  NAME_GENERATION_INSTRUCTIONS,
  buildNameGenerationInput,
  sanitizeGeneratedName,
};
