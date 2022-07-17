const { defineConfig } = require("@vue/cli-service");

module.exports = defineConfig({
  transpileDependencies: true,
  css: {
    loaderOptions: {
      scss: {
        additionalData: `@import "src/config/index.scss";`,
      },
    },
  },
  devServer: {
    port: 9000, // CHANGE YOUR PORT HERE!
  },
  chainWebpack: (config) => {
    config.module.rules.delete("svg");
  },
  configureWebpack: {
    module: {
      rules: [
        {
          test: /\.svg$/,
          loader: "vue-svg-loader",
        },
      ],
    },
  },
});
