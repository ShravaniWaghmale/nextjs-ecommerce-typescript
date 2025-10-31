import { GetStaticPaths, GetStaticProps } from 'next';
import { readProducts, findProductBySlug, Product } from '../../utils/db';

type Props = { product?: Product };

export default function ProductPage({ product }: Props) {
  if (!product) return <div>Product not found</div>;
  return (
    <main>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <div>Price: ${product.price}</div>
      <div>Inventory: {product.inventory}</div>
      <div>Last updated: {new Date(product.lastUpdated).toLocaleString()}</div>
    </main>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const products = await readProducts();
  const paths = products.map(p => ({ params: { slug: p.slug } }));
  return { paths, fallback: 'blocking' };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = typeof params?.slug === 'string' ? params.slug : '';
  const product = await findProductBySlug(slug);
  if (!product) return { notFound: true };
  return { props: { product }, revalidate: 60 };
};
