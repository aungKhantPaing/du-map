module.exports = {
  transpileDependencies: ['vuetify'],
  publicPath: '/',

  configureWebpack: {
    devtool: 'source-map',
  },

  pwa: {
    workboxOptions: {
      skipWaiting: true,
    },
    manifestOptions: {
      name: 'DU Map',
      short_name: 'DU Map',
      background_color: '#ffffff',
    },
  },

  pluginOptions: {
    prerenderSpa: {
      registry: undefined,
      renderRoutes: ['/'],
      useRenderEvent: true,
      headless: true,
      onlyProduction: true,
    },
  },
};
