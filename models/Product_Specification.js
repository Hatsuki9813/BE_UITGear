const mongoose = require('mongoose');
require('mongoose-timestamp');

const productSpecificationSchema = new mongoose.Schema({
  specifications: { 
    type: Object, // JSON cho thông số kỹ thuật (CPU, RAM, v.v.)
    default: {}
  },
},{timestamps:true});

module.exports = mongoose.model('Product_Specification', productSpecificationSchema);