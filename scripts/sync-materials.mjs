#!/usr/bin/env node
/**
 * Reads the materials (nguyên liệu) of a server and writes the player-facing facts to
 * src/data/servers/<server>/materials.json, which the "Danh sách nguyên liệu" page is built from.
 *
 * Files read:
 *   MMOItems/item/material.yml        the materials: id, name, base block
 *   MMOItems/item/<type>.yml          only to find the name of the other items in a recipe (type in lower case)
 *   SD-Island/island-upgrades.yml     the island upgrade levels that ask for a material (type MATERIAL)
 *   TurtleCraft/categories.yml        the title of each recipe category
 *   TurtleCraft/recipes/<category>/*  the recipes: which make a material and which use it
 *
 * For every material the output lists
 *   recipes  the recipes whose result is the material (how to craft it)
 *   uses     the recipes that need the material as an ingredient (what it is for)
 *   upgrades the island upgrade levels that ask the player to hand the material in
 * A material with neither is written with empty lists and the page shows it as empty.
 *
 * Where the files come from (one source per run):
 *   --dir <plugins folder>   a plugins folder on disk
 *   --ptero                  the server itself over the Pterodactyl client API (read only, throttled: there are hundreds of
 *                              recipe files and the panel allows about 240 requests a minute)
 *                              PTERO_URL, PTERO_KEY, PTERO_SERVER   as in sync-minions.mjs
 *                              PTERO_PLUGINS_ROOT                   plugins folder on the server, default /plugins
 *
 * Other options: --server <slug> (default: the first), --check (do not write, exit 1 when the file would change).
 * Only whitelisted facts are copied. The output has no timestamp, so a run that finds nothing new leaves the file unchanged.
 */
