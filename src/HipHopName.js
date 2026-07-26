/**
 * Browser client for hip-hop name generation.
 * Calls the local API — never the OpenAI API or a client-side API key.
 *
 * @returns {Promise<{ ok: true, hipHopName: string } | { ok: false, error: string }>}
 */
const generateHipHopName = async (name, additionalInfo, prefix) => {
  try {
    const response = await fetch('/api/generate-hip-hop-name', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, additionalInfo, prefix }),
    });

    let data = null;
    try {
      data = await response.json();
    } catch (parseError) {
      console.error('Name generation response was not JSON', {
        status: response.status,
        message: parseError?.message,
      });
    }

    if (!response.ok) {
      const error =
        data?.error || 'Unable to generate a name right now. Please try again.';
      console.error('Name generation request failed', {
        status: response.status,
        error,
      });
      return { ok: false, error };
    }

    const hipHopName = typeof data?.hipHopName === 'string' ? data.hipHopName.trim() : '';
    if (!hipHopName) {
      console.error('Name generation returned an empty hipHopName field', {
        status: response.status,
      });
      return {
        ok: false,
        error: 'The name generator returned an empty result. Please try again.',
      };
    }

    return { ok: true, hipHopName };
  } catch (error) {
    console.error('Name generation network error', { message: error?.message });
    return {
      ok: false,
      error: 'Unable to reach the name generator. Is the API server running?',
    };
  }
};

export default generateHipHopName;
