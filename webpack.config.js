const path = require('path');

module.exports = {
  entry: './public/scripts/script.js',
  mode: 'development',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'public/dist'),
  },
  watch: true
};