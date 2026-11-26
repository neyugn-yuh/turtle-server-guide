/**
 * Equipment of Sky Rèn (armor sets, swords, axes, bows, shields, pickaxes), called by sync-ren.mjs, written to gear.json.
 *
 * Files read (relative to the plugins folder of the server repo):
 *   SkyEnchants/armorsets/<set>.yml                the sets: name, the four armor pieces, the weapons that count for the set, the bonus by number of pieces
 *   MMOItems/item/{ao,mu,quan,giay,sword,riu,riufarm,bow,shield,cup}.yml   every item: name, stats, vanilla enchants, description
 *   EpicCraftCustom/craft/<group>/<recipe>.yml     how an item is crafted (/ecraft): the ingredients, money, success chance
 *   SkyEnchants/messages.yml                       the names of potion effects
 *
 * An item is listed when it belongs to a set or can be crafted; anything else (admin items, drops that have no recipe and no set) is not.
 * A set bonus or a recipe that cannot be written truthfully (an effect or an ingredient this script does not know) is left out
 * and reported through warn(), never guessed.
 */
import { readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const TYPES = {
	MU: { slot: 'helmet', label: 'Mũ' },
	AO: { slot: 'chestplate', label: 'Áo' },
	QUAN: { slot: 'leggings', label: 'Quần' },
	GIAY: { slot: 'boots', label: 'Giày' },
	SWORD: { slot: 'sword', label: 'Kiếm' },
	RIU: { slot: 'axe', label: 'Rìu' },
	RIUFARM: { slot: 'farm-axe', label: 'Rìu farm' },
	BOW: { slot: 'bow', label: 'Cung' },
	SHIELD: { slot: 'shield', label: 'Khiên' },
	CUP: { slot: 'pickaxe', label: 'Cúp' },
};
const ARMOR_SLOTS = ['helmet', 'chestplate', 'leggings', 'boots'];

const VANILLA = {
	arrow: 'Mũi tên', blaze_rod: 'Que lửa', bone: 'Xương', book: 'Sách', bookshelf: 'Kệ sách', carrot: 'Cà rốt', cod: 'Cá tuyết', coal_block: 'Khối Than',
	diamond: 'Kim cương', diamond_block: 'Khối Kim Cương', emerald_block: 'Khối Ngọc Lục Bảo', ender_eye: 'Mắt Ender', fermented_spider_eye: 'Mắt nhện ủ',
	gold_block: 'Khối Vàng', golden_carrot: 'Cà rốt vàng', hay_block: 'Bó cỏ khô', iron_block: 'Khối Sắt', iron_ingot: 'Thỏi sắt', magma_cream: 'Kem magma',
	melon: 'Dưa hấu', oak_log: 'Gỗ sồi', birch_log: 'Gỗ bạch dương', spruce_log: 'Gỗ vân sam', obsidian: 'Hắc diện thạch', prismarine_shard: 'Mảnh prismarine',
	pumpkin: 'Bí ngô', rotten_flesh: 'Thịt thối', slime_ball: 'Cục slime', stick: 'Que', stone: 'Đá', string: 'Sợi dây', wheat: 'Lúa mì', wheat_seeds: 'Hạt giống lúa mì',
};
const ENCHANTS = {
	PROTECTION_ENVIRONMENTAL: 'Bảo vệ', PROTECTION_FIRE: 'Chống lửa', PROTECTION_FALL: 'Chống rơi', PROTECTION_PROJECTILE: 'Chống đạn', PROTECTION_EXPLOSIONS: 'Chống nổ',
	THORNS: 'Gai', DURABILITY: 'Độ bền', DAMAGE_ALL: 'Sắc bén', DAMAGE_UNDEAD: 'Tiêu diệt xác sống', DAMAGE_ARTHROPODS: 'Hủy diệt động vật chân đốt', LOOT_BONUS_MOBS: 'Cướp bóc',
	FIRE_ASPECT: 'Hỏa thuật', DIG_SPEED: 'Hiệu suất', ARROW_DAMAGE: 'Sức mạnh', ARROW_FIRE: 'Ngọn lửa', ARROW_INFINITE: 'Vô hạn', ARROW_KNOCKBACK: 'Cú đấm', LOOT_BONUS_BLOCKS: 'May mắn', LUCK: 'May mắn của biển',
};
// How the armor sets are grouped on the list page. A set that is not listed here goes to "Khác" (and is reported).
const LINES = [
	['Phổ thông', ['tanthu', 'coxua', 'thuongco', 'thuonglong', 'huyenthoai', 'huyenkim', 'truyenthuyet', 'toicao']],
	['Ngũ hành', ['kimtinh', 'moctinh', 'thuytinh', 'hoatinh', 'thotinh', 'kimvuong', 'mocvuong', 'thuyvuong', 'hoavuong', 'thovuong', 'kimthan', 'mocthan', 'thuythan', 'hoathan', 'thothan']],
	['Bá vương', ['bavuong', 'bavuongcuongno']],
	['Huyết linh', Array.from({ length: 10 }, (_, i) => `huyetlinh${i + 1}`)],
	['Huyết ma vương', ['huyetmavuong', ...Array.from({ length: 10 }, (_, i) => `huyetmavuong${i + 1}`)]],
	['Linh hồn', Array.from({ length: 5 }, (_, i) => `linhhon${i + 1}`)],
];
const roman = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];

