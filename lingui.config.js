const { formatter } = require('@lingui/format-json')

// filepath: lingui.config.js
module.exports = {
  catalogs: [
    {
      // 关键改动：明确指定源文件是 .json
      path: '<rootDir>/locale/{locale}',
      include: ['<rootDir>/src'],
      exclude: ['**/node_modules/**'],
    },
  ],
  fallbackLocales: {},
  format: formatter({ style: 'minimal' }),
  formatOptions: { origins: false, lineNumbers: false },
  sourceLocale: 'en',
  locales: ['en', 'ja', 'zh_CN', 'zh_TW'],
  orderBy: 'messageId',
  pseudoLocale: '',
  rootDir: '.',
  runtimeConfigModule: {
    i18n: ['@lingui/core', 'i18n'],
    Trans: ['@lingui/react', 'Trans'],
  },
}
