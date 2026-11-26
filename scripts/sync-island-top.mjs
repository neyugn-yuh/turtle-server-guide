#!/usr/bin/env node
/**
 * Reads the island contribution (đua top đảo) setup of a server and writes the player-facing facts to
 * src/data/servers/<server>/island-top.json, which the "Đua top đảo" pages are built from.
 *
 * Files read:
 *   SD-Island/contribution.yml   what an island earns points for: items handed to the turtle (items), Dungeon bosses (mobs),
 *                                island mobs hunted (spawner-mobs) and the daily limits, shared by the whole island
 *   SD-Island/gui/top.yml        the monthly prize list and the closing note shown in the ranking menu
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
import { buildIslandTop } from './island-top-lib.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

const args = process.argv.slice(2);
const flag = (name) => args.includes(name);
const option = (name) => {
	const i = args.indexOf(name);
	return i >= 0 ? args[i + 1] : undefined;
};
function fail(message) {
	console.error(`sync-island-top: ${message}`);
	process.exit(1);
}

const { servers } = await import(pathToFileURL(join(ROOT, 'src/data/servers.mjs')).href);
const serverSlug = option('--server') ?? servers[0]?.slug;
if (!servers.some((s) => s.slug === serverSlug)) fail(`unknown server "${serverSlug}" (see src/data/servers.mjs)`);
const OUT = join(ROOT, 'src/data/servers', serverSlug, 'island-top.json');

// ---------- sources ----------
const FILES = {
	contribution: 'SD-Island/contribution.yml',
	top: 'SD-Island/gui/top.yml',
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

// ---------- main ----------
const dir = option('--dir');
if (!dir && !flag('--ptero')) fail('give a source: --dir <plugins folder> or --ptero');
const files = dir ? fromDir(dir) : await fromPterodactyl();

let data;
try {
	data = buildIslandTop(files);
} catch (error) {
	fail(error.message);
}

const output = JSON.stringify(data, null, '\t') + '\n';
const before = existsSync(OUT) ? readFileSync(OUT, 'utf8') : '';
if (before === output) {
	console.log(`sync-island-top: ${data.items.length} items, ${data.bosses.length} bosses, ${data.hunting.length} island mobs, no change`);
} else if (flag('--check')) {
	fail('island-top.json is out of date, run the sync');
} else {
	mkdirSync(dirname(OUT), { recursive: true });
	writeFileSync(OUT, output, 'utf8');
	console.log(`sync-island-top: ${data.items.length} items, ${data.bosses.length} bosses, ${data.hunting.length} island mobs written to ${OUT.slice(ROOT.length + 1).replace(/\\/g, '/')}`);
}
