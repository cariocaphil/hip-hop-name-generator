const test = require('node:test');
const assert = require('node:assert/strict');
const {
  buildNameGenerationInput,
  sanitizeGeneratedName,
} = require('./prompt');
const { generateHipHopNameWithOpenAI } = require('./generateHipHopName');
const { createApp } = require('./index');

test('sanitizeGeneratedName strips quotes and takes the first line', () => {
  assert.equal(sanitizeGeneratedName('  "Lil Jazz"  \nmore'), 'Lil Jazz');
  assert.equal(sanitizeGeneratedName('**MC Shadow**'), 'MC Shadow');
});

test('buildNameGenerationInput includes name, info, and prefix', () => {
  const input = buildNameGenerationInput('Alex', 'loves jazz', 'Lil');
  assert.match(input, /Alex/);
  assert.match(input, /loves jazz/);
  assert.match(input, /Lil/);
});

test('generateHipHopNameWithOpenAI returns sanitized model text', async () => {
  const client = {
    responses: {
      create: async () => ({
        output_text: '  "DJ Frost"  ',
        _request_id: 'req_test',
      }),
    },
  };

  const name = await generateHipHopNameWithOpenAI({
    name: 'Alex',
    additionalInfo: 'cool',
    prefix: 'DJ',
    client,
  });

  assert.equal(name, 'DJ Frost');
});

test('generateHipHopNameWithOpenAI rejects empty model output', async () => {
  const client = {
    responses: {
      create: async () => ({
        output_text: '   ',
        _request_id: 'req_empty',
      }),
    },
  };

  await assert.rejects(
    () => generateHipHopNameWithOpenAI({ name: 'Alex', client }),
    (error) => error.code === 'EMPTY_MODEL_OUTPUT'
  );
});

test('POST /api/generate-hip-hop-name returns a name on success', async () => {
  process.env.OPENAI_API_KEY = 'test-key';
  const app = createApp({
    generateName: async () => 'Lil Echo',
  });

  const server = app.listen(0);
  const { port } = server.address();

  try {
    const response = await fetch(`http://127.0.0.1:${port}/api/generate-hip-hop-name`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Alex', additionalInfo: 'jazz', prefix: 'Lil' }),
    });
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.equal(body.hipHopName, 'Lil Echo');
  } finally {
    server.close();
  }
});

test('POST /api/generate-hip-hop-name maps upstream failures to a friendly error', async () => {
  process.env.OPENAI_API_KEY = 'test-key';
  const app = createApp({
    generateName: async () => {
      const error = new Error('upstream down');
      error.status = 500;
      error.code = 'server_error';
      throw error;
    },
  });

  const server = app.listen(0);
  const { port } = server.address();

  try {
    const response = await fetch(`http://127.0.0.1:${port}/api/generate-hip-hop-name`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Alex' }),
    });
    const body = await response.json();

    assert.equal(response.status, 500);
    assert.match(body.error, /unable to generate a name/i);
  } finally {
    server.close();
  }
});

test('POST /api/generate-hip-hop-name handles empty model output', async () => {
  process.env.OPENAI_API_KEY = 'test-key';
  const app = createApp({
    generateName: async () => {
      const error = new Error('Model returned an empty name');
      error.code = 'EMPTY_MODEL_OUTPUT';
      throw error;
    },
  });

  const server = app.listen(0);
  const { port } = server.address();

  try {
    const response = await fetch(`http://127.0.0.1:${port}/api/generate-hip-hop-name`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Alex' }),
    });
    const body = await response.json();

    assert.equal(response.status, 502);
    assert.match(body.error, /empty result/i);
  } finally {
    server.close();
  }
});