export function buildEquipment({ base, readYaml, stripCodes, pretty, round, warn, fail }) {
	// ----- text -----
	/** Latin and Vietnamese letters, digits and a few marks only: drops decoration (乂 ๖ ✞ ‿) and non-Latin scripts. */
	const latin = (text) =>
		[...stripCodes(text).replace(/£/g, 'L')]
			.map((c) => (/[A-Za-z0-9%+.,:;'()[\]/!?-]/.test(c) || /\s/.test(c) || (c.codePointAt(0) >= 0xc0 && c.codePointAt(0) <= 0x24f) || (c.codePointAt(0) >= 0x1e00 && c.codePointAt(0) <= 0x1eff) ? c : ' '))
			.join('')
			.replace(/\s+/g, ' ')
			.trim();
	// A number or MAX in () or [] is part of the name ("Kiếm Tối Cao (2)", "Giáp Huyết Linh [1]"); any other tag ([OP], [GOLD], (New)) is not.
	// A lone X or x is decoration ("x｡✗｡x"), ".." around a name too.
	const nameOf = (raw) => {
		const text = latin(raw)
			.replace(/[([][^)\]\d]*?(?:[([]\s*)?(\d+|max)\s*[)\]]{1,2}/gi, ' $1 ')
			.replace(/\([^)]*\)/g, ' ')
			.replace(/\.{2,}/g, ' ')
			.split(/\s+/)
			.filter((w) => !/^[xX]$/.test(w))
			.join(' ');
		return (pretty(text) || pretty(text, { keepBrackets: true })).replace(/^[.\s]+|[.\s]+$/g, '');
	};

	// ----- items -----
	const files = {};
	for (const type of Object.keys(TYPES)) {
		const path = `MMOItems/item/${type.toLowerCase()}.yml`;
		files[type] = existsSync(join(base, path)) ? readYaml(path) : {};
	}
	const itemOf = (type, id) => {
		const raw = files[type]?.[id]?.base;
		if (!raw) return null;
		const stats = {};
		const stat = (key, to) => {
			if (raw[key] !== undefined && Number.isFinite(Number(raw[key]))) stats[to] = round(raw[key]);
		};
		stat('armor', 'armor');
		stat('defense', 'defense');
		stat('max-health', 'maxHealth');
		stat('damage-reduction', 'damageReduction');
		stat('attack-damage', 'attackDamage');
		stat('attack-speed', 'attackSpeed');
		const enchants = Object.entries(raw.enchants ?? {})
			.filter(([key]) => ENCHANTS[key])
			.map(([key, level]) => ({ name: ENCHANTS[key], level: Number(level) }));
		for (const key of Object.keys(raw.enchants ?? {})) if (!ENCHANTS[key]) warn(`${type}:${id}: vanilla enchant ${key} has no name (left out)`);
		const material = raw.material ? String(raw.material).toLowerCase() : null;
		const dyeMatch = /^(\d+)\s+(\d+)\s+(\d+)$/.exec(String(raw['dye-color'] ?? '').trim());
		const dyeColor =
			dyeMatch && material?.startsWith('leather_')
				? '#' + [dyeMatch[1], dyeMatch[2], dyeMatch[3]].map((n) => Math.max(0, Math.min(255, Number(n))).toString(16).padStart(2, '0')).join('')
				: null;
		return {
			key: `${type}:${id}`,
			type,
			id,
			kind: TYPES[type].slot,
			label: TYPES[type].label,
			name: nameOf(raw.name) || `${TYPES[type].label} ${id}`,
			icon: material,
			...(dyeColor ? { dyeColor } : {}),
			tier: raw.tier !== undefined ? Number(raw.tier) || null : null,
			stats,
			enchants,
			recipes: [],
		};
	};
	/** Ids that an id pattern stands for: "KIEMCOXUA*" or "KIEMHUYENKIM[1-8]" (MMOItems ids of one type), or the id itself. */
	const idsOf = (type, pattern) => {
		if (!/[*[]/.test(pattern)) return [pattern];
		const regex = new RegExp(`^${pattern.replace(/\*/g, '.*')}$`);
		return Object.keys(files[type] ?? {}).filter((id) => regex.test(id));
	};
	const items = new Map(); // key -> item (listed items only)
	const need = (key) => {
		if (items.has(key)) return items.get(key);
		const [type, id] = key.split(':');
		if (!TYPES[type]) return null;
		const item = itemOf(type, id);
		if (item) items.set(key, item);
		else warn(`${key} is not in MMOItems (left out)`);
		return item;
	};

	// ----- recipes -----
	const dir = join(base, 'EpicCraftCustom/craft');
	const recipeFiles = readdirSync(dir, { withFileTypes: true }).filter((d) => d.isDirectory()).flatMap((d) => readdirSync(join(dir, d.name)).filter((f) => f.endsWith('.yml')).sort().map((f) => `EpicCraftCustom/craft/${d.name}/${f}`));
	const mmoName = (type, id) => {
		const raw = (type in files ? files[type] : (files[type] = existsSync(join(base, `MMOItems/item/${type.toLowerCase()}.yml`)) ? readYaml(`MMOItems/item/${type.toLowerCase()}.yml`) : {}))[id]?.base;
		return raw ? { name: nameOf(raw.name), icon: raw.material ? String(raw.material).toLowerCase() : null } : null;
	};
	function ingredient(entry, where) {
		const item = entry.Item ?? {};
		if (item.Type && item.Id) {
			if (/[*[]/.test(String(item.Id))) {
				const first = idsOf(item.Type, String(item.Id))[0];
				const any = first ? mmoName(item.Type, first) : null;
				if (!any?.name) return void warn(`${where}: ingredient ${item.Type}:${item.Id} matches no item`);
				return { name: `${any.name.replace(/\s*\d+$/, '')} (bất kỳ cấp)`, icon: any.icon, amount: Number(item.Amount ?? entry.Amount ?? 1) };
			}
			const key = `${item.Type}:${item.Id}`;
			const info = mmoName(item.Type, item.Id);
			if (!info?.name) return void warn(`${where}: ingredient ${key} has no name`);
			return { name: info.name, icon: info.icon, amount: Number(item.Amount ?? entry.Amount ?? 1), ...(TYPES[item.Type] ? { item: key } : {}), ...(item.Type === 'MATERIAL' ? { material: String(item.Id) } : {}) };
		}
		const material = String(item.id ?? item.type ?? '').replace(/^minecraft:/, '').toLowerCase();
		if (!material) return void warn(`${where}: an ingredient has no item`);
		const amount = Number(entry.Amount ?? item.amount ?? item.count ?? 1);
		// a renamed item (a Mảnh Khảm is a prismarine shard with a custom name): the name is the text of its custom name
		const customName = item.components?.['minecraft:custom_name'] ?? item.meta?.['display-name'];
		if (customName) {
			const name = latin([...String(customName).matchAll(/text:?"?:?\s*"([^"]*)"/g)].map((m) => m[1]).join('').replace(/\\u[0-9a-f]{4}/gi, ' ')).trim();
			if (!name) return void warn(`${where}: ingredient ${material} has a custom name that cannot be read (recipe left out)`);
			return { name, icon: material, amount };
		}
		if (item.meta || item.components) return void warn(`${where}: ingredient ${material} is a renamed item (recipe left out)`);
		if (!VANILLA[material]) return void warn(`${where}: ingredient ${material} has no name (recipe left out)`);
		return { name: VANILLA[material], icon: material, amount };
	}
	// ----- materials: the recipes that make one, and what it is an ingredient of (materials.json) -----
	const materialRecipes = new Map(); // id -> recipes that give it
	const materialUses = new Map(); // id -> { kind: 'item', key } | { kind: 'material', id }
	const useOf = (id, use) => materialUses.set(id, [...(materialUses.get(id) ?? []), use]);
	const stripMaterial = (needs) => needs.map(({ material, ...n }) => n);
	function materialRecipe(recipe, file) {
		const out = Object.values(recipe.ItemsResult ?? {}).map((r) => r.Item).filter((i) => i?.Type === 'MATERIAL' && i.Id);
		// a spawner recipe: the result is given by a command (stacker give <player> spawner <mob> 1)
		const spawner = (recipe.CommandSuccess ?? []).map((c) => /^stacker give <player> spawner (\w+) 1$/.exec(String(c))).find(Boolean);
		if (!out.length && spawner) {
			for (const e of Object.values(recipe.ItemsRequire ?? {})) if (e.Item?.Type === 'MATERIAL' && e.Item.Id) useOf(String(e.Item.Id), { kind: 'spawner', entity: spawner[1].toUpperCase() });
			return;
		}
		if (out.length !== 1) return;
		const needs = Object.values(recipe.ItemsRequire ?? {}).map((e) => ingredient(e, file));
		if (!needs.length || needs.some((n) => !n)) return;
		if (recipe.CheckTurtleTop && Number(recipe.TurtleTopAmount) > 0) return void warn(`${file}: needs ${recipe.TurtleTopAmount} ${recipe.TurtleTopPoint} (recipe left out)`);
		const id = String(out[0].Id);
		const money = recipe.CheckVault && Number(recipe.Vault) > 0 ? Number(recipe.Vault) : null;
		const xu = recipe.CheckPoints && Number(recipe.Points) > 0 ? Number(recipe.Points) : null;
		materialRecipes.set(id, [...(materialRecipes.get(id) ?? []), { chance: round(recipe.CheckSuccess ? recipe.ChanceSuccess ?? 100 : 100), amount: Number(out[0].Amount ?? 1), money, xu, needs: stripMaterial(needs) }]);
		for (const n of needs) if (n.material) useOf(n.material, { kind: 'material', id });
	}
	let recipeCount = 0;
	for (const file of recipeFiles) {
		const recipe = readYaml(file);
		const results = Object.values(recipe.ItemsResult ?? {}).map((r) => r.Item).filter((i) => i?.Type && TYPES[i.Type]);
		if (!results.length) {
			materialRecipe(recipe, file);
			continue;
		}
		if (results.length > 1) {
			warn(`${file}: more than one result (left out)`);
			continue;
		}
		const result = results[0];
		const needs = Object.values(recipe.ItemsRequire ?? {}).map((e) => ingredient(e, file));
		if (!needs.length || needs.some((n) => !n)) continue;
		const money = recipe.CheckVault && Number(recipe.Vault) > 0 ? Number(recipe.Vault) : null;
		const xu = recipe.CheckPoints && Number(recipe.Points) > 0 ? Number(recipe.Points) : null;
		if (recipe.CheckTurtleTop && Number(recipe.TurtleTopAmount) > 0) {
			warn(`${file}: needs ${recipe.TurtleTopAmount} ${recipe.TurtleTopPoint} (recipe left out)`);
			continue;
		}
		const item = need(`${result.Type}:${result.Id}`);
		if (!item) continue;
		item.recipes.push({ chance: round(recipe.CheckSuccess ? recipe.ChanceSuccess ?? 100 : 100), money, xu, needs: stripMaterial(needs) });
		for (const n of needs) if (n.material) useOf(n.material, { kind: 'item', key: item.key });
		recipeCount++;
	}

	// ----- sets -----
	const POTIONS = Object.fromEntries(Object.entries(readYaml('SkyEnchants/messages.yml').messages?.['book-lore']?.['effect-formats']?.POTION?.names ?? {}).map(([k, v]) => [k, latin(v)]));
	const num = (x) => String(round(x));
	const dedupe = (list) => [...new Set(list)];
	const ATTACKS = { ATTACK: 'người chơi', ATTACK_MOB: 'quái' };
	const DEFENSES = { DEFENSE: 'người chơi', DEFENSE_BOW: 'cung tên', DEFENSE_MOB: 'quái' };
	/** Writes the events of a bonus (one piece count) as player-facing lines. */
	function bonusLines(events, where) {
		const lines = [];
		const grouped = new Map(); // text -> events that give it
		const procs = new Map(); // what happens -> when (events with a cooldown, chance or condition)
		const add = (text, event) => grouped.set(text, [...(grouped.get(text) ?? []), event]);
		for (const [event, v] of Object.entries(events ?? {})) {
			const effects = v.effects ?? [];
			const plain = Number(v.cooldown ?? 0) === 0 && !(v.conditions ?? []).length && Number(v.chance ?? 100) === 100;
			if (!plain) {
				const proc = procLine(event, v, where);
				if (proc) procs.set(proc.rest, [...(procs.get(proc.rest) ?? []), proc.when]);
				continue;
			}
			for (const effect of effects) {
				let m;
				if ((m = /^INCREASE_DAMAGE:([\d.]+)$/.exec(effect))) add(`Tăng ${num(m[1])}% sát thương gây ra`, event);
				else if ((m = /^DECREASE_DAMAGE_PERCENT:([\d.]+)$/.exec(effect))) add(`Giảm ${num(m[1])}% sát thương nhận`, event);
				else if (/^BURN:\d+ @Victim$/.test(effect)) add('Thiêu đốt đối thủ', event);
				else if ((m = /^POTION:([A-Z_]+):(\d+)$/.exec(effect)) && event === 'EFFECT_STATIC' && POTIONS[m[1]]) add(`Luôn có hiệu ứng ${POTIONS[m[1]]} ${roman[Number(m[2]) + 1] ?? Number(m[2]) + 1}`, event);
				else warn(`${where}: effect "${effect}" on ${event} is not known (left out)`);
			}
		}
		for (const [rest, whens] of procs) lines.push(`Khi bị ${whens.join(' hoặc ')} tấn công${rest}`);
		for (const [text, events] of grouped) {
			const sources = events.filter((e) => ATTACKS[e] || DEFENSES[e]);
			const all = text.startsWith('Tăng') ? Object.keys(ATTACKS) : text.startsWith('Giảm') ? Object.keys(DEFENSES) : null;
			const names = text.startsWith('Tăng') ? ATTACKS : DEFENSES;
			const missing = all && all.some((e) => !sources.includes(e));
			lines.push(missing && sources.length ? `${text} (${text.startsWith('Tăng') ? 'đánh' : 'từ'} ${sources.map((e) => names[e]).join(', ')})` : text);
		}
		return dedupe(lines);
	}
	/** An effect with a cooldown, a chance below 100 or a condition. Only the shapes below are known. */
	function procLine(event, v, where) {
		const when = { DEFENSE: 'người chơi', DEFENSE_MOB: 'quái', DEFENSE_BOW: 'cung tên' }[event];
		if (!when) return void warn(`${where}: ${event} with a cooldown is not known (left out)`);
		const conditions = (v.conditions ?? []).map((c) => /^%victim health percent% > (\d+) : %stop%$/.exec(String(c)));
		if (conditions.some((c) => !c)) return void warn(`${where}: a condition is not known (left out)`);
		const parts = [];
		for (const effect of v.effects ?? []) {
			let m;
			if (effect === 'CANCEL_EVENT') parts.push('chặn đòn đánh');
			else if ((m = /^POTION:([A-Z_]+):(\d+):\d+ @Self$/.exec(effect)) && POTIONS[m[1]]) parts.push(`nhận ${POTIONS[m[1]]} ${roman[Number(m[2]) + 1] ?? Number(m[2]) + 1}`);
			else if ((m = /^HEAL:(\d+) @Self$/.exec(effect))) parts.push(`hồi ${m[1]} máu`);
			else if ((m = /^PULL_AWAY:\d+ @Aoe\{radius=(\d+),/.exec(effect))) parts.push(`đẩy kẻ địch trong ${m[1]} block ra xa`);
			else if (/^(PARTICLE|SOUND):/.test(effect)) continue; // looks and sound only
			else return void warn(`${where}: effect "${effect}" is not known (left out)`);
		}
		if (!parts.length) return;
		const health = conditions.length ? ` và máu từ ${conditions[0][1]}% trở xuống` : '';
		const chance = Number(v.chance ?? 100) < 100 ? `, tỉ lệ ${num(v.chance)}%` : '';
		const cooldown = Number(v.cooldown ?? 0) > 0 ? `, hồi chiêu ${num(v.cooldown)} giây` : '';
		return { when, rest: `${health}${chance}${cooldown}: ${parts.join(', ')}` };
	}

	const setIds = readdirSync(join(base, 'SkyEnchants/armorsets')).filter((f) => f.endsWith('.yml')).map((f) => f.slice(0, -4)).sort();
	const lineOfSet = (id) => LINES.findIndex(([, ids]) => ids.includes(id));
	const sets = [];
	for (const id of setIds) {
		const raw = readYaml(`SkyEnchants/armorsets/${id}.yml`);
		const where = `set ${id}`;
		const name = nameOf(raw.name);
		if (!name) {
			warn(`${where} has no readable name (left out)`);
			continue;
		}
		const itemsOf = (ref) => {
			const [type, pattern] = String(ref ?? '').split(':');
			if (!TYPES[type] || !pattern) return [];
			return idsOf(type, pattern).sort((x, y) => x.localeCompare(y, 'en', { numeric: true })).map((i) => need(`${type}:${i}`)).filter(Boolean).map((i) => i.key);
		};
		const pieces = {};
		for (const slot of ARMOR_SLOTS) {
			const keys = itemsOf(raw.items?.[slot]?.mmoitems);
			if (keys.length) pieces[slot] = keys;
			else warn(`${where}: ${slot} ${raw.items?.[slot]?.mmoitems ?? '(none)'} is not an item (set left out)`);
		}
		if (Object.keys(pieces).length !== ARMOR_SLOTS.length) continue;
		const weapons = [];
		const mainhand = raw.items?.mainhand;
		for (const entry of Array.isArray(mainhand) ? mainhand : mainhand ? [mainhand] : []) {
			const keys = itemsOf(entry.mmoitems);
			if (!keys.length) {
				warn(`${where}: a main-hand item (${entry.mmoitems ?? 'none'}) is not an MMOItems item (left out)`);
				continue;
			}
			weapons.push({ items: keys, bonus: entry.events ? bonusLines(entry.events, `${where} ${keys[0]}`) : [] });
		}
		const bonuses = Object.entries(raw.events ?? {})
			.map(([count, events]) => ({ pieces: Number(count), lines: bonusLines(events, `${where} (${count} pieces)`) }))
			.filter((b) => b.lines.length)
			.sort((a, b) => a.pieces - b.pieces);
		const line = lineOfSet(id);
		if (line < 0) warn(`set ${id} is not in a line (listed under "Khác")`);
		sets.push({ id, slug: id, name, line: line >= 0 ? LINES[line][0] : 'Khác', order: line >= 0 ? line * 100 + LINES[line][1].indexOf(id) : 9999, pieces, weapons, bonuses });
	}
	sets.sort((a, b) => a.order - b.order);

	// ----- weapons and tools that have a recipe (the sets' weapons are already in) -----
	const listed = [...items.values()].filter((i) => i.recipes.length || sets.some((s) => Object.values(s.pieces).some((keys) => keys.includes(i.key)) || s.weapons.some((w) => w.items.includes(i.key))));
	// Items that only an ingredient points to are pulled in so a recipe can link to them.
	const byKey = new Map(listed.map((i) => [i.key, i]));
	for (const item of listed) for (const r of item.recipes) for (const n of r.needs) if (n.item && !byKey.has(n.item)) {
		const extra = need(n.item);
		if (extra) byKey.set(n.item, extra);
	}
	const order = Object.keys(TYPES);
	const itemList = [...byKey.values()].sort((a, b) => order.indexOf(a.type) - order.indexOf(b.type) || a.key.localeCompare(b.key, 'en', { numeric: true }));
	// the same name for several ids of one type (levels the config does not number): the number of the id tells them apart
	const seen = {};
	for (const item of itemList) (seen[item.type + item.name] ??= []).push(item);
	for (const group of Object.values(seen)) if (group.length > 1) for (const item of group) item.name = `${item.name.replace(/\s*\d+$/, '')} ${/(\d+)$/.exec(item.id)?.[1] ?? 1}`;
	// an ingredient that is itself a listed item is called by the name the page gives it; two recipes that are the same are one
	for (const item of itemList) {
		for (const r of item.recipes) for (const n of r.needs) if (n.item && byKey.has(n.item)) n.name = byKey.get(n.item).name;
		const unique = new Map(item.recipes.map((r) => [JSON.stringify(r), r]));
		item.recipes = [...unique.values()];
	}
	for (const set of sets) delete set.order;
	if (!sets.length) fail('no armor sets found in SkyEnchants/armorsets');
	console.log(`sync-ren: equipment: ${sets.length} sets, ${itemList.length} items, ${recipeCount} recipes`);
	// materials of the recipes: those that a recipe makes or uses
	const materials = [...new Set([...materialRecipes.keys(), ...materialUses.keys()])]
		.map((id) => {
			const info = mmoName('MATERIAL', id);
			if (!info?.name) return void warn(`MATERIAL:${id} has no name (left out)`);
			const usedBy = new Map();
			for (const use of materialUses.get(id) ?? []) {
				// a spawner is named later (ren-materials.mjs), from the spawner shop
				if (use.kind === 'spawner') {
					usedBy.set(`spawner:${use.entity}`, { kind: 'spawner', entity: use.entity });
					continue;
				}
				const name = use.kind === 'item' ? byKey.get(use.key)?.name : mmoName('MATERIAL', use.id)?.name;
				if (name && name !== info.name) usedBy.set(name, { name, kind: use.kind });
			}
			return { id, name: info.name, icon: info.icon, recipes: materialRecipes.get(id) ?? [], usedBy: [...usedBy.values()] };
		})
		.filter(Boolean);
	return {
		equipment: { lines: LINES.map(([name]) => name).concat(sets.some((s) => s.line === 'Khác') ? ['Khác'] : []), sets, items: itemList.map(({ type, ...item }) => ({ type, ...item })) },
		materials,
	};
}
