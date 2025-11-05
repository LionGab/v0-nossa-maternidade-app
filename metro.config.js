// Metro bundler config - Otimizado para React Native e Web
// Metro é usado tanto para mobile quanto para web no Expo

const { getDefaultConfig } = require("expo/metro-config");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Configurações para web
config.resolver = {
  ...config.resolver,
  // Extensões de arquivo (inclui web)
  sourceExts: [...config.resolver.sourceExts, "mjs", "cjs"],
  // Asset extensions
  assetExts: [
    ...config.resolver.assetExts.filter((ext) => ext !== "svg"),
    "db", // SQLite
  ],
};

// Transformer para SVGs (funciona em mobile e web)
config.transformer = {
  ...config.transformer,
  babelTransformerPath: require.resolve("react-native-svg-transformer"),
  getTransformOptions: async () => ({
    transform: {
      experimentalImportSupport: false,
      inlineRequires: true,
    },
  }),
};

// Configurações de cache para web
config.cacheStores = [
  ...(config.cacheStores || []),
];

module.exports = config;

