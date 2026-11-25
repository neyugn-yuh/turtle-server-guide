/**
 * Catalog of the in-game systems: the player-facing name and blurb of each. Plugin names are never shown to players.
 * Which systems a server has is decided in src/data/servers.mjs, which also drives the sidebar (astro.config.mjs)
 * and the cards (GuideCards.astro).
 *
 * slug:        the folder name of the system's pages inside a server folder
 * title:       what players call the system (sidebar group and card title)
 * description: one sentence for the card of the server's start page
 * landing:     the page (file name without extension) the card opens: the system's first page in the sidebar
 */
export const guides = [
	{
		slug: 'minions',
		title: 'Minion',
		description: 'Đặt minion trên đảo để tự sản xuất kể cả khi bạn offline, cho nhiên liệu, nâng cấp và lấy sản phẩm.',
		landing: 'menus',
	},
	{
		slug: 'island-upgrades',
		title: 'Nâng cấp đảo',
		description: 'Sáu loại nâng cấp đảo: diện tích, thành viên, slot minion, máy tạo quặng, chỉ số dungeon và xưởng rèn.',
		landing: 'menus',
	},
	{
		slug: 'materials',
		title: 'Nguyên liệu',
		description: 'Nguyên liệu khoáng sản, nông sản và dungeon: chế tạo từ gì và dùng để làm gì.',
		landing: 'khoang-san',
	},
	{
		slug: 'spawners',
		title: 'Spawner',
		description: 'Danh sách spawner: mob nào rơi gì với tỉ lệ nào, và nâng cấp spawner cần gì.',
		landing: 'list',
	},
	// <-- add new guides here
];
