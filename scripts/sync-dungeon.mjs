#!/usr/bin/env node
/**
 * Reads the dungeon (hầm ngục) of a server and writes the player-facing facts to
 * src/data/servers/<server>/dungeon.json, which the "Hầm ngục" pages are built from.
 *
 * Files read:
 *   MythicMobs/mobs/Dungeon/Tang<NN>.yml     the mobs of a tier: name, health, damage and what they give when they die
 *   MythicMobs/skills/Dungeon/Tang<NN>.yml   the skills called on death (boss rewards are skills "..._Reward")
 *   MMOItems/item/<type>.yml                 the names of the items a mob drops (only those that exist are listed)
 *   TurtleCurrency/currencies.yml            checks the currency a drop command pays in
 *   SD-Dungeon/floors/tang<NN>.yml           the outbreak (bùng nổ) of each tier: name, length, announcement, mobs, effects, lockdown, bombardment.
 *                                            The points that start an outbreak are hidden from players on purpose and are never copied.
 *   TurtleCraft/categories.yml               the name of each tier
 *   SD-Crates/crates/tang<n>.yml             the equipment crate of each tier: price of a spin, the spin buttons, chance of each grade
 *
 * What counts as a drop: a command run on death (`~onDeath`), directly on the mob or in a skill it calls:
 *   eco give <player> <n | <random.AtoB>> dungeon<N>      Dungeon Coins
 *   mi give <TYPE> <ID> <player> <amount> ...             an MMOItems item (chance = the number after ~onDeath, else always)
 *   give <player> <material> <n | <random.AtoB>>          a plain item
 * A drop that cannot be shown truthfully is left out and reported on the console, never guessed: an item that is not in
 * MMOItems any more, an amount that is a variable, a currency the server does not have.
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
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { parse } from 'yaml';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const TIERS = 15;
// the grades of the equipment crates (the order of the columns on the page), by the rarity key of the crate file
const CRATE_RARITY = { 'tan-binh': 'TANBINH', 'chien-binh': 'CHIENBINH', 'ky-si': 'KYSI', 'lanh-chua': 'LANHCHUA', 'quan-vuong': 'QUANVUONG', 'de-vuong': 'DEVUONG' };

const args = process.argv.slice(2);
const flag = (name) => args.includes(name);
const option = (name) => {
	const i = args.indexOf(name);
	return i >= 0 ? args[i + 1] : undefined;
};
function fail(message) {
	console.error(`sync-dungeon: ${message}`);
	process.exit(1);
}
const warnings = [];
const warn = (message) => warnings.push(message);

const { servers } = await import(pathToFileURL(join(ROOT, 'src/data/servers.mjs')).href);
const serverSlug = option('--server') ?? servers[0]?.slug;
if (!servers.some((s) => s.slug === serverSlug)) fail(`unknown server "${serverSlug}" (see src/data/servers.mjs)`);
const OUT = join(ROOT, 'src/data/servers', serverSlug, 'dungeon.json');

// ---------- sources ----------
function diskSource(dir) {
	const base = resolve(dir);
	return {
		async read(path) {
			const file = join(base, path);
			return existsSync(file) ? readFileSync(file, 'utf8') : null;
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

async function readYaml(path, required = true) {
	const text = await source.read(path);
	if (text === null) {
		if (required) fail(`${path} not found`);
		return null;
	}
	try {
		return parse(text) ?? {};
	} catch (error) {
		fail(`${path}: ${error.message}`);
	}
}

// ---------- helpers ----------
/** Removes color codes and MiniMessage tags: "<#D1D5DB>&lĐá Nền" -> "Đá Nền". */
const plain = (text) => String(text ?? '').replace(/<[^<>]*>/g, '').replace(/&#[0-9a-fA-F]{6}/g, '').replace(/&[0-9a-fk-orA-FK-OR]/g, '').replace(/\s+/g, ' ').trim();
const SMALL_CAPS = 'ᴀʙᴄᴅᴇꜰɢʜɪᴊᴋʟᴍɴᴏᴘǫʀѕᴛᴜᴠᴡхʏᴢ';
const unSmallCaps = (text) => [...text].map((c) => { const i = SMALL_CAPS.indexOf(c); return i >= 0 ? 'abcdefghijklmnopqrstuvwxyz'[i] : c; }).join('');
const titleCase = (text) => text.split(' ').map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w)).join(' ');
const prettyMaterial = (id) => id.split('_').map((w) => w[0].toUpperCase() + w.slice(1)).join(' ');
const round = (n) => Math.round(Number(n) * 1000) / 1000;

