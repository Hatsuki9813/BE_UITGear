const mongoose = require('mongoose');
require('mongoose-timestamp');

const brandSchema = new mongoose.Schema({
  name: { type: String, required: true },
},{timestamps:true});

// Tạo index cho name
brandSchema.index({ name: 1 });

module.exports = mongoose.model('Brand', brandSchema);