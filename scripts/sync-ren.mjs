#!/usr/bin/env node
/**
 * Reads the Dungeon system of the Sky Rèn server (6 dungeons) and the reward chests the bosses give, and writes the
 * player-facing facts to src/data/servers/sky-ren/dungeons.json and chests.json, which the "Dungeon" and "Rương quà"
 * pages of Sky Rèn are built from.
 *
 * Files read (relative to the plugins folder of the server repo):
 *   DeluxeMenus/gui_menus/menuDungeon.yml         name, difficulty and final boss of each dungeon (the /dungeon menu)
 *   MythicMobs/mobs/Dungeon/dungeon<N>.yml        the mobs of a dungeon: name, health, damage, exp, money, what they give on death
 *   MythicMobs/skills/Skill Dungeon/Dungeon<N>.yml   the reward skills a boss calls on death (rewards of the players nearby)
 *   MythicMobs/skills/KillerRewards.yml           the reward of the player who lands the killing blow of a boss
 *   MMOItems/item/{material,consumable}.yml       the names of the items that are given
 *   CrateReloaded/crates/<Crate>.yml              the chests the bosses give (item, how many rewards one opening gives, every reward and its chance)
 *   ItemAbility/gems.yml                          the names of the gems (Lửa phép) a chest gives
 *   SkyEnchants/groups.yml                        the names of the enchant book groups (also: dust chance, level cap of random books)
 *   SkyEnchants/enchantments/<GROUP>.yml          every enchant book: name, description, what it goes on, per-level activation chance / cooldown / souls, requirements   -> enchants.json
 *   SkyEnchants/gui/{enchanter,mavang,book-tools}.yml, SkyEnchants/config.yml   book prices (EXP), gilding (Mạ vàng) cost, enchant slots, shortcut commands
 *
 * What counts as a reward (a command run on death, directly on the mob or inside a reward skill):
 *   mi give <TYPE> <ID> <player> <amount> ...      an MMOItems item
 *   tt add <player> <currency> <n | <random.AtoB>> a dungeon currency (daquy = Đá Quý, bangngoc = Băng Ngọc)
 *   points give <player> <n>                       Xu
 *   exp give / src exp <player> <n>                experience
 *   crazycrates give v cauvong <n> <player>        Cầu Vồng key
 *   cr give to <player> <crate> <n> [offline]      a chest (the item to right-click)
 *   cr open <player> <crate>                       opens a chest at once (a reward of a chest)
 *   se giveitem/giveremove/givercbook, give, itemability gem, wildstacker:stacker give   rewards of the chests
 *   mme reward <player> <block> <n>                a block reward
 * A line that cannot be shown truthfully is left out and reported on the console, never guessed.
 *
 * Usage:  node scripts/sync-ren.mjs --dir <plugins folder> [--check]
 * Only whitelisted facts are copied. The output has no timestamp, so a run that finds nothing new leaves the file unchanged.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname, resolve, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'yaml';
import { buildEquipment } from './ren-equipment.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SERVER = 'sky-ren';
const OUT = join(ROOT, 'src/data/servers', SERVER, 'dungeons.json');
const OUT_CHESTS = join(ROOT, 'src/data/servers', SERVER, 'chests.json');
const OUT_ENCHANTS = join(ROOT, 'src/data/servers', SERVER, 'enchants.json');
const OUT_EQUIPMENT = join(ROOT, 'src/data/servers', SERVER, 'gear.json');
const COUNT = 6;

const args = process.argv.slice(2);
const flag = (name) => args.includes(name);
const option = (name) => {
	const i = args.indexOf(name);
	return i >= 0 ? args[i + 1] : undefined;
};
function fail(message) {
	console.error(`sync-ren: ${message}`);
	process.exit(1);
}
const warnings = [];
const warn = (message) => warnings.push(message);

if (!option('--dir')) fail('give the plugins folder of the server: --dir <plugins folder>');
const BASE = resolve(option('--dir'));
function readYaml(path) {
	const file = join(BASE, path);
	if (!existsSync(file)) fail(`${path} not found in ${BASE}`);
	try {
		return parse(readFileSync(file, 'utf8')) ?? {};
	} catch (error) {
		fail(`${path}: ${error.message}`);
	}
}

// ---------- text helpers ----------
const SMALL_CAPS = 'ᴀʙᴄᴅᴇꜰɢʜɪᴊᴋʟᴍɴᴏᴘǫʀѕᴛᴜᴠᴡхʏᴢ';
const unSmallCaps = (text) => [...text].map((c) => { const i = SMALL_CAPS.indexOf(c); return i >= 0 ? 'abcdefghijklmnopqrstuvwxyz'[i] : c; }).join('');
/** Removes color codes (&a, §a, &#rrggbb) and MiniMessage / placeholder tags (<mob.hp>). */
const stripCodes = (text) => String(text ?? '').replace(/<[^<>]*>/g, '').replace(/&#[0-9a-fA-F]{6}/g, '').replace(/[&§][0-9a-fk-orA-FK-OR]/g, '');
/** Keeps letters, digits, spaces and a few marks; drops symbols (★ ❤ ✣ 乂 ｡ |) and fixes the case: UPPER and lower words both become "Title Case". */
function pretty(text, { keepBrackets = false } = {}) {
	const kept = unSmallCaps(stripCodes(text))
		.replace(keepBrackets ? /[\[\]]/g : /\[[^\]]*\]/g, ' ')
		.replace(/\(\s*lvl[^)]*\)/gi, ' ')
		.replace(/[^\p{L}\p{N}\s()'.:&-]/gu, ' ')
		.replace(/\p{Script=Han}/gu, ' ')
		.replace(/\(\s+/g, '(')
		.replace(/\s+\)/g, ')')
		.replace(/\(\)/g, ' ');
	return kept
		.split(/\s+/)
		.filter(Boolean)
		.map((w) => {
			const letters = w.replace(/[^\p{L}]/gu, '');
			if (/^[IVX]+$/.test(w)) return w; // roman numerals: Quái Vật II
			const upper = letters.length > 1 && letters === letters.toUpperCase();
			const head = w[0].toUpperCase();
			const tail = w.slice(1);
			return head + (upper ? tail.toLowerCase() : tail);
		})
		.join(' ')
		.trim();
}
const round = (n) => Math.round(Number(n) * 1000) / 1000;

// ---------- item names ----------
const itemFiles = {};
const itemInfo = (type, id) => {
	const key = type.toLowerCase();
	itemFiles[key] ??= existsSync(join(BASE, `MMOItems/item/${key}.yml`)) ? readYaml(`MMOItems/item/${key}.yml`) : {};
	const item = itemFiles[key][id.toUpperCase()];
	const name = item ? pretty(item.base?.name, { keepBrackets: true }) : '';
	return name ? { name, icon: item.base?.material ? String(item.base.material).toLowerCase() : null } : null;
};

// ---------- rewards ----------
const CURRENCIES = { daquy: 'Đá Quý', bangngoc: 'Băng Ngọc' };
const BLOCKS = { diamond_block: 'Khối Kim Cương', iron_block: 'Khối Sắt', gold_block: 'Khối Vàng', lapis_block: 'Khối Lapis', emerald_block: 'Khối Ngọc Lục Bảo' };
// ---------- chests ----------
const BOOK_GROUPS = Object.fromEntries(Object.entries(readYaml('SkyEnchants/groups.yml').groups ?? {}).map(([id, g]) => [id, String(g['group-name'] ?? '').trim()]));
const GEMS = readYaml('ItemAbility/gems.yml').Items ?? {};
const MOBS = { pig: 'Lợn', cow: 'Bò', chicken: 'Gà', zombie: 'Zombie', skeleton: 'Skeleton', creeper: 'Creeper', spider: 'Nhện', enderman: 'Enderman', blaze: 'Quỷ lửa', iron_golem: 'Iron Golem', ghast: 'Ghast' };
const LUA_PHEP = { LuaPhepThuong: 'Thường', LuaPhepToiCao: 'Tối Cao', LuaPhepTruyenThuyet: 'Truyền Thuyết' };
/** Name and kind of a chest from its id (what players call them: the event menus say "Rương Lửa Phép Tối Cao"). */
function chestNaming(id) {
	let m = /^BossDungeon(\d+)$/.exec(id);
	if (m) return { name: `Rương Quà Boss Dungeon ${m[1]}`, kind: 'boss', order: Number(m[1]) };
	m = /^Spawner(\d+)$/.exec(id);
	if (m) return { name: `Rương Spawner ${m[1]}`, kind: 'spawner', order: Number(m[1]) };
	if (LUA_PHEP[id]) return { name: `Rương Lửa Phép ${LUA_PHEP[id]}`, kind: 'lua-phep', order: Object.keys(LUA_PHEP).indexOf(id) + 1 };
	return null;
}
const chests = new Map(); // id -> chest, filled while the rewards are read
/** Registers a chest (and, through "cr open", the chests it opens) and returns it, or null when it cannot be shown. */
function chestOf(id, where) {
	if (chests.has(id)) return chests.get(id);
	const naming = chestNaming(id);
	if (!naming) return void warn(`${where}: chest ${id} has no known name (left out)`);
	const file = `CrateReloaded/crates/${id}.yml`;
	if (!existsSync(join(BASE, file))) return void warn(`${where}: ${file} not found (chest left out)`);
	const crate = readYaml(file)[id];
	if (!crate) return void warn(`${file}: no "${id}" section (chest left out)`);
	const chest = { id: id.toLowerCase(), ...naming, icon: String(crate.item ?? '').split(/\s+/)[0].toLowerCase() || null, min: Number(crate.reward?.['minimum-rewards']), max: Number(crate.reward?.['maximum-rewards']), total: 0, rewards: [], sources: [] };
	chests.set(id, chest);
	for (const entry of crate.reward?.rewards ?? []) {
		const text = String(entry);
		const chance = Number(/chance:\(([\d.]+)\)/.exec(text)?.[1]);
		const commands = [...text.matchAll(/cmd:\(([^)]*)\)/g)].map((c) => c[1]).filter((c) => !/^\/?tcsendmsg /.test(c)); // tcsendmsg only tells the player what they got
		if (!Number.isFinite(chance) || commands.length !== 1) {
			warn(`${file}: cannot read the reward "${text}" (left out)`);
			continue;
		}
		chest.total = round(chest.total + chance);
		const reward = rewardOf(commands[0].replace(/^\//, '').replace(/\{player\}/g, '<trigger.name>'), chance, file);
		if (reward) chest.rewards.push(reward);
	}
	if (!chest.rewards.length || !Number.isFinite(chest.min) || !Number.isFinite(chest.max)) fail(`${file}: no rewards or no minimum/maximum-rewards`);
	return chest;
}

/** "3" -> {min:3,max:3}; "<random.3to5>" -> {min:3,max:5}; anything else (a variable) -> null. */
function amountOf(text) {
	const fixed = /^(\d+)$/.exec(text);
	if (fixed) return { min: Number(fixed[1]), max: Number(fixed[1]) };
	const range = /^<random\.(\d+)to(\d+)>$/.exec(text);
	if (range) return { min: Number(range[1]), max: Number(range[2]) };
	return null;
}
/** The chance written after the targeter of a skill line ("@trigger ~onDeath 0.3" or "@trigger 0.2"): 0.3 is 30%; none is always. */
function chanceOf(line) {
	const m = /(?:~onDeath\s+|@\w+(?:\{[^}]*\})?\s+)([0-9.]+)\s*$/.exec(line);
	return m ? round(Number(m[1]) * 100) : 100;
}

/** One command of a reward -> a reward entry, or null (reported). */
function rewardOf(command, chance, where) {
	const text = command.replace(/<(?:trigger|target)\.name>/g, '@P');
	let m = /^mi give (\w+) (\w+) @P (\d+)(?: \d+ \d+ \d+ silent)?$/.exec(text) ?? /^mi give (\w+) (\w+) @P (\d+)\b/.exec(text);
	if (m) {
		const info = itemInfo(m[1], m[2]);
		if (!info) return void warn(`${where}: drops ${m[1]}:${m[2]}, which is not in MMOItems (left out)`);
		return { type: 'item', name: info.name, icon: info.icon, min: Number(m[3]), max: Number(m[3]), chance };
	}
	m = /^tt add @P (\w+) (\S+)$/.exec(text);
	if (m) {
		const amount = amountOf(m[2]);
		if (!CURRENCIES[m[1]]) return void warn(`${where}: tt add ${m[1]} is not a known currency (left out)`);
		if (!amount) return void warn(`${where}: tt add amount "${m[2]}" cannot be shown (left out)`);
		return { type: 'currency', name: CURRENCIES[m[1]], ...amount, chance };
	}
	m = /^points give @P (\d+)$/.exec(text);
	if (m) return { type: 'xu', name: 'Xu', icon: 'gold_ingot', min: Number(m[1]), max: Number(m[1]), chance };
	m = /^(?:exp give|src exp) @P (\d+)$/.exec(text);
	if (m) return { type: 'exp', name: 'Kinh nghiệm', icon: 'experience_bottle', min: Number(m[1]), max: Number(m[1]), chance };
	m = /^crazycrates give v cauvong (\d+) @P$/.exec(text);
	if (m) return { type: 'key', name: 'Chìa khóa Cầu Vồng', icon: 'clay_ball', min: Number(m[1]), max: Number(m[1]), chance };
	m = /^cr give to @P (\w+) (\d+)(?: offline)?$/.exec(text);
	if (m) {
		const chest = chestOf(m[1], where);
		return chest && { type: 'chest', name: chest.name, icon: chest.icon, chest: chest.id, min: Number(m[2]), max: Number(m[2]), chance };
	}
	m = /^cr open @P (\w+)$/.exec(text);
	if (m) {
		const chest = chestOf(m[1], where);
		return chest && { type: 'chest', name: `Mở ngay ${chest.name}`, icon: chest.icon, chest: chest.id, opens: true, min: 1, max: 1, chance };
	}
	m = /^se giveitem @P slotincreaser (\d+)$/.exec(text);
	if (m) return { type: 'item', name: 'Ô cường hóa', icon: 'ender_eye', min: Number(m[1]), max: Number(m[1]), chance };
	m = /^se giveremove @P (\d+)$/.exec(text);
	if (m) return { type: 'item', name: 'Cục thối', icon: 'rotten_flesh', min: Number(m[1]), max: Number(m[1]), chance };
	m = /^se givercbook (\w+) @P (\d+)$/.exec(text);
	if (m) {
		if (!BOOK_GROUPS[m[1]]) return void warn(`${where}: enchant book group ${m[1]} is not in SkyEnchants/groups.yml (left out)`);
		return { type: 'item', name: `Sách phép ${BOOK_GROUPS[m[1]]} ngẫu nhiên`, icon: 'book', min: Number(m[2]), max: Number(m[2]), chance };
	}
	m = /^give @P enchanted_golden_apple (\d+)$/.exec(text);
	if (m) return { type: 'item', name: 'Táo vàng phù phép', icon: 'golden_apple', min: Number(m[1]), max: Number(m[1]), chance };
	m = /^itemability gem @P (\w+) (\d+)$/.exec(text);
	if (m) {
		const gem = GEMS[m[1]];
		// "&7&l๖Lửa phép &7(+Sát Thương) I" -> "Lửa phép (+Sát Thương) I" (the plus of the stat stays)
		const name = gem && stripCodes(gem.Name).replace(/[\p{Script=Thai}\p{Script=Han}]/gu, '').replace(/[^\p{L}\p{N}\s()+.-]/gu, '').replace(/\s+/g, ' ').trim();
		if (!name) return void warn(`${where}: gem ${m[1]} is not in ItemAbility/gems.yml (left out)`);
		return { type: 'item', name, icon: String(gem.Material ?? '').toLowerCase() || null, min: Number(m[2]), max: Number(m[2]), chance };
	}
	m = /^wildstacker:stacker give @P spawner (\w+) (\d+)$/.exec(text);
	if (m) {
		if (!MOBS[m[1]]) return void warn(`${where}: spawner of ${m[1]} has no known name (left out)`);
		return { type: 'item', name: `Spawner ${MOBS[m[1]]}`, icon: 'spawner', min: Number(m[2]), max: Number(m[2]), chance };
	}
	m = /^mme reward @P (\w+) (\d+)$/.exec(text);
	if (m) {
		if (!BLOCKS[m[1]]) return void warn(`${where}: mme reward ${m[1]} is not a known block (left out)`);
		return { type: 'block', name: BLOCKS[m[1]], icon: m[1], min: Number(m[2]), max: Number(m[2]), chance };
	}
	if (/^bc /.test(text)) return null; // an announcement
	warn(`${where}: unknown command "${command}" (left out)`);
	return null;
}

/** Same reward twice in one group (two stacks of 64) becomes one entry with the sum. */
function merge(list) {
	const out = [];
	for (const r of list) {
		const same = out.find((o) => o.type === r.type && o.name === r.name && o.chance === r.chance && o.min === o.max && r.min === r.max);
		if (same) {
			same.min += r.min;
			same.max += r.max;
		} else out.push({ ...r });
	}
	return out;
}

const skillCache = {};
function skillsOf(n) {
	skillCache[n] ??= readYaml(`MythicMobs/skills/Skill Dungeon/Dungeon${n}.yml`);
	return skillCache[n];
}
const killerSkills = readYaml('MythicMobs/skills/KillerRewards.yml');

function rewardsOfSkill(skill, where) {
	const list = [];
	for (const line of skill?.Skills ?? []) {
		const command = /command\{c="([^"]+)"\}/.exec(line)?.[1];
		if (!command) continue;
		const reward = rewardOf(command, chanceOf(line), where);
		if (reward) list.push(reward);
	}
	return merge(list);
}