// ---------- load ----------
const categories = (await readYaml('TurtleCraft/categories.yml')).categories ?? {};
const currencyIds = new Set(Object.keys(await readYaml('TurtleCurrency/currencies.yml')));

const skills = {};
for (let n = 1; n <= TIERS; n++) Object.assign(skills, (await readYaml(`MythicMobs/skills/Dungeon/Tang${String(n).padStart(2, '0')}.yml`)) ?? {});

const itemFiles = new Map();
async function itemName(type, id) {
	const key = type.toLowerCase();
	if (!itemFiles.has(key)) itemFiles.set(key, await readYaml(`MMOItems/item/${key}.yml`, false));
	const item = itemFiles.get(key)?.[id.toUpperCase()];
	return item ? plain(item.base?.name) || null : null;
}

/** The amount of a command: "3", "<random.2to4>" or null for a variable. */
function amountOf(text) {
	const fixed = /^(\d+)$/.exec(text);
	if (fixed) return { min: Number(fixed[1]), max: Number(fixed[1]) };
	const range = /^<random\.(\d+)to(\d+)>$/.exec(text);
	if (range) return { min: Number(range[1]), max: Number(range[2]) };
	return null;
}

/** The chance of a skill line ("... ~onDeath 0.35" is 35%, no number is always). */
function chanceOf(line) {
	const m = /~onDeath\s+([0-9.]+)\s*$/.exec(line);
	return m ? round(Number(m[1]) * 100) : 100;
}

/** Everything a death line pays: coins, items, plain items. `reach` is the radius when the reward goes to every player nearby. */
async function dropsOf(line, mobId, depth = 0, reach = 0, inheritedChance = 100) {
	const out = { coins: [], items: [], plainItems: [] };
	const chance = round((chanceOf(line) * inheritedChance) / 100);
	const skillCall = /skill\{s=([^;}]+)[;}][^@]*@(\w+)(?:\{r=(\d+)\})?/.exec(line);
	const command = /command\{c="([^"]+)"\}/.exec(line);
	if (command) {
		await addCommand(out, command[1], chance, mobId, reach);
	} else if (skillCall && depth < 3) {
		const name = skillCall[1].trim();
		const body = skills[name];
		if (!body) {
			warn(`${mobId}: the death skill ${name} is not in skills/Dungeon`);
			return out;
		}
		const radius = skillCall[3] ? Number(skillCall[3]) : reach;
		for (const inner of body.Skills ?? []) {
			const nested = await dropsOf(`${inner} ~onDeath ${chance / 100}`, mobId, depth + 1, radius, 100);
			out.coins.push(...nested.coins);
			out.items.push(...nested.items);
			out.plainItems.push(...nested.plainItems);
		}
	}
	return out;
}

async function addCommand(out, text, chance, mobId, reach) {
	let m = /^eco give (\S+) (\S+) (\S+)$/.exec(text);
	if (m) {
		const amount = amountOf(m[2]);
		const currency = /^dungeon(\d+)$/.exec(m[3]);
		if (!amount) return; // a variable amount (money stolen by a goblin...) cannot be shown
		if (!currency) return warn(`${mobId}: pays in "${m[3]}", which is not a dungeon currency`);
		if (!currencyIds.has(m[3]) && !currencyIds.has(`d${currency[1]}`)) return warn(`${mobId}: pays in "${m[3]}", the server has no such currency`);
		if (!currencyIds.has(m[3])) warn(`${mobId}: pays in "${m[3]}" but the currency is "d${currency[1]}" in TurtleCurrency/currencies.yml`);
		return void out.coins.push({ ...amount, tier: Number(currency[1]), chance, reach });
	}
	m = /^mi give (\w+) (\w+) (\S+) (\d+)(?:-(\d+))? /.exec(`${text} `);
	if (m) {
		const name = await itemName(m[1], m[2]);
		if (!name) return warn(`${mobId}: drops ${m[1]}:${m[2]}, which is not in MMOItems any more (left out)`);
		return void out.items.push({ name, type: m[1].toUpperCase(), id: m[2].toUpperCase(), min: Number(m[4]), max: Number(m[5] ?? m[4]), chance, reach });
	}
	m = /^give (\S+) ([a-z0-9_]+) (\S+)$/.exec(text);
	if (m) {
		const amount = amountOf(m[3]);
		if (!amount) return;
		return void out.plainItems.push({ name: prettyMaterial(m[2]), ...amount, chance, reach });
	}
}

