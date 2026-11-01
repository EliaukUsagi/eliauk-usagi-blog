// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
	site: 'https://aiusagi.com',
	trailingSlash: 'ignore',
	devToolbar: { enabled: false },
	// 悬停即预取站内页面，配合跨文档 View Transitions 让跳转几乎无等待
	prefetch: { prefetchAll: true, defaultStrategy: 'hover' },
	integrations: [mdx(), sitemap()],
	markdown: {
		shikiConfig: { themes: { light: 'github-light', dark: 'github-dark-dimmed' } },
	},
	vite: {
		plugins: [tailwindcss()],
	},
});
