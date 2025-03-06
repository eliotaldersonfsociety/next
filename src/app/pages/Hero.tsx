'use client'

const floatingAnimation = `
  @keyframes floating {
    0% { transform: translate(0, 0px); }
    50% { transform: translate(0, 15px); }
    100% { transform: translate(0, -0px); }
  }
`;

import Image from 'next/image'
import { Truck } from 'lucide-react'
import Link from 'next/link'; // Importa Link


export default function Hero() {
  return (
    <div className="relative w-full h-[400px]">
      <style jsx>{floatingAnimation}</style>
      <Image
        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Compudopt+Dallas-1920w.jpg-ZzOnSJ2d5cETcDrUTaiIZT6gtCDfXD.jpeg"
        alt="Dallas skyline at sunset with urban infrastructure"
        fill
        className="object-cover"
        priority
      />
      {/* Dark overlay with fade effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/50 to-gray-200" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white space-y-8">
        <h1 className="text-center">
          <span className="text-5xl md:text-6xl font-bold block">Bienvenido</span>
          <span 
            className="text-7xl md:text-8xl font-extrabold block mt-2 text-yellow-400"
            style={{
              animation: 'floating 3s ease-in-out infinite',
              display: 'inline-block',
            }}
          >
            2025
          </span>
        </h1>
        <div className="flex flex-col md:flex-row gap-4">
          <Link href="/pages/categorias/promociones">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-semibold transition-colors">
              Hasta 40% de descuento
            </button>
          </Link>
          <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full font-semibold transition-colors flex items-center gap-2">
            <Truck className="w-5 h-5" />
            Envío gratis hasta tu casa
          </button>
        </div>
      </div>
    </div>
  )
}

