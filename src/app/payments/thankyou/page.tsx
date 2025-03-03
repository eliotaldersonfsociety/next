'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
//import Image from 'next/image';
import { useSession } from '../../pages/context/SessionContext';
import Header from '../../pages/Header';
import Footer from '../../pages/footer';

const ThankYouPage = () => {
  const router = useRouter();
  const { session, sessionLoading } = useSession();
  const [purchaseDetails, setPurchaseDetails] = useState<PurchaseDetails | null>(null);

  useEffect(() => {
    const storedData = localStorage.getItem('purchaseDetails');
    if (storedData) {
      setPurchaseDetails(JSON.parse(storedData));
      localStorage.removeItem('purchaseDetails'); // Limpiar después de usar
    } else {
      console.error('No se encontraron detalles de compra');
    }
  }, []);

  if (sessionLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <h1 className="text-2xl font-bold">Cargando sesión...</h1>
      </div>
    );
  }

  const handleRedirect = () => {
    if (session?.isAdmin) {
      router.push('/admin-panel');
    } else {
      router.push('/dashboard');
    }
  };

  if (!purchaseDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <h1 className="text-2xl font-bold">Cargando detalles de la compra...</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header />
      <div className="flex-grow container mx-auto p-6 lg:px-36">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
          <h1 className="text-2xl font-bold mb-4">¡Gracias por tu compra!</h1>
          <p className="text-gray-700">
            Tu pago se ha completado exitosamente. Te hemos enviado un correo con los detalles de tu pedido.
          </p>

          <button
            className="mt-6 px-6 py-2 bg-blue-500 text-white rounded-lg"
            onClick={handleRedirect}
          >
            Continuar
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ThankYouPage;
