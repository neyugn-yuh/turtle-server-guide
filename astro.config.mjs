// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightLinksValidator from 'starlight-links-validator';

import { satteri } from '@astrojs/markdown-satteri';
import { guiMenus } from './src/plugins/gui-menus.mjs';
import { guides } from './src/data/guides.mjs';
import { servers } from './src/data/servers.mjs';

// One sidebar group per server (src/data/servers.mjs). Inside it: the server's start page, then one group per system. The pages of a system are discovered from `src/content/docs/<server>/<system>/`
// (Vietnamese) and `src/content/docs/en/<server>/<system>/` (English).
const serverGroups = servers.map((server) => ({
	label: server.title.vi,
	translations: { en: server.title.en },
	collapsed: true,
	items: [
		{ slug: server.slug },
		...server.guides.map((slug) => {
			const guide = guides.find((g) => g.slug === slug);
			if (!guide) throw new Error(`Server "${server.slug}" lists unknown system "${slug}"`);
			return {
				label: guide.title.vi,
				translations: { en: guide.title.en },
				collapsed: true,
				items: [{ autogenerate: { directory: `${server.slug}/${slug}` } }],
			};
		}),
	],
}));

// https://astro.build/config
export default defineConfig({
	// Turns `![..](/gui/<lang>/<system>-<menu>.svg)` into an interactive menu (see src/plugins/gui-menus.mjs).
	markdown: { processor: satteri({ mdastPlugins: [guiMenus] }) },
	// Public address, used for the sitemap and absolute URLs.
	// Override with SITE_URL when the site moves to a custom domain.
	site: process.env.SITE_URL ?? 'https://turtle-server-guide.pages.dev',
	integrations: [
		starlight({
			title: 'Turtle Server Guide',
			logo: {
				light: './src/assets/logo-light.svg',
				dark: './src/assets/logo-dark.svg',
			},
			favicon: '/favicon.svg',
			defaultLocale: 'root',
			locales: {
				root: { label: 'Tiếng Việt', lang: 'vi' },
				en: { label: 'English', lang: 'en' },
			},
			social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/MineTurtleVN' }],
			plugins: [starlightLinksValidator()],
			// Opens the detail box when a reader hovers, taps or focuses a slot of a menu.
			head: [{ tag: 'script', attrs: { src: '/gui-viewer.js', defer: true } }],
			customCss: [
				// Self-hosted fonts (no Google Fonts requests). Vietnamese needs the `vietnamese` subset.
				'@fontsource/inter/latin-400.css',
				'@fontsource/inter/latin-500.css',
				'@fontsource/inter/latin-600.css',
				'@fontsource/inter/latin-ext-400.css',
				'@fontsource/inter/latin-ext-500.css',
				'@fontsource/inter/latin-ext-600.css',
				'@fontsource/inter/vietnamese-400.css',
				'@fontsource/inter/vietnamese-500.css',
				'@fontsource/inter/vietnamese-600.css',
				'@fontsource/fira-code/latin-400.css',
				'@fontsource/fira-code/latin-ext-400.css',
				'./src/styles/custom.css',
				'./src/styles/gui.css',
			],
			// Code blocks: Emerald Base uses #1C1C1C panels with no shadow. Syntax colors come from GitHub's themes,
			// which keep comments readable on both backgrounds. UI colors still follow the Starlight tokens.
			expressiveCode: {
				themes: ['github-dark-default', 'github-light-default'],
				useStarlightUiThemeColors: true,
				styleOverrides: {
					borderRadius: '4px',
					codeBackground: 'var(--tw-code-bg)',
					codeFontSize: '0.8125rem',
					codeLineHeight: '1.7',
					frames: {
						editorBackground: 'var(--tw-code-bg)',
						terminalBackground: 'var(--tw-code-bg)',
						editorActiveTabBackground: 'var(--tw-code-bg)',
					},
				},
			},
			sidebar: [
				{
					label: 'Bắt đầu',
					translations: { en: 'Getting started' },
					items: [{ autogenerate: { directory: 'getting-started' } }],
				},
				{
					label: 'Máy chủ',
					translations: { en: 'Servers' },
					items: serverGroups,
				},
			],
		}),
	],
});
