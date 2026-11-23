// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightLinksValidator from 'starlight-links-validator';

import { guides } from './src/data/guides.mjs';

// One sidebar group per guide in src/data/guides.mjs. The pages of a group are discovered from
// `src/content/docs/guides/<slug>/` (Vietnamese) and `src/content/docs/en/guides/<slug>/` (English).
const guideGroups = guides.map(({ slug, title }) => ({
	label: title.vi,
	translations: { en: title.en },
	collapsed: true,
	items: [{ autogenerate: { directory: `guides/${slug}` } }],
}));

// https://astro.build/config
export default defineConfig({
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
					label: 'Hệ thống trong game',
					translations: { en: 'In-game systems' },
					items: guideGroups,
				},
			],
		}),
	],
});
