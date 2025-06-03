// models/Product.js
import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name for this product.'],
    maxlength: [60, 'Name cannot be more than 60 characters'],
  },
  description: {
    type: String,
    required: [true, 'Please provide a description for this product.'],
    maxlength: [500, 'Description cannot be more than 500 characters'],
  },
  price: {
    type: Number,
    required: [true, 'Please provide a price for this product.'],
    min: [0, 'Price cannot be negative.'],
  },
  image: {
    type: String, // Store URL of the image
    required: false, // Optional
  },
});

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);