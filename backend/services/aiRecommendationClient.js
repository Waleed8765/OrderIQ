const { chatCompletionWithMeta } = require('../rag/services/llmService');

function extractFirstJsonObject(text) {
    if (!text || typeof text !== 'string') return null;
    const start = text.indexOf('{');
    const end = text.lastIndexOf('}');
    if (start === -1 || end === -1 || end <= start) return null;
    return text.slice(start, end + 1);
}

function validateAndNormalizeRecommendations(parsed, candidateIds, limit) {
    if (!parsed || !Array.isArray(parsed.recommendations)) return [];

    const seen = new Set();
    const normalized = [];

    for (const item of parsed.recommendations) {
        if (!item || typeof item !== 'object') continue;
        const restaurantId = typeof item.restaurantId === 'string' ? item.restaurantId : null;
        const reason = typeof item.reason === 'string' ? item.reason.trim() : '';
        if (!restaurantId || !reason) continue;
        if (!candidateIds.has(restaurantId)) continue;
        if (seen.has(restaurantId)) continue;

        normalized.push({
            restaurantId,
            reason: reason.slice(0, 220),
        });
        seen.add(restaurantId);

        if (normalized.length >= limit) break;
    }

    return normalized;
}

function parseRecommendationsFromAssistantContent(content, candidates, limit) {
    const jsonText = extractFirstJsonObject(content);
    if (!jsonText) {
        throw new Error('AI recommendation response was not valid JSON');
    }
    let parsed;
    try {
        parsed = JSON.parse(jsonText);
    } catch {
        throw new Error('AI recommendation JSON parse failed');
    }
    const candidateIds = new Set(candidates.map((c) => c.id));
    return validateAndNormalizeRecommendations(parsed, candidateIds, limit);
}

/**
 * Ranks restaurant candidates using the same LLM stack as RAG: Groq (GROQ_API_KEY) first,
 * then local Ollama (OLLAMA_BASE_URL / OLLAMA_LLM_MODEL). No OpenRouter.
 */
async function recommendRestaurantsWithAI({ userProfile, candidates, limit }) {
    const compactCandidates = candidates.map((c) => ({
        id: c.id,
        name: c.name,
        city: c.city,
        cuisineTypes: c.cuisineTypes || [],
        rating: c.rating,
        reviewCount: c.reviewCount,
        priceRange: c.priceRange || '$$',
        promoted: Boolean(c.promoted),
    }));

    const messages = [
        {
            role: 'system',
            content:
                'You are a restaurant recommendation ranking assistant. Return ONLY valid JSON with schema: {"recommendations":[{"restaurantId":"string","reason":"string"}]}. Do not include markdown or extra text.',
        },
        {
            role: 'user',
            content: JSON.stringify({
                instruction: `Pick the best ${limit} restaurants for this user from the candidate set. Reasons should be personalized and concise.`,
                userProfile,
                candidates: compactCandidates,
            }),
        },
    ];

    const { content, provider, model } = await chatCompletionWithMeta(messages);
    const recommendations = parseRecommendationsFromAssistantContent(content, candidates, limit);

    return {
        recommendations,
        provider,
        model,
    };
}

module.exports = { recommendRestaurantsWithAI };