import { readdirSync, readFileSync, writeFileSync, mkdirSync, existsSync, statSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { gunzipSync } from 'node:zlib';
import { parse } from 'yaml';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const ID = /^[A-Za-z0-9_]{1,64}$/;

const args = process.argv.slice(2);
const flag = (name) => args.includes(name);
const option = (name) => {
	const i = args.indexOf(name);
	return i >= 0 ? args[i + 1] : undefined;
};
function fail(message) {
	console.error(`sync-materials: ${message}`);
	process.exit(1);
}

const { servers } = await import(pathToFileURL(join(ROOT, 'src/data/servers.mjs')).href);
const serverSlug = option('--server') ?? servers[0]?.slug;
if (!servers.some((s) => s.slug === serverSlug)) fail(`unknown server "${serverSlug}" (see src/data/servers.mjs)`);
const OUT = join(ROOT, 'src/data/servers', serverSlug, 'materials.json');

// ---------- sources: a tiny file system over a plugins folder or the panel ----------
/** @returns {{ read(path): Promise<string|null>, list(path): Promise<string[]> }} paths are relative to the plugins folder */
function diskSource(dir) {
	const base = resolve(dir);
	return {
		async read(path) {
			const file = join(base, path);
			return existsSync(file) ? readFileSync(file, 'utf8') : null;
		},
		async list(path) {
			const folder = join(base, path);
			return existsSync(folder) && statSync(folder).isDirectory() ? readdirSync(folder) : [];
		},
	};
}

function panelSource() {
	const url = process.env.PTERO_URL?.replace(/\/+$/, '');
	const key = process.env.PTERO_KEY;
	const server = process.env.PTERO_SERVER;
	const root = (process.env.PTERO_PLUGINS_ROOT ?? '/plugins').replace(/\/+$/, '');
	if (!url || !key || !server) fail('--ptero needs PTERO_URL, PTERO_KEY and PTERO_SERVER');
	const headers = { Authorization: `Bearer ${key}`, Accept: 'Application/vnd.pterodactyl.v1+json' };
	const api = (what, query) => `${url}/api/client/servers/${encodeURIComponent(server)}/files/${what}?${new URLSearchParams(query)}`;
	let last = 0;
	const get = async (address, kind) => {
		for (let attempt = 0; attempt < 5; attempt++) {
			const wait = last + 300 - Date.now(); // ~3 requests a second, well under the panel's limit
			if (wait > 0) await new Promise((done) => setTimeout(done, wait));
			last = Date.now();
			const response = await fetch(address, { headers });
			if (response.status === 429) {
				await new Promise((done) => setTimeout(done, 5000));
				continue;
			}
			return response;
		}
		fail(`the panel kept answering 429 when reading ${kind}`);
	};
	return {
		async read(path) {
			const response = await get(api('contents', { file: `${root}/${path}` }), path);
			if (response.status === 404 || response.status === 500) return null;
			if (!response.ok) fail(`the panel answered ${response.status} when reading ${path}`);
			return response.text();
		},
		async list(path) {
			const response = await get(api('list', { directory: `${root}/${path}` }), path);
			if (response.status === 404 || response.status === 500) return [];
			if (!response.ok) fail(`the panel answered ${response.status} when listing ${path}`);
			return ((await response.json()).data ?? []).map((entry) => entry.attributes?.name).filter(Boolean);
		},
	};
}

// ---------- reading ----------
/** Removes color codes and MiniMessage tags: "<#D1D5DB>&lĐá Nền" -> "Đá Nền". */
const plain = (text) => String(text ?? '').replace(/<[^<>]*>/g, '').replace(/&#[0-9a-fA-F]{6}/g, '').replace(/&[0-9a-fk-orA-FK-OR]/g, '').replace(/\s+/g, ' ').trim();

const source = flag('--ptero') ? panelSource() : option('--dir') ? diskSource(option('--dir')) : fail('give a source: --dir <plugins folder> or --ptero');

const materialText = await source.read('MMOItems/item/material.yml');
if (materialText === null) fail('MMOItems/item/material.yml not found');
const materialsYaml = parse(materialText) ?? {};
const materials = Object.entries(materialsYaml).map(([id, data]) => {
	if (!ID.test(id)) fail(`bad material id "${id}"`);
	const base = data?.base ?? {};
	const block = String(base.material ?? '').toLowerCase();
	if (!/^[a-z0-9_]*$/.test(block)) fail(`${id}: bad base material "${base.material}"`);
	return { id: id.toUpperCase(), name: plain(base.name) || id, icon: block };
});
const wanted = new Set(materials.map((m) => m.id));

// category titles
const categoriesYaml = parse((await source.read('TurtleCraft/categories.yml')) ?? '')?.categories ?? {};
const categoryTitle = (category) => plain(categoriesYaml[category]?.title) || category;

// names of the items that appear in a recipe: MATERIAL from material.yml, other types from <type>.yml
const typeFiles = new Map();
const blockName = (value) => (/^[a-z0-9_]+$/.test(String(value ?? '').toLowerCase()) ? String(value).toLowerCase() : '');
async function itemInfo(type, id) {
	const T = type.toUpperCase();
	const I = id.toUpperCase();
	if (T === 'MATERIAL') {
		const found = materials.find((m) => m.id === I);
		return { name: found?.name ?? I, icon: found?.icon ?? '' };
	}
	if (!typeFiles.has(T)) {
		const text = ID.test(type) ? await source.read(`MMOItems/item/${type.toLowerCase()}.yml`) : null;
		const data = text ? (parse(text) ?? {}) : {};
		typeFiles.set(T, new Map(Object.entries(data).map(([key, value]) => [key.toUpperCase(), { name: plain(value?.base?.name), icon: blockName(value?.base?.material) }])));
	}
	const info = typeFiles.get(T).get(I);
	return { name: info?.name || I, icon: info?.icon ?? '' };
}

/** A plain item is stored in a recipe as a base64 snapshot. Read its material name out of it (best effort). */
function stackInfo(base64) {
	try {
		const bytes = Buffer.from(String(base64).replace(/^item:/i, ''), 'base64');
		let raw = bytes;
		try {
			raw = gunzipSync(bytes);
		} catch {
			// not compressed: search the bytes as they are
		}
		const m = /minecraft:([a-z0-9_]+)/.exec(raw.toString('latin1'));
		if (m) return { name: m[1].split('_').map((w) => w[0].toUpperCase() + w.slice(1)).join(' '), icon: m[1] };
	} catch {
		// fall through
	}
	return { name: 'Vật phẩm thường', icon: '' };
}

/** "mmoitems:TYPE:ID" -> {type, id}; anything else (an item snapshot) -> null. */
function mmoRef(text) {
	const m = /^mmoitems:([A-Za-z0-9_]+):([A-Za-z0-9_]+)$/i.exec(String(text ?? '').trim());
	return m ? { type: m[1].toUpperCase(), id: m[2].toUpperCase() } : null;
}

async function describe(entries) {
	const out = [];
	for (const entry of entries ?? []) {
		const ref = mmoRef(entry?.item);
		const info = ref ? await itemInfo(ref.type, ref.id) : stackInfo(entry?.item);
		out.push({ name: info.name, icon: info.icon, amount: Number(entry?.amount ?? 1) || 1 });
	}
	return out;
}

// group of each material (src/data/material-categories.mjs); every material must be in exactly one group
const { materialCategories } = await import(pathToFileURL(join(ROOT, 'src/data/material-categories.mjs')).href);
const categoryOf = new Map();
for (const group of materialCategories) {
	for (const id of group.ids) {
		if (categoryOf.has(id)) fail(`${id} is in two groups of src/data/material-categories.mjs`);
		categoryOf.set(id, group.id);
	}
}
for (const m of materials) if (!categoryOf.has(m.id)) fail(`${m.id} is in no group: add it to src/data/material-categories.mjs`);
for (const id of categoryOf.keys()) if (!wanted.has(id)) fail(`src/data/material-categories.mjs lists ${id}, which is not in MMOItems/item/material.yml`);

const result = new Map(materials.map((m) => [m.id, { ...m, category: categoryOf.get(m.id), recipes: [], uses: [], upgrades: [] }]));

// island upgrades: which level of which upgrade asks for the material, and how many
const UPGRADE_TITLES = { 'border-size': 'Diện tích đảo', 'members-limit': 'Thành viên đảo', 'minion-slots': 'Slot đặt minion', ore: 'Máy tạo quặng', 'dungeon-stats': 'Chỉ số dungeon', forge: 'Xưởng rèn' };
const upgradeText = await source.read('SD-Island/island-upgrades.yml');
const upgradeCategories = upgradeText ? (parse(upgradeText)?.categories ?? {}) : {};
for (const [id, title] of Object.entries(UPGRADE_TITLES)) {
	const category = upgradeCategories[id];
	if (!category) continue;
	const offset = Number(category['display-offset'] ?? 0) || 0;
	const byMaterial = new Map();
	for (const level of Object.keys(category.levels ?? {}).map(Number).sort((a, b) => a - b)) {
		for (const [key, amount] of Object.entries(category.levels[String(level)]?.items ?? {})) {
			const ref = mmoRef(`mmoitems:${key}`);
			if (!ref || ref.type !== 'MATERIAL' || !wanted.has(ref.id)) continue;
			if (!byMaterial.has(ref.id)) byMaterial.set(ref.id, []);
			byMaterial.get(ref.id).push({ level: level + offset, amount: Number(amount) });
		}
	}
	for (const [materialId, levels] of byMaterial) result.get(materialId).upgrades.push({ upgrade: title, levels });
}

const categories = (await source.list('TurtleCraft/recipes')).sort();
for (const category of categories) {
	const files = (await source.list(`TurtleCraft/recipes/${category}`)).filter((name) => /\.ya?ml$/i.test(name)).sort();
	for (const file of files) {
		const text = await source.read(`TurtleCraft/recipes/${category}/${file}`);
		const recipe = text ? parse(text) : null;
		if (!recipe) continue;
		const made = (recipe.results ?? []).map((r) => mmoRef(r?.item)).filter((r) => r?.type === 'MATERIAL' && wanted.has(r.id));
		const used = (recipe.ingredients ?? []).map((r) => mmoRef(r?.item)).filter((r) => r?.type === 'MATERIAL' && wanted.has(r.id));
		if (!made.length && !used.length) continue;
		const row = {
			category: categoryTitle(category),
			ingredients: await describe(recipe.ingredients),
			results: await describe(recipe.results),
			chance: Number(recipe.chance ?? 100),
			cost: recipe.cost && typeof recipe.cost === 'object' ? { currency: String(recipe.cost.currency ?? ''), amount: Number(recipe.cost.amount ?? 0) } : null,
		};
		for (const ref of made) result.get(ref.id).recipes.push(row);
		for (const ref of used) result.get(ref.id).uses.push(row);
	}
}

const output = JSON.stringify({ materials: [...result.values()] }, null, '\t') + '\n';
const before = existsSync(OUT) ? readFileSync(OUT, 'utf8') : '';
if (before === output) {
	console.log(`sync-materials: ${materials.length} materials, no change`);
} else if (flag('--check')) {
	fail('materials.json is out of date, run the sync');
} else {
	mkdirSync(dirname(OUT), { recursive: true });
	writeFileSync(OUT, output, 'utf8');
	console.log(`sync-materials: ${materials.length} materials written to ${OUT.slice(ROOT.length + 1).replace(/\\/g, '/')}`);
}
