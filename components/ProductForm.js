// components/ProductForm.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

const ProductForm = ({ productData = {} }) => {
  const router = useRouter();
  const [form, setForm] = useState({
    name: productData.name || '',
    description: productData.description || '',
    price: productData.price || '',
    // image sẽ được xử lý riêng nếu là file upload
    image: productData.image || '', // Giữ lại để hiển thị URL nếu có từ database
  });
  const [selectedFile, setSelectedFile] = useState(null); // State mới cho file được chọn
  const [filePreview, setFilePreview] = useState(productData.image || ''); // State cho preview ảnh
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false); // State cho trạng thái upload ảnh

  useEffect(() => {
    if (productData && productData._id) {
      setForm({
        name: productData.name || '',
        description: productData.description || '',
        price: productData.price || '',
        image: productData.image || '',
      });
      setFilePreview(productData.image || ''); // Cập nhật preview khi có productData
      setSelectedFile(null); // Reset file khi chuyển sang sản phẩm khác
    } else {
        setForm({
            name: '',
            description: '',
            price: '',
            image: '',
        });
        setFilePreview(''); // Reset preview trên trang add mới
        setSelectedFile(null); // Reset file trên trang add mới
    }
    if (message) {
        setMessage('');
    }
  }, [productData, message]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // Hàm xử lý khi chọn file
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result); // Hiển thị preview ảnh
      };
      reader.readAsDataURL(file);
    } else {
      setSelectedFile(null);
      setFilePreview(form.image || ''); // Reset preview nếu không có file chọn
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    if (!form.name || !form.description || !form.price) {
      setMessage('Please fill in all required fields.');
      setIsSubmitting(false);
      return;
    }
    if (isNaN(parseFloat(form.price)) || parseFloat(form.price) < 0) {
      setMessage('Price must be a positive number.');
      setIsSubmitting(false);
      return;
    }

    let imageUrl = form.image; // Giữ lại URL cũ nếu không có file mới
    if (selectedFile) {
      setUploadingImage(true);
      const formData = new FormData();
      formData.append('file', selectedFile);

      try {
        // Gửi file đến API endpoint mới để tải lên ảnh
        const uploadRes = await fetch('/api/upload-image', {
          method: 'POST',
          body: formData, // FormData sẽ tự động đặt Content-Type là multipart/form-data
        });
        const uploadData = await uploadRes.json();

        if (!uploadRes.ok) {
          throw new Error(uploadData.message || 'Image upload failed');
        }
        imageUrl = uploadData.imageUrl; // Lấy URL từ phản hồi của server
        setMessage('Image uploaded successfully!');
      } catch (uploadError) {
        setMessage(`Image upload error: ${uploadError.message}`);
        setIsSubmitting(false);
        setUploadingImage(false);
        return; // Dừng nếu upload ảnh thất bại
      } finally {
        setUploadingImage(false);
      }
    }

    // Dữ liệu sản phẩm để gửi đến API sản phẩm
    const productDataToSend = { ...form, image: imageUrl };

    try {
      const apiEndpoint = productData._id
        ? `/api/products/${productData._id}`
        : '/api/products';
      const httpMethod = productData._id ? 'PUT' : 'POST';

      const res = await fetch(apiEndpoint, {
        method: httpMethod,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productDataToSend), // Gửi dữ liệu đã bao gồm URL ảnh mới
      });

      const data = await res.json();

      if (res.ok) {
        setMessage('Product saved successfully!');
        setTimeout(() => {
          router.push(productData._id ? `/products/${productData._id}` : '/');
        }, 1500);
      } else {
        setMessage(`Error: ${data.message || 'Something went wrong!'}`);
      }
    } catch (error) {
      setMessage(`Network error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="form-container">
      <h1 className="form-title">{productData._id ? 'Edit Product' : 'Add New Product'}</h1>
      {message && <p className={`message ${message.includes('Error') || message.includes('upload error') ? 'error' : 'success'}`}>{message}</p>}
      <form onSubmit={handleSubmit} className="product-form">
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            name="description"
            value={form.description}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="price">Price:</label>
          <input
            type="number"
            id="price"
            name="price"
            value={form.price}
            onChange={handleChange}
            required
          />
        </div>
        {/* Trường input file */}
        <div className="form-group">
          <label htmlFor="imageUpload">Upload Image (Optional):</label>
          <input
            type="file"
            id="imageUpload"
            name="imageUpload"
            accept="image/*" // Chỉ cho phép chọn file ảnh
            onChange={handleFileChange}
          />
          {filePreview && (
            <div className="image-preview-container">
              <img src={filePreview} alt="Image Preview" className="image-preview" />
            </div>
          )}
        </div>

        <button type="submit" disabled={isSubmitting || uploadingImage} className="submit-button">
          {isSubmitting ? 'Saving...' : (uploadingImage ? 'Uploading Image...' : (productData._id ? 'Update Product' : 'Add Product'))}
        </button>
        <Link href={productData._id ? `/products/${productData._id}` : '/'} className="cancel-button">
            Cancel
        </Link>
      </form>

      <style jsx>{`
        /* Giữ lại các style cũ */
        .form-container { /* ... */ }
        .form-title { /* ... */ }
        .message { /* ... */ }
        .message.success { /* ... */ }
        .message.error { /* ... */ }
        .product-form .form-group { /* ... */ }
        .product-form label { /* ... */ }
        .product-form input[type="text"],
        .product-form input[type="number"],
        .product-form textarea { /* ... */ }
        .product-form textarea { /* ... */ }
        .product-form input:focus,
        .product-form textarea:focus { /* ... */ }
        .submit-button { /* ... */ }
        .submit-button:hover:not(:disabled) { /* ... */ }
        .submit-button:disabled { /* ... */ }
        .cancel-button { /* ... */ }
        .cancel-button:hover { /* ... */ }

        /* Thêm style cho preview ảnh */
        .image-preview-container {
          margin-top: 1rem;
          text-align: center;
        }
        .image-preview {
          max-width: 100%;
          max-height: 200px;
          object-fit: contain;
          border: 1px solid #ddd;
          border-radius: 5px;
        }
      `}</style>
    </div>
  );
};

export default ProductForm;