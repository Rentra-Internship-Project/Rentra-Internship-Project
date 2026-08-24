const axios = require('axios');

exports.handleChat = async (req, res) => {
  try {
    const { messages } = req.body;
    
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'Groq API key is not configured' });
    }

    const rentraSystemPrompt = require('../utils/chatbotPrompt');
    const systemPrompt = rentraSystemPrompt;

    // Format messages for Groq API (OpenAI compatible)
    const groqMessages = [
      { role: 'system', content: systemPrompt },
      ...messages.map(msg => ({
        role: msg.role === 'bot' ? 'assistant' : 'user',
        content: msg.text
      }))
    ];

    // Primary and fallback models for maximum reliability across Groq API tiers
    const candidateModels = [
      process.env.GROQ_MODEL || 'openai/gpt-oss-120b',
      'openai/gpt-oss-120b',
      'openai/gpt-oss-20b',
      'groq/compound-mini',
      'groq/compound',
      'llama-3.1-8b-instant'
    ].filter(Boolean);

    let botReply = null;
    let lastError = null;

    for (const model of candidateModels) {
      try {
        const payload = {
          model,
          messages: groqMessages,
          temperature: 0.7,
          max_tokens: 500,
        };

        const response = await axios.post(
          'https://api.groq.com/openai/v1/chat/completions',
          payload,
          {
            headers: {
              'Authorization': `Bearer ${apiKey}`,
              'Content-Type': 'application/json'
            },
            timeout: 15000
          }
        );

        let content = response.data.choices[0]?.message?.content || '';
        // Remove <think> blocks if present from reasoning models
        content = content.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();

        if (content) {
          botReply = content;
          break;
        }
      } catch (err) {
        lastError = err;
        console.warn(`Groq model ${model} failed:`, err?.response?.data?.error?.message || err.message);
        // Continue loop to try next fallback model
      }
    }

    if (!botReply) {
      throw lastError || new Error('Failed to generate chat response from any available AI model');
    }

    res.json({ reply: botReply });
  } catch (error) {
    console.error('Chat API Error:', error?.response?.data || error.message);
    res.status(500).json({ error: error?.response?.data?.error?.message || error.message });
  }
};
