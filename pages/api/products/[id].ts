import type { NextApiRequest, NextApiResponse } from 'next';
import { readProducts, writeProducts } from '../../../utils/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method === 'PUT') {
    const adminKey = (req.headers['x-admin-key'] as string | undefined) || process.env.ADMIN_KEY;
    if (adminKey !== (process.env.ADMIN_KEY || 'change-me-to-a-secure-key')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!id) return res.status(400).json({ error: 'id param required' });

    const products = await readProducts();
    const idx = products.findIndex(p => p.id === String(id));
    if (idx === -1) return res.status(404).json({ error: 'Product not found' });

    const updates = req.body;
    products[idx] = { ...products[idx], ...updates, lastUpdated: new Date().toISOString() };
    await writeProducts(products);
    return res.status(200).json(products[idx]);
  }

  res.setHeader('Allow', ['PUT']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
