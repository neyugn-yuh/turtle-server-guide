#!/usr/bin/env node
/**
 * Reads the equipment of a server (sword, bow, axe, armor, shield) and writes the player-facing facts to
 * src/data/servers/<server>/equipment.json, which the "Trang bị" pages are built from.
 *
 * Files read:
 *   MMOItems/item/{sword,bow,axe,mu,ao,quan,giay,shield}.yml   the items KIEM_TANG<n>_<grade>, CUNG_..., RIU_..., MU_..., AO_..., QUAN_..., GIAY_..., KHIEN_...
 *                                                              (the donate items such as KIEM_CHITON have no tier and are left out)
 *   MMOItems/item-sets.yml                                     the bonus of wearing the 4 armor pieces of a tier and grade
 *   MMOItems/upgrade-templates.yml                             how much one upgrade level adds
 *   TurtleCraft/categories.yml                                 name of each tier (tangN_doido) and the forge level that opens it
 *   TurtleCraft/recipes/tang<n>_doido/kiem_tanbinh_to_chienbinh.yml   how many pieces make the next grade
 *   SD-Crates/crates/tang<n>.yml                               the crate of each tier: price, currency, chance of each grade
 *
 * Where the files come from (one source per run):
 *   --dir <plugins folder>   a plugins folder on disk
 *   --ptero                  the server itself over the Pterodactyl client API (read only, throttled)
 *                              PTERO_URL, PTERO_KEY, PTERO_SERVER   as in sync-minions.mjs
 *                              PTERO_PLUGINS_ROOT                   plugins folder on the server, default /plugins
 *
 * Other options: --server <slug> (default: the first), --check (do not write, exit 1 when the file would change).
 * Only whitelisted facts are copied. The output has no timestamp, so a run that finds nothing new leaves the file unchanged.
 */
import { readdirSync, readFileSync, writeFileSync, mkdirSync, existsSync, statSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { parse } from 'yaml';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const TIERS = 15;

const args = process.argv.slice(2);
const flag = (name) => args.includes(name);
const option = (name) => {
	const i = args.indexOf(name);
	return i >= 0 ? args[i + 1] : undefined;
};
function fail(message) {
	console.error(`sync-equipment: ${message}`);
	process.exit(1);
}

const { servers } = await import(pathToFileURL(join(ROOT, 'src/data/servers.mjs')).href);
const serverSlug = option('--server') ?? servers[0]?.slug;
if (!servers.some((s) => s.slug === serverSlug)) fail(`unknown server "${serverSlug}" (see src/data/servers.mjs)`);
const OUT = join(ROOT, 'src/data/servers', serverSlug, 'equipment.json');

// ---------- sources ----------
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
	let last = 0;
	return {
		async read(path) {
			for (let attempt = 0; attempt < 5; attempt++) {
				const wait = last + 300 - Date.now();
				if (wait > 0) await new Promise((done) => setTimeout(done, wait));
				last = Date.now();
				const response = await fetch(`${url}/api/client/servers/${encodeURIComponent(server)}/files/contents?${new URLSearchParams({ file: `${root}/${path}` })}`, { headers });
				if (response.status === 429) {
					await new Promise((done) => setTimeout(done, 5000));
					continue;
				}
				if (response.status === 404 || response.status === 500) return null;
				if (!response.ok) fail(`the panel answered ${response.status} when reading ${path}`);
				return response.text();
			}
			fail(`the panel kept answering 429 when reading ${path}`);
		},
	};
}

const source = flag('--ptero') ? panelSource() : option('--dir') ? diskSource(option('--dir')) : fail('give a source: --dir <plugins folder> or --ptero');

async function readYaml(path) {
	const text = await source.read(path);
	if (text === null) fail(`${path} not found`);
	try {
		return parse(text) ?? {};
	} catch (error) {
		fail(`${path}: ${error.message}`);
	}
}

