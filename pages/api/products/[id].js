// pages/api/products/[id].js
import connectDB from '../../../lib/mongodb'; // <--- Thay đổi import ở đây
import Product from '../../../models/Product';

export default async function handler(req, res) {
  await connectDB(); // <--- Gọi hàm kết nối ở đây

  const {
    query: { id },
    method,
  } = req;

  switch (method) {
    case 'GET':
      try {
        const product = await Product.findById(id);
        if (!product) {
          return res.status(404).json({ success: false, message: 'Product not found' });
        }
        res.status(200).json({ success: true, data: product });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;

    case 'PUT':
      try {
        const product = await Product.findByIdAndUpdate(id, req.body, {
          new: true,
          runValidators: true,
        });
        if (!product) {
          return res.status(404).json({ success: false, message: 'Product not found' });
        }
        res.status(200).json({ success: true, data: product });
      } catch (error) {
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ success: false, message: messages.join(', ') });
        }
        res.status(400).json({ success: false, message: error.message });
      }
      break;

    case 'DELETE':
      try {
        const deletedProduct = await Product.deleteOne({ _id: id });
        if (!deletedProduct.deletedCount) {
          return res.status(404).json({ success: false, message: 'Product not found' });
        }
        res.status(200).json({ success: true, data: {} });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;

    default:
      res.status(405).json({ success: false, message: `Method ${method} Not Allowed` });
      break;
  }
}