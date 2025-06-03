// pages/products/add.js
import Head from 'next/head';
import ProductForm from '../../components/ProductForm';

export default function AddProductPage() {
  return (
    <div>
      <Head>
        <title>Add New Product</title>
      </Head>
      <ProductForm />
    </div>
  );
}