import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const ProductForm = ({ productData = {} }) => {
  const router = useRouter();
  const [form, setForm] = useState({
    name: productData.name || '',
    description: productData.description || '',
    price: productData.price || '',
    image: productData.image || '',
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(productData.image || '');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    if (productData && productData._id) {
      setForm({
        name: productData.name || '',
        description: productData.description || '',
        price: productData.price || '',
        image: productData.image || '',
      });
      setFilePreview(productData.image || '');
      setSelectedFile(null);
    }
  }, [productData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prevForm => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setSelectedFile(null);
      setFilePreview(form.image || '');
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

    let imageUrl = form.image;
    if (selectedFile) {
      setUploadingImage(true);
      const formData = new FormData();
      formData.append('file', selectedFile);

      try {
        const uploadRes = await fetch('/api/upload-image', {
          method: 'POST',
          body: formData,
        });
        const uploadData = await uploadRes.json();

        if (!uploadRes.ok) {
          throw new Error(uploadData.message || 'Image upload failed');
        }
        imageUrl = uploadData.imageUrl;
      } catch (uploadError) {
        setMessage(`Image upload error: ${uploadError.message}`);
        setIsSubmitting(false);
        setUploadingImage(false);
        return;
      } finally {
        setUploadingImage(false);
      }
    }

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
        body: JSON.stringify(productDataToSend),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage('Product saved successfully!');
        // Không tự động điều hướng nữa để giữ lại message
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
      {message && (
        <p className={`message ${message.includes('Error') || message.includes('upload error') ? 'error' : 'success'}`}>
          {message}
        </p>
      )}
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

        <div className="form-group">
          <label htmlFor="imageUpload">Upload Image (Optional):</label>
          <input
            type="file"
            id="imageUpload"
            name="imageUpload"
            accept="image/*"
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

        <button
          type="button"
          className="cancel-button"
          onClick={() => router.push('/')}
        >
          Cancel
        </button>
      </form>

      <style jsx>{`
        .form-container {
          max-width: 600px;
          margin: 2rem auto;
          padding: 2rem;
          background-color: white;
          border-radius: 10px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }
        .form-title {
          text-align: center;
          color: #2c3e50;
          margin-bottom: 2rem;
        }
        .message {
          padding: 1rem;
          border-radius: 5px;
          margin-bottom: 1.5rem;
          text-align: center;
          font-weight: bold;
        }
        .message.success {
          background-color: #d4edda;
          color: #155724;
          border: 1px solid #c3e6cb;
        }
        .message.error {
          background-color: #f8d7da;
          color: #721c24;
          border: 1px solid #f5c6cb;
        }
        .product-form .form-group {
          margin-bottom: 1.5rem;
        }
        .product-form label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: bold;
          color: #555;
        }
        .product-form input[type="text"],
        .product-form input[type="number"],
        .product-form textarea {
          width: 100%;
          padding: 0.8rem;
          border: 1px solid #ddd;
          border-radius: 5px;
          font-size: 1rem;
        }
        .product-form textarea {
          resize: vertical;
          min-height: 120px;
        }
        .product-form input:focus,
        .product-form textarea:focus {
          outline: none;
          border-color: #3498db;
          box-shadow: 0 0 5px rgba(52, 152, 219, 0.5);
        }
        .submit-button,
        .cancel-button {
          width: 100%;
          padding: 1rem 1.5rem;
          font-size: 1.1rem;
          border: none;
          border-radius: 5px;
          margin-top: 1rem;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }
        .submit-button {
          background-color: #28a745;
          color: white;
        }
        .submit-button:hover:not(:disabled) {
          background-color: #218838;
        }
        .submit-button:disabled {
          background-color: #cccccc;
          cursor: not-allowed;
        }
        .cancel-button {
          background-color: #f0ad4e;
          color: white;
        }
        .cancel-button:hover {
          background-color: #ec971f;
        }
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
