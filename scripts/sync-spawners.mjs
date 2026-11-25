#!/usr/bin/env node
/**
 * Reads the spawner setup of a server and writes the player-facing facts to
 * src/data/servers/<server>/spawners.json, which the "Danh sách spawner" page is built from.
 *
 * Files read (all of TurtleStacker):
 *   TurtleStacker/entities.yml          the mobs that stack: stack size and what each drops when killed
 *   TurtleStacker/spawner-upgrades.yml  the spawner levels (drop bonus, spawn speed, price), general and per mob
 *   TurtleStacker/spawner-perks.yml     the perks a spawner unlocks at a level
 *   TurtleStacker/config.yml            the spawner stack limit
 *
 * Where the files come from (one source per run):
 *   --dir <plugins folder>   a plugins folder on disk
 *   --ptero                  the server itself over the Pterodactyl client API (read only)
 *                              PTERO_URL, PTERO_KEY, PTERO_SERVER   as in sync-minions.mjs
 *                              PTERO_PLUGINS_ROOT                   plugins folder on the server, default /plugins
 *
 * Other options: --server <slug> (default: the first), --check (do not write, exit 1 when the file would change).
 * Only whitelisted facts are copied. The output has no timestamp, so a run that finds nothing new leaves the file unchanged.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { parse } from 'yaml';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const NAME = /^[A-Z][A-Z0-9_]*$/;

const args = process.argv.slice(2);
const flag = (name) => args.includes(name);
const option = (name) => {
	const i = args.indexOf(name);
	return i >= 0 ? args[i + 1] : undefined;
};
function fail(message) {
	console.error(`sync-spawners: ${message}`);
	process.exit(1);
}

const { servers } = await import(pathToFileURL(join(ROOT, 'src/data/servers.mjs')).href);
const serverSlug = option('--server') ?? servers[0]?.slug;
if (!servers.some((s) => s.slug === serverSlug)) fail(`unknown server "${serverSlug}" (see src/data/servers.mjs)`);
const OUT = join(ROOT, 'src/data/servers', serverSlug, 'spawners.json');

// ---------- sources ----------
const FILES = {
	entities: 'TurtleStacker/entities.yml',
	upgrades: 'TurtleStacker/spawner-upgrades.yml',
	perks: 'TurtleStacker/spawner-perks.yml',
	config: 'TurtleStacker/config.yml',
	menu: 'DeluxeMenus/gui_menus/shop_spawner.yml',
};

function fromDir(dir) {
	const out = {};
	for (const [key, rel] of Object.entries(FILES)) {
		const file = join(resolve(dir), rel);
		if (!existsSync(file)) fail(`${file} does not exist`);
		out[key] = readFileSync(file, 'utf8');
	}
	return out;
}

async function fromPterodactyl() {
	const base = process.env.PTERO_URL?.replace(/\/+$/, '');
	const key = process.env.PTERO_KEY;
	const server = process.env.PTERO_SERVER;
	const root = (process.env.PTERO_PLUGINS_ROOT ?? '/plugins').replace(/\/+$/, '');
	if (!base || !key || !server) fail('--ptero needs PTERO_URL, PTERO_KEY and PTERO_SERVER');
	const headers = { Authorization: `Bearer ${key}`, Accept: 'Application/vnd.pterodactyl.v1+json' };
	const out = {};
	for (const [name, rel] of Object.entries(FILES)) {
		const url = `${base}/api/client/servers/${encodeURIComponent(server)}/files/contents?${new URLSearchParams({ file: `${root}/${rel}` })}`;
		const response = await fetch(url, { headers });
		if (!response.ok) fail(`the panel answered ${response.status} when reading ${rel}`);
		out[name] = await response.text();
	}
	return out;
}

// ---------- reading ----------
/** "15%" is 15, 0.25 (a plain number) is 25, as TurtleStacker reads them. Returns a percentage. */
function percent(value, where) {
	let fraction;
	if (typeof value === 'string' && value.trim().endsWith('%')) fraction = Number(value.trim().slice(0, -1)) / 100;
	else fraction = Number(value);
	if (!Number.isFinite(fraction)) throw new Error(`${where} is not a percentage: ${value}`);
	return Math.round(fraction * 100 * 10000) / 10000;
}

