module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-empty': [0, 'always'],
    'subject-empty': [0, 'always'],
  },
};
