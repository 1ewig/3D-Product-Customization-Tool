/**
 * Vercel Serverless Function - Express Backend (High-Performance KV Edition)
 * This file handles persistent storage using Vercel KV (Redis).
 * Optimized to use metadata indexing and individual design keys for speed.
 */

import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { kv } from '@vercel/kv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Configuration Keys
const METADATA_KEY = 'product_designs_metadata'; // Lightweight index
const DESIGN_PREFIX = 'design:';                  // Prefix for heavy data
const LOCAL_DIR = path.join('/tmp', 'designs');   // Local fallback directory

// Ensure local directory exists for fallback
if (!fs.existsSync(LOCAL_DIR)) {
  fs.mkdirSync(LOCAL_DIR, { recursive: true });
}

// ─── MIDDLEWARE ──────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// ─── STORAGE HELPERS ─────────────────────────────────────────────────────────

const getMetadata = async () => {
  if (process.env.KV_REST_API_URL) {
    return (await kv.get(METADATA_KEY)) || [];
  }
  const metaPath = path.join(LOCAL_DIR, 'metadata.json');
  if (!fs.existsSync(metaPath)) return [];
  return JSON.parse(fs.readFileSync(metaPath));
};

const saveMetadata = async (metadata) => {
  if (process.env.KV_REST_API_URL) {
    await kv.set(METADATA_KEY, metadata);
    return;
  }
  fs.writeFileSync(path.join(LOCAL_DIR, 'metadata.json'), JSON.stringify(metadata, null, 2));
};

const getDesignData = async (id) => {
  if (process.env.KV_REST_API_URL) {
    return await kv.get(`${DESIGN_PREFIX}${id}`);
  }
  const designPath = path.join(LOCAL_DIR, `${id}.json`);
  if (!fs.existsSync(designPath)) return null;
  return JSON.parse(fs.readFileSync(designPath));
};

const saveDesignData = async (id, data) => {
  if (process.env.KV_REST_API_URL) {
    await kv.set(`${DESIGN_PREFIX}${id}`, data);
    return;
  }
  fs.writeFileSync(path.join(LOCAL_DIR, `${id}.json`), JSON.stringify(data, null, 2));
};

const deleteDesignData = async (id) => {
  if (process.env.KV_REST_API_URL) {
    await kv.del(`${DESIGN_PREFIX}${id}`);
    return;
  }
  const designPath = path.join(LOCAL_DIR, `${id}.json`);
  if (fs.existsSync(designPath)) fs.unlinkSync(designPath);
};

// ─── API ROUTES ──────────────────────────────────────────────────────────────

/**
 * GET /api/designs
 * Returns lightweight metadata (ID and Date) for the Library list.
 */
app.get('/api/designs', async (req, res) => {
  try {
    const metadata = await getMetadata();
    res.json(metadata);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load library' });
  }
});

/**
 * GET /api/designs/:id
 * Fetches the heavy design data on-demand.
 */
app.get('/api/designs/:id', async (req, res) => {
  try {
    const design = await getDesignData(req.params.id);
    if (!design) return res.status(404).json({ error: 'Design not found' });
    res.json(design);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch design' });
  }
});

/**
 * POST /api/designs
 * Saves a new design with split-key storage.
 */
app.post('/api/designs', async (req, res) => {
  try {
    const id = Date.now().toString();
    const createdAt = new Date().toISOString();
    const newDesign = { id, createdAt, ...req.body };

    // 1. Save heavy data to its own key
    await saveDesignData(id, newDesign);

    // 2. Update lightweight metadata index
    const metadata = await getMetadata();
    metadata.unshift({ id, createdAt });
    await saveMetadata(metadata);

    res.status(201).json({ id, createdAt });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save design' });
  }
});

/**
 * DELETE /api/designs/:id
 */
app.delete('/api/designs/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await deleteDesignData(id);

    const metadata = await getMetadata();
    const updatedMetadata = metadata.filter(d => d.id !== id);
    await saveMetadata(updatedMetadata);

    res.json({ message: 'Design deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete design' });
  }
});

if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 KV-Optimized API running on http://localhost:${PORT}`);
  });
}

export default app;


