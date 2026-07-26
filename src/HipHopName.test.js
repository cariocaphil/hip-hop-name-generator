import generateHipHopName from './HipHopName';

describe('generateHipHopName', () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    global.fetch = originalFetch;
    jest.restoreAllMocks();
  });

  test('returns a successful hip hop name from the local API', async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ hipHopName: '  Lil Jazz Master  ' }),
    });

    const result = await generateHipHopName('Alex', 'loves jazz', 'Lil');

    expect(result).toEqual({ ok: true, hipHopName: 'Lil Jazz Master' });
    expect(global.fetch).toHaveBeenCalledWith(
      '/api/generate-hip-hop-name',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
        }),
      })
    );

    const body = JSON.parse(global.fetch.mock.calls[0][1].body);
    expect(body).toEqual({
      realName: 'Alex',
      furtherInformation: 'loves jazz',
      prefix: 'Lil',
    });
  });

  test('returns a friendly error when the API responds with failure', async () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    global.fetch.mockResolvedValue({
      ok: false,
      status: 502,
      json: async () => ({
        error: 'Unable to generate a name right now. Please try again.',
      }),
    });

    await expect(generateHipHopName('Alex', '', 'MC')).resolves.toEqual({
      ok: false,
      error: 'Unable to generate a name right now. Please try again.',
    });
    expect(consoleError).toHaveBeenCalled();
  });

  test('returns a friendly error when the API returns an empty name', async () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    global.fetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ hipHopName: '   ' }),
    });

    await expect(generateHipHopName('Alex', '', 'MC')).resolves.toEqual({
      ok: false,
      error: 'The name generator returned an empty result. Please try again.',
    });
    expect(consoleError).toHaveBeenCalled();
  });

  test('returns a friendly error when fetch fails', async () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    global.fetch.mockRejectedValue(new Error('network down'));

    await expect(generateHipHopName('Alex', '', 'DJ')).resolves.toEqual({
      ok: false,
      error: 'Unable to reach the name generator. Is the API server running?',
    });
    expect(consoleError).toHaveBeenCalled();
  });
});
