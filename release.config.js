const config = {
  branches: ['main'],
  repositoryUrl: 'https://github.com/nicommerce/commerce-node.git',
  plugins: [
    [
      '@semantic-release/commit-analyzer',
      {
        preset: 'angular',
        releaseRules: [
          // Major changes
          { breaking: true, release: 'major' },
          { type: 'feat', scope: 'sdk', release: 'major' },

          // Minor changes
          { type: 'feat', release: 'minor' },
          { type: 'update', scope: 'deps', release: 'minor' },

          // Patch changes
          { type: 'fix', release: 'patch' },
          { type: 'docs', scope: 'readme', release: 'patch' },
          { type: 'perf', release: 'patch' },
          { type: 'refactor', release: 'patch' },

          // No release
          { type: 'test', release: false },
          { type: 'chore', release: false },
        ],
        parserOpts: {
          noteKeywords: ['BREAKING CHANGE', 'BREAKING CHANGES'],
        },
      },
    ],
    [
      '@semantic-release/release-notes-generator',
      {
        preset: 'angular',
        presetConfig: {
          types: [
            { type: 'feat', section: '✨ Features' },
            { type: 'fix', section: '🐛 Bug Fixes' },
            { type: 'perf', section: '⚡️ Performance' },
            { type: 'refactor', section: '♻️ Refactors' },
            { type: 'docs', section: '📝 Documentation' },
            { type: 'test', section: '✅ Tests' },
            { type: 'chore', section: '🔧 Maintenance' },
          ],
        },
      },
    ],
    [
      '@semantic-release/changelog',
      {
        changelogFile: 'CHANGELOG.md',
        changelogTitle: '# Coinbase Commerce SDK Changelog',
      },
    ],
    '@semantic-release/npm',
    [
      '@semantic-release/git',
      {
        assets: ['package.json', 'CHANGELOG.md'],
        message:
          'chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}',
      },
    ],
    '@semantic-release/github',
  ],
};

module.exports = config;
