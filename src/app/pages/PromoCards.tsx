import Image from 'next/image';

const promoCards = [
  {
    title: 'ACTUALIZA CELULAR Y EL DE TU FAMILIA',
    subtitle: 'Última tecnología',
    buttonText: 'Ver más',
    imageSrc: '/t2.png',
    imageAlt: 'Smartphone última generación',
  },
  {
    title: 'LLEVA TU JUEGO AL SIGUIENTE NIVEL',
    subtitle: 'Envío Gratis en 48 Horas',
    buttonText: 'Ver más',
    imageSrc: '/t3.png',
    imageAlt: 'Consola PS5 con control',
  },
  {
    title: 'MEJORA TU EXPERIENCIA DE AUDIO',
    subtitle: 'Ofertas Especiales',
    buttonText: 'Descubrir',
    imageSrc: '/t16.png',
    imageAlt: 'Auriculares de alta calidad',
  },
  {
    title: 'EQUIPA TU HOGAR INTELIGENTE',
    subtitle: 'Tecnología para el Hogar',
    buttonText: 'Explorar',
    imageSrc: '/t20.png',
    imageAlt: 'Dispositivos de hogar inteligente',
  },
]

const categoryCards = [
  {
    title: "Electrónica",
    mainImage: "/t52.png",
    link: "https://next-navy-seven.vercel.app/product/142",
    subImages: [
      {
        src: "https://ae-pic-a1.aliexpress-media.com/kf/S5dec004714b4441cb5a0a36acd411512R.jpg_960x960q75.jpg_.avif",
        link: "https://next-navy-seven.vercel.app/product/189"
      },
      {
        src: "https://ae-pic-a1.aliexpress-media.com/kf/S7de3633ba16a4c579be8cc592b4da1c9P.jpg_960x960q75.jpg_.avif",
        link: "https://next-navy-seven.vercel.app/product/197"
      },
      {
        src: "https://ae-pic-a1.aliexpress-media.com/kf/Se79d470ae60b427a8c040f60a4883ed6p.jpg_960x960q75.jpg_.avif",
        link: "https://next-navy-seven.vercel.app/product/206"
      },
      {
        src: "https://ae-pic-a1.aliexpress-media.com/kf/H3cd4207d606b422cbc2045461792238eZ.jpg_960x960q75.jpg_.avif",
        link: "https://next-navy-seven.vercel.app/product/223"
      }
    ]
  },
  {
    title: "Moda",
    mainImage: "/t51.png",
    link: "https://next-navy-seven.vercel.app/product/238",
    subImages: [
      {
        src: "https://ae-pic-a1.aliexpress-media.com/kf/S85a469ad0f064a2e920a7394388ab4704.jpg_960x960q75.jpg_.avif",
        link: "https://next-navy-seven.vercel.app/product/379"
      },
      {
        src: "https://ae-pic-a1.aliexpress-media.com/kf/Sa9effe7f5a5e44e599af35cef134fef3r.jpg_960x960q75.jpg_.avif",
        link: "https://next-navy-seven.vercel.app/product/368"
      },
      {
        src: "https://ae-pic-a1.aliexpress-media.com/kf/S2ca90342ad8843eabd8e32ac56312ba36.jpg_960x960q75.jpg_.avif",
        link: "https://next-navy-seven.vercel.app/product/325"
      },
      {
        src: "https://ae-pic-a1.aliexpress-media.com/kf/Hb5dab28783a44de8b04bce62ade9ca62g.jpg_960x960q75.jpg_.avif",
        link: "https://next-navy-seven.vercel.app/product/484"
      }
    ]
  },
  {
    title: "Hogar",
    mainImage: "/t50.png",
    link: "https://next-navy-seven.vercel.app/product/721",
    subImages: [
      {
        src: "https://ae-pic-a1.aliexpress-media.com/kf/S646589b42327422b84e4d72780e4f9fbo.jpg_960x960q75.jpg_.avif",
        link: "https://next-navy-seven.vercel.app/product/855"
      },
      {
        src: "https://ae-pic-a1.aliexpress-media.com/kf/Sf4f05975f13b4282a7fd14eda011b0199.jpg_960x960q75.jpg_.avif",
        link: "https://next-navy-seven.vercel.app/product/866"
      },
      {
        src: "https://ae-pic-a1.aliexpress-media.com/kf/Sf6f52828dade4dd2b443a4845fdab5f6N.jpg_960x960q75.jpg_.avif",
        link: "https://next-navy-seven.vercel.app/product/869"
      },
      {
        src: "https://ae-pic-a1.aliexpress-media.com/kf/S05f6817e1ddf4e84892f9119c1a40703g.png_960x960.png_.avif",
        link: "https://next-navy-seven.vercel.app/product/880"
      }
    ]
  }
];

export default function PromoCards() {
  return (
    <div className="bg-gray-200 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 lg:mx-36">
          {promoCards.map((card, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="flex justify-between items-stretch relative">
                <div className="p-6 space-y-4 flex-1">
                  <p className="text-sm text-gray-600 uppercase tracking-wide">{card.subtitle}</p>
                  <h3 className="text-2xl md:text-3xl font-extrabold">{card.title}</h3>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full font-semibold transition-colors">
                    {card.buttonText}
                  </button>
                </div>
                {/* Imagen adaptada para móviles y pantallas grandes */}
                <div className="relative w-full md:w-48 h-40 md:h-48">
                  <Image
                    src={card.imageSrc}
                    alt={card.imageAlt}
                    layout="fill"
                    objectFit="contain"  // Ajustar sin recortar
                    className="object-center"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:mx-36">
          {categoryCards.map((card, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-4">
                <h3 className="text-xl font-bold mb-4">{card.title}</h3>
                <a href={card.link}>
                  <div className="relative h-48 mb-4">
                    <Image
                      src={card.mainImage}
                      alt={card.title}
                      layout="fill"
                      objectFit="contain"
                      className="object-center rounded-md"
                    />
                  </div>
                </a>
                <div className="grid grid-cols-4 gap-2">
                  {card.subImages.map((subImage, subIndex) => (
                    <a key={subIndex} href={subImage.link}>
                      <div className="relative h-12 w-12">
                        <Image
                          src={subImage.src}
                          alt={`${card.title} sub-image ${subIndex + 1}`}
                          layout="fill"
                          objectFit="contain"
                          className="object-center rounded-md"
                        />
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
