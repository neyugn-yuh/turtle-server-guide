#!/usr/bin/env node
/**
 * Downloads the Minecraft item pictures the minion list shows into public/minions/<material>.png.
 *
 * Reads the materials from src/data/servers/<server>/minions.json (run sync-minions first), so a new product
 * in the server config only needs: sync, then this script. Pictures that already exist are skipped.
 * Source: PrismarineJS/minecraft-assets (the textures of Minecraft Java, 16x16). A block item (cobblestone, logs,
 * cactus...) has no item texture, so its block texture is used.
 *
 *   node scripts/fetch-minion-icons.mjs [--version 1.21.4] [--force]
 */
import { readdirSync, readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const { upgradeIcons } = await import(pathToFileURL(join(ROOT, 'src/data/island-upgrade-icons.mjs')).href);
const OUT = join(ROOT, 'public/minions');
const args = process.argv.slice(2);
const version = args.includes('--version') ? args[args.indexOf('--version') + 1] : '1.21.4';
const force = args.includes('--force');
const BASE = `https://raw.githubusercontent.com/PrismarineJS/minecraft-assets/master/data/${version}`;

// Texture to try, in order, for a material.
const candidates = (name) => [`items/${name}`, `blocks/${name}`, `blocks/${name}_side`, `blocks/${name}_top`];

const serversDir = join(ROOT, 'src/data/servers');
const materials = new Set();
for (const server of readdirSync(serversDir)) {
	const file = join(serversDir, server, 'minions.json');
	if (!existsSync(file)) continue;
	for (const minion of JSON.parse(readFileSync(file, 'utf8')).minions) {
		if (minion.icon) materials.add(minion.icon);
		for (const group of minion.products) for (const product of group.products) if (product.icon) materials.add(product.icon);
	}
	// materials: the block of each material and the items of its recipes
	const materialsFile = join(serversDir, server, 'materials.json');
	if (existsSync(materialsFile)) {
		for (const material of JSON.parse(readFileSync(materialsFile, 'utf8')).materials) {
			if (material.icon) materials.add(material.icon);
			for (const recipe of [...material.recipes, ...material.uses]) for (const item of [...recipe.ingredients, ...recipe.results]) if (item.icon) materials.add(item.icon);
		}
	}
	// spawners: the picture of each mob and of the items it drops
	const spawnersFile = join(serversDir, server, 'spawners.json');
	if (existsSync(spawnersFile)) {
		materials.add('experience_bottle'); // the experience row of each drop table
		materials.add('gold_nugget'); // stands in for Mobcoins in the drop table until they have their own picture
		for (const mob of JSON.parse(readFileSync(spawnersFile, 'utf8')).mobs) {
			if (mob.icon) materials.add(mob.icon);
			for (const drop of mob.drops) if (drop.icon) materials.add(drop.icon);
		}
	}
	// equipment: the picture of the item of each grade (sword, bow, axe, chestplate)
	const equipmentFile = join(serversDir, server, 'equipment.json');
	if (existsSync(equipmentFile)) {
		const equipment = JSON.parse(readFileSync(equipmentFile, 'utf8'));
		for (const kind of Object.values(equipment.kinds)) for (const tier of kind.tiers) for (const grade of tier.grades) if (grade.icon) materials.add(grade.icon);
	}
	// island upgrades: the picture of each upgrade and of the blocks a level asks for
	const islandFile = join(serversDir, server, 'island-upgrades.json');
	if (existsSync(islandFile)) {
		for (const upgrade of JSON.parse(readFileSync(islandFile, 'utf8')).upgrades) {
			if (upgradeIcons[upgrade.id]) materials.add(upgradeIcons[upgrade.id]);
			for (const level of upgrade.levels) for (const key of Object.keys(level.items)) if (!key.includes(':')) materials.add(key.toLowerCase()); // MATERIAL:X pictures come from materials.json
		}
	}
}

// Sky Rèn dungeons: the picture of every reward (items, blocks, keys, experience). A server without minions.json is not in the loop above.
for (const server of readdirSync(serversDir)) {
	const dungeonsFile = join(serversDir, server, 'dungeons.json');
	if (!existsSync(dungeonsFile)) continue;
	for (const d of JSON.parse(readFileSync(dungeonsFile, 'utf8')).dungeons) {
		for (const mob of d.mobs) for (const reward of [...mob.drops, ...mob.killer, ...mob.nearby.flatMap((g) => g.rewards)]) if (reward.icon) materials.add(reward.icon);
	}
	// the reward chests: the item of each chest and of each reward
	const chestsFile = join(serversDir, server, 'chests.json');
	if (existsSync(chestsFile)) {
		for (const chest of JSON.parse(readFileSync(chestsFile, 'utf8')).chests) {
			if (chest.icon) materials.add(chest.icon);
			for (const reward of chest.rewards) if (reward.icon) materials.add(reward.icon);
		}
	}
	// the crafting materials: the item of each material and of each ingredient of its recipes
	const renMaterialsFile = join(serversDir, server, 'ren-materials.json');
	if (existsSync(renMaterialsFile)) {
		for (const material of JSON.parse(readFileSync(renMaterialsFile, 'utf8')).materials) {
			if (material.icon) materials.add(material.icon);
			for (const recipe of material.recipes) for (const need of recipe.needs) if (need.icon) materials.add(need.icon);
		}
	}
	// the equipment: the item of each piece and of each ingredient
	const equipmentFile = join(serversDir, server, 'gear.json');
	if (existsSync(equipmentFile)) {
		for (const item of JSON.parse(readFileSync(equipmentFile, 'utf8')).items) {
			if (item.icon) materials.add(item.icon);
			for (const recipe of item.recipes) for (const need of recipe.needs) if (need.icon) materials.add(need.icon);
		}
	}
}

// Items that have no flat texture in the Minecraft assets (a head is drawn in 3D): a 16x16 picture drawn here, row by row.
// K outline, D dark scales, L snout, E eyes, T teeth, . transparent.
const DRAWN = {
	dragon_head: [
		'................',
		'................',
		'..KK........KK..',
		'..KKK......KKK..',
		'...KKKKKKKKKK...',
		'..KDDDDDDDDDDK..',
		'.KDDDDDDDDDDDDK.',
		'.KDDEEDDDDEEDDK.',
		'.KDDEEDDDDEEDDK.',
		'.KDDDDDDDDDDDDK.',
		'..KDLLLLLLLLDK..',
		'..KDLLKLLKLLDK..',
		'..KDLLLLLLLLDK..',
		'...KLTLTLTLTLK..',
		'...KKKKKKKKKK...',
		'................',
	],
};
const PALETTE = { K: [11, 11, 15, 255], D: [38, 38, 46, 255], L: [58, 58, 69, 255], E: [224, 82, 224, 255], T: [216, 216, 216, 255], '.': [0, 0, 0, 0] };
async function draw(name, rows) {
	if (rows.length !== 16 || rows.some((row) => row.length !== 16)) throw new Error(`drawn picture ${name} is not 16x16`);
	const raw = Buffer.from(rows.flatMap((row) => [...row].flatMap((c) => PALETTE[c])));
	const { default: sharp } = await import('sharp');
	return sharp(raw, { raw: { width: 16, height: 16, channels: 4 } }).png().toBuffer();
}

mkdirSync(OUT, { recursive: true });
const missing = [];
for (const name of [...materials].sort()) {
	const target = join(OUT, `${name}.png`);
	if (!force && existsSync(target)) continue;
	let saved = false;
	if (DRAWN[name]) {
		writeFileSync(target, await draw(name, DRAWN[name]));
		console.log(`${name} <- drawn`);
		continue;
	}
	for (const path of candidates(name)) {
		const response = await fetch(`${BASE}/${path}.png`);
		if (!response.ok) continue;
		const bytes = Buffer.from(await response.arrayBuffer());
		if (bytes.subarray(0, 4).toString('hex') !== '89504e47') continue; // not a PNG
		writeFileSync(target, bytes);
		console.log(`${name} <- ${path}`);
		saved = true;
		break;
	}
	// the texture set of 1.21.4 has no copper tools or armor: tint the iron one copper-orange
	const copper = /^copper_(sword|axe|chestplate)$/.exec(name);
	if (!saved && copper) {
		const response = await fetch(`${BASE}/items/iron_${copper[1]}.png`);
		if (response.ok) {
			const { default: sharp } = await import('sharp');
			writeFileSync(target, await sharp(Buffer.from(await response.arrayBuffer())).tint('#D07A52').png().toBuffer());
			console.log(`${name} <- items/iron_${copper[1]} (tinted copper)`);
			saved = true;
		}
	}
	if (!saved) missing.push(name);
}
console.log(`fetch-minion-icons: ${materials.size} materials, ${missing.length} without a picture${missing.length ? `: ${missing.join(', ')}` : ''}`);
