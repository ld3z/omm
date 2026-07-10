import { defineConfig } from 'vitepress'
import container from 'markdown-it-container'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'OhMyMathpad',
  description: 'A great tool',
  cleanUrls: true,
  lastUpdated: true,
//  base: '/omm/',

  markdown: {
    math: true,
    config(md) {
      // ::: steps ... ::: turns the numbered list inside into styled steps
      md.use(container, 'steps', {
        render(tokens: any[], idx: number) {
          return tokens[idx].nesting === 1 ? '<div class="vp-steps">\n' : '</div>\n'
        }
      })
    }
  },

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Install', link: '/install' }
    ],

    sidebar: [
      {
        text: 'Home',
        link: '/',
        items: [
          {
            text: 'Chromium Browsers',
            items: [
              { text: 'Google Chrome', link: '/chrome-install' },
              { text: 'Brave', link: '/brave-install' },
              { text: 'Microsoft Edge', link: '/edge-install' },
              { text: 'Vivaldi', link: '/vivaldi-install' },
              { text: 'Opera', link: '/opera-install' }
            ]
          },
          {
            text: 'Other Browsers',
            items: [
              { text: 'Safari', link: '/safari-install' },
              { text: 'Mozilla Firefox', link: '/firefox-install' }
            ]
          }
        ]
      }
    ],

    socialLinks: [
      {
        icon: 'github',
        link: 'https://github.com/ld3z/omm'
      }
    ]
  }
})
