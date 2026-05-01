/**
 * Vercel Serverless Function - Express Backend (MongoDB Edition)
 * This file handles persistent storage using MongoDB Atlas.
 * It uses a singleton pattern to maintain database connections in serverless.
 */

import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Design from './models/Design.js';

// Load environment variables from .env file
dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

// ─── MONGODB CONNECTION (SINGLETON) ──────────────────────────────────────────
const MONGODB_URI = process.env.MONGODB_URI;

let isConnected = false;

const connectToDatabase = async () => {
  if (isConnected) return;

  if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI is missing from environment variables!');
    return;
  }

  try {
    const db = await mongoose.connect(MONGODB_URI);
    isConnected = db.connections[0].readyState === 1;
    console.log('✅ Connected to MongoDB Atlas');
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error);
  }
};

// ─── MIDDLEWARE ──────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Middleware to ensure DB is connected before handling requests
app.use(async (req, res, next) => {
  await connectToDatabase();
  next();
});

// ─── API ROUTES ──────────────────────────────────────────────────────────────

/**
 * GET /api/designs
 * Fetches lightweight metadata for all saved designs.
 */
app.get('/api/designs', async (req, res) => {
  try {
    // Fetch designs and map _id to id for frontend compatibility
    const designs = await Design.find({}, '_id createdAt').sort({ createdAt: -1 });
    const metadata = designs.map(d => ({
      id: d._id,
      createdAt: d.createdAt
    }));
    res.json(metadata);
  } catch (error) {

    res.status(500).json({ error: 'Failed to load designs' });
  }
});

/**
 * GET /api/designs/:id
 * Fetches the full design data by ID.
 */
app.get('/api/designs/:id', async (req, res) => {
  try {
    const design = await Design.findById(req.params.id);
    if (!design) return res.status(404).json({ error: 'Design not found' });
    res.json(design);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch design details' });
  }
});

/**
 * POST /api/designs
 * Saves a new customization design document.
 */
app.post('/api/designs', async (req, res) => {
  try {
    const newDesign = await Design.create(req.body);
    // Return metadata of the newly created document
    res.status(201).json({ id: newDesign._id, createdAt: newDesign.createdAt });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save design' });
  }
});

/**
 * DELETE /api/designs/:id
 * Removes a specific design document.
 */
app.delete('/api/designs/:id', async (req, res) => {
  try {
    await Design.findByIdAndDelete(req.params.id);
    res.json({ message: 'Design deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete design' });
  }
});

// ─── LOCAL SERVER ────────────────────────────────────────────────────────────
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 API running on http://localhost:${PORT}`);
  });
}

export default app;