const titleOf = (id) => id.toLowerCase().split('_').map((w) => w[0].toUpperCase() + w.slice(1)).join(' ');
// the plain name shown for an item whose material name is not what players call it
const ITEM_NAMES = { CHICKEN: 'Raw Chicken', BEEF: 'Raw Beef', PORKCHOP: 'Raw Porkchop', MUTTON: 'Raw Mutton' };
// every spawner looks the same in the game, so they share the picture of the spawner block
const SPAWNER_ICON = 'spawner';

// Experience a vanilla 1.21 mob gives for one kill by a player (the amount TurtleStacker starts from; it is not in any config file).
// Adult mobs. Animals give 1-3. A slime gives its size (1, 2 or 4), so a spawner slime gives 1-4 (bySize).
// The entity's loot.xp-multiplier (default 1.0) scales it, as TurtleStacker does when a mob dies.
const VANILLA_XP = {
	ZOMBIE: [5, 5],
	SKELETON: [5, 5],
	SPIDER: [5, 5],
	CREEPER: [5, 5],
	WITCH: [5, 5],
	COW: [1, 3],
	PIG: [1, 3],
	SHEEP: [1, 3],
	CHICKEN: [1, 3],
	RABBIT: [1, 3],
	SLIME: [1, 4],
};
const XP_BY_SIZE = new Set(['SLIME']);

function readXp(id, loot, where) {
	const base = VANILLA_XP[id];
	if (!base) throw new Error(`${where}: no vanilla experience known for ${id}, add it to VANILLA_XP in sync-spawners.mjs`);
	const multiplier = Number(loot['xp-multiplier'] ?? 1);
	if (!Number.isFinite(multiplier) || multiplier < 0) throw new Error(`${where}.loot.xp-multiplier is not valid: ${loot['xp-multiplier']}`);
	return { min: Math.round(base[0] * multiplier), max: Math.round(base[1] * multiplier), bySize: XP_BY_SIZE.has(id) };
}

/**
 * Buying prices from the spawner shop menu (DeluxeMenus/gui_menus/shop_spawner.yml). Each item's left click takes the price of 1 spawner
 * ("eco take <player> <n>" then "turtlestacker give <player> <mob> 1"); the right click must take exactly 10 times that for 10.
 * Returns { MOB: price }.
 */
function readPrices(menu) {
	const prices = {};
	for (const [key, item] of Object.entries(menu?.items ?? {})) {
		const left = item?.left_click_commands ?? [];
		const give = left.map((c) => String(c).match(/^\[console\]\s+turtlestacker give \S+ (\S+) 1$/i)).find(Boolean);
		if (!give) continue;
		const take = left.map((c) => String(c).match(/^\[console\]\s+eco take \S+ (\d+)$/i)).find(Boolean);
		if (!take) throw new Error(`shop_spawner.yml ${key}: left click gives a spawner without an "eco take"`);
		const mob = give[1].toUpperCase();
		const price = Number(take[1]);
		const right = (item.right_click_commands ?? []).map((c) => String(c).match(/^\[console\]\s+eco take \S+ (\d+)$/i)).find(Boolean);
		if (!right || Number(right[1]) !== price * 10) throw new Error(`shop_spawner.yml ${key}: right click (x10) must take exactly 10 times ${price}`);
		if (price <= 0) throw new Error(`shop_spawner.yml ${key}: price must be above 0`);
		prices[mob] = price;
	}
	return prices;
}

function readTiers(levels, where) {
	return Object.entries(levels ?? {})
		.map(([level, tier]) => ({
			level: Number(level),
			dropBonus: percent(tier?.['mob-drop-bonus'] ?? '0%', `${where}.${level}.mob-drop-bonus`),
			spawnSpeed: percent(tier?.['spawn-speed'] ?? '0%', `${where}.${level}.spawn-speed`),
			cost: Number(tier?.cost ?? 0),
		}))
		.sort((a, b) => a.level - b.level);
}

function readMob(id, data, upgrades, perks, price) {
	const where = `entities.yml ${id}`;
	if (!NAME.test(id)) throw new Error(`bad mob id ${id}`);
	const loot = data?.loot ?? {};
	const drops = Object.entries(loot['extra-drops'] ?? {}).map(([key, drop]) => {
		const material = String(drop?.material ?? '').toUpperCase();
		if (!NAME.test(material)) throw new Error(`${where}.${key}.material is not a material name: ${drop?.material}`);
		const min = Math.max(1, Number(drop?.min ?? 1));
		return { item: ITEM_NAMES[material] ?? titleOf(material), icon: material.toLowerCase(), chance: Math.min(100, percent(drop?.chance ?? '100%', `${where}.${key}.chance`)), min, max: Math.max(min, Number(drop?.max ?? min)) };
	});
	const own = upgrades.perMob?.[id]?.levels;
	const tiers = readTiers(own ?? upgrades.levels, own ? `per-mob.${id}` : 'levels');
	const mobPerks = Object.entries(perks?.[id] ?? {}).map(([level, perk]) => ({ level: Number(level), name: String(perk?.name ?? '') })).sort((a, b) => a.level - b.level);
	return {
		id,
		name: titleOf(id),
		icon: SPAWNER_ICON,
		maxStack: Number(data?.['max-stack'] ?? 100),
		vanillaDrops: loot.vanilla !== false,
		price: price ?? null,
		xp: readXp(id, loot, where),
		drops,
		tiers,
		perks: mobPerks,
	};
}

