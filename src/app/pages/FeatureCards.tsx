"use client"; // Asegúrate de que se ejecute en el cliente
import { useRouter } from "next/navigation";
import { UserPlus, FootprintsIcon as Shoe, Smartphone, Grid, Package } from 'lucide-react'

const cards = [
  {
    title: 'Crea tu cuenta',
    icon: UserPlus,
    description: 'Disfruta de ofertas y compra sin límites',
    buttonText: 'Ingresa tu cuenta',
    path: "/login", 
  },
  {
    title: 'Zapatos',
    icon: Shoe,
    description: 'Encuentra el estilo que se adapta a ti',
    buttonText: 'Buscar zapatos',
  },
  {
    title: 'Celulares y teléfonos',
    icon: Smartphone,
    description: 'Descubre celulares que son tendencia',
    buttonText: 'Ir a celulares',
  },
  {
    title: 'Nuestras categorías',
    icon: Grid,
    description: 'Encuentra celulares, ropa, zapatos y más',
    buttonText: 'Ir a categorías',
  },
  {
    title: 'Recibe tus compras',
    icon: Package,
    description: 'Puedes recibirlas en tu casa o retirarlas',
    buttonText: 'Cómo recibir o retirar',
  },
]

export default function FeatureCards() {
  return (
    <div className="bg-gray-200 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 lg:mx-36">
          {cards.map((card, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center text-center">
              <card.icon className="w-12 h-12 text-blue-600 mb-4" />
              <h2 className="text-xl font-semibold mb-2">{card.title}</h2>
              <p className="text-gray-600 mb-4">{card.description}</p>
              <button className="mt-auto bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full font-semibold transition-colors">
                {card.buttonText}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

