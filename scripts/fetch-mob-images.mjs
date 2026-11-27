#!/usr/bin/env node
/**
 * Draws the face of every mob of the spawner list into public/mobs/<mob>.png.
 *
 * Reads the mob ids from src/data/servers/<server>/spawners.json (run sync-spawners first) and the entities of src/data/servers/<server>/dungeons.json, downloads the mob's texture from
 * PrismarineJS/minecraft-assets (the textures of Minecraft Java) and cuts the front of its head out of it, enlarged without
 * smoothing. Parts that sit on their own spot of the texture (a snout, a beak, slime eyes) are pasted onto the face.
 * Pictures that already exist are skipped; a mob with no entry below is reported and keeps no picture.
 *
 *   node scripts/fetch-mob-images.mjs [--version 1.21.4] [--force]
 */
import { readdirSync, readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'public/mobs');
const args = process.argv.slice(2);
const version = args.includes('--version') ? args[args.indexOf('--version') + 1] : '1.21.4';
const force = args.includes('--force');
const BASE = `https://raw.githubusercontent.com/PrismarineJS/minecraft-assets/master/data/${version}/entity`;
const SCALE = 8;

/**
 * texture: file under entity/. face: [x, y, width, height] of the front of the head on the texture.
 * parts: more rectangles pasted on the face: { from: [x, y, w, h] on the texture, to: [x, y] on the face }.
 * Coordinates follow the model of the mob in the game (the box of the head starts at its texture offset).
 */
const MOBS = {
	ZOMBIE: { texture: 'zombie/zombie.png', face: [8, 8, 8, 8] },
	SKELETON: { texture: 'skeleton/skeleton.png', face: [8, 8, 8, 8] },
	CREEPER: { texture: 'creeper/creeper.png', face: [8, 8, 8, 8] },
	SPIDER: { texture: 'spider/spider.png', face: [40, 12, 8, 8] },
	WITCH: { texture: 'witch.png', face: [8, 8, 8, 10], parts: [{ from: [26, 2, 2, 4], to: [3, 4] }] },
	COW: { texture: 'cow/cow.png', face: [6, 6, 8, 8] },
	PIG: { texture: 'pig/pig.png', face: [8, 8, 8, 8], parts: [{ from: [17, 17, 4, 3], to: [2, 4] }] },
	SHEEP: { texture: 'sheep/sheep.png', face: [8, 8, 6, 6] },
	CHICKEN: { texture: 'chicken.png', face: [3, 3, 4, 6], parts: [{ from: [16, 2, 4, 2], to: [0, 2] }, { from: [16, 6, 2, 2], to: [1, 4] }] },
	// mobs of the island race of Sky Rèn (the nose of a villager or an illager is pasted on the face)
	GHAST: { texture: 'ghast/ghast.png', face: [16, 16, 16, 16] },
	BLAZE: { texture: 'blaze.png', face: [8, 8, 8, 8] },
	VILLAGER: { texture: 'villager/villager.png', face: [8, 8, 8, 10], parts: [{ from: [26, 2, 2, 4], to: [3, 4] }] },
	EVOKER: { texture: 'illager/evoker.png', face: [8, 8, 8, 10], parts: [{ from: [26, 2, 2, 4], to: [3, 4] }] },
	IRON_GOLEM: { texture: 'iron_golem/iron_golem.png', face: [8, 8, 8, 10], parts: [{ from: [26, 2, 2, 4], to: [3, 5] }] },
	LLAMA: { texture: 'llama/creamy.png', face: [9, 9, 4, 4] },
	// mobs of the Sky Rèn dungeons
	PIG_ZOMBIE: { texture: 'piglin/zombified_piglin.png', face: [8, 8, 10, 8], parts: [{ from: [32, 2, 8, 4], to: [1, 3] }] },
	CAVE_SPIDER: { texture: 'spider/cave_spider.png', face: [40, 12, 8, 8] },
	WITHER_SKELETON: { texture: 'skeleton/wither_skeleton.png', face: [8, 8, 8, 8] },
	STRAY: { texture: 'skeleton/stray.png', face: [8, 8, 8, 8] },
	ENDERMAN: { texture: 'enderman/enderman.png', face: [8, 8, 8, 8] },
	ENDERMITE: { texture: 'endermite.png', face: [2, 2, 4, 3] },
	HUSK: { texture: 'zombie/husk.png', face: [8, 8, 8, 8] },
	WITHER: { texture: 'wither/wither.png', face: [8, 8, 8, 8] },
	// the front of a rabbit's head is plain, so its ears go on top
	RABBIT: { texture: 'rabbit/brown.png', face: [37, 5, 5, 4], size: [5, 9], faceAt: [0, 5], parts: [{ from: [53, 1, 2, 5], to: [0, 0] }, { from: [59, 1, 2, 5], to: [3, 0] }, { from: [33, 10, 1, 1], to: [2, 7] }] },
	// the body of a slime is an inner cube with a face and a see-through shell around it
	SLIME: {
		texture: 'slime/slime.png',
		face: [6, 22, 6, 6],
		size: [8, 8],
		faceAt: [1, 1],
		parts: [
			{ from: [34, 2, 2, 2], to: [2, 3] },
			{ from: [34, 6, 2, 2], to: [5, 3] },
			{ from: [33, 9, 1, 1], to: [4, 5] },
			{ from: [8, 8, 8, 8], to: [0, 0] },
		],
	},
};

