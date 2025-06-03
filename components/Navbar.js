// components/Navbar.js
import Link from 'next/link';

const Navbar = () => (
  <nav className="navbar">
    <Link href="/" className="navbar-brand">
      EcomApp
    </Link>
    <div className="navbar-links">
      <Link href="/products/add" className="navbar-link">
        Add Product
      </Link>
    </div>
    <style jsx>{`
      .navbar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem 2rem;
        background-color: #333;
        color: white;
      }
      .navbar-brand {
        font-size: 1.5rem;
        font-weight: bold;
        color: white;
        text-decoration: none;
      }
      .navbar-links {
        display: flex;
        gap: 1rem;
      }
      .navbar-link {
        color: white;
        text-decoration: none;
        padding: 0.5rem 1rem;
        border-radius: 5px;
      }
      .navbar-link:hover {
        background-color: #555;
      }
    `}</style>
  </nav>
);

export default Navbar;