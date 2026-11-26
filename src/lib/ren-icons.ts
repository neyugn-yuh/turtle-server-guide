import { existsSync } from 'node:fs';
import { join } from 'node:path';
import sharp from 'sharp';

const publicMinionsDir = join(process.cwd(), 'public', 'minions');
const hasMinionDir = existsSync(publicMinionsDir);
const tintedCache = new Map<string, string>();
const baseCache = new Map<string, { data: Buffer; width: number; height: number }>();

export function hasMinionIcon(icon: string | null | undefined): boolean {
	return Boolean(icon && (!hasMinionDir || existsSync(join(publicMinionsDir, `${icon}.png`))));
}

async function loadBaseSprite(icon: string) {
	const hit = baseCache.get(icon);
	if (hit) return hit;
	const file = join(publicMinionsDir, `${icon}.png`);
	const { data, info } = await sharp(file).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
	const entry = { data, width: info.width, height: info.height };
	baseCache.set(icon, entry);
	return entry;
}

/**
 * Returns the icon URL, or an exact Minecraft-style dyed PNG data URI when
 * `dyeColor` (#rrggbb) is present on a grayscale leather armor sprite.
 */
export async function resolveGearIcon(base: string, icon: string | null | undefined, dyeColor?: string | null): Promise<string> {
	if (!hasMinionIcon(icon)) return '';
	if (!dyeColor || !hasMinionDir || !icon!.startsWith('leather_')) {
		return `${base}/minions/${icon}.png`;
	}
	const hex = /^#([0-9a-f]{6})$/i.exec(dyeColor)?.[1];
	if (!hex) return `${base}/minions/${icon}.png`;

	const cacheKey = `${icon}:${hex.toLowerCase()}`;
	const cached = tintedCache.get(cacheKey);
	if (cached) return cached;

	const r = parseInt(hex.slice(0, 2), 16);
	const g = parseInt(hex.slice(2, 4), 16);
	const b = parseInt(hex.slice(4, 6), 16);

	const sprite = await loadBaseSprite(icon!);
	const out = Buffer.from(sprite.data);
	for (let i = 0; i < out.length; i += 4) {
		if (out[i + 3] === 0) continue;
		out[i] = Math.round((out[i] * r) / 255);
		out[i + 1] = Math.round((out[i + 1] * g) / 255);
		out[i + 2] = Math.round((out[i + 2] * b) / 255);
	}
	const png = await sharp(out, { raw: { width: sprite.width, height: sprite.height, channels: 4 } }).png().toBuffer();
	const uri = `data:image/png;base64,${png.toString('base64')}`;
	tintedCache.set(cacheKey, uri);
	return uri;
}
