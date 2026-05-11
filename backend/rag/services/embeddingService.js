/**
 * Embedding Service
 * Generates vector embeddings using Google Gemini's text-embedding-004 model.
 * Falls back to Ollama or dummy embedding if Gemini is not available.
 */

const ragConfig = require('../config');
const { GoogleGenerativeAI } = require('@google/generative-ai');

let geminiClient = null;

function getGeminiClient() {
  if (!geminiClient && process.env.GOOGLE_API_KEY) {
    geminiClient = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
  }
  return geminiClient;
}

/**
 * Generate embedding vector for a given text using Google Gemini.
 * Falls back to Ollama or dummy embedding if Gemini is not available.
 * @param {string} text - The text to embed
 * @returns {Promise<number[]>} - Array of floats (768 dimensions)
 */
async function generateEmbedding(text) {
  const { baseUrl, model, dimensions } = ragConfig.embedding;

  try {
    const gemini = getGeminiClient();
    if (gemini) {
      const embedModel = gemini.getGenerativeModel({ model: 'text-embedding-004' });
      const result = await embedModel.embedContent(text);
      return result.embedding.values;
    }
  } catch (error) {
    console.warn('[Embedding] Google Gemini not available, trying Ollama:', error.message);
  }

  try {
    const response = await fetch(`${baseUrl}/api/embeddings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model, prompt: text }),
    });

    if (response.ok) {
      const data = await response.json();
      return data.embedding;
    }
  } catch (error) {
    console.warn('[Embedding] Ollama not available, using dummy embedding:', error.message);
  }

  // Fallback: Return a dummy embedding (all zeros) when nothing is available
  return new Array(dimensions).fill(0);
}

/**
 * Build a descriptive text chunk for a restaurant record.
 * This is the text that gets embedded into the vector store.
 */
function buildRestaurantChunk(restaurant) {
  const services = [];
  if (restaurant.dineIn) services.push('dine-in');
  if (restaurant.takeaway) services.push('takeaway');
  if (restaurant.delivery) services.push('delivery');

  return [
    `${restaurant.name} is a ${restaurant.businessType || 'restaurant'} located in ${restaurant.area}, ${restaurant.city}.`,
    restaurant.cuisineTypes?.length ? `Cuisines: ${restaurant.cuisineTypes.join(', ')}.` : '',
    `Rating: ${restaurant.rating}/5 (${restaurant.reviewCount} reviews).`,
    `Price range: ${restaurant.priceRange}. Hours: ${restaurant.openingTime} - ${restaurant.closingTime}.`,
    services.length ? `Services: ${services.join(', ')}.` : '',
    restaurant.description ? `Description: ${restaurant.description}` : '',
    restaurant.status !== 'OPEN' ? `Currently ${restaurant.status.toLowerCase()}.` : '',
  ].filter(Boolean).join(' ');
}

/**
 * Build a descriptive text chunk for a menu item record.
 */
function buildMenuItemChunk(menuItem, restaurant, category) {
  return [
    `${menuItem.name} at ${restaurant.name} (${restaurant.area}, ${restaurant.city}).`,
    menuItem.description ? `Description: ${menuItem.description}.` : '',
    `Price: Rs.${menuItem.price}.`,
    category ? `Category: ${category.name}.` : '',
    menuItem.badge ? `Badge: ${menuItem.badge}.` : '',
    !menuItem.inStock ? 'Currently out of stock.' : '',
  ].filter(Boolean).join(' ');
}

module.exports = {
  generateEmbedding,
  buildRestaurantChunk,
  buildMenuItemChunk,
};
