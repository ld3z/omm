import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'OhMyMathpad',
  description: 'A great tool',
  cleanUrls: true,
  lastUpdated: true,
  base: '/oh-my-mathpad/',

  markdown: {
    math: true
  },

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Install', link: '/install' }
    ],

    sidebar: [
      {
        text: 'Install',
        items: [
          { text: 'Chrome', link: '/chrome-install' },
          { text: 'Firefox', link: '/firefox-install' }
        ]
      }
    ],

    socialLinks: [
      {
        icon: 'github',
        link: 'https://github.com/ld3z/oh-my-mathpad'
      }
    ]
  }
})