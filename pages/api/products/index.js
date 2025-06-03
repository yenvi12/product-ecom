// pages/api/products/index.js
import connectDB from '../../../lib/mongodb';
import Product from '../../../models/Product';

export default async function handler(req, res) {
  await connectDB(); // Gọi hàm kết nối database

  const { method } = req;

  switch (method) {
    case 'GET':
      try {
        const products = await Product.find({});
        res.status(200).json({ success: true, data: products });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message || 'Error fetching products' });
      }
      break;
    case 'POST':
      try {
        const product = await Product.create(req.body);
        res.status(201).json({ success: true, data: product });
      } catch (error) {
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ success: false, message: messages.join(', ') });
        }
        res.status(400).json({ success: false, message: error.message || 'Error creating product' });
      }
      break;
    default:
      res.status(405).json({ success: false, message: `Method ${method} Not Allowed` });
      break;
  }
}