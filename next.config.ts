/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // Permite builds mesmo com erros de ESLint
  },
  typescript: {
    ignoreBuildErrors: true, // Permite builds mesmo com erros de TypeScript
  },
  // Outras configurações do Next.js podem ser adicionadas aqui
};

export default nextConfig;