// ---------- reading ----------
/** Removes color codes and MiniMessage tags: "<#D1D5DB>&lĐá Nền" -> "Đá Nền". */
const plain = (text) => String(text ?? '').replace(/<[^<>]*>/g, '').replace(/&#[0-9a-fA-F]{6}/g, '').replace(/&[0-9a-fk-orA-FK-OR]/g, '').replace(/\s+/g, ' ').trim();

// The tier titles are written in small caps in the config; turn them back into letters.
const SMALL_CAPS = 'ᴀʙᴄᴅᴇꜰɢʜɪᴊᴋʟᴍɴᴏᴘǫʀѕᴛᴜᴠᴡхʏᴢ';
const unSmallCaps = (text) => [...text].map((c) => { const i = SMALL_CAPS.indexOf(c); return i >= 0 ? 'abcdefghijklmnopqrstuvwxyz'[i] : c; }).join('');
const titleCase = (text) => text.split(' ').map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w)).join(' ');

// The six grades of every tier, weakest first. The id is the end of the item id (KIEM_TANG1_<id>).
const GRADES = [
	{ id: 'TANBINH', name: 'Tân Binh', material: 'Da' },
	{ id: 'CHIENBINH', name: 'Chiến Binh', material: 'Xích' },
	{ id: 'KYSI', name: 'Kỵ Sĩ', material: 'Đồng' },
	{ id: 'LANHCHUA', name: 'Lãnh Chúa', material: 'Sắt' },
	{ id: 'QUANVUONG', name: 'Quân Vương', material: 'Vàng' },
	{ id: 'DEVUONG', name: 'Đế Vương', material: 'Kim Cương' },
];
const CRATE_RARITY = { 'tan-binh': 'TANBINH', 'chien-binh': 'CHIENBINH', 'ky-si': 'KYSI', 'lanh-chua': 'LANHCHUA', 'quan-vuong': 'QUANVUONG', 'de-vuong': 'DEVUONG' };

// What a weapon shows, in order: [stat key, label, unit]. Only the stats an item has are written.
const WEAPONS = {
	sword: { file: 'sword', prefix: 'KIEM', stats: [['attack-damage', 'Sát thương', ''], ['attack-speed', 'Tốc độ đánh', ''], ['critical-strike-chance', 'Tỉ lệ chí mạng', '%'], ['critical-strike-power', 'Sát thương chí mạng', '%'], ['lifesteal', 'Hút máu', '%'], ['pve-damage', 'Sát thương lên quái (PvE)', '%']] },
	bow: { file: 'bow', prefix: 'CUNG', stats: [['attack-damage', 'Sát thương', ''], ['projectile-damage', 'Sát thương đạn', '%'], ['arrow-velocity', 'Tốc độ tên', ''], ['critical-strike-chance', 'Tỉ lệ chí mạng', '%'], ['critical-strike-power', 'Sát thương chí mạng', '%'], ['pve-damage', 'Sát thương lên quái (PvE)', '%']] },
	axe: { file: 'axe', prefix: 'RIU', stats: [['attack-damage', 'Sát thương', ''], ['attack-speed', 'Tốc độ đánh', ''], ['magic-damage', 'Sát thương phép', '%'], ['skill-damage', 'Sát thương kỹ năng', '%'], ['blunt-rating', 'Xuyên giáp', '%'], ['critical-strike-chance', 'Tỉ lệ chí mạng', '%'], ['critical-strike-power', 'Sát thương chí mạng', '%'], ['pve-damage', 'Sát thương lên quái (PvE)', '%']] },
};
const PIECES = [['mu', 'MU', 'Mũ'], ['ao', 'AO', 'Áo'], ['quan', 'QUAN', 'Quần'], ['giay', 'GIAY', 'Giày']];

const round = (n) => Math.round(Number(n) * 1000) / 1000;
/** A stat is a number or a block with `base`. */
const statValue = (v) => (v && typeof v === 'object' ? Number(v.base) : Number(v));

const itemId = (prefix, tier, grade) => `${prefix}_TANG${tier}_${grade}`;
function need(items, id, where) {
	const item = items[id]?.base;
	if (!item) fail(`${where} has no item ${id}`);
	return item;
}

/** The skill text of a grade-6 weapon: trigger, name and the lines under it, read from the lore. */
function abilityOf(base) {
	if (!base.ability) return null;
	const lines = (base.lore ?? []).map(plain).filter(Boolean);
	const at = lines.findIndex((line) => line.startsWith('»'));
	if (at < 0) return null;
	const head = lines[at].replace(/^»\s*/, '').split('•').map((s) => s.trim());
	const rest = lines.slice(at + 1);
	return {
		trigger: head.length > 1 ? head[0] : '',
		name: head.length > 1 ? head[1] : head[0],
		text: rest.filter((l) => !l.startsWith('▪')).join(' '),
		details: rest.filter((l) => l.startsWith('▪')).map((l) => l.replace(/^▪\s*/, '')),
	};
}

