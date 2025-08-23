const js = require('@eslint/js');

module.exports = [
  {
    ignores: ['coverage/**', 'node_modules/**']
  },
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 5,
      sourceType: 'script',
      globals: {
        // Node.js globals
        require: 'readonly',
        module: 'readonly',
        exports: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        process: 'readonly',
        console: 'readonly',
        Buffer: 'readonly',
        global: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
        setImmediate: 'readonly',
        clearImmediate: 'readonly'
      }
    },
    rules: {
      // Basic error prevention
      'no-undef': 'error',
      'no-unused-vars': ['error', { 'args': 'none' }],
      'no-console': 'off',
      
      // Style rules (relaxed for legacy code)
      'quotes': ['warn', 'single', { 'allowTemplateLiterals': true }],
      'semi': ['warn', 'always'],
      'indent': ['warn', 2],
      'no-trailing-spaces': 'warn',
      'eol-last': 'warn',
      
      // Disable rules that conflict with ES5 style
      'prefer-const': 'off',
      'prefer-arrow-callback': 'off',
      'object-shorthand': 'off',
      'prefer-template': 'off'
    }
  },
  {
    files: ['tests/**/*.js'],
    languageOptions: {
      globals: {
        // Mocha globals
        describe: 'readonly',
        it: 'readonly',
        before: 'readonly',
        after: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly'
      }
    }
  }
];