const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  ref: { type: String, required: true, unique: true, trim: true },
  category: { 
    type: String, 
    enum: [
      'MsL1 (illimité)', 'MsL2 (1an)', 'MsL2A (672h)', 
      'MsL3 (178h)', 'MsL4 (72h)', 'MsL5 (48h)', 
      'MsL5A (24h)', 'MsL6 spécifique'
    ], 
    required: true 
  },
  level: { type: Number, required: true, default: 1, min: 1 }
}, { timestamps: true });

module.exports = mongoose.model('Product', ProductSchema);
