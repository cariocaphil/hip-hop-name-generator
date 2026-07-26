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

test('buildNameGenerationInput includes real name, further information, and prefix', () => {
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
    realName: 'Alex',
    furtherInformation: 'cool',
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
    () => generateHipHopNameWithOpenAI({ realName: 'Alex', client }),
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
      body: JSON.stringify({
        realName: 'Alex',
        furtherInformation: 'jazz',
        prefix: 'Lil',
      }),
    });
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.equal(body.hipHopName, 'Lil Echo');
  } finally {
    server.close();
  }
});

test('POST /api/generate-hip-hop-name accepts the shared Phil contract body', async () => {
  process.env.OPENAI_API_KEY = 'test-key';
  let received;

  const app = createApp({
    generateName: async (params) => {
      received = params;
      return 'MC Rio Phil';
    },
  });

  const server = app.listen(0);
  const { port } = server.address();

  try {
    const response = await fetch(`http://127.0.0.1:${port}/api/generate-hip-hop-name`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        realName: 'Phil',
        furtherInformation: 'wanna live in rio',
        prefix: 'MC',
      }),
    });
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.equal(body.hipHopName, 'MC Rio Phil');
    assert.deepEqual(received, {
      realName: 'Phil',
      furtherInformation: 'wanna live in rio',
      prefix: 'MC',
    });
  } finally {
    server.close();
  }
});

test('POST /api/generate-hip-hop-name returns 400 when realName is missing', async () => {
  process.env.OPENAI_API_KEY = 'test-key';
  const app = createApp({
    generateName: async () => 'should-not-run',
  });

  const server = app.listen(0);
  const { port } = server.address();

  try {
    const response = await fetch(`http://127.0.0.1:${port}/api/generate-hip-hop-name`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        furtherInformation: 'wanna live in rio',
        prefix: 'MC',
      }),
    });
    const body = await response.json();

    assert.equal(response.status, 400);
    assert.match(body.error, /real name/i);
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
      body: JSON.stringify({ realName: 'Alex' }),
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
      body: JSON.stringify({ realName: 'Alex' }),
    });
    const body = await response.json();

    assert.equal(response.status, 502);
    assert.match(body.error, /empty result/i);
  } finally {
    server.close();
  }
});
