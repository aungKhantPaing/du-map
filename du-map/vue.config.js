module.exports = {
  transpileDependencies: ['vuetify'],
  publicPath: process.env.NODE_ENV === 'production' ? '/production-sub-path/' : '/',
  configureWebpack: {
    devtool: 'source-map', // for debugging in VS Code (https://vuejs.org/v2/cookbook/debugging-in-vscode.html#Displaying-Source-Code-in-the-Browser)
  },
};
