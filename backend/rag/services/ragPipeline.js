/**
 * RAG Pipeline Service
 * Orchestrates the full Retrieval-Augmented Generation flow:
 *   User query → Embed → Vector search → Build prompt → LLM → Response
 */

const ragConfig = require('../config');
const { similaritySearch } = require('./vectorStoreService');
const { chatCompletion, chatCompletionStream } = require('./llmService');
const { buildRestaurantChunk } = require('./embeddingService');
const prisma = require('../../config/db');

// Pure greeting / small-talk: skip RAG entirely.
const GREETING_RE = /^(hi+|hello+|hey+|yo+|hola|sup+|wassup|whats?\s*up|good\s*(morning|afternoon|evening|night)|how\s*(are|r)\s*(you|u|ya)|hru|thanks?|thank\s*you|ty|tysm|bye+|goodbye|ok+|okay|cool|nice|great|salam|assalam(u)?\s*alaikum)[\s!.?,😊👋🙏]*$/i;

// Generic "show me restaurants/food" intent: vector search may miss, so fall back to top-rated DB rows.
const GENERIC_LIST_RE = /\b(suggest|recommend|show|list|find|give|any|popular|best|top|good|nearby|some)\b[^?.!]*\b(restaurant|restaurants|place|places|food|cafe|cafes|spot|spots|eatery|eateries|menu|dish|dishes|cuisine|option|options)\b|^\s*(i'?m\s*hungry|what\s*(should|to|can)\s*(i|we)\s*(eat|order|get|have)|food\s*ideas?|hungry|order\s*food)\s*[?.!]*$/i;

const GREETING_REPLY =
  "Hi! 👋 I'm the OrderIQ Assistant. Ask me about restaurants, menus, or food recommendations and I'll help you find something great!";

/**
 * Process a user chat message through the RAG pipeline.
 *
 * @param {string} userMessage - The user's query
 * @param {Array} conversationHistory - Previous messages [{role, content}, ...]
 * @param {object} userContext - Optional user context { city, area }
 * @returns {Promise<string>} - The assistant's response
 */
async function processQuery(userMessage, conversationHistory = [], userContext = {}) {
  const trimmed = userMessage.trim();

  // Step 0: Greeting / small-talk short-circuit — don't hit the LLM at all.
  if (GREETING_RE.test(trimmed)) {
    return GREETING_REPLY;
  }

  const retrievedDocs = await retrieveDocs(trimmed, userContext);
  const context = buildContext(retrievedDocs);
  const messages = buildMessages(trimmed, context, conversationHistory);

  return await chatCompletion(messages);
}

/**
 * Process a user query with streaming response.
 */
async function processQueryStream(userMessage, conversationHistory = [], userContext = {}, onChunk) {
  const trimmed = userMessage.trim();

  if (GREETING_RE.test(trimmed)) {
    onChunk(GREETING_REPLY);
    return GREETING_REPLY;
  }

  const retrievedDocs = await retrieveDocs(trimmed, userContext);
  const context = buildContext(retrievedDocs);
  const messages = buildMessages(trimmed, context, conversationHistory);

  return await chatCompletionStream(messages, onChunk);
}

/**
 * Run vector search; if it returns nothing AND the user asked a generic
 * "show/recommend restaurants" question, fall back to top-rated DB rows
 * so the assistant always has something concrete to talk about.
 */
async function retrieveDocs(query, userContext) {
  const docs = await similaritySearch(query, {
    city: userContext.city || undefined,
  });
  if (docs.length > 0) return docs;
  if (!GENERIC_LIST_RE.test(query)) return docs;
  return await fetchTopRestaurantsAsDocs(userContext.city);
}

async function fetchTopRestaurantsAsDocs(city) {
  const where = { status: 'OPEN' };
  if (city) where.city = { equals: city, mode: 'insensitive' };

  const restaurants = await prisma.restaurant.findMany({
    where,
    orderBy: [{ rating: 'desc' }, { reviewCount: 'desc' }],
    take: 6,
  });

  return restaurants.map((r) => ({
    source_type: 'restaurant',
    source_id: r.id,
    content: buildRestaurantChunk(r),
    restaurant_id: r.id,
    city: r.city,
    area: r.area,
    cuisine_types: r.cuisineTypes,
  }));
}

/**
 * Format retrieved documents into a context string for the LLM.
 */
function buildContext(documents) {
  if (!documents || documents.length === 0) {
    return 'AVAILABLE DATA: (empty — no matching restaurants or items found)';
  }

  const entries = documents
    .map((doc, i) => `  ${i + 1}. [${doc.source_type.toUpperCase()}] ${doc.content}`)
    .join('\n');

  return `AVAILABLE DATA (ONLY use these — do NOT invent anything else):\n${entries}`;
}

/**
 * Build the full messages array for LLM chat completion.
 */
function buildMessages(userMessage, context, conversationHistory) {
  const systemMessage = {
    role: 'system',
    content: `${ragConfig.systemPrompt}\n\n${context}`,
  };

  // Keep last 6 messages from conversation history to stay within context limits
  const recentHistory = conversationHistory.slice(-6);

  return [
    systemMessage,
    ...recentHistory,
    { role: 'user', content: userMessage },
  ];
}

module.exports = { processQuery, processQueryStream };