// ---------- the menu: name, difficulty, final boss ----------
const menu = readYaml('DeluxeMenus/gui_menus/menuDungeon.yml').items ?? {};
function menuEntry(n) {
	const item = menu[`Dungeon${n}`];
	if (!item) fail(`menuDungeon.yml has no Dungeon${n}`);
	const name = pretty(String(item.display_name).split('|').slice(1).join('|'));
	const lore = (item.lore ?? []).map((l) => stripCodes(l));
	const diff = lore.find((l) => /Độ khó/.test(l)) ?? '';
	const stars = [...diff].filter((c) => c === '★').length;
	const max = stars + [...diff].filter((c) => c === '☆').length;
	const label = /\(([^)]+)\)\s*$/.exec(diff)?.[1] ?? null;
	const finalBoss = lore.find((l) => /Boss cuối/.test(l))?.replace(/^.*Boss cuối:\s*/, '').trim() ?? null;
	if (!name || !stars || !label || !finalBoss) fail(`menuDungeon.yml Dungeon${n}: cannot read name, difficulty or final boss`);
	return { name, difficulty: { stars, max, label }, finalBoss };
}

// ---------- the mobs ----------
// What the mob looks like in the game: the entity of its disguise (a disguise "player" has a custom skin we do not have, so it is
// the entity the mob is), else its type. A giant is drawn as a zombie.
function appearanceOf(mob) {
	const disguise = /^(\w+)/.exec(String(mob.Disguise ?? ''))?.[1];
	const entity = disguise && disguise.toLowerCase() !== 'player' ? disguise : (mob.Type ?? mob.Mobtype ?? '');
	const id = String(entity).toUpperCase();
	return id === 'GIANT' ? 'ZOMBIE' : id || null;
}
function mobOf(id, mob, n) {
	const display = String(mob.Display ?? '');
	const clean = stripCodes(display);
	const title = /\(([^)]+)\)/.exec(clean)?.[1]?.trim() ?? null;
	const killer = (mob.Skills ?? []).find((l) => /skill\{s=KillerReward-[^}]+\}\s*@trigger/.test(l));
	const isBoss = Boolean(killer);
	const name = pretty(clean.replace(/\([^)]*\)/g, ' '));
	const out = { id, name, appearance: appearanceOf(mob), kind: isBoss ? 'boss' : 'normal', title: isBoss && title && !/^boss$/i.test(title) ? title : null, health: Number(mob.Health), damage: mob.Damage === undefined ? null : Number(mob.Damage), exp: null, money: null, drops: [], killer: [], nearby: [] };
	for (const d of mob.Drops ?? []) {
		const text = String(d).trim();
		let m = /^exp (\d+)$/i.exec(text);
		if (m) out.exp = Number(m[1]);
		m = /^money (\d+)(?: ([0-9.]+))?$/i.exec(text);
		if (m) out.money = { amount: Number(m[1]), chance: m[2] === undefined ? 100 : round(Number(m[2]) * 100) };
	}
	const drops = [];
	for (const line of mob.Skills ?? []) {
		if (!/~onDeath/.test(line)) continue;
		const command = /command\{c="([^"]+)"\}/.exec(line)?.[1];
		if (command) {
			const reward = rewardOf(command, chanceOf(line), id);
			if (reward) drops.push(reward);
			continue;
		}
		const call = /skill\{s=([^;}]+)\}\s*(@\w+)(?:\{([^}]*)\})?/.exec(line);
		if (!call) continue; // announcements and the like (message{...})
		const skillName = call[1].trim();
		if (skillName.startsWith('KillerReward-')) {
			const body = killerSkills[skillName];
			if (!body) {
				warn(`${id}: the killer reward ${skillName} is not in KillerRewards.yml`);
				continue;
			}
			out.killer = rewardsOfSkill(body, skillName);
			continue;
		}
		const body = skillsOf(n)[skillName];
		if (!body) {
			warn(`${id}: the death skill ${skillName} is not in Skill Dungeon/Dungeon${n}.yml`);
			continue;
		}
		if (call[2].toLowerCase() !== '@pir') {
			warn(`${id}: ${skillName} is aimed at ${call[2]}, not at players in a radius (left out)`);
			continue;
		}
		const options = Object.fromEntries((call[3] ?? '').split(';').filter(Boolean).map((kv) => kv.split('=')));
		out.nearby.push({ reach: Number(options.r), limit: options.limit === undefined ? null : Number(options.limit), rewards: rewardsOfSkill(body, skillName) });
	}
	out.drops = merge(drops);
	if (out.nearby.some((g) => !Number.isFinite(g.reach))) fail(`${id}: a reward skill has no radius`);
	return out;
}

