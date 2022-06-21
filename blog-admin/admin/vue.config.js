// module.exports = {
//   productionSourceMap: false,
//   devServer: {
//     port: 8000,
//     proxy: {
//       "/api": {
//         target: "http://18.222.123.50:3000",
//         changeOrigin: true,
//         pathRewrite: {
//           "^/api": ""
//         }
//       }
//     },
//     disableHostCheck: true
//   },
//   chainWebpack: config => {
//     config.resolve.alias.set("@", resolve("src"));
//   }
// };

// const path = require("path");
// function resolve(dir) {
//   return path.join(__dirname, dir);
// }
