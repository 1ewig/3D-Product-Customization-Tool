/**
 * Vercel Serverless Function - Express Backend (Classic Edition)
 * Reverted to single-array storage for maximum snappiness and instant switching.
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
const KV_KEY = 'product_designs';
const DATA_FILE = path.join('/tmp', 'designs.json');

// ─── MIDDLEWARE ──────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// ─── STORAGE HELPERS ─────────────────────────────────────────────────────────

const readData = async () => {
  if (process.env.KV_REST_API_URL) {
    try {
      const designs = await kv.get(KV_KEY);
      return designs || [];
    } catch (e) {
      console.error('KV Read Error:', e);
    }
  }

  if (!fs.existsSync(DATA_FILE)) return [];
  try {
    const data = fs.readFileSync(DATA_FILE);
    return JSON.parse(data);
  } catch (e) {
    return [];
  }
};

const writeData = async (data) => {
  if (process.env.KV_REST_API_URL) {
    try {
      await kv.set(KV_KEY, data);
      return;
    } catch (e) {
      console.error('KV Write Error:', e);
    }
  }

  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  } catch (e) {
    console.error('FS Write Error:', e);
  }
};

// ─── API ROUTES ──────────────────────────────────────────────────────────────

/**
 * GET /api/designs
 * Fetches ALL designs at once for instant client-side switching.
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
 * Saves a new design to the global array.
 */
app.post('/api/designs', async (req, res) => {
  try {
    const designs = await readData();
    const newDesign = {
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      ...req.body
    };
    designs.unshift(newDesign); // Add to beginning
    await writeData(designs);
    res.status(201).json(newDesign);
  } catch (error) {
    res.status(500).json({ error: 'Failed to save design' });
  }
});

/**
 * DELETE /api/designs/:id
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

if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 Classic API running on http://localhost:${PORT}`);
  });
}

export default app;