// ---------- main ----------
const dungeons = [];
for (let n = 1; n <= COUNT; n++) {
	const file = readYaml(`MythicMobs/mobs/Dungeon/dungeon${n}.yml`);
	const mobs = Object.entries(file).filter(([id]) => id.startsWith(`Dun${n}`)).map(([id, mob]) => mobOf(id, mob, n));
	if (!mobs.length) fail(`MythicMobs/mobs/Dungeon/dungeon${n}.yml has no mobs`);
	const entry = menuEntry(n);
	if (!mobs.some((m) => m.kind === 'boss')) fail(`dungeon ${n} has no boss (no mob calls a KillerReward skill)`);
	dungeons.push({ n, ...entry, mobs: [...mobs.filter((m) => m.kind === 'normal'), ...mobs.filter((m) => m.kind === 'boss')] });
}

// where each chest comes from: which boss gives it (and to whom), which chest opens it
const chestBySlug = (slug) => [...chests.values()].find((c) => c.id === slug);
for (const d of dungeons) {
	for (const mob of d.mobs.filter((m) => m.kind === 'boss')) {
		for (const r of mob.killer.filter((x) => x.type === 'chest')) chestBySlug(r.chest).sources.push({ type: 'boss', dungeon: d.n, boss: mob.name, who: 'killer' });
		for (const g of mob.nearby) for (const r of g.rewards.filter((x) => x.type === 'chest')) chestBySlug(r.chest).sources.push({ type: 'boss', dungeon: d.n, boss: mob.name, who: 'nearby', reach: g.reach, limit: g.limit });
	}
}
for (const parent of chests.values()) for (const r of parent.rewards.filter((x) => x.type === 'chest')) chestBySlug(r.chest).sources.push({ type: 'chest', chest: parent.id });
const KIND_ORDER = ['boss', 'spawner', 'lua-phep'];
const chestList = [...chests.values()].sort((a, b) => KIND_ORDER.indexOf(a.kind) - KIND_ORDER.indexOf(b.kind) || a.order - b.order).map(({ order, ...chest }) => chest);