// ---------- main ----------
const categories = (await readYaml('TurtleCraft/categories.yml')).categories ?? {};
const sets = await readYaml('MMOItems/item-sets.yml');
const templates = await readYaml('MMOItems/upgrade-templates.yml');
const percentOf = (v) => Number(String(v ?? '').replace('%', ''));

const files = {};
for (const name of ['sword', 'bow', 'axe', 'mu', 'ao', 'quan', 'giay', 'shield']) files[name] = await readYaml(`MMOItems/item/${name}.yml`);

// tiers: name, forge level, crate
const tiers = [];
for (let n = 1; n <= TIERS; n++) {
	const category = categories[`tang${n}_doido`];
	if (!category) fail(`TurtleCraft/categories.yml has no tang${n}_doido`);
	const title = plain(category.title).split('»').slice(1).join('»').trim();
	if (!title) fail(`tang${n}_doido has no title after »`);
	const crate = await readYaml(`SD-Crates/crates/tang${n}.yml`);
	const total = Object.values(crate.rarities ?? {}).reduce((sum, r) => sum + Number(r.weight ?? 0), 0);
	const chances = {};
	for (const [key, gradeId] of Object.entries(CRATE_RARITY)) {
		const weight = Number(crate.rarities?.[key]?.weight);
		if (!Number.isFinite(weight)) fail(`SD-Crates/crates/tang${n}.yml has no rarity ${key}`);
		chances[gradeId] = round((weight / total) * 100);
	}
	tiers.push({ n, name: titleCase(unSmallCaps(title)), forgeLevel: Number(category['forge-level'] ?? 0), crate: { currency: String(crate.currency), price: Number(crate.price), chances } });
}

// what the grade upgrade of every tier asks for: the sword recipes stand for all kinds (the config keeps them the same)
const UPGRADE_STEPS = [
	['tanbinh', 'chienbinh'],
	['chienbinh', 'kysi'],
	['kysi', 'lanhchua'],
	['lanhchua', 'quanvuong'],
	['quanvuong', 'devuong'],
];
const itemNames = {};
/** Player-facing name of an MMOItems item "TYPE:ID", read from MMOItems/item/<type>.yml. */
async function mmoName(type, id) {
	const key = `${type}:${id}`;
	if (!(key in itemNames)) {
		const file = await readYaml(`MMOItems/item/${type.toLowerCase()}.yml`);
		const name = plain(file[id]?.base?.name);
		if (!name) fail(`the upgrade recipes ask for ${key}, which has no name in MMOItems/item/${type.toLowerCase()}.yml`);
		itemNames[key] = name;
	}
	return itemNames[key];
}
for (const tier of tiers) {
	tier.upgrades = [];
	for (const [from, to] of UPGRADE_STEPS) {
		const recipe = await readYaml(`TurtleCraft/recipes/tang${tier.n}_doido/kiem_${from}_to_${to}.yml`);
		const [piece, ...rest] = recipe.ingredients ?? [];
		if (!piece) fail(`tang${tier.n}_doido kiem_${from}_to_${to} has no ingredients`);
		const items = [];
		for (const ingredient of rest) {
			const m = /^mmoitems:([A-Z_]+):([A-Z0-9_]+)$/.exec(String(ingredient.item));
			if (!m) fail(`tang${tier.n}_doido kiem_${from}_to_${to}: ingredient ${ingredient.item} is not an MMOItems item`);
			items.push({ name: await mmoName(m[1], m[2]), amount: Number(ingredient.amount) });
		}
		tier.upgrades.push({ from, to, pieces: Number(piece.amount), items });
	}
}

// pieces needed for the next grade (same in every tier: read the first)
const recipe = await readYaml('TurtleCraft/recipes/tang1_doido/kiem_tanbinh_to_chienbinh.yml');
const piecesPerGrade = Number(recipe.ingredients?.[0]?.amount);
if (!Number.isFinite(piecesPerGrade) || piecesPerGrade < 1) fail('cannot read how many pieces make the next grade');

