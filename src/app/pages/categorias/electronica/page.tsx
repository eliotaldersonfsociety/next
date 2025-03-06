"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import ClipLoader from "react-spinners/ClipLoader";
import Link from "next/link";
import Header from "../../Header";
import Footer from "../../footer"; // Cambié "footer" a "Footer" para seguir convenciones de nombres

const ck = "ck_6caec8dbb8183c4d8dfa54621166a33d54cb6c13";
const cs = "cs_34e358ad9715dff7db34a38688e8382877a2ed5a";

interface Product {
  id: number;
  name: string;
  images: { src: string }[];
  regular_price: string;
  sale_price: string;
}

const Electronica = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `https://texasstore-108ac1a.ingress-haven.ewp.live/wp-json/wc/v3/products?category=195&per_page=20`,
          {
            headers: { Authorization: `Basic ${btoa(`${ck}:${cs}`)}` },
          }
        );

        if (!res.ok) {
          console.error("Error fetching products:", res.statusText);
          return;
        }

        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <>
      <Header />
      <div className="bg-white lg:mx-36">
        <main className="text-center px-5 mt-20 pb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-8 capitalize">Electronica</h1>

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <ClipLoader color="#AC252D" size={50} />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {products.length > 0 ? (
                products.map((product) => (
                  <div
                    key={product.id}
                    className="border rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                  >
                    <Link href={`/product/${product.id}`}>
                      <Image
                        src={product.images[0]?.src}
                        alt={product.name}
                        width={500}
                        height={500}
                        className="w-full h-64 object-cover mb-4 rounded-md"
                      />
                      <h2 className="text-xl mb-2">{product.name}</h2>
                     {/* Mostrar precios */}
                      <div className="product-price text-lg font-bold text-gray-900">
                        {product.sale_price && product.sale_price !== product.regular_price ? (
                          <>
                            <span className="line-through text-gray-500">
                              ${parseFloat(product.regular_price).toFixed(2)}
                            </span>{" "}
                            <span className="text-red-500 text-2xl font-extrabold">
                              ${parseFloat(product.sale_price).toFixed(2)}
                            </span>
                          </>
                        ) : (
                          <span>${parseFloat(product.regular_price).toFixed(2)}</span>
                        )}
                      </div>
                    </Link>
                  </div>
                ))
              ) : (
                <p>No se encontraron productos.</p>
              )}
            </div>
          )}
        </main>
      </div>
      <Footer />
    </>
  );
};


export default Electronica;
