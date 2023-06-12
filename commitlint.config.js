
/**
 * This file is part of 'York.IE React Base Starter Template'
 *
 * (c) 2023 'York.IE' <support@york.ie>
 *
 * --------------------------------------------------
 *
 * @module app.v1.commitlintConfig
 * @description This is a configuration file for commitlint, a tool used to enforce consistent commit message
 *              formatting in a project. The 'module.exports' object contains a set of rules that define the format
 *              and content of commit messages. These rules include things like the allowed types of commits
 *              ('feat', 'fix', etc.), the maximum length of the commit message header and body, and whether
 *              certain fields (like the subject or scope) can be empty. These rules help ensure that commit
 *              messages are clear, concise, and consistent across a project.
 * @author 'Nainik Mehta' <nainik@york.ie>
 * @version 1.0.0
 *
 * --------------------------------------------------
 */

// build: Changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm)
// chore: Regular or minor changes
// ci: Changes to our CI configuration files and scripts (example scopes: Travis, Circle, BrowserStack, SauceLabs)
// docs: Documentation only changes
// feat: A new feature
// fix: A bug fix
// hotfix: A hot fix apply
// perf: A code change that improves performance
// refactor: A code change that neither fixes a bug nor adds a feature
// style: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
// test: Adding missing tests or correcting existing tests

module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // Type of the commit must be present in commit messages
    'type-enum': [
      2,
      'always',
      [
        'build',
        'chore',
        'ci',
        'docs',
        'feat',
        'fix',
        'hotfix',
        'perf',
        'refactor',
        'revert',
        'style',
        'test',
        'translation',
        'security',
        'changeset',
      ],
    ],
    'subject-case': [
      2,
      'never',
      ['sentence-case', 'start-case', 'pascal-case', 'upper-case'],
    ],
    'subject-empty': [2, 'never'],
    'subject-full-stop': [2, 'never', '.'],
    'scope-empty': [2, 'never'],
    'scope-case': [2, 'always', 'lower-case'],
    'scope-enum': [
      2,
      'always',
      [
        'libraries',
        'components',
        'design',
        'pages',
        'utils',
        'tests',
        'config',
        'module',
      ],
    ],
    // header has value or fewer characters
    'header-max-length': [2, 'always', 100],
    'body-leading-blank': [1, 'always'],
    'body-max-line-length': [2, 'always', 100],
    // footer should have a leading blank line
    'footer-leading-blank': [1, 'always'],
    'footer-max-line-length': [2, 'always', 100],
    'type-case': [2, 'always', 'lower-case'],
    'type-empty': [2, 'never'],
  },
};

