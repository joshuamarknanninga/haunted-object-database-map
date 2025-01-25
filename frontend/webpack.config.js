// frontend/webpack.config.js

module.exports = {
    // ... other configurations
    module: {
      rules: [
        // ... other rules
        {
          test: /\.css$/i,
          use: [
            'style-loader',
            'css-loader',
            'postcss-loader', // Ensure this is included
          ],
        },
      ],
    },
  };
  