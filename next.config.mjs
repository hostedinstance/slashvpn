/** @type {import('next').NextConfig} */

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.icons8.com',
      },
    ],
  },

  /**
   * Turbopack конфиг (Next.js 16 — включён по умолчанию в next dev)
   * 
   * В Next.js 16 Turbopack стал стабильным и дефолтным для dev.
   * Если есть webpack конфиг — ОБЯЗАТЕЛЬНО нужен и turbopack конфиг.
   * 
   * SVG: используем @svgr/webpack через turbopack loaders
   */
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },

  /**
   * Webpack конфиг — используется ТОЛЬКО для next build (production)
   * В next dev с Turbopack этот блок игнорируется
   */
  webpack(config) {
    const fileLoaderRule = config.module.rules.find((rule) =>
      rule.test?.test?.('.svg'),
    );

    config.module.rules.push(
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/,
      },
      {
        test: /\.svg$/i,
        issuer: fileLoaderRule?.issuer,
        resourceQuery: { not: [...(fileLoaderRule?.resourceQuery?.not ?? []), /url/] },
        use: ['@svgr/webpack'],
      },
    );

    if (fileLoaderRule) {
      fileLoaderRule.exclude = /\.svg$/i;
    }

    return config;
  },
};

export default nextConfig;