// ---------- enchant books (Sách phép) ----------
// The groups that have a page, weakest to strongest: the order of the power table in AGENTS.md ("SkyEnchants - Phân cấp sức mạnh").
const BOOK_TIERS = ['CU', 'HIEM', 'CO', 'SIEUCO', 'HUYENTHOAI', 'TRUYENTHUYET', 'LINHHON', 'HUYETTU', 'MAVANG', 'THACHDAU'];
const COLOR_HEX = { 0: '#000000', 1: '#0000aa', 2: '#00aa00', 3: '#00aaaa', 4: '#aa0000', 5: '#aa00aa', 6: '#ffaa00', 7: '#aaaaaa', 8: '#555555', 9: '#5555ff', a: '#55ff55', b: '#55ffff', c: '#ff5555', d: '#ff55ff', e: '#ffff55', f: '#ffffff' };
const sentence = (text) => (text ? text[0].toLocaleUpperCase('vi') + text.slice(1).toLocaleLowerCase('vi') : text);
/** Keeps Latin and Vietnamese letters, digits and a few marks; drops decoration (乂 ঔ ʔʕ ✞ ︿). "£" is used for an "L" in some names. */
const trimMarks = (text) =>
	[...text.replace(/£/g, 'L')]
		.map((c) => (/[A-Za-z0-9'()\-.,]/.test(c) || /\s/.test(c) || (c.codePointAt(0) >= 0xc0 && c.codePointAt(0) <= 0x24f) || (c.codePointAt(0) >= 0x1e00 && c.codePointAt(0) <= 0x1eff) ? c : ' '))
		.join('')
		.replace(/\s+/g, ' ')
		.trim()
		.replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N})]+$/gu, '')
		.replace(/^./u, (c) => c.toLocaleUpperCase('vi'));
