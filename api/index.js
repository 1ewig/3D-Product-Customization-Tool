/**
 * Vercel Serverless Function - Express Backend
 * This file serves as the main entry point for the backend API.
 * It handles persistent storage using Vercel KV in production 
 * and falls back to the local filesystem during development.
 */

import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { kv } from '@vercel/kv';

// ESM dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Configuration for local vs cloud storage
const DATA_FILE = path.join('/tmp', 'designs.json'); // Local fallback (ephemeral on Vercel)
const KV_KEY = 'product_designs';                  // Redis key for Vercel KV

// Middleware setup
app.use(cors());
app.use(express.json({ limit: '10mb' })); // Higher limit to support Base64 image strings

/**
 * Reads design data from the best available storage source.
 * Prioritizes Vercel KV (Redis) if configured.
 */
const readData = async () => {
  // Check if Vercel KV environment variables are present
  if (process.env.KV_REST_API_URL) {
    try {
      const designs = await kv.get(KV_KEY);
      return designs || [];
    } catch (e) {
      console.error('KV Read Error:', e);
    }
  }

  // Fallback: Read from local /tmp file system
  if (!fs.existsSync(DATA_FILE)) return [];
  try {
    const data = fs.readFileSync(DATA_FILE);
    return JSON.parse(data);
  } catch (e) {
    return [];
  }
};

/**
 * Writes design data to the best available storage source.
 */
const writeData = async (data) => {
  // Save to Vercel KV if available
  if (process.env.KV_REST_API_URL) {
    try {
      await kv.set(KV_KEY, data);
      return;
    } catch (e) {
      console.error('KV Write Error:', e);
    }
  }

  // Fallback: Write to local /tmp file system
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  } catch (e) {
    console.error('FS Write Error:', e);
  }
};

// ─── API ROUTES ──────────────────────────────────────────────────────────────

/**
 * GET /api/designs
 * Fetches all saved product customization designs.
 */
app.get('/api/designs', async (req, res) => {
  try {
    const designs = await readData();
    res.json(designs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load designs' });
  }
});

/**
 * POST /api/designs
 * Saves a new customization design (includes text and Base64 image data).
 */
app.post('/api/designs', async (req, res) => {
  try {
    const designs = await readData();
    const newDesign = {
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      ...req.body
    };
    designs.push(newDesign);
    await writeData(designs);
    res.status(201).json(newDesign);
  } catch (error) {
    res.status(500).json({ error: 'Failed to save design' });
  }
});

/**
 * DELETE /api/designs/:id
 * Removes a specific design from the library by its ID.
 */
app.delete('/api/designs/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const designs = await readData();
    const updatedDesigns = designs.filter(d => d.id !== id);
    await writeData(updatedDesigns);
    res.json({ message: 'Design deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete design' });
  }
});

/**
 * Local server initiation (bypassed on Vercel deployment)
 */
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}

// Export for Vercel Serverless Function handling
export default app;
