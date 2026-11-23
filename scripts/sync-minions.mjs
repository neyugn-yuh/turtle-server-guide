#!/usr/bin/env node
/**
 * Reads the minion definitions of a server and writes the player-facing facts to
 * src/data/servers/<server>/minions.json, which the "Danh sách minion" page is built from.
 *
 * Where the definitions come from (one source per run):
 *   --dir <folder>   a plugin data folder on disk: <folder>/minions/*.yml
 *   --ptero          the server itself, over the Pterodactyl client API (read only: it lists and reads files)
 *                      PTERO_URL         panel address, for example https://panel.example.com
 *                      PTERO_KEY         client API key (see README: use a sub-user that may only read files)
 *                      PTERO_SERVER      short server identifier, for example 503bd428
 *                      PTERO_PLUGIN_DIR  plugin folder on the server, default /plugins/TurtleMinions
 *
 * Other options:
 *   --server <slug>  which server of src/data/servers.mjs the data belongs to (default: the first one)
 *   --check          do not write, exit 1 when the file would change (for CI)
 *
 * Only whitelisted, public facts are copied (name, group, tiers, products). Nothing else of the config is read into
 * the output, so a secret in a config file cannot leak into the site. The output has no timestamp, so a run that
 * finds nothing new leaves the file byte for byte the same.
 */
