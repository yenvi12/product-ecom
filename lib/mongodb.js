// lib/mongodb.js
import mongoose from 'mongoose';

const connectDB = async () => {
  // Tránh kết nối lại nếu đã có kết nối hoạt động
  if (mongoose.connections[0].readyState) {
    console.log("✅ Already connected to MongoDB.");
    return;
  }
  

  // Đảm bảo MONGODB_URI được định nghĩa
  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) {
    console.error("❌ MONGODB_URI is not defined in .env.local");
    // Thoát ứng dụng hoặc báo lỗi rõ ràng nếu biến môi trường thiếu
    throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
  }

  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1); // Thoát ứng dụng nếu có lỗi kết nối nghiêm trọng
  }
};

export default connectDB;