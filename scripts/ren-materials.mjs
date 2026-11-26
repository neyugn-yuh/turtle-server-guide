/**
 * Materials (nguyên liệu) of Sky Rèn, called by sync-ren.mjs, written to ren-materials.json.
 *
 * ren-equipment.mjs reads the /ecraft recipes and hands over the materials a recipe makes or uses, with the recipes that
 * make each one and the items they go into. This adds where a material comes from besides crafting, from what the dungeon
 * and chest data of the same run already hold (matched by the player-facing name):
 *   drops   a dungeon mob drops it, or its killer / the players nearby get it
 *   chests  a reward chest gives it
 * A material that no recipe makes or uses is not a crafting material and is not listed.
 */
export function buildMaterials({ materials: found, dungeons, chests, warn }) {
	// "X640 Nấm" is a stack of 640: written as the config does, with a lower case x
	const materials = found.map((m) => ({ ...m, name: m.name.replace(/^X(\d+)\s/, 'x$1 ') }));
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

	const unique = (list) => [...new Map(list.map((x) => [JSON.stringify(x), x])).values()];
	return {
		materials: materials
			.map((m) => ({ ...m, drops: unique(drops.get(m.id)), chests: unique(inChests.get(m.id)) }))
			.sort((a, b) => a.name.localeCompare(b.name, 'vi')),
	};
}
