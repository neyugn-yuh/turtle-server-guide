/**
 * Reads the island contribution (đua top đảo) config of a server and returns the player-facing facts.
 * Shared by sync-island-top.mjs (Sky Dungeon, SD-Island) and sync-ren.mjs (Sky Rèn, TurtleIsland): both plugins use the same
 * contribution.yml and gui/top.yml, so one reader serves both.
 */
import { parse } from 'yaml';

// ---------- names ----------
// Vanilla blocks players hand in. A new block needs a name here (the page never shows an English id).
const VANILLA_NAMES = {
	DIAMOND_BLOCK: 'Khối Kim Cương',
	EMERALD_BLOCK: 'Khối Lục Bảo',
	GOLD_BLOCK: 'Khối Vàng',
	IRON_BLOCK: 'Khối Sắt',
};
// MMOItems contribution items (TYPE:ID). They are not in MMOItems/item/material.yml of the repo, so the names live here.
const MMOITEM_NAMES = {
	'MATERIAL:TRUNGRONGCONGHIEN': 'Trứng Rồng Cống Hiến',
	'MATERIAL:KHUNGCONGEND': 'Khung Cổng End Cống Hiến',
	'MATERIAL:BOTBIENCONGHIEN': 'Bọt Biển Cống Hiến',
	'MATERIAL:QUANGTHACHANHCONGHIEN': 'Quặng Thạch Anh Cống Hiến',
};

// ---------- reading ----------
function count(value, where, { allowZero = true } = {}) {
	const n = Number(value);
	if (!Number.isInteger(n) || n < 0 || (!allowZero && n === 0)) throw new Error(`${where} must be a whole number${allowZero ? '' : ' above 0'}: ${value}`);
	return n;
}

/** daily-limit: a whole number, 0 or missing means no limit (null). */
function limitOf(entry, where) {
	if (entry['daily-limit'] === undefined || entry['daily-limit'] === null) return null;
	const n = count(entry['daily-limit'], `${where}.daily-limit`);
	return n === 0 ? null : n;
}

function readItem(entry, spawnerNames, index, visuals) {
	const where = `items[${index}]`;
	const id = String(entry.id ?? '');
	const colon = id.indexOf(':');
	if (colon < 0) throw new Error(`${where}.id is not KIND:ID: ${id}`);
	const kind = id.slice(0, colon);
	const key = id.slice(colon + 1);
	let name;
	let group;
	if (kind === 'VANILLA') {
		name = VANILLA_NAMES[key];
		group = 'block';
	} else if (kind === 'MMOITEMS') {
		name = MMOITEM_NAMES[key];
		group = 'special';
	} else if (kind === 'SPAWNER') {
		const mob = spawnerNames[key];
		name = mob ? `Lồng ${mob}` : undefined;
		group = 'spawner';
	} else throw new Error(`${where}.id has an unknown kind: ${id}`);
	if (!name) throw new Error(`${where}: no player-facing name for ${id}, add it to sync-island-top.mjs${kind === 'SPAWNER' ? ' or to spawner-mobs in contribution.yml' : ''}`);
	const item = { name, group, points: count(entry.points, `${where}.points`, { allowZero: false }), dailyLimit: limitOf(entry, where) };
	if (visuals) {
		// what the picture shows: a lồng shows its mob; a vanilla block its item; an MMOItems item the vanilla item of its quota-id (VANILLA:DRAGON_EGG)
		if (kind === 'SPAWNER') item.entity = key;
		else {
			const vanilla = kind === 'VANILLA' ? key : /^VANILLA:(\w+)$/.exec(String(entry['quota-id'] ?? ''))?.[1];
			if (vanilla) item.icon = vanilla.toLowerCase();
		}
	}
	return item;
}

function readMobs(map, where, visuals) {
	return Object.entries(map ?? {}).map(([id, m]) => ({
		...(visuals ? { id } : {}),
		name: String(m.name ?? id),
		group: String(m.group ?? ''),
		points: count(m.points ?? 0, `${where}.${id}.points`),
		dailyLimit: limitOf(m, `${where}.${id}`),
	}));
}

/** `visuals`: also give each item an `icon` / `entity` and each mob its config id, for the pictures of the page (Sky Rèn). */
export function buildIslandTop(files, { visuals = false } = {}) {
	const contribution = parse(files.contribution) ?? {};
	const top = parse(files.top) ?? {};

	const spawnerNames = Object.fromEntries(Object.entries(contribution['spawner-mobs'] ?? {}).map(([type, m]) => [type, String(m.name ?? '')]));
	const items = (contribution.items ?? []).map((entry, i) => readItem(entry, spawnerNames, i, visuals));
	if (!items.length) throw new Error('contribution.yml has no items');
	items.sort((a, b) => b.points - a.points || a.name.localeCompare(b.name, 'vi'));

	const bosses = readMobs(contribution.mobs, 'mobs', visuals);
	const hunting = readMobs(contribution['spawner-mobs'], 'spawner-mobs', visuals);
	for (const m of hunting) if (!m.name) throw new Error('a spawner-mobs entry has no name');

	const ranking = top['contribution-ranking'] ?? {};
	const rewards = (ranking.rewards ?? []).map((r, i) => count(r, `contribution-ranking.rewards[${i}]`, { allowZero: false }));
	const limits = contribution.limits ?? {};

	return {
		dailyLimitEnabled: limits['daily-limit-enabled'] !== false,
		items,
		hunting: hunting.sort((a, b) => b.points - a.points || a.name.localeCompare(b.name, 'vi')),
		bosses,
		ranking: { closingNote: String(ranking['closing-note'] ?? ''), rewards },
	};
}
