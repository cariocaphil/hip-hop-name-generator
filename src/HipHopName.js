const generateHipHopName = async (name, additionalInfo, prefix) => {
  const apiKey = process.env.REACT_APP_OPENAI_API_KEY;
  const prompt = `Transform the name "${name}" into a hip hop star name, and consider the additional information about the person having that name, "${additionalInfo}", and the prefix chosen "${prefix}" :`;

  try {
    const response = await fetch('https://api.openai.com/v1/engines/davinci/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        prompt: prompt,
        max_tokens: 50,
        n: 1,
        stop: ['\n'],
      }),
    });

    const data = await response.json();
    if (data.choices && data.choices.length > 0 && data.choices[0].text) {
      const hipHopName = data.choices[0].text.trim();
      return hipHopName;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error generating hip hop name:', error);
    return null;
  }
};

export default generateHipHopName;
