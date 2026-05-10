/**
 * RAG Module Entry Point
 * Initializes the vector store and exports the router + sync hooks.
 *
 * Usage in server.js:
 *   const rag = require('./rag');
 *   rag.initialize();
 *   app.use('/api/chat', rag.routes);
 */

const { initVectorStore, getEmbeddingCount } = require('./services/vectorStoreService');
const chatRoutes = require('./routes/chatRoutes');
const syncService = require('./services/syncService');
const ragConfig = require('./config');
const prisma = require('../config/db');

/**
 * Initialize the RAG module (call once at server startup).
 * Creates the vector store table/indexes if they don't exist,
 * and auto-syncs embeddings if the table is empty but the DB has data.
 */
async function initialize() {
  try {
    await initVectorStore();
    console.log('[RAG] Module initialized successfully');
    // Fire-and-forget: don't block server startup on embedding generation.
    autoSyncIfEmpty().catch((err) =>
      console.error('[RAG] Auto-sync failed:', err.message),
    );
  } catch (error) {
    console.error('[RAG] Initialization failed:', error.message);
    console.error('[RAG] Chat features will be unavailable');
  }
}

/**
 * If rag_embeddings is empty but restaurants exist in the DB, auto-seed.
 * This makes the chatbot self-healing across fresh DBs, migrations, or table wipes.
 */
async function autoSyncIfEmpty() {
  const embCount = await getEmbeddingCount();
  if (embCount > 0) return;

  const restaurantCount = await prisma.restaurant.count();
  if (restaurantCount === 0) {
    console.log('[RAG] No restaurants in DB; skipping auto-sync.');
    return;
  }

  // Embedding generation needs Ollama. Check before attempting.
  const baseUrl = ragConfig.embedding.baseUrl;
  try {
    const resp = await fetch(`${baseUrl}/api/tags`);
    if (!resp.ok) throw new Error(`status ${resp.status}`);
  } catch (e) {
    console.warn(
      `[RAG] Embeddings table is empty and Ollama is not reachable at ${baseUrl} (${e.message}). ` +
        'Start Ollama and run `node rag/scripts/syncEmbeddings.js`, or restart the server.',
    );
    return;
  }

  console.log(
    `[RAG] Embeddings table is empty; auto-syncing ${restaurantCount} restaurant(s)...`,
  );
  await syncService.syncAllEmbeddings();
  console.log('[RAG] Auto-sync complete.');
}

module.exports = {
  initialize,
  routes: chatRoutes,
  sync: syncService,
};
