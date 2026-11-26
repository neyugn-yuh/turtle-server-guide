/**
 * Materials (nguyên liệu) of Sky Rèn, called by sync-ren.mjs, written to ren-materials.json.
 *
 * ren-equipment.mjs reads the /ecraft recipes and hands over the materials a recipe makes or uses, with the recipes that
 * make each one and the items they go into. This adds where a material comes from besides crafting, from what the dungeon
 * and chest data of the same run already hold (matched by the player-facing name):
 *   drops   a dungeon mob drops it, or its killer / the players nearby get it
 *   chests  a reward chest gives it
 * A material that no recipe makes or uses is not a crafting material and is not listed.
 *
 * The config does not say which kind a material is, so the groups of the pages are kept here. A material that is in no group stops
 * the sync (like scripts/sync-materials.mjs does for Sky Dungeon): put it in a group below, or in HIDDEN to keep it off the wiki.
 */

/** Materials left off the wiki on purpose (the Dragon Ball event gems, the Trung Thu items). */
const HIDDEN = new Set(['NGOCRONG1SAO', 'NGOCRONG2SAO', 'NGOCRONG3SAO', 'NGOCRONG4SAO', 'NGOCRONG5SAO', 'NGOCRONG6SAO', 'NGOCRONG7SAO', 'NGOCRONGHOANGKIM', 'NGUYETHON', 'NGUYETTHACH']);

/** The pages of the materials section: id (also the file name of the page), title, material ids (as in MMOItems/item/material.yml). */
export const MATERIAL_GROUPS = [
	{ id: 'nong-san', title: 'Nông sản', ids: ['BINGOKHONGLO', 'DUAHAUKHONGLO', 'KIENROMKHONGLO', 'GOSOIKHONGLO', 'GOBACHDUONGKHONGLO', 'GOVANSAMKHONGLO'] },
	{
		id: 'khoang-san',
		title: 'Khoáng sản',
		ids: ['KHOITHANKHONGLO', 'KHOISATKHONGLO', 'KHOIVANGKHONGLO', 'KHOIKIMCUONGKHONGLO', 'KHOILUCBAOKHONGLO', 'KIMCUONGDUC', 'VANGTHOIONGANH', 'SONGSAT1', 'SONGSAT2', 'SONGSAT3'],
	},
	{
		id: 'dungeon',
		title: 'Dungeon',
		ids: [
			'DANANGCAP', 'MANHDANANGCAP', 'LINHHONBANGGIA', 'MATNHENYEUTINH', 'NAMMAHAITAC', 'NAMMAHAITAC640',
			'XUONGDIANGUC', 'XUONGNHENYEUTINH', 'XUONGPHUTHUYDEN', 'XUONGRONGKHONGGIAN',
			'MANHKHIENBANGGIA', 'MANHKHIENDIANGUC', 'MANHKHIENPHUTHUYDEN', 'MANHKHIENTHIENHA', 'MANHKHIENYEUTINH',
			'MANHKHIENBANGGIA1280', 'MANHKHIENDIANGUC1280', 'MANHKHIENTHIENHA1280', 'MANHKHIENYEUTINH256', 'MANHKHIENPHUTHUYDEN640',
		],
	},
	{ id: 'khac', title: 'Khác', ids: ['DACUONGHOA', 'DANANGCAPRIU', 'DATHANTAI', 'BUIVANGPHEP', 'KESACHMATMA', 'DAURONG', 'TRAITIMQUAIVAT1', 'TRAITIMQUAIVAT2', 'TRAITIMQUAIVAT3'] },
];

/** Spawners that /ecraft makes but the spawner shop does not sell (entity -> name). */
const CRAFT_ONLY_SPAWNERS = { HORSE: 'Lồng Ngựa', HUSK: 'Lồng Husk' };

export function buildMaterials({ materials: all, dungeons, chests, spawners, warn, fail }) {
	// spawner recipes (/ecraft): the entity the recipe gives -> the name of the spawner in the shop
	const spawnerName = new Map([...Object.entries(CRAFT_ONLY_SPAWNERS), ...spawners.map((s) => [s.entity, s.name])]);
	const found = all.filter((m) => !HIDDEN.has(m.id));
	const groupOf = new Map(MATERIAL_GROUPS.flatMap((g) => g.ids.map((id) => [id, g.id])));
	const loose = found.filter((m) => !groupOf.has(m.id));
	if (loose.length) fail(`materials: ${loose.map((m) => `${m.id} (${m.name})`).join(', ')} not in a group of scripts/ren-materials.mjs (MATERIAL_GROUPS), add it to a group or to HIDDEN`);
	// "X640 Nấm" is a stack of 640: written as the config does, with a lower case x
	const materials = found.map((m) => ({ ...m, category: groupOf.get(m.id), name: m.name.replace(/^X(\d+)\s/, 'x$1 ') }));
	const byName = new Map();
	for (const m of materials) {
		if (byName.has(m.name)) warn(`materials: two materials are called "${m.name}" (drops and chests are matched to the first)`);
		else byName.set(m.name, m);
	}
	const drops = new Map(materials.map((m) => [m.id, []]));
	const inChests = new Map(materials.map((m) => [m.id, []]));
	const add = (list, entry, where) => {
		const material = byName.get(entry.name);
		if (!material || entry.type !== 'item') return;
		list.get(material.id).push(where);
	};

	for (const dungeon of dungeons) {
		for (const mob of dungeon.mobs) {
			const where = (via, e) => ({ dungeon: dungeon.n, mob: mob.name, boss: mob.kind === 'boss', via, min: e.min, max: e.max, chance: e.chance });
			for (const e of mob.drops) add(drops, e, where('drop', e));
			for (const e of mob.killer) add(drops, e, where('killer', e));
			for (const group of mob.nearby) for (const e of group.rewards ?? []) add(drops, e, where('nearby', e));
		}
	}
	for (const chest of chests) {
		for (const e of chest.rewards) {
			if (e.type !== 'item') continue;
			const material = byName.get(e.name);
			if (material) inChests.get(material.id).push({ chest: chest.id, name: chest.name, kind: chest.kind, min: e.min, max: e.max, chance: e.chance });
		}
	}

	const usedByOf = (m) =>
		m.usedBy
			.map((u) => {
				if (u.kind !== 'spawner') return u;
				const name = spawnerName.get(u.entity);
				if (!name) return void warn(`materials: ${m.id} is used for a ${u.entity} spawner that the spawner shop does not sell (left out)`);
				return { name, kind: 'spawner' };
			})
			.filter(Boolean)
			.sort((a, b) => a.name.localeCompare(b.name, 'vi'));
	const unique = (list) => [...new Map(list.map((x) => [JSON.stringify(x), x])).values()];
	return {
		groups: MATERIAL_GROUPS.map(({ id, title }) => ({ id, title })),
		materials: materials
			.map((m) => ({ ...m, usedBy: usedByOf(m), drops: unique(drops.get(m.id)), chests: unique(inChests.get(m.id)) }))
			.sort((a, b) => a.name.localeCompare(b.name, 'vi')),
	};
}
