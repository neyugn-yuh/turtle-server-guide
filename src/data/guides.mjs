/**
 * Catalog of the in-game systems: the player-facing name and blurb of each. Plugin names are never shown to players.
 * Which systems a server has is decided in src/data/servers.mjs, which also drives the sidebar (astro.config.mjs)
 * and the cards (GuideCards.astro).
 *
 * slug:        the folder name of the system's pages inside a server folder
 * title:       what players call the system, one per language (sidebar group and card title)
 * description: one sentence per language for the landing-page card
 */
export const guides = [
	{
		slug: 'minions',
		title: { vi: 'Minion', en: 'Minions' },
		description: {
			vi: 'Đặt minion trên đảo để tự sản xuất kể cả khi bạn offline, cho nhiên liệu, nâng cấp và lấy sản phẩm.',
			en: 'Place minions on your island so they produce even while you are offline: fuel, upgrades and collecting.',
		},
	},
	// <-- add new guides here
];
