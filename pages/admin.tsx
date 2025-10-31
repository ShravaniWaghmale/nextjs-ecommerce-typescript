import { useEffect, useState } from 'react';
import type { Product } from '../utils/db';

type Form = { id?: string; name:string; price:number; category:string; inventory:number; description:string };

export default function Admin() {
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState<Form>({ name:'', price:0, category:'', inventory:0, description:'' });

  async function load() {
    const res = await fetch('/api/products');
    const data = await res.json();
    setProducts(data);
  }

  useEffect(()=>{ load(); }, []);

  async function create(e:any) {
    e.preventDefault();
    const res = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-admin-key': process.env.NEXT_PUBLIC_ADMIN_KEY || 'change-me-in-frontend-if-needed' },
      body: JSON.stringify(form)
    });
    if (res.ok) { setForm({ name:'', price:0, category:'', inventory:0, description:'' }); load(); }
    else {
      const err = await res.text();
      alert('Failed to create product: ' + err);
    }
  }

  async function startEdit(p: Product) {
    setForm({ id: p.id, name: p.name, price: p.price, category: p.category, inventory: p.inventory, description: p.description });
  }

  async function update(e:any) {
    e.preventDefault();
    if (!form.id) return alert('No product selected');
    const res = await fetch(`/api/products/${form.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'x-admin-key': process.env.NEXT_PUBLIC_ADMIN_KEY || 'change-me-in-frontend-if-needed' },
      body: JSON.stringify(form)
    });
    if (res.ok) { setForm({ name:'', price:0, category:'', inventory:0, description:'' }); load(); }
    else {
      const err = await res.text();
      alert('Failed to update product: ' + err);
    }
  }

  return (
    <main>
      <h1>Admin Panel (Client-side)</h1>
      <form onSubmit={form.id ? update : create} style={{ marginBottom: 20 }}>
        <input placeholder="Name" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} />
        <input placeholder="Category" value={form.category} onChange={e=>setForm({...form, category:e.target.value})} />
        <input placeholder="Price" type="number" step="0.01" value={form.price} onChange={e=>setForm({...form, price:parseFloat(e.target.value||'0')})} />
        <input placeholder="Inventory" type="number" value={form.inventory} onChange={e=>setForm({...form, inventory:parseInt(e.target.value||'0')})} />
        <textarea placeholder="Description" value={form.description} onChange={e=>setForm({...form, description:e.target.value})} />
        <button type="submit">{form.id ? 'Update Product' : 'Create Product'}</button>
      </form>

      <h2>All products</h2>
      <ul>
        {products.map(p=> (
          <li key={p.id}>
            {p.name} — ${p.price} — {p.inventory} {' '}
            <button onClick={()=>startEdit(p)}>Edit</button>
          </li>
        ))}
      </ul>
    </main>
  );
}
