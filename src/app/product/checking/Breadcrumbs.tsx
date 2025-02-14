import Link from 'next/link';

type Category = {
  id?: number; // Hacemos que "id" sea opcional
  name: string;
  slug?: string;
};

type BreadcrumbsProps = {
  categories: Category[];
  productSlug?: string;
};

const Breadcrumbs = ({ categories, productSlug }: BreadcrumbsProps) => (
  <div className="text-sm mb-4 font-extralight lg:mx-36">
    {/* Enlace a la página de inicio */}
    <Link href="/" passHref>
      <span className="text-blue-600 hover:underline">Inicio</span>
    </Link>
    <span className="mx-2 text-gray-600">/</span>

    {/* Enlaces a las categorías */}
    {categories.length > 0 ? (
      <>
        {categories.map((category, index) => (
          <span key={category.slug}> {/* Usamos slug como key si el id no está disponible */}
            <Link href={`/category/${category.slug}`} passHref>
              <span className="text-blue-600 hover:underline">{category.name}</span>
            </Link>
            {index < categories.length - 1 && (
              <span className="mx-2 text-gray-600">/</span>
            )}
          </span>
        ))}
        <span className="mx-2 text-gray-600">/</span>

        {/* Enlace al producto */}
        {productSlug && (
          <Link href={`/product/${productSlug}`} passHref>
            <span className="text-blue-600 hover:underline">{productSlug}</span>
          </Link>
        )}
      </>
    ) : (
      <span className="text-sm text-gray-600">Sin categoría</span>
    )}
  </div>
);

export default Breadcrumbs;