const output = { grades: GRADES.map(({ id, name, material }) => ({ id, name, material })), tiers, upgrade: { weaponPercent: percentOf(templates.weapon?.['attack-damage']), armorPercent: percentOf(templates.armor?.defense), piecesPerGrade }, kinds: {} };
if (!output.upgrade.weaponPercent || !output.upgrade.armorPercent) fail('MMOItems/upgrade-templates.yml needs weapon.attack-damage and armor.defense');

// weapons
for (const [kind, spec] of Object.entries(WEAPONS)) {
	const list = [];
	for (let n = 1; n <= TIERS; n++) {
		const names = new Set();
		const grades = GRADES.map((g) => {
			const base = need(files[spec.file], itemId(spec.prefix, n, g.id), `item/${spec.file}.yml`);
			names.add(plain(base.name));
			const stats = {};
			for (const [key] of spec.stats) if (base[key] !== undefined) stats[key] = round(statValue(base[key]));
			return { grade: g.id, icon: String(base.material).toLowerCase(), stats, upgradeMax: Number(base.upgrade?.max ?? 0), ability: abilityOf(base) };
		});
		if (names.size !== 1) fail(`${spec.prefix} tier ${n}: the grades have different names (${[...names].join(', ')})`);
		list.push({ tier: n, name: [...names][0], grades });
	}
	output.kinds[kind] = { stats: spec.stats.map(([key, label, unit]) => ({ key, label, unit })), tiers: list };
}

// armor (4 pieces) and shield
const armorTiers = [];
const shieldTiers = [];
for (let n = 1; n <= TIERS; n++) {
	const pieceNames = {};
	const grades = GRADES.map((g) => {
		const pieces = {};
		let setId = null;
		for (const [file, prefix, label] of PIECES) {
			const base = need(files[file], itemId(prefix, n, g.id), `item/${file}.yml`);
			const name = plain(base.name);
			if (pieceNames[file] && pieceNames[file] !== name) fail(`${prefix} tier ${n}: the grades have different names`);
			pieceNames[file] = name;
			pieces[file] = { health: round(base['max-health']), defense: round(base.defense) };
			if (!Number.isFinite(pieces[file].health) || !Number.isFinite(pieces[file].defense)) fail(`${itemId(prefix, n, g.id)} needs max-health and defense`);
			if (base.set) setId = String(base.set);
			if (Number(base.upgrade?.max) !== Number(need(files.mu, itemId('MU', n, g.id), 'item/mu.yml').upgrade?.max)) fail(`${itemId(prefix, n, g.id)}: upgrade max differs from the helmet of the same grade`);
		}
		const set = setId ? sets[setId] : null;
		const setBonus = set?.bonuses?.['4']?.['physical-damage-reduction'];
		return { grade: g.id, icon: String(need(files.ao, itemId('AO', n, g.id), 'item/ao.yml').material).toLowerCase(), pieces, setBonus: setBonus === undefined ? null : round(setBonus), upgradeMax: Number(need(files.mu, itemId('MU', n, g.id), 'item/mu.yml').upgrade?.max ?? 0) };
	});
	armorTiers.push({ tier: n, names: pieceNames, grades });

	const shieldNames = new Set();
	const shield = GRADES.map((g) => {
		const base = need(files.shield, itemId('KHIEN', n, g.id), 'item/shield.yml');
		shieldNames.add(plain(base.name));
		return { grade: g.id, health: round(base['max-health']), defense: round(base.defense), blockRating: round(base['block-rating']), blockPower: round(base['block-power']), upgradeMax: Number(base.upgrade?.max ?? 0) };
	});
	if (shieldNames.size !== 1) fail(`KHIEN tier ${n}: the grades have different names`);
	shieldTiers.push({ tier: n, name: [...shieldNames][0], grades: shield });
}
output.kinds.armor = { pieces: PIECES.map(([key, , label]) => ({ key, label })), tiers: armorTiers, shield: shieldTiers };

const text = JSON.stringify(output, null, '\t') + '\n';
const before = existsSync(OUT) ? readFileSync(OUT, 'utf8') : '';
if (before === text) {
	console.log('sync-equipment: no change');
} else if (flag('--check')) {
	fail('equipment.json is out of date, run the sync');
} else {
	mkdirSync(dirname(OUT), { recursive: true });
	writeFileSync(OUT, text, 'utf8');
	console.log(`sync-equipment: written to ${OUT.slice(ROOT.length + 1).replace(/\\/g, '/')}`);
}
