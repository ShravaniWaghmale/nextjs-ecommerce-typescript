import { GetServerSideProps } from 'next';
import { readProducts } from '../utils/db';

type Props = {
  stats: { total: number; totalInventory: number };
  lowStock: { id:string; name:string; inventory:number }[];
};

export default function Dashboard({ stats, lowStock }: Props) {
  return (
    <main>
      <h1>Inventory Dashboard (SSR)</h1>
      <div>Total products: {stats.total}</div>
      <div>Total inventory: {stats.totalInventory}</div>
      <h2>Low stock (<= 10)</h2>
      <ul>
        {lowStock.map(p => (
          <li key={p.id}>{p.name} — {p.inventory}</li>
        ))}
      </ul>
    </main>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const products = await readProducts();
  const total = products.length;
  const totalInventory = products.reduce((s,p)=>s+p.inventory, 0);
  const lowStock = products.filter(p=>p.inventory <= 10).map(p=>({ id:p.id, name:p.name, inventory:p.inventory }));
  return { props: { stats: { total, totalInventory }, lowStock } };
};
