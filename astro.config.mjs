// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
	site: 'https://aiusagi.com',
	trailingSlash: 'ignore',
	devToolbar: { enabled: false },
	integrations: [mdx(), sitemap()],
	markdown: {
		shikiConfig: { theme: 'vesper' },
	},
	vite: {
		plugins: [tailwindcss()],
	},
});
