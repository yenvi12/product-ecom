// pages/api/products/index.js
import connectDB from '../../../lib/mongodb';
import Product from '../../../models/Product'; // Đảm bảo đường dẫn này đúng tới Product Model của bạn

export default async function handler(req, res) {
  // Bắt lỗi kết nối database ngay từ đầu
  try {
    await connectDB(); // Gọi hàm kết nối database
  } catch (dbError) {
    console.error("❌ Database connection failed in /api/products:", dbError);
    // Trả về lỗi 500 Internal Server Error nếu không kết nối được database
    return res.status(500).json({
      success: false,
      message: 'Failed to connect to database. Please check server logs for details.',
      error: dbError.message // Cung cấp thông báo lỗi từ dbError
    });
  }

  const { method } = req;

  switch (method) {
    case 'GET':
      try {
        const products = await Product.find({});
        res.status(200).json({ success: true, data: products });
      } catch (error) {
        console.error("❌ Error fetching products (GET /api/products):", error);
        res.status(500).json({
          success: false,
          message: error.message || 'Error fetching products',
          error: error.message || 'Internal Server Error' // Thêm trường error để dễ gỡ lỗi
        });
      }
      break;

    case 'POST':
      try {
        // Đảm bảo req.body có dữ liệu hợp lệ. Next.js tự động parse JSON body.
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({ success: false, message: 'Request body is empty' });
        }
        const product = await Product.create(req.body);
        res.status(201).json({ success: true, data: product });
      } catch (error) {
        console.error("❌ Error creating product (POST /api/products):", error);
        if (error.name === 'ValidationError') {
          const messages = Object.values(error.errors).map(val => val.message);
          return res.status(400).json({ success: false, message: messages.join(', '), error: error.message });
        }
        res.status(500).json({
          success: false,
          message: error.message || 'Error creating product',
          error: error.message || 'Internal Server Error' // Thêm trường error để dễ gỡ lỗi
        });
      }
      break;

    default:
      console.warn(`⚠️ Method ${method} not allowed for /api/products`);
      res.status(405).json({ success: false, message: `Method ${method} Not Allowed` });
      break;
  }
}