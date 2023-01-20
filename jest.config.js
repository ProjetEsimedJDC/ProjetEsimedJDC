const config = {
    globalSetup: './tests/core/setup.js',
    globalTeardown: './tests/core/teardown.js',
    globals: {
      apiUrl: 'http://localhost:3000',
    },
  };
  
  module.exports = config;