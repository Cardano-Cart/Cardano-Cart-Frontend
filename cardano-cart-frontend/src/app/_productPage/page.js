import Header from "../_components/Header"
import Link from 'next/link';

const products = [
  { id: 1, title: 'Abstract 3D Design', price: '2.55 ETH' },
  { id: 2, title: 'Digital Artwork', price: '1.2 ETH' },
];

export default function Productpage() {
  return (
    <>
    <Header />
    <div className="container mx-auto p-6">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-6">Products</h1>
        <ul className="space-y-4">
          {products.map((product) => (
            <li
              key={product.id}
              className="border p-4 rounded-lg flex justify-between items-center"
            >
              <div>
                <h2 className="text-xl font-semibold">{product.title}</h2>
                <p className="text-gray-600">{product.price}</p>
              </div>
              <Link href={`/product/${product.id}`}>
                <a className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                  View Details
                </a>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
    </>
  );
}