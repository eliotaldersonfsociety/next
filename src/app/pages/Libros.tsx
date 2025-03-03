import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Importamos Link de React Router
import ClipLoader from 'react-spinners/ClipLoader'; // Importamos el spinner

const ck = import.meta.env.VITE_API_KEY;
const cs = import.meta.env.VITE_API_SECRET;

interface Props {
  categorySlug?: string; // Slug opcional para la categoría
}

export default function Libros({ categorySlug = "540" }: Props) {
  const [products, setProducts] = useState<any[]>([]); // Tipado explícito como array de cualquier tipo
  const [loading, setLoading] = useState<boolean>(true); // Estado para el indicador de carga

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true); // Activamos el estado de carga

        // Hacemos la solicitud a la API, pasando el `categorySlug`
        const res = await fetch(`https://texasstore.local/wp-json/wc/v3/products?category=${categorySlug}`, {
          headers: {
            Authorization: `Basic ${btoa(`${ck}:${cs}`)}`, // Usamos `btoa` en lugar de `Buffer` para base64
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
  }, [categorySlug]); // Se activa cada vez que cambia el `categorySlug`

  return (
    <div className="bg-white lg:mx-36">
      <main className="text-center px-5 mt-20">
        <h1 className="text-4xl md:text-5xl font-bold mb-8 capitalize">Libros</h1>

        {loading ? ( // Muestra el spinner si está cargando
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
                  <Link to={`/product/${product.id}`}>
                    <img
                      src={product.images[0]?.src}
                      alt={product.name}
                      className="w-full h-64 object-cover mb-4 rounded-md"
                    />
                    <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
                    <div
                      className="product-price text-lg font-bold text-gray-900"
                      dangerouslySetInnerHTML={{ __html: product.price_html }}
                    />
                  </Link>
                </div>
              ))
            ) : (
              <p>No products found in this category.</p>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
