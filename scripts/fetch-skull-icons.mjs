#!/usr/bin/env node
/**
 * Draws the head of every magic skull into public/skulls/<texture>.png.
 *
 * Reads the skulls from src/data/servers/<server>/skulls.json and the heads in treasures.json (run sync-ren first). `texture` is the hash of the skin the
 * skull's head texture (ItemAbility/items.yml `Texture`) points to. The skin is downloaded from textures.minecraft.net
 * and the head (with its hat layer) is drawn as a small 3D cube, the way the game shows it in the inventory.
 * Pictures that already exist are skipped.
 *
 *   node scripts/fetch-skull-icons.mjs [--force]
 */
import { readdirSync, readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'public/skulls');
const force = process.argv.includes('--force');

const serversDir = join(ROOT, 'src/data/servers');
const textures = new Set();
for (const server of readdirSync(serversDir)) {
	const file = join(serversDir, server, 'skulls.json');
	if (existsSync(file)) for (const skull of JSON.parse(readFileSync(file, 'utf8')).skulls) if (skull.texture) textures.add(skull.texture);
	// heads in the treasure chests and the Xui Xẻo shops
	const treasures = join(serversDir, server, 'treasures.json');
	if (existsSync(treasures)) {
		const data = JSON.parse(readFileSync(treasures, 'utf8'));
		for (const prize of data.chests.flatMap((c) => c.prizes)) if (prize.texture) textures.add(prize.texture);
		for (const item of data.shops.flatMap((s) => s.items)) if (item.texture) textures.add(item.texture);
	}
}

const FACE = 64; // each face is drawn 64x64 (the skin has 8x8)
const C = FACE * 0.8660254; // half the width of the cube
const H = FACE / 2;
const W = Math.round(C * 2);
const HEIGHT = FACE * 2;

/** One face of the head (base + hat layer) as a PNG data uri, enlarged without smoothing. */
async function face(skin, x, y) {
	const part = (left) => sharp(skin).extract({ left, top: y, width: 8, height: 8 }).resize(FACE, FACE, { kernel: 'nearest' }).png().toBuffer();
	// the hat layer is 32 pixels to the right of the head on the skin
	const base = await part(x);
	const hat = await part(x + 32);
	const png = await sharp(base).composite([{ input: hat }]).png().toBuffer();
	return `data:image/png;base64,${png.toString('base64')}`;
}

async function drawHead(skin) {
	const meta = await sharp(skin).metadata();
	if (meta.width !== 64 || ![32, 64].includes(meta.height)) throw new Error(`skin is ${meta.width}x${meta.height}, not 64x64 or 64x32`);
	const png = await sharp(skin).ensureAlpha().png().toBuffer();
	const top = await face(png, 8, 0);
	const front = await face(png, 8, 8);
	const side = await face(png, 16, 8); // the left side of the head, the one the game shows on the right
	const img = (href, m) => `<image href="${href}" width="${FACE}" height="${FACE}" transform="matrix(${m})" image-rendering="optimizeSpeed"/>`;
	const k = 0.8660254;
	// isometric cube: front on the left, the left side of the head on the right, top above; the sides are shaded like in the game
	const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${HEIGHT}" viewBox="0 0 ${W} ${HEIGHT}">
${img(front, `${k} 0.5 0 1 0 ${H}`)}
<polygon points="0,${H} ${C},${H * 2} ${C},${H * 4} 0,${H * 3}" fill="#000" opacity="0.18"/>
${img(side, `${k} -0.5 0 1 ${C} ${H * 2}`)}
<polygon points="${C},${H * 2} ${C * 2},${H} ${C * 2},${H * 3} ${C},${H * 4}" fill="#000" opacity="0.38"/>
${img(top, `${k} 0.5 -${k} 0.5 ${C} 0`)}
</svg>`;
	return sharp(Buffer.from(svg), { density: 192 }).resize({ height: 192 }).png().toBuffer();
}

mkdirSync(OUT, { recursive: true });
const failed = [];
for (const texture of [...textures].sort()) {
	const target = join(OUT, `${texture}.png`);
	if (!force && existsSync(target)) continue;
	try {
		const res = await fetch(`https://textures.minecraft.net/texture/${texture}`);
		if (!res.ok) throw new Error(`HTTP ${res.status}`);
		writeFileSync(target, await drawHead(Buffer.from(await res.arrayBuffer())));
		console.log(`saved ${texture}`);
	} catch (error) {
		failed.push(`${texture}: ${error.message}`);
	}
}
console.log(`${textures.size} skull textures, ${failed.length} failed`);
if (failed.length) {
	console.error(failed.join('\n'));
	process.exit(1);
}
