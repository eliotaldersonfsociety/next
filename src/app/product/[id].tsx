'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useCart } from '../pages/context/CartContext';
import { useSession } from '../pages/context/SessionContext';
import Breadcrumbs from './checking/Breadcrumbs';
import ProductImages from './checking/ProductImages';
import ProductAttributes from './checking/ProductAttributes';
import Rating from './checking/Rating';
import ProductDetails from './checking/ProductDetails';
import PaymentMethods from './checking/Payments';
import Footer from './checking/footer';
import { Button } from '@/components/ui/button';
import { ShoppingCart, CircleDollarSign } from 'lucide-react';
import ClipLoader from 'react-spinners/ClipLoader';
import { toast } from 'react-hot-toast';

type Product = {
  id: string;
  name: string;
  price: string;
  regular_price: string;
  description: string;
  images: Array<{ src: string }>;
  categories: Array<{ name: string; slug: string }>;
  average_rating: number;
  rating_count: number;
  attributes: Array<{ name: string; value: string }>;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;
const API_SECRET = process.env.NEXT_PUBLIC_API_SECRET;

const fetchProductData = async (id: string): Promise<Product | null> => {
  try {
    const res = await fetch(`${API_URL}/${id}`, {
      headers: {
        Authorization: `Basic ${btoa(`${API_KEY}:${API_SECRET}`)}`,
      },
    });

    if (!res.ok) throw new Error(`Error fetching product: ${res.statusText}`);
    return res.json();
  } catch (error) {
    console.error(error);
    return null;
  }
};

export default function ProductPage() {
  const { id } = useParams(); // Solo usamos `id`, no `slug`
  const router = useRouter();
  const { addToCart, getTotal, cart } = useCart();
  const { session } = useSession();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [mainImage, setMainImage] = useState<string>('');

  useEffect(() => {
    if (!id) return;

    const loadProduct = async () => {
      setLoading(true);
      const productData = await fetchProductData(id as string);
      if (productData) {
        setProduct(productData);
        setMainImage(productData.images?.[0]?.src || '/placeholder.svg');
      } else {
        router.push('/not-found');
      }
      setLoading(false);
    };

    loadProduct();
  }, [id, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <ClipLoader color="#AC252D" size={50} />
      </div>
    );
  }

  if (!product) {
    return <div>Producto no encontrado.</div>;
  }

  const handleAddToCart = () => {
    const cartItem = {
      id: parseInt(product.id),
      name: product.name,
      price: parseFloat(product.price),
      quantity: 1,
      image: product.images?.[0]?.src || '/placeholder.svg',
    };
    addToCart(cartItem);
    toast.success('Producto agregado al carrito');
  };

  const handleBuyNow = () => {
    if (cart.length === 0) {
      toast.error('Agrega productos al carrito antes de proceder al pago');
      return;
    }

    if (session) {
      router.push(`/paypal?total=${getTotal()}`);
    } else {
      router.push('/product/checkout/');
    }
  };

  const transformedAttributes = product.attributes.map((attr) => ({
    name: attr.name,
    options: [attr.value],
  }));

  return (
    <div className="bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <Breadcrumbs categories={product.categories || []} productSlug={Array.isArray(id) ? id[0] : id} /> {/* Usamos `id` en lugar de `slug` */}

        <div className="grid md:grid-cols-3 gap-4 lg:mx-36">
          <div className="flex justify-center items-start bg-white p-6 rounded-lg shadow-md">
            <ProductImages images={product.images} mainImage={mainImage} setMainImage={setMainImage} />
          </div>

          <div className="space-y-6 bg-white p-6 rounded-lg shadow-md">
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <div className="text-2xl font-light text-gray-600">
              <del>{product.regular_price}$</del>
            </div>
            <div className="text-5xl font-semibold">{product.price}$</div>
            <ProductAttributes attributes={transformedAttributes} />
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <Rating rating={product.average_rating} count={product.rating_count} />
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

        <ProductDetails description={product.description} />
      </div>
      <Footer />
    </div>
  );
}
