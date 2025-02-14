/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "hebbkx1anhila5yf.public.blob.vercel-storage.com",
      },
      {
        protocol: "https",
        hostname: "ae-pic-a1.aliexpress-media.com",
      },
      {
        protocol: "https",
        hostname: "texasstore.local",
      },
      {
        protocol: "https", // Asegúrate de que el protocolo sea https
        hostname: "texasstore-108ac1a.ingress-haven.ewp.live", // Agrega tu dominio aquí
      },
    ],
  },
};

module.exports = nextConfig;
