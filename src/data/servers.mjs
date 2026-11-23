/**
 * The servers this guide covers. Every server has its own section of the site, its own list of systems
 * and its own copy of the pages, because the plugins and the numbers differ from server to server.
 *
 * slug:        first part of the address (/<slug>/...) and folder under src/content/docs/ and src/content/docs/en/
 * title:       the name players know the server by, one per language
 * description: one sentence per language for the card on the home page
 * guides:      slugs from src/data/guides.mjs, in display order; their pages live in
 *              src/content/docs/<slug>/<guide>/ (Vietnamese) and src/content/docs/en/<slug>/<guide>/ (English)
 *
 * Adding a server: see "Adding a server" in README.md.
 */
export const servers = [
	{
		slug: 'sky-dungeon',
		title: { vi: 'Sky Dungeon', en: 'Sky Dungeon' },
		description: {
			vi: 'Hướng dẫn minion trên máy chủ Sky Dungeon: đặt minion, cho nhiên liệu, nâng cấp và lấy sản phẩm.',
			en: 'Minion guide for the Sky Dungeon server: place minions, add fuel, upgrade and collect products.',
		},
		guides: ['minions'],
	},
	// <-- add new servers here
];
