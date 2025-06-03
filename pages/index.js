// pages/index.js
import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || 'Failed to fetch products');
        }
        setProducts(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) return <p>Loading products...</p>;
  if (error) return <p className="error-message">Error: {error}</p>;
  if (products.length === 0) return <p>No products found. Add some!</p>;

  return (
    <div>
      <Head>
        <title>Product List</title>
        <meta name="description" content="List of all products" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1 className="page-title">Available Products</h1>

      <div className="product-grid">
        {products.map((product) => (
          <div key={product._id} className="product-card">
            <img src={product.image || '/placeholder.png'} alt={product.name} className="product-image" />
            <div className="product-info">
              <Link href={`/products/${product._id}`} className="product-name">
                <h2>{product.name}</h2>
              </Link>
              <p className="product-price">${product.price.toFixed(2)}</p>
              <p className="product-description">{product.description.substring(0, 100)}...</p>
            </div>
            <div className="product-actions">
              <Link href={`/products/edit/${product._id}`} className="button edit-button">
                Edit
              </Link>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .page-title {
          text-align: center;
          margin-bottom: 2rem;
          color: #2c3e50;
        }
        .product-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
        }
        .product-card {
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          transition: transform 0.2s ease-in-out;
        }
        .product-card:hover {
          transform: translateY(-5px);
        }
        .product-image {
          width: 100%;
          height: 200px;
          object-fit: cover;
          display: block;
        }
        .product-info {
          padding: 1.5rem;
          flex-grow: 1;
        }
        .product-name {
          font-size: 1.5rem;
          margin-top: 0;
          margin-bottom: 0.5rem;
          color: #3498db;
          text-decoration: none;
        }
        .product-name:hover {
          text-decoration: underline;
        }
        .product-price {
          font-size: 1.2rem;
          color: #27ae60;
          font-weight: bold;
          margin-bottom: 0.5rem;
        }
        .product-description {
          font-size: 0.9rem;
          color: #555;
        }
        .product-actions {
          padding: 1rem 1.5rem;
          border-top: 1px solid #eee;
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
        }
        .button {
          padding: 0.6rem 1.2rem;
          border-radius: 5px;
          text-decoration: none;
          font-weight: bold;
          cursor: pointer;
          transition: background-color 0.2s ease;
          border: none;
        }
        .edit-button {
          background-color: #3498db;
          color: white;
        }
        .edit-button:hover {
          background-color: #2980b9;
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