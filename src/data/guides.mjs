/**
 * The in-game systems covered by this guide, in display order.
 * This list drives the sidebar (astro.config.mjs) and the landing-page cards (GuideCards.astro),
 * so adding a guide means adding one entry here plus its page folders.
 *
 * slug:        folder name under src/content/docs/guides/ and src/content/docs/en/guides/
 * name:        the plugin's brand name (not translated)
 * title:       what players call the system, one per language (sidebar group and card title)
 * description: one sentence per language for the landing-page card
 */
export const guides = [
	{
		slug: 'turtle-hoes',
		name: 'TurtleHoes',
		title: { vi: 'Cuốc thu hoạch', en: 'Harvester hoes' },
		description: {
			vi: 'Cách dùng cuốc thu hoạch ở khu farm: nâng cấp cuốc, phù phép, sự kiện thu hoạch và bảng xếp hạng.',
			en: 'How to use harvester hoes in the farm zones: hoe upgrades, enchants, harvest events and leaderboards.',
		},
	},
	{
		slug: 'turtle-backpack',
		name: 'TurtleBackpack',
		title: { vi: 'Ba lô', en: 'Backpack' },
		description: {
			vi: 'Ba lô ảo nhận đồ từ công cụ của bạn: rút đồ, bán, tự bán và nâng cấp sức chứa.',
			en: 'The virtual backpack that receives what your tools drop: withdraw, sell, auto-sell and upgrade its capacity.',
		},
	},
	{
		slug: 'turtle-farm-pets',
		name: 'TurtleFarmPets',
		title: { vi: 'Pet nông trại', en: 'Farm pets' },
		description: {
			vi: 'Nuôi pet để tăng chỉ số cho bạn và bắn quái xuất hiện khi bạn farm.',
			en: 'Raise pets that boost your stats and shoot the monsters that appear while you farm.',
		},
	},
	{
		slug: 'turtle-lands',
		name: 'TurtleLands',
		title: { vi: 'Chiếm đất', en: 'Land claims' },
		description: {
			vi: 'Chiếm đất theo chunk, mời thành viên, phân vai trò, đặt cờ và dùng ngân hàng land.',
			en: 'Claim land by chunk, invite members, assign roles, set flags and use the land bank.',
		},
	},
	{
		slug: 'turtle-minions',
		name: 'TurtleMinions',
		title: { vi: 'Minion', en: 'Minions' },
		description: {
			vi: 'Đặt minion trên đảo để tự sản xuất kể cả khi bạn offline, cho nhiên liệu, nâng cấp và lấy sản phẩm.',
			en: 'Place minions on your island so they produce even while you are offline: fuel, upgrades and collecting.',
		},
	},
	// <-- add new guides here
];
