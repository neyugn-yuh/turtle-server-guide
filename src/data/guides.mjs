/**
 * Catalog of the in-game systems: the player-facing name and blurb of each. Plugin names are never shown to players.
 * Which systems a server has is decided in src/data/servers.mjs, which also drives the sidebar (astro.config.mjs)
 * and the cards (GuideCards.astro).
 *
 * slug:        the folder name of the system's pages inside a server folder
 * title:       what players call the system (sidebar group and card title)
 * description: one sentence for the card of the server's start page
 */
export const guides = [
	{
		slug: 'minions',
		title: 'Minion',
		description: 'Đặt minion trên đảo để tự sản xuất kể cả khi bạn offline, cho nhiên liệu, nâng cấp và lấy sản phẩm.',
	},
	{
		slug: 'island-upgrades',
		title: 'Nâng cấp đảo',
		description: 'Sáu loại nâng cấp đảo: diện tích, thành viên, slot minion, máy tạo quặng, chỉ số dungeon và xưởng rèn.',
	},
	// <-- add new guides here
];
