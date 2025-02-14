import Image from 'next/image'

const categories = [
  { name: 'Electrónica', image: '/t10.png' },
  { name: 'Moda', image: '/t8.png' },
  { name: 'Hogar y Jardín', image: '/t9.png' },
  { name: 'Deportes', image: '/t11.png' },
  { name: 'Juguetes', image: '/t7.png' },
  { name: 'Belleza', image: '/t6.png' },
  { name: 'Automotriz', image: '/t4.png' },
  { name: 'Libros', image: '/t5.png' },
  { name: 'Mascotas', image: '/t12.png' },
  { name: 'Alimentos', image: '/t13.png' },
  { name: 'Salud', image: '/t14.png' },
  { name: 'Arte', image: '/t15.png' },
]

export default function CategoryCards() {
  return (
    <div className="bg-gray-200 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold mb-8 text-gray-800">Categorías</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6 lg:mx-36">
          {categories.map((category, index) => (
            <div key={index} className="bg-white rounded-lg p-4 flex flex-col items-center justify-center shadow-md transition-transform hover:scale-105">
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
          ))}
        </div>
      </div>
    </div>
  )
}

