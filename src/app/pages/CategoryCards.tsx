import Image from 'next/image'
import Link from 'next/link'

const categories = [
  { name: 'Electrónica', image: '/t10.png', path: '/categorias/electronica' },
  { name: 'Moda', image: '/t8.png', path: '/categorias/moda' },
  { name: 'Hogar y Jardín', image: '/t9.png', path: '/categorias/hogar-y-jardin' },
  { name: 'Deportes', image: '/t11.png', path: '/categorias/deportes' },
  { name: 'Juguetes', image: '/t7.png', path: '/categorias/juguetes' },
  { name: 'Belleza', image: '/t6.png', path: '/categorias/belleza' },
  { name: 'Automotriz', image: '/t4.png', path: '/pages/automotriz' },
  { name: 'Libros', image: '/t5.png', path: '/categorias/libros' },
  { name: 'Mascotas', image: '/t12.png', path: '/categorias/mascotas' },
  { name: 'Alimentos', image: '/t13.png', path: '/categorias/alimentos' },
  { name: 'Salud', image: '/t14.png', path: '/categorias/salud' },
  { name: 'Arte', image: '/t15.png', path: '/categorias/arte' },
]

export default function CategoryCards() {
  return (
    <div className="bg-gray-200 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold mb-8 text-gray-800">Categorías</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6 lg:mx-36">
          {categories.map((category, index) => (
            <Link href={category.path} key={index} passHref>
              <div className="bg-white rounded-lg p-4 flex flex-col items-center justify-center shadow-md transition-transform hover:scale-105 cursor-pointer">
                <div className="relative w-20 h-20 mb-4">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover rounded-full"
                  />
                </div>
                <span className="text-sm font-medium text-center text-gray-700">{category.name}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
