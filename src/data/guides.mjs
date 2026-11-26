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
	{
		slug: 'equipment',
		title: 'Trang bị',
		description: 'Giáp, kiếm, cung và rìu theo từng tầng và phẩm cấp: chỉ số, kỹ năng, cách nhận và nâng cấp.',
		landing: 'armor',
	},
	{
		slug: 'dungeon',
		title: 'Hầm ngục',
		description: 'Các tầng hầm ngục: quái, tinh anh và boss, phần thưởng, và giá quay rương trang bị của từng tầng.',
		landing: 'floors',
	},
	{
		slug: 'island-top',
		title: 'Đua top đảo',
		description: 'Điểm cống hiến của đảo: vật phẩm nào được bao nhiêu điểm, săn quái, boss, hạn mức mỗi ngày và phần thưởng top.',
		landing: 'tong-quan',
	},
	{
		slug: 'dungeons',
		title: 'Dungeon',
		description: 'Sáu dungeon từ dễ đến cực khó: quái vật từng nơi, boss và phần thưởng chi tiết.',
		landing: 'dungeon-1',
	},
	{
		slug: 'chests',
		title: 'Rương quà',
		description: 'Các rương quà từ boss dungeon: mở ra có quà gì, tỉ lệ bao nhiêu và cách nhận.',
		landing: 'danh-sach',
	},
	{
		slug: 'enchants',
		title: 'Sách phép',
		description: 'Toàn bộ sách phép trên một trang: lọc theo nhóm và loại trang bị, xem tác dụng và chỉ số từng cấp.',
		landing: 'danh-sach',
	},
	{
		slug: 'gear',
		title: 'Trang bị',
		description: 'Các bộ giáp và hiệu ứng bộ, sọ phép, kiếm, rìu, cung, khiên, cúp: chỉ số và công thức chế tạo.',
		landing: 'bo-trang-bi',
	},
	// <-- add new guides here
];
