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
    type: String, // Đây là nơi lưu trữ URL của hình ảnh từ Cloudinary
    required: false, // Hình ảnh là tùy chọn, không bắt buộc
  },
});

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);