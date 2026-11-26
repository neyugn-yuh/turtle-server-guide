/**
 * Spawner shop of Sky Rèn, called by sync-ren.mjs, written to spawners.json.
 *
 * Files read (relative to the plugins folder of the server repo):
 *   DeluxeMenus/gui_menus/shopSpawner.yml     the spawners on sale: name, what they drop, EXP, price of x1 and x10
 *                                             (the price is read from the `eco take` command, not from the lore)
 *   TurtleIsland/contribution.yml             the contribution points an island gets for handing in each spawner
 *
 * A fact that cannot be read truthfully is left empty and reported through warn(), never guessed.
 */

export function buildSpawners({ readYaml, stripCodes, pretty, warn, fail }) {
	// ---------- island contribution config (only the spawner points are used here) ----------
	const config = readYaml('TurtleIsland/contribution.yml');
	const rawItems = config.items ?? [];
	if (!rawItems.length) fail('TurtleIsland/contribution.yml: items is empty');
	const contribution = new Map(); // SPAWNER entity (upper case) -> { points, dailyLimit }
	for (const item of rawItems) {
		const [kind, ...rest] = String(item.id).split(':');
		if (kind === 'SPAWNER') contribution.set(rest.join(':').toUpperCase(), { points: item.points, dailyLimit: item['daily-limit'] ?? null });
	}

	// ---------- spawner shop ----------
	const shopItems = readYaml('DeluxeMenus/gui_menus/shopSpawner.yml').items ?? {};
	const money = (n) => Number(n);
	const spawners = [];
	for (const [key, entry] of Object.entries(shopItems)) {
		if (entry.material !== 'SPAWNER') continue;
		const where = `shopSpawner.yml: ${key}`;
		const lore = (entry.lore ?? []).map((line) => stripCodes(line).replace(/^[\s▪]+/u, '').trim()).filter(Boolean);
		const field = (re) => lore.map((line) => line.match(re)).find(Boolean)?.[1];
		const left = (entry.left_click_commands ?? []).join('\n');
		const right = (entry.right_click_commands ?? []).join('\n');
		const give = (commands) => commands.match(/wstacker give %player_name% spawner (\S+) (\d+)/);
		const one = give(left);
		const ten = give(right);
		const entity = one?.[1]?.toUpperCase();
		if (!entity || one[2] !== '1' || !ten || ten[1].toUpperCase() !== entity || ten[2] !== '10') {
			warn(`${where}: cannot read the spawner given by x1 / x10, left out`);
			continue;
		}
		const price = left.match(/eco take %player_name% (\d+)/)?.[1];
		const price10 = right.match(/eco take %player_name% (\d+)/)?.[1];
		if (!price || !price10) {
			warn(`${where}: cannot read the price, left out`);
			continue;
		}
		if (money(price10) !== money(price) * 10) warn(`${where}: the price of x10 is not ten times the price of x1`);
		const exp = field(/^EXP cơ bản:\s*([\d.]+)/);
		const expLooting = field(/^Rìu vàng Looting 50:\s*([\d.]+)/);
		const drops = field(/^Đồ rơi:\s*(.+)$/);
		if (exp === undefined) warn(`${where}: no base EXP line`);
		if (expLooting === undefined) warn(`${where}: no Looting 50 EXP line`);
		if (drops === undefined) warn(`${where}: no drops line`);
		const island = contribution.get(entity);
		spawners.push({
			slot: entry.slot,
			id: String(key).toLowerCase(),
			entity,
			name: pretty(String(entry.display_name).replace(/ꜱ/g, 's')),
			drops: drops ?? null,
			exp: exp === undefined ? null : Number(exp),
			expLooting: expLooting === undefined ? null : Number(expLooting),
			price: money(price),
			price10: money(price10),
			islandPoints: island?.points ?? null,
			islandDailyLimit: island ? island.dailyLimit : null,
		});
	}
	spawners.sort((a, b) => a.slot - b.slot);
	const spawnerData = { spawners: spawners.map(({ slot, ...spawner }) => spawner) };
	return { spawnerData };
}
