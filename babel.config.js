module.exports = function babelConfig(api) {
  api.cache(true);

  return {
    presets: [
      [
        '@babel/preset-env',
        {
          useBuiltIns: 'entry'
        }
      ],
      '@babel/preset-react'
    ],
    plugins: [
      ['@babel/plugin-proposal-decorators', { legacy: true }],
      ['@babel/plugin-proposal-class-properties', { loose: true }],

      'react-loadable/babel',
      '@babel/plugin-syntax-dynamic-import',

      'react-hot-loader/babel',
      ['@babel/plugin-transform-runtime', { regenerator: true }]
    ],
    env: {
      test: {
        plugins: [
          'babel-plugin-dynamic-import-node'
        ]
      }
    }
  };
};
