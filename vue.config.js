module.exports = {
  transpileDependencies: ['vuetify'],
  publicPath: '/',
  configureWebpack: {
    devtool: 'source-map',
  },
  pwa: {
    manifestOptions: {
      name: 'DU Map',
      short_name: 'DU Map',
      background_color: '#ffffff',
    },
  },
};
