#!/usr/bin/env node
/**
 * Reads the island upgrades of a server and writes the player-facing facts to
 * src/data/servers/<server>/island-upgrades.json, which the "Chi tiết nâng cấp" page is built from.
 *
 * Two files are read:
 *   SD-Island/island-upgrades.yml        the 6 upgrades: what each level gives and what it costs
 *   TurtleOreGen/ore-generators.yml      the ore chances of every ore generator level
 *
 * Where they come from (one source per run):
 *   --dir <plugins folder>   a plugins folder on disk: <folder>/SD-Island/..., <folder>/TurtleOreGen/...
 *   --ptero                  the server itself, over the Pterodactyl client API (read only)
 *                              PTERO_URL, PTERO_KEY, PTERO_SERVER   as in sync-minions.mjs
 *                              PTERO_PLUGINS_ROOT                   plugins folder on the server, default /plugins
 *
 * Other options:
 *   --server <slug>  which server of src/data/servers.mjs the data belongs to (default: the first one)
 *   --check          do not write, exit 1 when the file would change (for CI)
 *
 * Only whitelisted, public facts are copied (levels, values, prices, required blocks, stat bonuses, ore chances).
 * The output has no timestamp, so a run that finds nothing new leaves the file byte for byte the same.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'yaml';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
// The upgrades the page knows how to describe, in display order. The plugin has exactly these six.
const UPGRADES = ['border-size', 'members-limit', 'minion-slots', 'ore', 'dungeon-stats', 'forge'];
const ORES = ['STONE', 'COAL_ORE', 'IRON_ORE', 'REDSTONE_ORE', 'LAPIS_ORE', 'GOLD_ORE', 'DIAMOND_ORE', 'EMERALD_ORE'];
const NAME = /^[A-Z][A-Z0-9_]*$/;
// an item a level asks for: a vanilla block (DIAMOND_BLOCK) or an MMOItems item TYPE:ID (MATERIAL:DA_NEN)
const ITEM = /^[A-Z][A-Z0-9_]*(:[A-Z0-9_]+)?$/;

const args = process.argv.slice(2);
const flag = (name) => args.includes(name);
const option = (name) => {
	const i = args.indexOf(name);
	return i >= 0 ? args[i + 1] : undefined;
};

const { servers } = await import(new URL(`file:///${join(ROOT, 'src/data/servers.mjs').replace(/\\/g, '/')}`).href);
const serverSlug = option('--server') ?? servers[0]?.slug;
if (!servers.some((s) => s.slug === serverSlug)) fail(`unknown server "${serverSlug}" (see src/data/servers.mjs)`);
const OUT = join(ROOT, 'src/data/servers', serverSlug, 'island-upgrades.json');

function fail(message) {
	console.error(`sync-island-upgrades: ${message}`);
	process.exit(1);
}

// ---------- sources ----------
const FILES = { upgrades: 'SD-Island/island-upgrades.yml', ore: 'TurtleOreGen/ore-generators.yml' };

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
const num = (value, where) => {
	const n = Number(value);
	if (!Number.isFinite(n)) throw new Error(`${where} is not a number: ${value}`);
	return n;
};

function readUpgrade(id, data) {
	const where = `island-upgrades.yml ${id}`;
	if (!data || typeof data !== 'object') throw new Error(`${where} is missing`);
	const offset = num(data['display-offset'] ?? 0, `${where} display-offset`);
	const levels = Object.keys(data.levels ?? {})
		.map(Number)
		.sort((a, b) => a - b)
		.map((level) => {
			const l = data.levels[String(level)];
			const items = {};
			for (const [material, amount] of Object.entries(l.items ?? {})) {
				const key = material.toUpperCase();
				if (!ITEM.test(key)) throw new Error(`${where} level ${level}: bad item name ${material}`);
				items[key] = num(amount, `${where} level ${level} ${material}`);
			}
			const stats = {};
			for (const [stat, amount] of Object.entries(l.stats ?? {})) {
				if (!NAME.test(stat)) throw new Error(`${where} level ${level}: bad stat name ${stat}`);
				stats[stat] = String(amount);
			}
			const slots = Object.values(items).reduce((sum, amount) => sum + Math.ceil(amount / 64), 0);
			if (slots > 36) throw new Error(`${where} level ${level}: the items need ${slots} inventory slots, more than 36`);
			const points = num(l.playerpoints ?? 0, `${where} level ${level} playerpoints`);
			return { level, display: level + offset, value: num(l.value, `${where} level ${level} value`), money: num(l.money ?? 0, `${where} level ${level} money`), points, items, stats };
		});
	if (!levels.length) throw new Error(`${where} has no levels`);
	return { id, baseValue: num(data['base-value'] ?? 0, `${where} base-value`), baseDisplay: offset, levels };
}

function readOre(text, levels) {
	const generators = parse(text)?.generators;
	if (!generators) throw new Error('ore-generators.yml has no generators');
	const result = [];
	const entries = [['default', 0], ...Array.from({ length: levels }, (_, i) => [`level${i + 1}`, i + 1])];
	for (const [key, level] of entries) {
		const random = generators[key]?.random;
		if (!random) throw new Error(`ore-generators.yml has no generator "${key}"`);
		const total = Object.values(random).reduce((sum, w) => sum + Number(w), 0);
		const chance = (names) => Math.round((names.reduce((sum, name) => sum + Number(random[name] ?? 0), 0) / total) * 10000) / 100;
		const blocks = Object.keys(random).filter((name) => name.endsWith('_BLOCK'));
		const row = { level };
		for (const ore of ORES) row[ore] = chance([ore]);
		row.BLOCKS = chance(blocks);
		result.push(row);
	}
	return result;
}

// ---------- main ----------
const dir = option('--dir');
if (!dir && !flag('--ptero')) fail('give a source: --dir <plugins folder> or --ptero');
const files = dir ? fromDir(dir) : await fromPterodactyl();

let output;
try {
	const source = parse(files.upgrades);
	const upgrades = UPGRADES.map((id) => readUpgrade(id, source?.categories?.[id]));
	const dungeonWorlds = (source['dungeon-worlds'] ?? []).map(String);
	output = JSON.stringify({ upgrades, dungeonWorlds, ore: readOre(files.ore, upgrades.find((u) => u.id === 'ore').levels.length) }, null, '\t') + '\n';
} catch (error) {
	fail(error.message);
}

const before = existsSync(OUT) ? readFileSync(OUT, 'utf8') : '';
if (before === output) {
	console.log('sync-island-upgrades: no change');
} else if (flag('--check')) {
	fail('island-upgrades.json is out of date, run the sync');
} else {
	mkdirSync(dirname(OUT), { recursive: true });
	writeFileSync(OUT, output, 'utf8');
	console.log(`sync-island-upgrades: written to ${OUT.slice(ROOT.length + 1).replace(/\\/g, '/')}`);
}
