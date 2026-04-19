/**
 * AI Logic Wrapper for Reachly Pro OS
 * Hybrid approach: Rule-based + LLM (OpenRouter/Groq/Mock)
 */

export async function generateAIText(prompt: string, fallback: string): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  
  if (!apiKey) {
    console.warn("AI Warning: OPENROUTER_API_KEY not found. Using sophisticated mock response.");
    // Simulate thinking delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return fallback;
  }

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://reachly.io",
        "X-Title": "Reachly Pro OS",
      },
      body: JSON.stringify({
        model: "mistralai/mistral-7b-instruct:free",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 500,
      })
    });

    const data = await response.json();
    return data.choices?.[0]?.message?.content || fallback;
  } catch (error) {
    console.error("AI Error:", error);
    return fallback;
  }
}