// How fast one spawner block runs before any upgrade. These are the vanilla spawner values (stored in the spawner block, not in a
// plugin file): up to 4 spawn attempts per cycle, a cycle every 200-800 ticks (10-40 s, 25 s on average), only with a player within
// 16 blocks. Leaf can override the delays (config/leaf-global.yml, gameplay-mechanisms.spawner-settings); when it is switched on
// there, its delays are used so the wiki cannot drift. The Leaf file sits next to the plugins folder (--dir) or on the server (--ptero).
function readSpawnerBase(leafText) {
	const base = { spawnCount: 4, minDelayTicks: 200, maxDelayTicks: 800 };
	if (!leafText) return base;
	const custom = parse(leafText)?.['gameplay-mechanisms']?.['spawner-settings'];
	if (custom?.enabled === true) {
		base.minDelayTicks = Number(custom['min-spawn-delay'] ?? base.minDelayTicks);
		base.maxDelayTicks = Number(custom['max-spawn-delay'] ?? base.maxDelayTicks);
	}
	return base;
}

async function readLeaf(pluginsDir) {
	if (pluginsDir) {
		const file = join(resolve(pluginsDir), '..', 'config', 'leaf-global.yml');
		return existsSync(file) ? readFileSync(file, 'utf8') : '';
	}
	const base = process.env.PTERO_URL?.replace(/\/+$/, '');
	const root = (process.env.PTERO_PLUGINS_ROOT ?? '/plugins').replace(/\/+$/, '');
	const headers = { Authorization: `Bearer ${process.env.PTERO_KEY}`, Accept: 'Application/vnd.pterodactyl.v1+json' };
	const url = `${base}/api/client/servers/${encodeURIComponent(process.env.PTERO_SERVER)}/files/contents?${new URLSearchParams({ file: `${root}/../config/leaf-global.yml` })}`;
	const response = await fetch(url, { headers });
	return response.ok ? await response.text() : '';
}

// ---------- main ----------
const dir = option('--dir');
if (!dir && !flag('--ptero')) fail('give a source: --dir <plugins folder> or --ptero');
const files = dir ? fromDir(dir) : await fromPterodactyl();
const leafText = await readLeaf(dir);

let output;
try {
	const entities = parse(files.entities) ?? {};
	const upgrades = parse(files.upgrades) ?? {};
	const perks = parse(files.perks) ?? {};
	const config = parse(files.config) ?? {};
	const prices = readPrices(parse(files.menu) ?? {});
	for (const mob of Object.keys(prices)) if (!(mob in (entities.mobs ?? {}))) throw new Error(`shop_spawner.yml sells ${mob}, which is not in TurtleStacker/entities.yml`);
	const mobs = Object.entries(entities.mobs ?? {}).map(([id, data]) => readMob(id, data, { levels: upgrades.levels, perMob: upgrades['per-mob'] }, perks, prices[id]));
	if (!mobs.length) throw new Error('entities.yml has no mobs');
	output = JSON.stringify({ spawnerMaxStack: Number(config.spawner?.['max-stack'] ?? 0), currency: String(upgrades.currency ?? 'money'), spawnerBase: readSpawnerBase(leafText), mobs }, null, '\t') + '\n';
} catch (error) {
	fail(error.message);
}

const before = existsSync(OUT) ? readFileSync(OUT, 'utf8') : '';
if (before === output) {
	console.log('sync-spawners: no change');
} else if (flag('--check')) {
	fail('spawners.json is out of date, run the sync');
} else {
	mkdirSync(dirname(OUT), { recursive: true });
	writeFileSync(OUT, output, 'utf8');
	console.log(`sync-spawners: written to ${OUT.slice(ROOT.length + 1).replace(/\\/g, '/')}`);
}
