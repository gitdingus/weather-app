const path = require('path');

module.exports = {
  entry: src/index.js,
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'main.js',
  },
  optimization: {
    minimize: false,
  },
  rules: [
    {
      test: /\.css$/i,
      use: ["style-loader", "css-loader"],
    },
  ],
},