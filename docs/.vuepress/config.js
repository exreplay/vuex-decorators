module.exports = {
  title: 'Vuex Decorators',
  description: 'Official documentation for @averjs/vuex-decorators',
  themeConfig: {
    repo: 'exreplay/vuex-decorators',
    displayAllHeaders: true,
    sidebarDepth: 1,
    nav: [
      { text: 'Guide', link: '/guide/' },
      { text: 'Release Notes', link: 'https://github.com/exreplay/vuex-decorators/releases' }
    ],
    sidebar: {
      '/': [
        '/',
        '/guide/',
        {
          title: 'API',
          collapsable: false,
          sidebarDepth: 0,
          children: [
            '/api/vuex-module/'
          ]
        },
        {
          title: 'Decorators',
          path: '/decorators/',
          collapsable: false,
          sidebarDepth: 0,
          children: [
            '/decorators/vuex-class/',
            '/decorators/getter/',
            '/decorators/mutation/',
            '/decorators/action/',
            '/decorators/has-getter/',
            '/decorators/has-getter-and-mutation/'
          ]
        },
        {
          title: 'Type Safety',
          path: '/type-safety/',
          collapsable: false,
          sidebarDepth: 0
        }
      ]
    }
  }
}