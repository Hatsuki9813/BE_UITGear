const mongoose = require('mongoose');
require('mongoose-timestamp');

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  parent_category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null },
},{timestamps:true});

// Tạo index cho name và parent_category
categorySchema.index({ name: 1, parent_category: 1 });

module.exports = mongoose.model('Category', categorySchema);