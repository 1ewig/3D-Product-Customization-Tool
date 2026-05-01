import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { kv } from '@vercel/kv';
import dotenv from 'dotenv';

// Load environment variables for local KV testing if needed
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Configuration Keys
const METADATA_KEY = 'product_designs_metadata';
const DESIGN_PREFIX = 'design:';
const LOCAL_DIR = path.join(__dirname, 'designs');

// Ensure local directory exists
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

app.get('/api/designs', async (req, res) => {
  try {
    const metadata = await getMetadata();
    res.json(metadata);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load library' });
  }
});

app.get('/api/designs/:id', async (req, res) => {
  try {
    const design = await getDesignData(req.params.id);
    if (!design) return res.status(404).json({ error: 'Design not found' });
    res.json(design);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch design' });
  }
});

app.post('/api/designs', async (req, res) => {
  try {
    const id = Date.now().toString();
    const createdAt = new Date().toISOString();
    const newDesign = { id, createdAt, ...req.body };

    await saveDesignData(id, newDesign);

    const metadata = await getMetadata();
    metadata.unshift({ id, createdAt });
    await saveMetadata(metadata);

    res.status(201).json({ id, createdAt });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save design' });
  }
});

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

app.listen(PORT, () => {
  console.log(`🚀 Optimized Server running on http://localhost:${PORT}`);
});