function classify(mob) {
	const display = plain(String(mob.Display ?? '').replace(/<mob\.[^>]*>/g, '').replace(/❤|\[Lv\.?\]/g, ''));
	const tag = /^\s*(?:[^\w\s\[\]]\s*)?\[([^\]]+)\]/u.exec(display)?.[1] ?? null;
	const name = display.replace(/\[[^\]]+\]/g, '').replace(/[✦⚡👁]/gu, '').replace(/\s+/g, ' ').trim();
	const template = String(mob.Template ?? '');
	if (template.startsWith('BOSS')) {
		let kind = 'Boss đặc biệt';
		if (/BÙNG NỔ/i.test(tag ?? '')) kind = 'Boss bùng nổ';
		else if (/CỔNG/i.test(tag ?? '')) kind = 'Boss cổng';
		else if (/BOSS/i.test(tag ?? '')) kind = 'Boss tầng';
		const pretty = name === name.toUpperCase() ? titleCase(name.toLowerCase()) : name;
		return { group: 'boss', kind, name: pretty, outbreak: kind === 'Boss bùng nổ' };
	}
	if (/^Tinh Anh$/i.test(tag ?? '')) return { group: 'elite', kind: 'Tinh anh', name, outbreak: false };
	if (/^Bùng Nổ$/i.test(tag ?? '')) return { group: 'normal', kind: 'Quái bùng nổ', name, outbreak: true };
	if (!tag) return { group: 'other', kind: 'Đặc biệt', name, outbreak: false };
	return { group: 'normal', kind: 'Quái thường', name, outbreak: false };
}