import { readdirSync, readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'yaml';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const CATEGORY_ORDER = ['mining', 'farming', 'foraging', 'fishing', 'combat'];
const FILE_NAME = /^[a-z0-9_.-]+\.yml$/i;

// ---------- arguments ----------
const args = process.argv.slice(2);
const flag = (name) => args.includes(name);
const option = (name) => {
	const i = args.indexOf(name);
	return i >= 0 ? args[i + 1] : undefined;
};

const { servers } = await import(pathToUrl(join(ROOT, 'src/data/servers.mjs')));
const serverSlug = option('--server') ?? servers[0]?.slug;
if (!servers.some((s) => s.slug === serverSlug)) fail(`unknown server "${serverSlug}" (see src/data/servers.mjs)`);
const OUT = join(ROOT, 'src/data/servers', serverSlug, 'minions.json');

function pathToUrl(p) {
	return new URL(`file:///${p.replace(/\\/g, '/')}`).href;
}

function fail(message) {
	console.error(`sync-minions: ${message}`);
	process.exit(1);
}

// ---------- sources ----------
/** @returns {Promise<{id: string, text: string}[]>} one entry per minion file */
async function fromDir(dir) {
	const folder = join(resolve(dir), 'minions');
	if (!existsSync(folder)) fail(`${folder} does not exist`);
	return readdirSync(folder)
		.filter((name) => FILE_NAME.test(name))
		.map((name) => ({ id: name.replace(/\.yml$/i, ''), text: readFileSync(join(folder, name), 'utf8') }));
}

async function fromPterodactyl() {
	const base = process.env.PTERO_URL?.replace(/\/+$/, '');
	const key = process.env.PTERO_KEY;
	const server = process.env.PTERO_SERVER;
	const pluginDir = (process.env.PTERO_PLUGIN_DIR ?? '/plugins/TurtleMinions').replace(/\/+$/, '');
	if (!base || !key || !server) fail('--ptero needs PTERO_URL, PTERO_KEY and PTERO_SERVER');
	const headers = { Authorization: `Bearer ${key}`, Accept: 'Application/vnd.pterodactyl.v1+json' };
	const api = (path, query) => `${base}/api/client/servers/${encodeURIComponent(server)}/${path}?${new URLSearchParams(query)}`;
	const get = async (url, kind) => {
		const response = await fetch(url, { headers });
		if (!response.ok) fail(`the panel answered ${response.status} when reading ${kind}`);
		return response;
	};

	const list = await (await get(api('files/list', { directory: `${pluginDir}/minions` }), 'the minion folder')).json();
	const names = (list.data ?? []).map((entry) => entry.attributes).filter((a) => a?.is_file && FILE_NAME.test(a.name)).map((a) => a.name);
	if (!names.length) fail(`no .yml files in ${pluginDir}/minions on the server`);

	const files = [];
	for (let i = 0; i < names.length; i += 6) {
		// a few at a time: well under the panel's rate limit
		const batch = names.slice(i, i + 6);
		const texts = await Promise.all(batch.map(async (name) => (await get(api('files/contents', { file: `${pluginDir}/minions/${name}` }), name)).text()));
		batch.forEach((name, k) => files.push({ id: name.replace(/\.yml$/i, ''), text: texts[k] }));
	}
	return files;
}

// ---------- reading one minion ----------
/** Removes MiniMessage tags (<#00AAFF>, <white>, <b>, <tier>...) and tidies the spaces. */
const plain = (text) => String(text ?? '').replace(/<[^<>]*>/g, '').replace(/\s+/g, ' ').trim();

function number(value, where) {
	const n = Number(value);
	if (!Number.isFinite(n)) throw new Error(`${where} is not a number: ${value}`);
	return n;
}

function readProducts(map, where) {
	const entries = Object.entries(map ?? {});
	if (!entries.length) throw new Error(`${where} has no products`);
	return entries.map(([key, p]) => ({
		name: plain(p.display) || String(p.item?.type ?? key).replace(/_/g, ' '),
		chance: number(p.chance ?? 1, `${where}.${key}.chance`),
		amount: String(p.amount ?? '1'),
	}));
}

function readMinion({ id, text }) {
	const where = `${id}.yml`;
	const data = parse(text);
	if (!data || typeof data !== 'object') throw new Error(`${where} is empty`);
	const levels = Object.keys(data.upgrades ?? {}).map(Number).filter(Number.isInteger).sort((a, b) => a - b);
	if (!levels.length) throw new Error(`${where} has no upgrades`);
	if (!CATEGORY_ORDER.includes(data.category)) throw new Error(`${where}: unknown category "${data.category}"`);

	// speed, storage and radius carry over to the next tier when a tier leaves them out
	let last = {};
	const tiers = levels.map((level) => {
		const u = data.upgrades[level] ?? {};
		last = { speed: u.speed ?? last.speed, storage: u.storage ?? last.storage, radius: u.radius ?? last.radius };
		const radius = number(last.radius, `${where} tier ${level} radius`);
		return { tier: level, speed: number(last.speed, `${where} tier ${level} speed`), storage: number(last.storage, `${where} tier ${level} storage`), area: 2 * radius + 1 };
	});

	// the product list of a tier replaces the previous one from that tier on
	const groups = [];
	let current = readProducts(data.products, where);
	let from = levels[0];
	for (const level of levels.slice(1)) {
		const next = data.upgrades[level]?.products;
		if (!next) continue;
		groups.push({ from, to: level - 1, products: current });
		current = readProducts(next, `${where} tier ${level}`);
		from = level;
	}
	groups.push({ from, to: levels[levels.length - 1], products: current });

	return { id, name: plain(data.name).replace(/\s*$/, '') || id, category: data.category, tiers, products: groups };
}

// ---------- main ----------
const dir = option('--dir');
if (!dir && !flag('--ptero')) fail('give a source: --dir <plugin folder> or --ptero');
const files = dir ? await fromDir(dir) : await fromPterodactyl();

const minions = [];
const problems = [];
for (const file of files) {
	try {
		minions.push(readMinion(file));
	} catch (error) {
		problems.push(error.message);
	}
}
if (problems.length) fail(`cannot read ${problems.length} minion file(s):\n- ${problems.join('\n- ')}`);
if (!minions.length) fail('no minions found');

minions.sort((a, b) => CATEGORY_ORDER.indexOf(a.category) - CATEGORY_ORDER.indexOf(b.category) || a.name.localeCompare(b.name, 'en') || a.id.localeCompare(b.id));
const output = JSON.stringify({ minions }, null, '\t') + '\n';

const before = existsSync(OUT) ? readFileSync(OUT, 'utf8') : '';
if (before === output) {
	console.log(`sync-minions: ${minions.length} minions, no change`);
} else if (flag('--check')) {
	fail('minions.json is out of date, run the sync');
} else {
	mkdirSync(dirname(OUT), { recursive: true });
	writeFileSync(OUT, output, 'utf8');
	console.log(`sync-minions: ${minions.length} minions written to ${OUT.slice(ROOT.length + 1).replace(/\\/g, '/')}`);
}
