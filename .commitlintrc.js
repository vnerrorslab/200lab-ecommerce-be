module.exports = {
    extends: ['@commitlint/config-conventional'],
    rules: {
      'type-enum': [
        2,
        'always',
        [
          'feature', // New feature
          'fix', // Fixes
          'hot-fix', // Hot fix
          'improve', //Improve code
          'refactor', // Code restructuring
          'docs', // Add documents
          'chore', // Small change during development
          'style', // Fix the type of typeface, format, does not affect logic
          'test', // Write test
          'revert', // Revert again the previous commit
          'ci', // Change configuration CI/CD
          'build', // Build file
        ],
      ],
      'type-case': [2, 'always', 'lower-case'],
      'type-empty': [2, 'never'],
      'subject-empty': [2, 'never'],
      'subject-full-stop': [2, 'never', '.'],
      'header-max-length': [2, 'always', 72],
    },
  };