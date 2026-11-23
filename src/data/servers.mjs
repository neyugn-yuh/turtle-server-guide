/**
 * The servers this guide covers. Every server has its own section of the site, its own list of systems
 * and its own copy of the pages, because the plugins and the numbers differ from server to server.
 *
 * slug:        first part of the address (/<slug>/...) and folder under src/content/docs/
 * title:       the name players know the server by
 * description: one sentence for the card on the home page
 * guides:      slugs from src/data/guides.mjs, in display order; their pages live in src/content/docs/<slug>/<guide>/
 *
 * Adding a server: see "Thêm máy chủ" in README.md.
 */
export const servers = [
	{
		slug: 'sky-dungeon',
		title: 'Sky Dungeon',
		description: 'Hướng dẫn minion trên máy chủ Sky Dungeon: đặt minion, cho nhiên liệu, nâng cấp và lấy sản phẩm.',
		guides: ['minions'],
	},
	// <-- add new servers here
];
