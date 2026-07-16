
const SYSTEM_PROMPT = `You are a senior software engineer performing a code review.
Given a source file, respond with ONLY valid JSON (no markdown fences, no prose)
matching exactly this shape:

{
  "summary": "2-4 sentence plain-English summary of the code's purpose and overall quality",
  "documentation": "auto-generated docstring/comment block describing what the code does",
  "issues": [
    {
      "category": "bug | code_smell | naming | performance | security | best_practice",
      "severity": "critical | warning | info",
      "line_number": number or null,
      "message": "what is wrong, specifically",
      "suggestion": "concrete fix or improvement"
    }
  ]
}

Be specific and reference real line numbers where possible. Do not invent issues that
aren't present. If the code is clean, return an empty issues array and say so in the summary.`;

async function runAiReview(language, code) {
  const apiKey = (process.env.OPENROUTER_API_KEY || "").trim();
  const looksLikePlaceholder = !apiKey || apiKey.startsWith("sk-or-xxxx") || apiKey.length < 20;

  if (looksLikePlaceholder) {
    return {
      summary: null,
      documentation: null,
      issues: [],
      available: false,
      note: "OPENROUTER_API_KEY is not set (or still the placeholder from .env.example) — AI review was skipped. Get a free key at openrouter.ai and add it to backend/.env.",
    };
  }

  const body = {
    

    model: process.env.OPENROUTER_MODEL || "openrouter/free",
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: `Language: ${language}\n\n\`\`\`${language}\n${code}\n\`\`\`` },
    ],
    temperature: 0.2,
  };

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const text = await response.text();
    if (response.status === 401) {
      throw new Error(
        "OpenRouter rejected the API key (401). Double-check OPENROUTER_API_KEY in backend/.env is a real key copied from openrouter.ai/keys, with no extra quotes or spaces."
      );
    }
    throw new Error(`OpenRouter request failed (${response.status}): ${text}`);
  }

  const data = await response.json();
  const raw = data.choices?.[0]?.message?.content || "{}";

  let parsed;
  try {
  
    const cleaned = raw.replace(/```json|```/g, "").trim();
    parsed = JSON.parse(cleaned);
  } catch {
    return {
      summary: raw.slice(0, 500),
      documentation: null,
      issues: [],
      available: true,
      note: "The AI response could not be parsed as JSON; showing raw summary text only.",
    };
  }

  return {
    summary: parsed.summary || null,
    documentation: parsed.documentation || null,
    issues: Array.isArray(parsed.issues)
      ? parsed.issues.map((i) => ({
          source: "ai",
          category: i.category || "best_practice",
          severity: i.severity || "info",
          line_number: i.line_number ?? null,
          message: i.message,
          suggestion: i.suggestion || null,
        }))
      : [],
    available: true,
    note: null,
  };
}

module.exports = { runAiReview };
