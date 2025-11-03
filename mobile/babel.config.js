module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Reanimated plugin deve ser o último
      'react-native-reanimated/plugin',
    ],
  };
};
