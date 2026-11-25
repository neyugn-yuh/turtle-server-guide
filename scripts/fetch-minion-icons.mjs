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
		for (const mob of JSON.parse(readFileSync(spawnersFile, 'utf8')).mobs) {
			if (mob.icon) materials.add(mob.icon);
			for (const drop of mob.drops) if (drop.icon) materials.add(drop.icon);
		}
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

mkdirSync(OUT, { recursive: true });
const missing = [];
for (const name of [...materials].sort()) {
	const target = join(OUT, `${name}.png`);
	if (!force && existsSync(target)) continue;
	let saved = false;
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
	if (!saved) missing.push(name);
}
console.log(`fetch-minion-icons: ${materials.size} materials, ${missing.length} without a picture${missing.length ? `: ${missing.join(', ')}` : ''}`);
