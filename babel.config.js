// Babel config para Next.js
// Next.js usa seu próprio sistema de transpilação, mas mantemos este arquivo
// para compatibilidade com bibliotecas que podem precisar de Babel
module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      // Next.js preset (configurado automaticamente pelo Next.js)
      "next/babel",
    ],
    plugins: [
      // Plugins opcionais podem ser adicionados aqui se necessário
    ],
    env: {
      production: {
        plugins: [
          // Remover console.log em produção (opcional)
          // ["transform-remove-console", { exclude: ["error", "warn"] }],
        ],
      },
    },
  };
};
