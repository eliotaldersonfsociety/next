import Image from 'next/image';

const PaymentMethods = () => {
  return (
    <div className="mt-6">
      <h3 className="text-xl font-semibold">Métodos de Pago</h3>
      <div className="flex flex-col gap-6 mt-4">
        <Image
          src="/zelle.png" // Asegúrate de tener esta imagen en la carpeta /public
          alt="Zelle"
          width={500}
          height={200}
        />
        <Image
          src="/payments.png" // Asegúrate de tener esta imagen en la carpeta /public
          alt="Payments"
          width={500}
          height={200}
        />
      </div>
    </div>
  );
};

export default PaymentMethods;
