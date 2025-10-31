import type { NextApiRequest, NextApiResponse } from 'next';
import { readProducts, writeProducts, Product } from '../../../../utils/db';
import { nanoid } from 'nanoid';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const products = await readProducts();
    res.status(200).json(products);
    return;
  }

  if (req.method === 'POST') {
    const adminKey = (req.headers['x-admin-key'] as string | undefined) || process.env.ADMIN_KEY;
    if (adminKey !== (process.env.ADMIN_KEY || 'change-me-to-a-secure-key')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { name, description, price, category, inventory } = req.body;
    if (!name) return res.status(400).json({ error: 'Name required' });

    const products = await readProducts();
    const newProd: Product = {
      id: nanoid(8),
      name,
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      description: description || '',
      price: Number(price) || 0,
      category: category || 'General',
      inventory: Number(inventory) || 0,
      lastUpdated: new Date().toISOString()
    };
    products.push(newProd);
    await writeProducts(products);
    res.status(201).json(newProd);
    return;
  }

  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
