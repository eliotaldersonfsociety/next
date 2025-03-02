'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { notFound } from 'next/navigation';
import { useCart } from '../../pages/context/CartContext';
import { useSession } from '../../pages/context/SessionContext'; // Importar useSession
import Header from '@/app/pages/Header';
import Breadcrumbs from '../checking/Breadcrumbs';
import ProductImages from '../checking/ProductImages';
import ProductAttributes from '../checking/ProductAttributes';
import Rating from '../checking/Rating';
import ProductDetails from '../checking/ProductDetails';
import PaymentMethods from '../checking/Payments';
import { Button } from '@/components/ui/button';
import { ShoppingCart, CircleDollarSign } from 'lucide-react';
import ClipLoader from 'react-spinners/ClipLoader';
import Footer from '../checkout/footer';
import Oferts from '../../pages/Ofertas'

const ck = "ck_10f8bd17af5190cd0c2f0f17aaa8098a1cdf1f46";
const cs = "cs_1a7d245efb14ac7d786712aeb568f2a11adddb73";

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

async function fetchProductData(id: string) {
  const res = await fetch(`https://texasstore-108ac1a.ingress-haven.ewp.live/wp-json/wc/v3/products/${id}`, {
    headers: {
      Authorization: `Basic ${Buffer.from(`${ck}:${cs}`).toString("base64")}`,
    },
  });

  if (!res.ok) {
    console.error("Error fetching product:", res.statusText);
    return null;
  }

  const data = await res.json();
  return data;
}

export default function ProductPage() {
  const router = useRouter();
  const { id } = useParams();
  const { addToCart, cart } = useCart(); // Obtener cart de useCart
  const { session } = useSession(); // Obtener sesión de useSession
  interface Product {
    id: number;
    name: string;
    price: string;
    regular_price: string;
    images: { src: string }[];
    categories: { name: string }[];
    attributes: { name: string; options: string[] }[];
    average_rating: string;
    rating_count: number;
    description: string;
    slug: string;
  }

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [mainImage, setMainImage] = useState<string>('');

  useEffect(() => {
    const loadProduct = async () => {
      if (!id) return;

      try {
        setLoading(true); // Inicia el indicador de carga
        const productData = await fetchProductData(id as string);
        if (!productData) {
          notFound();
        }
        setProduct(productData);
        setMainImage(productData.images[0]?.src || "/placeholder.svg");
      } catch (error) {
        console.error("Error loading product:", error);
      } finally {
        setLoading(false); // Detiene el indicador de carga
      }
    };

    loadProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <ClipLoader color="#AC252D" size={50} />
      </div>
    );
  }

  if (!product) {
    return <div>Product not found.</div>;
  }

  const handleAddToCart = () => {
    const cartItem = {
      id: product.id,
      name: product.name,
      price: parseFloat(product.price),
      quantity: 1,
      image: product.images[0]?.src || "/placeholder.svg",
    };
    addToCart(cartItem);
  };

  const handleBuyNow = () => {
    if (cart.length === 0) {
      alert('Por favor, agrega productos al carrito');
      return;
    }

    if (session) {
      // Si el usuario está logueado, redirigir a PayPal (simulado aquí como ejemplo)
      router.push('/payments');
    } else {
      // Si el usuario no está logueado, redirigir al checkout
      router.push('/product/checkout/');
    }
  };

  return (
    <div className="bg-gray-100">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <Breadcrumbs categories={product.categories || []} productSlug={product.slug} />

        <div className="grid md:grid-cols-3 gap-4 lg:mx-36">
          <div className="flex justify-center items-start bg-white p-6 rounded-lg shadow-md">
            <ProductImages
              images={product.images}
              mainImage={mainImage}
              setMainImage={setMainImage}
            />
          </div>

          <div className="space-y-6 bg-white p-6 rounded-lg shadow-md">
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <div
              className="text-2xl font-light text-gray-600"
              dangerouslySetInnerHTML={{ __html: `<del>${product.regular_price}$</del>` }}
            />
            <div
              className="text-5xl font-semibold"
              dangerouslySetInnerHTML={{ __html: `${product.price}$` }}
            />
            <ProductAttributes attributes={product.attributes} />
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <Rating rating={Number(product.average_rating)} count={product.rating_count} />
            <p className="text-sm text-green-500">Envío gratis a todo el país</p>
            <PaymentMethods />
            <Button className="w-full mb-4" onClick={handleAddToCart}>
              <ShoppingCart className="mr-2 h-4 w-4" /> Agregar al carrito
            </Button>
            <Button className="w-full" onClick={handleBuyNow}>
              <CircleDollarSign className="mr-2 h-4 w-4" /> Comprar Ahora
            </Button>
          </div>
        </div>
        <Ofertas />
        <ProductDetails description={product.description} />
      </div>
      <Footer />
    </div>
  );
}
