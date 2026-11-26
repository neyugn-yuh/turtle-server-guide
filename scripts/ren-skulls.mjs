/**
 * Magic skulls (sọ phép) of Sky Rèn, called by sync-ren.mjs, written to skulls.json.
 *
 * Files read (relative to the plugins folder of the server repo):
 *   ItemAbility/items.yml            the skulls: name, rank line, the four stats (Abilities) and the number of Lửa phép slots (GemSlot)
 *   EpicCraftCustom/craft/sophep/*   how a skull is crafted (/ecraft), handed over by ren-equipment.mjs as `recipes` (key: upper case id)
 *
 * The picture of a skull is its head texture (`Texture`, the base64 value of a minecraft-heads.com head): the hash of the skin it
 * points to is kept as `texture`, and scripts/fetch-skull-icons.mjs draws the head into public/skulls/<texture>.png.
 *
 * The stats come from the abilities the plugin really applies; the lore the players read is checked against them and any
 * difference is reported. A skull whose lore says Halloween is an event skull.
 */
const STATS = [
	['AttackDamage', 'damage'],
	['AttackSpeed', 'attackSpeed'],
	['MaxHealth', 'health'],
	['Armor', 'armor'],
];

/** The hash of the skin a head texture (base64 JSON with the skin url) points to, or null. */
function skinHash(value) {
	try {
		const url = JSON.parse(Buffer.from(String(value), 'base64').toString('utf8'))?.textures?.SKIN?.url ?? '';
		return /\/texture\/([0-9a-f]{16,})$/.exec(url)?.[1] ?? null;
	} catch {
		return null;
	}
}

export function buildSkulls({ readYaml, stripCodes, pretty, recipes, warn, fail }) {
	// the /ecraft category a recipe is in is named by EpicCraftCustom/craft/categories.yml
	const categories = readYaml('EpicCraftCustom/craft/categories.yml');
	const categoryName = (id) => pretty(categories[id]?.DisplayName ?? '') || (/^dungeon(\d+)$/.exec(id) ? `Dungeon ${/(\d+)/.exec(id)[1]}` : id);
	// the same recipe in two categories is one recipe; a different one is shown too
	const uniqueRecipes = (list) => [...new Map(list.map(({ category, ...r }) => [JSON.stringify(r), { ...r, category: categoryName(category) }])).values()];
	const items = readYaml('ItemAbility/items.yml').Items ?? {};
	if (!Object.keys(items).length) fail('ItemAbility/items.yml: Items is empty');
	const plain = (line) => stripCodes(line).trim();
	const skulls = [];
	for (const [id, raw] of Object.entries(items)) {
		const where = `skull ${id}`;
		const abilities = Object.fromEntries(Object.values(raw.Abilities?.Ability ?? {}).map((a) => [a.Type, a]));
		const stats = {};
		for (const [type, key] of STATS) {
			const a = abilities[type];
			if (!a) {
				warn(`${where}: no ${type} ability (left out)`);
				continue;
			}
			// MaxHealth is in half hearts (value 7 is 3.5 Tim), the others are as written; AttackSpeed is a percentage
			stats[key] = key === 'health' ? Number(a.Value) / 2 : Number(a.Value);
		}
		if (Object.keys(stats).length !== STATS.length) continue;
		const lore = (raw.Lore ?? []).map(plain).filter(Boolean);
		// the lore lines the players read must say the same as the abilities
		const loreNum = (re) => {
			const m = lore.map((l) => re.exec(l)).find(Boolean);
			return m ? Number(m[1]) : null;
		};
		const loreStats = { damage: loreNum(/^\+([\d.]+) Sát Thương/), attackSpeed: loreNum(/^\+([\d.]+)% Tốc Độ Đánh/), health: loreNum(/^\+([\d.]+) Tim/), armor: loreNum(/^\+([\d.]+) Giáp/) };
		for (const [key, value] of Object.entries(loreStats)) if (value !== null && value !== stats[key]) warn(`${where}: the lore says ${key} ${value}, the ability gives ${stats[key]}`);

		// "&2(2♦)" or "[4]" after the name is the level of the skull; the rest of the name loses its decoration (⌘ ﹝ ๖ 彡 ...)
		const nameText = stripCodes(raw.Name ?? '');
		const level = /\(\s*(\d+)\s*♦\s*\)/.exec(nameText)?.[1] ?? /\[\s*(\d+)\s*\]/.exec(nameText)?.[1] ?? null;
		const diamonds = /♦/.test(nameText);
		const latin = [...nameText.replace(/\(\s*\d+\s*♦\s*\)|\[\s*\d+\s*\]/g, ' ')]
			.map((c) => (/[A-Za-z0-9]/.test(c) || /\s/.test(c) || (c.codePointAt(0) >= 0xc0 && c.codePointAt(0) <= 0x24f) || (c.codePointAt(0) >= 0x1e00 && c.codePointAt(0) <= 0x1eff) ? c : ' '))
			.join('');
		const family = pretty(latin);
		if (!family) {
			warn(`${where}: no readable name (left out)`);
			continue;
		}
		// the line after the four stats is the rank line ("◆ ◆ ◆ HIẾM ◆ ◆ ◆"); an event skull starts with its Halloween tag instead
		const event = lore.some((l) => /halloween/i.test(pretty(l)));
		const lastStat = Math.max(...lore.map((l, i) => (/^\+[\d.]+%? (Sát Thương|Tốc Độ Đánh|Tim|Giáp)/.test(l) ? i : -1)));
		const rank = event || lastStat < 0 ? '' : pretty((lore[lastStat + 1] ?? '').replace(/\(\s*\d+\s*♦\s*\)/g, ' '));
		const texture = skinHash(raw.Texture);
		if (!texture) warn(`${where}: Texture is not a head texture (no picture)`);
		skulls.push({
			id: id.toLowerCase(),
			texture,
			name: level === null ? family : diamonds ? `${family} (${level}♦)` : `${family} ${level}`,
			family,
			level: level === null ? null : Number(level),
			diamonds,
			rank,
			event,
			gemSlots: raw.GemSlot === undefined ? null : Number(raw.GemSlot),
			stats,
			recipes: uniqueRecipes(recipes[id.toUpperCase()] ?? []),
		});
	}
	if (!skulls.length) fail('no magic skulls found in ItemAbility/items.yml');
	return { skulls };
}
