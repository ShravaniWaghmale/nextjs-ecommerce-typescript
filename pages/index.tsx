import Link from 'next/link';
import { GetStaticProps } from 'next';
import { readProducts, Product } from '../utils/db';
import { useState } from 'react';

type Props = { products: Product[] };

export default function Home({ products }: Props) {
  const [q, setQ] = useState('');
  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(q.toLowerCase()) || p.category.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <main>
      <h1>Product Catalog (SSG)</h1>
      <input placeholder="Search products or category" value={q} onChange={e=>setQ(e.target.value)} />
      <ul>
        {filtered.map(p => (
          <li key={p.id} style={{ margin: 10 }}>
            <Link href={`/products/${p.slug}`}>{p.name}</Link>
            <div>Price: ${p.price}</div>
            <div>Inventory: {p.inventory}</div>
          </li>
        ))}
      </ul>
    </main>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const products = await readProducts();
  return {
    props: { products },
    revalidate: 3600
  };
};