const seGroups = readYaml('SkyEnchants/groups.yml').groups ?? {};
const shop = readYaml('SkyEnchants/gui/enchanter.yml').enchanter ?? {};
const seConfig = readYaml('SkyEnchants/config.yml');
const gild = readYaml('SkyEnchants/gui/mavang.yml').mavang ?? {};
const rawEnchants = {}; // id -> { group, raw }, every group (names of required / replaced enchants are looked up here)
for (const group of Object.keys(seGroups)) for (const [id, raw] of Object.entries(readYaml(`SkyEnchants/enchantments/${group}.yml`))) rawEnchants[id] = { group, raw };
const enchantName = (id) => trimMarks(stripCodes(String(rawEnchants[id]?.raw.display ?? '').replace('%group-color%', '')));
const groupLabel = (id) => sentence(trimMarks(stripCodes(seGroups[id]?.['group-name'] ?? '')));
/** A required / replaced / excluded enchant; its group is named when it is not the group of the enchant that refers to it (a gilded book has the same name as the book it comes from). */
const enchantRef = (ref, where, ownGroup) => {
	const [id, level] = String(ref).split(':');
	const name = enchantName(id);
	if (!name) return void warn(`${where}: enchant "${id}" does not exist (left out)`);
	const group = rawEnchants[id].group;
	const label = group !== ownGroup && BOOK_TIERS.includes(group) ? groupLabel(group) : null;
	return { name, ...(label ? { group: label } : {}), ...(level ? { level: Number(level) } : {}) };
};
function enchantOf(id, raw, ownGroup) {
	const where = `enchant ${id}`;
	const name = enchantName(id);
	if (!name) fail(`${where} has no name`);
	const levels = Object.entries(raw.levels ?? {})
		.map(([level, v]) => ({ level: Number(level), chance: round(v.chance), cooldown: round(v.cooldown ?? 0), ...(v.souls ? { souls: Number(v.souls) } : {}) }))
		.sort((a, b) => a.level - b.level);
	if (!levels.length) fail(`${where} has no levels`);
	const description = String(raw.description ?? '').split('\n').map((l) => stripCodes(l).replace(/%[a-z-]+%/g, '').trim()).filter(Boolean).join(' ');
	const settings = raw.settings ?? {};
	const refs = (list) => (list ?? []).map((r) => enchantRef(r, where, ownGroup)).filter(Boolean);
	return {
		id,
		name,
		appliesTo: String(raw['applies-to'] ?? '').replace(/\s*\+\s*/g, ', '),
		description,
		passive: raw.type === 'EFFECT_STATIC',
		requires: refs(settings['required-enchants']),
		replaces: refs(settings['removed-enchants']),
		excludes: refs(settings['not-applyable-with']),
		levels,
	};
}
const bookGroups = BOOK_TIERS.map((id, i) => {
	const g = seGroups[id];
	if (!g) fail(`SkyEnchants/groups.yml has no group ${id}`);
	const name = sentence(trimMarks(stripCodes(g['group-name'])));
	if (!name) fail(`group ${id} has no name`);
	const color = /^&([0-9a-f])$/i.exec(String(g.color))?.[1];
	const price = shop.books?.[id]?.['price-exp'];
	return {
		id,
		slug: id.toLowerCase(),
		name,
		tier: i + 1,
		color: color ? COLOR_HEX[color.toLowerCase()] : null,
		priceExp: price ?? null,
		dustChance: round(g['magic-dust']?.chance ?? 0),
		randomLevelCap3: g['random-book-limit-level-3'] === true,
		enchants: Object.entries(readYaml(`SkyEnchants/enchantments/${id}.yml`)).map(([eid, raw]) => enchantOf(eid, raw, id)),
	};
});
const gildGroup = seGroups[gild.requirement?.group];
const enchantsData = {
	baseSlots: seConfig.enchants?.['base-slots'],
	maxSlots: seConfig.enchants?.['max-slots'],
	failureDestroysItem: shop['destroy-item-on-failure'] === true,
	bookTools: readYaml('SkyEnchants/gui/book-tools.yml')['book-tools']?.enabled === true,
	commands: seConfig['direct-commands'] ?? {},
	gild: gild.enabled ? { books: gild.requirement.amount, from: sentence(trimMarks(stripCodes(gildGroup?.['group-name']))), daQuy: gild.requirement.points?.type === 'daquy' ? gild.requirement.points.amount : null } : null,
	groups: bookGroups,
};
if (![enchantsData.baseSlots, enchantsData.maxSlots].every(Number.isFinite)) fail('SkyEnchants/config.yml: enchants.base-slots / max-slots missing');

const equipmentData = buildEquipment({ base: BASE, readYaml, stripCodes, pretty, round, warn, fail });

for (const message of [...new Set(warnings)].sort()) console.warn(`sync-ren: warning: ${message}`);

const rel = (file) => relative(ROOT, file).split(sep).join('/');
const outputs = [
	[OUT, JSON.stringify({ dungeons }, null, '\t') + '\n'],
	[OUT_CHESTS, JSON.stringify({ chests: chestList }, null, '\t') + '\n'],
	[OUT_ENCHANTS, JSON.stringify(enchantsData, null, '\t') + '\n'],
	[OUT_EQUIPMENT, JSON.stringify(equipmentData, null, '\t') + '\n'],
];
let changed = false;
for (const [file, text] of outputs) {
	const before = existsSync(file) ? readFileSync(file, 'utf8') : '';
	if (before === text) continue;
	if (flag('--check')) fail(`${rel(file)} is out of date, run the sync`);
	mkdirSync(dirname(file), { recursive: true });
	writeFileSync(file, text, 'utf8');
	console.log(`sync-ren: written to ${rel(file)}`);
	changed = true;
}
if (!changed) console.log('sync-ren: no change');