// ---------- main ----------
const tiers = [];
for (let n = 1; n <= TIERS; n++) {
	const category = categories[`tang${n}_doido`];
	if (!category) fail(`TurtleCraft/categories.yml has no tang${n}_doido`);
	const title = plain(category.title).split('»').slice(1).join('»').trim();
	if (!title) fail(`tang${n}_doido has no title after »`);

	const mobsFile = await readYaml(`MythicMobs/mobs/Dungeon/Tang${String(n).padStart(2, '0')}.yml`);
	const mobs = [];
	for (const [id, mob] of Object.entries(mobsFile)) {
		if (!/^Tang\d+_/.test(id)) continue;
		const { group, kind, name, outbreak } = classify(mob);
		const drops = { coins: [], items: [], plainItems: [] };
		for (const line of mob.Skills ?? []) {
			if (!/~onDeath/.test(line)) continue;
			const found = await dropsOf(line, id);
			drops.coins.push(...found.coins);
			drops.items.push(...found.items);
			drops.plainItems.push(...found.plainItems);
		}
		const coins = drops.coins.filter((c) => c.tier === n);
		for (const c of drops.coins) if (c.tier !== n) warn(`${id}: pays in dungeon${c.tier}, not in dungeon${n} of its own tier`);
		const rewardCoin = coins.length ? { min: coins.reduce((s, c) => s + c.min, 0), max: coins.reduce((s, c) => s + c.max, 0), reach: Math.max(...coins.map((c) => c.reach)) } : null;
		mobs.push({
			id,
			name,
			kind,
			group,
			outbreak: Boolean(outbreak),
			health: Number(mob.Health),
			damage: mob.Damage === undefined ? null : Number(mob.Damage),
			coins: rewardCoin,
			items: [...drops.items.map(({ name: item, min, max, chance, reach }) => ({ item, min, max, chance, reach })), ...drops.plainItems.map(({ name: item, min, max, chance, reach }) => ({ item, min, max, chance, reach }))],
		});
	}
	if (!mobs.length) fail(`MythicMobs/mobs/Dungeon/Tang${String(n).padStart(2, '0')}.yml has no mobs`);

	const floor = await readYaml(`SD-Dungeon/floors/tang${String(n).padStart(2, '0')}.yml`);
	const ob = floor.outbreak ?? {};
	if (!ob.name) fail(`SD-Dungeon/floors/tang${String(n).padStart(2, '0')}.yml has no outbreak.name`);
	const known = new Set(mobs.map((m) => m.id));
	const spawns = Object.values(ob.spawns ?? {}).map((sp) => {
		if (!known.has(sp.mob)) fail(`tang${n} outbreak spawns ${sp.mob}, which is not in MythicMobs/mobs/Dungeon`);
		return { mob: String(sp.mob), amount: Number(sp.amount ?? 1), delaySeconds: Number(sp['delay-seconds'] ?? 0) };
	});
	const spawned = new Set(spawns.map((sp) => sp.mob));
	const outbreak = {
		name: String(ob.name),
		durationSeconds: Number(ob['duration-seconds']),
		announcement: plain(String(ob['start-message'] ?? '')).replace(/%name%/g, String(ob.name)),
		spawns,
		// mobs tagged as outbreak mobs that the outbreak does not spawn itself (a boss that arrives later, a summon...)
		alsoMobs: mobs.filter((m) => m.outbreak && !spawned.has(m.id)).map((m) => m.id),
		effects: (ob['player-effects'] ?? []).map((e) => String(e).split(':')[0].toUpperCase()),
		weather: ob['player-weather'] ? String(ob['player-weather']).toUpperCase() : null,
		night: ob['player-time'] !== undefined && Number(ob['player-time']) >= 13000 && Number(ob['player-time']) <= 23000,
		lockdownSeconds: ob.lockdown ? Number(ob.lockdown.seconds) : 0,
		bombard: ob.bombard ? { intervalSeconds: Number(ob.bombard['interval-seconds']), perSalvo: Number(ob.bombard['per-salvo']), radius: Number(ob.bombard.radius) } : null,
	};
	if (!Number.isFinite(outbreak.durationSeconds) || outbreak.durationSeconds <= 0) fail(`tang${n} outbreak has no duration-seconds`);

	const crate = await readYaml(`SD-Crates/crates/tang${n}.yml`);
	const price = Number(crate.price);
	const options = Object.values(crate['spin-options'] ?? {}).map((o) => ({ spins: Number(o.spins), cost: o.cost === undefined ? price * Number(o.spins) : Number(o.cost) })).sort((a, b) => a.spins - b.spins);
	const totalWeight = Object.values(crate.rarities ?? {}).reduce((sum, r) => sum + Number(r.weight ?? 0), 0);
	const chances = {};
	for (const [key, gradeId] of Object.entries(CRATE_RARITY)) {
		const weight = Number(crate.rarities?.[key]?.weight);
		if (!Number.isFinite(weight)) fail(`SD-Crates/crates/tang${n}.yml has no rarity ${key}`);
		chances[gradeId] = round((weight / totalWeight) * 100);
	}
	tiers.push({
		n,
		name: titleCase(unSmallCaps(title)),
		outbreak,
		crate: { name: `Rương Tầng ${n}`, currency: String(crate.currency), price, options, chances },
		mobs,
	});
}

for (const message of [...new Set(warnings)].sort()) console.warn(`sync-dungeon: warning: ${message}`);

const text = JSON.stringify({ tiers }, null, '\t') + '\n';
const before = existsSync(OUT) ? readFileSync(OUT, 'utf8') : '';
if (before === text) {
	console.log('sync-dungeon: no change');
} else if (flag('--check')) {
	fail('dungeon.json is out of date, run the sync');
} else {
	mkdirSync(dirname(OUT), { recursive: true });
	writeFileSync(OUT, text, 'utf8');
	console.log(`sync-dungeon: written to ${OUT.slice(ROOT.length + 1).replace(/\\/g, '/')}`);
}
