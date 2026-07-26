import generateHipHopName from './HipHopName';

describe('generateHipHopName', () => {
  const originalFetch = global.fetch;
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv, REACT_APP_OPENAI_API_KEY: 'test-key' };
    global.fetch = jest.fn();
  });

  afterEach(() => {
    global.fetch = originalFetch;
    process.env = originalEnv;
    jest.restoreAllMocks();
  });

  test('returns trimmed hip hop name from API response', async () => {
    global.fetch.mockResolvedValue({
      json: async () => ({
        choices: [{ text: '  Lil Jazz Master  ' }],
      }),
    });

    const result = await generateHipHopName('Alex', 'loves jazz', 'Lil');

    expect(result).toBe('Lil Jazz Master');
    expect(global.fetch).toHaveBeenCalledWith(
      'https://api.openai.com/v1/engines/davinci/completions',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          Authorization: 'Bearer test-key',
        }),
      })
    );

    const body = JSON.parse(global.fetch.mock.calls[0][1].body);
    expect(body.prompt).toContain('Alex');
    expect(body.prompt).toContain('loves jazz');
    expect(body.prompt).toContain('Lil');
  });

  test('returns null when choices are missing', async () => {
    global.fetch.mockResolvedValue({
      json: async () => ({}),
    });

    await expect(generateHipHopName('Alex', '', 'MC')).resolves.toBeNull();
  });

  test('returns null when choices text is empty', async () => {
    global.fetch.mockResolvedValue({
      json: async () => ({
        choices: [{ text: '' }],
      }),
    });

    await expect(generateHipHopName('Alex', '', 'MC')).resolves.toBeNull();
  });

  test('returns null and logs error when fetch fails', async () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    global.fetch.mockRejectedValue(new Error('network down'));

    await expect(generateHipHopName('Alex', '', 'DJ')).resolves.toBeNull();
    expect(consoleError).toHaveBeenCalled();
  });
});
