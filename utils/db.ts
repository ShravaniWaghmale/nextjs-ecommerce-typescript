import fs from 'fs/promises';
import path from 'path';

const DATA_PATH = path.join(process.cwd(), 'data', 'products.json');

export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  category: string;
  inventory: number;
  lastUpdated: string;
};

export async function readProducts(): Promise<Product[]> {
  const content = await fs.readFile(DATA_PATH, 'utf-8');
  return JSON.parse(content) as Product[];
}

export async function writeProducts(products: Product[]): Promise<void> {
  await fs.writeFile(DATA_PATH, JSON.stringify(products, null, 2), 'utf-8');
}

export async function findProductBySlug(slug: string): Promise<Product | undefined> {
  const products = await readProducts();
  return products.find(p => p.slug === slug);
}

export async function findProductById(id: string): Promise<Product | undefined> {
  const products = await readProducts();
  return products.find(p => p.id === id);
}
