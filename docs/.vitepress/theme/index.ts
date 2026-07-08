// https://vitepress.dev/guide/custom-theme
import { h } from 'vue'
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import AnnouncementBanner from './components/AnnouncementBanner.vue'
import CardGrid from './components/CardGrid.vue'
import DownloadButton from './components/DownloadButton.vue'
import LinkCard from './components/LinkCard.vue'
import './style.css'

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
    })
  },
  enhanceApp({ app, router, siteData }) {
    app.component('AnnouncementBanner', AnnouncementBanner)
    app.component('CardGrid', CardGrid)
    app.component('DownloadButton', DownloadButton)
    app.component('LinkCard', LinkCard)
  }
} satisfies Theme
