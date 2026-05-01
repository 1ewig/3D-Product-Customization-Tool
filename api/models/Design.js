import mongoose from 'mongoose';

/**
 * Design Schema
 * Defines the structure for saved product customizations.
 * This ensures data consistency across the database.
 */
const DesignSchema = new mongoose.Schema({
  createdAt: {
    type: Date,
    default: Date.now,
  },
  text: {
    textContent: String,
    textColor: String,
    fontSize: Number,
    textPosition: {
      x: Number,
      y: Number,
      z: Number
    },
    textRotation: Number,
    textScale: Number
  },
  logo: {
    logoUrl: String, // Store Base64 or URL
    logoPosition: {
      x: Number,
      y: Number,
      z: Number
    },
    logoRotation: Number,
    logoScale: Number
  },
  model: {
    customModelUrl: String // Store Base64 or URL
  }
}, {
  // Minimize the overhead by removing the __v version key
  versionKey: false 
});

// Avoid re-compiling the model if it already exists (Hot Reload / Serverless safety)
const Design = mongoose.models.Design || mongoose.model('Design', DesignSchema);

export default Design;
