module.exports = {
  configureWebpack: {
    devtool: 'source-map',
  },
  devServer: {
    port: 8080,
    proxy: {
      '/api/': {
        target: process.env.VUE_APP_BACKEND_ROUTE_LOCAL,
        changeOrigin: 'true',
      },
    },
  },
};