const serversDir = join(ROOT, 'src/data/servers');
const ids = new Set();
for (const server of readdirSync(serversDir)) {
	const file = join(serversDir, server, 'spawners.json');
	// Sky Dungeon lists `mobs` (id), Sky Rèn lists `spawners` (entity)
	if (existsSync(file)) {
		const data = JSON.parse(readFileSync(file, 'utf8'));
		for (const mob of data.mobs ?? []) ids.add(mob.id);
		for (const spawner of data.spawners ?? []) if (spawner.entity) ids.add(spawner.entity);
	}
	// the island race: the entity of each lồng and of each hunted mob or boss
	const island = join(serversDir, server, 'island-top.json');
	if (existsSync(island)) {
		const top = JSON.parse(readFileSync(island, 'utf8'));
		for (const e of [...top.items, ...top.hunting, ...top.bosses]) if (e.entity) ids.add(e.entity);
	}
	// the dungeons of Sky Rèn: the entity each mob looks like (see sync-ren.mjs)
	const dungeons = join(serversDir, server, 'dungeons.json');
	if (existsSync(dungeons)) for (const d of JSON.parse(readFileSync(dungeons, 'utf8')).dungeons) for (const mob of d.mobs) if (mob.appearance) ids.add(mob.appearance);
}

async function download(path) {
	const response = await fetch(`${BASE}/${path}`);
	if (!response.ok) throw new Error(`${path}: ${response.status}`);
	const bytes = Buffer.from(await response.arrayBuffer());
	if (bytes.subarray(0, 4).toString('hex') !== '89504e47') throw new Error(`${path}: not a PNG`);
	return bytes;
}

async function crop(texture, [x, y, w, h]) {
	return sharp(texture).extract({ left: x, top: y, width: w, height: h }).png().toBuffer();
}

async function draw(spec) {
	const texture = await download(spec.texture);
	let width, height, layers = [];
	if (spec.rows) {
		[width, height] = spec.size;
		for (let i = 0; i < spec.rows.length; i++) layers.push({ input: await crop(texture, [spec.rows[i][0], spec.rows[i][1], 8, 1]), left: 0, top: i });
	} else {
		const [fx, fy, fw, fh] = spec.face;
		[width, height] = spec.size ?? [fw, fh];
		const [ox, oy] = spec.faceAt ?? [0, 0];
		layers.push({ input: await crop(texture, spec.face), left: ox, top: oy });
	}
	for (const part of spec.parts ?? []) layers.push({ input: await crop(texture, part.from), left: part.to[0], top: part.to[1] });
	const small = await sharp({ create: { width, height, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } }).composite(layers).png().toBuffer();
	return sharp(small).resize(width * SCALE, height * SCALE, { kernel: 'nearest' }).png().toBuffer();
}

mkdirSync(OUT, { recursive: true });
const missing = [];
for (const id of [...ids].sort()) {
	const target = join(OUT, `${id.toLowerCase()}.png`);
	if (!force && existsSync(target)) continue;
	if (!MOBS[id]) {
		missing.push(id);
		continue;
	}
	writeFileSync(target, await draw(MOBS[id]));
	console.log(`${id} <- ${MOBS[id].texture}`);
}
console.log(`fetch-mob-images: ${ids.size} mobs, ${missing.length} without a face${missing.length ? `: ${missing.join(', ')}` : ''}`);
