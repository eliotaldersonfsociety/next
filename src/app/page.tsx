'use client'; // Necesario para que funcione en el lado del cliente

import { useState, useEffect } from 'react';
import Header from './pages/Header';
import Link from 'next/link'; // Importamos Link de Next.js
import Image from 'next/image'; // Importamos Image de Next.js
import Hero from './pages/Hero';
import FeatureCards from './pages/FeatureCards';
import PromoCards from './pages/PromoCards';
import CategoryCards from './pages/CategoryCards';
import ClipLoader from 'react-spinners/ClipLoader'; // Importamos el spinner
import Footer from './pages/footer';
import Oferts from './pages/Oferts';

const ck = "ck_6caec8dbb8183c4d8dfa54621166a33d54cb6c13";
const cs = "cs_34e358ad9715dff7db34a38688e8382877a2ed5a";


export default function Home() {
  interface Product {
    id: number;
    name: string;
    images: { src: string }[];
    sale_price: string;
  }

  const [products, setProducts] = useState<Product[]>([]); // Tipado explícito como array de productos
  const [loading, setLoading] = useState<boolean>(true); // Estado para el indicador de carga

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true); // Activamos el estado de carga
        const res = await fetch("https://texasstore-108ac1a.ingress-haven.ewp.live/wp-json/wc/v3/products/", {
          headers: {
            Authorization: `Basic ${btoa(`${ck}:${cs}`)}`,
          },
        });

        if (!res.ok) {
          console.error("Error fetching products:", res.statusText);
          return;
        }

        const data = await res.json();
        setProducts(data); // Actualiza el estado con los productos obtenidos
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false); // Desactivamos el estado de carga
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="bg-gray-100">
      <Header />
      <Hero />
      <FeatureCards />
      <Oferts />
      <PromoCards />
      <CategoryCards />

      <main className="text-center px-5 mt-20 mx-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-8 capitalize">Productos</h1>

        {loading ? ( // Muestra el spinner si está cargando
          <div className="flex items-center justify-center h-64">
            <ClipLoader color="#AC252D" size={50} />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <div 
                key={product.id} 
                className="border rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer"
              >
                {/* Usamos el Link directamente como contenedor */}
                <Link href={`/product/${product.id}`}>
                  <Image 
                    src={product.images[0]?.src}
                    alt={product.name}
                    width={500}
                    height={500}
                    className="w-full h-64 object-cover mb-4 rounded-md" 
                  />
                  <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
                  <div
                    className="product-price text-lg font-bold text-gray-900"
                    dangerouslySetInnerHTML={{ __html: product.sale_price }}
                  />
                </Link>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
