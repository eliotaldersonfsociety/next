type ProductDetailsProps = {
  description: string;
};

const ProductDetails = ({ description }: ProductDetailsProps) => (
  <div className="mt-12">
    <h2 className="text-2xl font-bold mb-4 text-center">Detalles del Producto</h2>
    <div className="lg:mx-36 my-8">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="prose max-w-none text-center mx-auto" dangerouslySetInnerHTML={{ __html: description }} />
      </div>
    </div>
  </div>
);

export default ProductDetails;
