// pages/products/[id].js
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Link from 'next/link'; // Đảm bảo dòng này có

export default function ProductDetail() {
  const router = useRouter();
  const { id } = router.query; // Get ID from URL
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return; // Don't fetch until ID is available

    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${id}`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || 'Failed to fetch product');
        }
        setProduct(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]); // Re-run when ID changes

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const res = await fetch(`/api/products/${id}`, {
          method: 'DELETE',
        });
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || 'Failed to delete product');
        }
        alert('Product deleted successfully!');
        router.push('/'); // Redirect to homepage after deletion
      } catch (err) {
        alert(`Error deleting product: ${err.message}`);
      }
    }
  };

  if (loading) return <p>Loading product details...</p>;
  if (error) return <p className="error-message">Error: {error}</p>;
  if (!product) return <p>Product not found.</p>;

  return (
    <div>
      <Head>
        <title>{product.name}</title>
        <meta name="description" content={product.description} />
      </Head>

      <div className="product-detail-card">
        <img src={product.image || '/placeholder.png'} alt={product.name} className="detail-image" />
        <div className="detail-info">
          <h1 className="detail-name">{product.name}</h1>
          <p className="detail-price">${product.price.toFixed(2)}</p>
          <p className="detail-description">{product.description}</p>
          <div className="detail-actions">
            <Link href={`/products/edit/${product._id}`} className="button edit-button">
              Edit Product
            </Link>
            <button onClick={handleDelete} className="button delete-button">
              Delete Product
            </button>
            <Link href="/" className="button back-button">
              Back to List
            </Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        .product-detail-card {
          display: flex;
          flex-direction: column;
          background-color: white;
          border-radius: 10px;
          box-shadow: 0 6px 18px rgba(0, 0, 0, 0.15);
          overflow: hidden;
          margin: 2rem auto;
        }
        @media (min-width: 768px) {
          .product-detail-card {
            flex-direction: row;
          }
        }
        .detail-image {
          width: 100%;
          height: 350px;
          object-fit: cover;
          display: block;
        }
        @media (min-width: 768px) {
          .detail-image {
            width: 50%;
            height: auto;
          }
        }
        .detail-info {
          padding: 2.5rem;
          flex-grow: 1;
        }
        .detail-name {
          font-size: 2.5rem;
          margin-top: 0;
          color: #2c3e50;
        }
        .detail-price {
          font-size: 1.8rem;
          color: #27ae60;
          font-weight: bold;
          margin-bottom: 1.5rem;
        }
        .detail-description {
          font-size: 1.1rem;
          color: #555;
          line-height: 1.8;
          margin-bottom: 2rem;
        }
        .detail-actions {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }
        .button {
          padding: 0.8rem 1.5rem;
          border-radius: 8px;
          text-decoration: none;
          font-weight: bold;
          cursor: pointer;
          transition: background-color 0.2s ease, transform 0.1s ease;
          border: none;
        }
        .button:active {
          transform: translateY(1px);
        }
        .edit-button {
          background-color: #3498db;
          color: white;
        }
        .edit-button:hover {
          background-color: #2980b9;
        }
        .delete-button {
          background-color: #e74c3c;
          color: white;
        }
        .delete-button:hover {
          background-color: #c0392b;
        }
        .back-button {
          background-color: #95a5a6;
          color: white;
        }
        .back-button:hover {
          background-color: #7f8c8d;
        }
        .error-message {
          color: red;
          text-align: center;
          font-weight: bold;
        }
      `}</style>
    </div>
  );
}