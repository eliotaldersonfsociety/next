'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const ThankYouPage = () => {
  const router = useRouter();
  interface PurchaseItem {
    image: string;
    name: string;
    price: number;
    quantity: number;
  }

  interface PurchaseDetails {
    total: number;
    paymentMethod: string;
    items: PurchaseItem[];
  }

  const [purchaseDetails, setPurchaseDetails] = useState<PurchaseDetails | null>(null);

  useEffect(() => {
    // Intentar obtener los detalles de la compra desde localStorage
    const storedData = localStorage.getItem('purchaseDetails');
    if (storedData) {
      setPurchaseDetails(JSON.parse(storedData));
      localStorage.removeItem('purchaseDetails'); // Limpiar después de usar
    } else {
      console.error('No se encontraron detalles de compra');
    }
  }, []);

  if (!purchaseDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <h1 className="text-2xl font-bold">Cargando detalles de la compra...</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center lg:mx-36">
        <h1 className="text-2xl font-bold mb-4">¡Gracias por tu compra!</h1>
        <p className="text-gray-700">
          Tu pago se ha completado exitosamente. Te hemos enviado un correo con los detalles de tu pedido.
        </p>
        <div className="mt-4 text-left">
          <h2 className="text-xl font-semibold">Detalles de la compra:</h2>
          <p>Total: ${purchaseDetails.total.toFixed(2)}</p>
              {purchaseDetails.items.map((item: PurchaseItem, index: number) => (
                <div key={index}>
                  <p>{item.name}</p>
                </div>
              ))}

          {/* Tabla de productos comprados */}
          <table className="w-full mt-4 border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border border-gray-200">Producto</th>
                <th className="p-2 border border-gray-200">Precio Unitario</th>
                <th className="p-2 border border-gray-200">Cantidad</th>
                <th className="p-2 border border-gray-200">Total</th>
              </tr>
            </thead>
            <tbody>
              {purchaseDetails.items.map((item: PurchaseItem, index: number) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="p-2 border border-gray-200 flex items-center">
                    <Image src={item.image} alt={item.name} width={48} height={48} className="object-cover rounded-md mr-4" />
                    <span>{item.name}</span>
                  </td>
                  <td className="p-2 border border-gray-200 text-center">
                    ${item.price.toFixed(2)}
                  </td>
                  <td className="p-2 border border-gray-200 text-center">
                    {item.quantity}
                  </td>
                  <td className="p-2 border border-gray-200 text-center">
                    ${(item.price * item.quantity).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button
          className="mt-6 px-6 py-2 bg-blue-500 text-white rounded-lg"
          onClick={() => router.push('/')}
        >
          Volver al inicio
        </button>
      </div>
    </div>
  );
};

export default ThankYouPage;
