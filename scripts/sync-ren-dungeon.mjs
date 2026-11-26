#!/usr/bin/env node
/**
 * Reads the Dungeon system of the Sky Rèn server (6 dungeons) and writes the player-facing facts to
 * src/data/servers/sky-ren/dungeons.json, which the "Dungeon" pages of Sky Rèn are built from.
 *
 * Files read (relative to the plugins folder of the server repo):
 *   DeluxeMenus/gui_menus/menuDungeon.yml         name, difficulty and final boss of each dungeon (the /dungeon menu)
 *   MythicMobs/mobs/Dungeon/dungeon<N>.yml        the mobs of a dungeon: name, health, damage, exp, money, what they give on death
 *   MythicMobs/skills/Skill Dungeon/Dungeon<N>.yml   the reward skills a boss calls on death (rewards of the players nearby)
 *   MythicMobs/skills/KillerRewards.yml           the reward of the player who lands the killing blow of a boss
 *   MMOItems/item/{material,consumable}.yml       the names of the items that are given
 *
 * What counts as a reward (a command run on death, directly on the mob or inside a reward skill):
 *   mi give <TYPE> <ID> <player> <amount> ...      an MMOItems item
 *   tt add <player> <currency> <n | <random.AtoB>> a dungeon currency (daquy = Đá Quý, bangngoc = Băng Ngọc)
 *   points give <player> <n>                       Xu
 *   exp give / src exp <player> <n>                experience
 *   crazycrates give v cauvong <n> <player>        Cầu Vồng key
 *   cr give to <player> <crate> <n> [offline]      a crate key
 *   mme reward <player> <block> <n>                a block reward
 * A line that cannot be shown truthfully is left out and reported on the console, never guessed.
 *
 * Usage:  node scripts/sync-ren-dungeon.mjs --dir <plugins folder> [--check]
 * Only whitelisted facts are copied. The output has no timestamp, so a run that finds nothing new leaves the file unchanged.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'yaml';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SERVER = 'sky-ren';
const OUT = join(ROOT, 'src/data/servers', SERVER, 'dungeons.json');
const COUNT = 6;

const args = process.argv.slice(2);
const flag = (name) => args.includes(name);
const option = (name) => {
	const i = args.indexOf(name);
	return i >= 0 ? args[i + 1] : undefined;
};
function fail(message) {
	console.error(`sync-ren-dungeon: ${message}`);
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
const itemName = (type, id) => {
	const key = type.toLowerCase();
	itemFiles[key] ??= existsSync(join(BASE, `MMOItems/item/${key}.yml`)) ? readYaml(`MMOItems/item/${key}.yml`) : {};
	const item = itemFiles[key][id.toUpperCase()];
	return item ? pretty(item.base?.name, { keepBrackets: true }) || null : null;
};

// ---------- rewards ----------
const CURRENCIES = { daquy: 'Đá Quý', bangngoc: 'Băng Ngọc' };
const BLOCKS = { diamond_block: 'Khối Kim Cương', iron_block: 'Khối Sắt', gold_block: 'Khối Vàng', lapis_block: 'Khối Lapis', emerald_block: 'Khối Ngọc Lục Bảo' };
// crate ids -> what players call them (Lửa Phép names are the ones the event menus use; the other ids give their number)
const CRATES = {
	LuaPhepThuong: 'Rương Lửa Phép Thường',
	LuaPhepToiCao: 'Rương Lửa Phép Tối Cao',
	LuaPhepTruyenThuyet: 'Rương Lửa Phép Truyền Thuyết',
};
function crateName(id) {
	if (CRATES[id]) return CRATES[id];
	const m = /^(Spawner|BossDungeon)(\d+)$/.exec(id);
	if (m) return `${m[1] === 'Spawner' ? 'Rương Spawner' : 'Rương Boss Dungeon'} ${m[2]}`;
	return null;
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
		const name = itemName(m[1], m[2]);
		if (!name) return void warn(`${where}: drops ${m[1]}:${m[2]}, which is not in MMOItems (left out)`);
		return { type: 'item', name, min: Number(m[3]), max: Number(m[3]), chance };
	}
	m = /^tt add @P (\w+) (\S+)$/.exec(text);
	if (m) {
		const amount = amountOf(m[2]);
		if (!CURRENCIES[m[1]]) return void warn(`${where}: tt add ${m[1]} is not a known currency (left out)`);
		if (!amount) return void warn(`${where}: tt add amount "${m[2]}" cannot be shown (left out)`);
		return { type: 'currency', name: CURRENCIES[m[1]], ...amount, chance };
	}
	m = /^points give @P (\d+)$/.exec(text);
	if (m) return { type: 'xu', name: 'Xu', min: Number(m[1]), max: Number(m[1]), chance };
	m = /^(?:exp give|src exp) @P (\d+)$/.exec(text);
	if (m) return { type: 'exp', name: 'Kinh nghiệm', min: Number(m[1]), max: Number(m[1]), chance };
	m = /^crazycrates give v cauvong (\d+) @P$/.exec(text);
	if (m) return { type: 'key', name: 'Chìa khóa Cầu Vồng', min: Number(m[1]), max: Number(m[1]), chance };
	m = /^cr give to @P (\w+) (\d+)(?: offline)?$/.exec(text);
	if (m) {
		const name = crateName(m[1]);
		if (!name) return void warn(`${where}: crate ${m[1]} has no known name (left out)`);
		return { type: 'key', name: `Chìa khóa ${name}`, min: Number(m[2]), max: Number(m[2]), chance };
	}
	m = /^mme reward @P (\w+) (\d+)$/.exec(text);
	if (m) {
		if (!BLOCKS[m[1]]) return void warn(`${where}: mme reward ${m[1]} is not a known block (left out)`);
		return { type: 'block', name: BLOCKS[m[1]], min: Number(m[2]), max: Number(m[2]), chance };
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
function mobOf(id, mob, n) {
	const display = String(mob.Display ?? '');
	const clean = stripCodes(display);
	const title = /\(([^)]+)\)/.exec(clean)?.[1]?.trim() ?? null;
	const killer = (mob.Skills ?? []).find((l) => /skill\{s=KillerReward-[^}]+\}\s*@trigger/.test(l));
	const isBoss = Boolean(killer);
	const name = pretty(clean.replace(/\([^)]*\)/g, ' '));
	const out = { id, name, kind: isBoss ? 'boss' : 'normal', title: isBoss && title && !/^boss$/i.test(title) ? title : null, health: Number(mob.Health), damage: mob.Damage === undefined ? null : Number(mob.Damage), exp: null, money: null, drops: [], killer: [], nearby: [] };
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

for (const message of [...new Set(warnings)].sort()) console.warn(`sync-ren-dungeon: warning: ${message}`);

const text = JSON.stringify({ dungeons }, null, '\t') + '\n';
const before = existsSync(OUT) ? readFileSync(OUT, 'utf8') : '';
if (before === text) {
	console.log('sync-ren-dungeon: no change');
} else if (flag('--check')) {
	fail('dungeons.json is out of date, run the sync');
} else {
	mkdirSync(dirname(OUT), { recursive: true });
	writeFileSync(OUT, text, 'utf8');
	console.log(`sync-ren-dungeon: written to ${OUT.slice(ROOT.length + 1).replace(/\\/g, '/')}`);
}
