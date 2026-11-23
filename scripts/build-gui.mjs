#!/usr/bin/env node
/**
 * Draws the GUI diagrams of the guide.
 *
 * Input:  src/data/gui/<plugin>/<menu>.json   (one file per menu, see docs in README.md)
 * Output: public/gui/<lang>/<plugin>-<menu>.svg   for every language in LANGS
 *
 * The diagrams are schematic on purpose: the slot positions, the titles and the names of the buttons come
 * from the plugin, the textures do not (Mojang's item textures are not redistributed). A numbered badge on a
 * slot points to the matching row of the table next to the diagram on the page.
 *
 * The script fails (exit 1) on a spec it cannot draw faithfully, so a wrong slot number or a missing
 * translation breaks the build instead of shipping a misleading picture.
 */
import { readdirSync, readFileSync, writeFileSync, mkdirSync, rmSync, statSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
// GUI_SPEC_DIR / GUI_OUT_DIR let a spec be checked outside the site (relative paths are from the working directory).
const SPEC_DIR = process.env.GUI_SPEC_DIR ? resolve(process.cwd(), process.env.GUI_SPEC_DIR) : join(ROOT, 'src/data/gui');
const OUT_DIR = process.env.GUI_OUT_DIR ? resolve(process.cwd(), process.env.GUI_OUT_DIR) : join(ROOT, 'public/gui');
const LANGS = ['vi', 'en'];

// ---------- geometry (px, the SVG scales) ----------
const SLOT = 48;
const PAD = 14;
const TITLE_H = 30;
const COLS = 9;
const INV_GAP = 14; // gap between the menu grid and the player's inventory
const INV_LABEL_H = 18;

// ---------- palette: the vanilla inventory look ----------
const C = {
	panel: '#c6c6c6',
	panelLight: '#ffffff',
	panelDark: '#555555',
	outline: '#000000',
	slot: '#8b8b8b',
	slotDark: '#373737',
	slotLight: '#ffffff',
	title: '#404040',
	badgeBg: '#3ecf8e',
	badgeText: '#121212',
	inputStroke: '#0a7445',
};

const DYES = {
	WHITE: '#f0f0f0', ORANGE: '#f9801d', MAGENTA: '#c74ebd', LIGHT_BLUE: '#3ab3da', YELLOW: '#fed83d', LIME: '#80c71f',
	PINK: '#f38baa', GRAY: '#474f52', LIGHT_GRAY: '#9d9d97', CYAN: '#169c9c', PURPLE: '#8932b8', BLUE: '#3c44aa',
	BROWN: '#835432', GREEN: '#5e7c16', RED: '#b02e26', BLACK: '#1d1d21',
};

const MATERIALS = [
	[/EMERALD/, '#2ecc71'], [/DIAMOND/, '#4fd1e6'], [/GOLD/, '#f1c40f'], [/IRON/, '#c9c9c9'], [/COPPER/, '#c46a45'],
	[/NETHERITE/, '#4a3f46'], [/COAL|CHARCOAL/, '#2b2b2b'], [/REDSTONE/, '#e0392d'], [/LAPIS/, '#2f55c9'],
	[/QUARTZ/, '#ece6df'], [/ANVIL/, '#555a63'], [/ARROW/, '#b08d57'], [/BARRIER/, '#d63031'], [/HOPPER/, '#6b6b6b'],
	[/BARREL|CHEST/, '#a0692f'], [/PAPER|MAP/, '#efe6c8'], [/BOOK/, '#7b4ea3'], [/CLOCK/, '#e8b53e'],
	[/COMPASS/, '#a33b3b'], [/NAME_TAG/, '#d9c9a3'], [/SPYGLASS/, '#c98b4a'], [/PLAYER_HEAD|SKULL/, '#c68e5b'],
	[/WHEAT|HAY/, '#d8b84a'], [/CARROT/, '#ed8a1c'], [/POTATO/, '#cba35c'], [/MELON/, '#6fa83a'], [/PUMPKIN/, '#d9741a'],
	[/EGG/, '#e8dcc0'], [/BONE/, '#e6e2d3'], [/FEATHER/, '#e9e9e9'], [/SADDLE|LEAD/, '#8a5a35'],
	[/HOE|PICKAXE|AXE|SHOVEL|SWORD/, '#9aa3ad'], [/ENCHANT/, '#8e5bd6'], [/EXPERIENCE_BOTTLE|POTION/, '#7ee08a'],
	[/GLASS/, '#a8d8e8'], [/LIME/, DYES.LIME], [/DIRT|GRASS|MOSS/, '#7a5a36'], [/STONE|COBBLE|DEEPSLATE/, '#7d7d7d'],
	[/TNT/, '#d6452b'], [/BEACON|NETHER_STAR|STAR/, '#f6f2c0'], [/CAKE/, '#f2d6c4'], [/BELL/, '#e6c34a'],
	[/WRITABLE_BOOK|WRITTEN_BOOK/, '#8a6b3c'], [/OAK|SPRUCE|BIRCH|JUNGLE|ACACIA|DARK_OAK|WOOD|LOG|PLANKS/, '#a07a4b'],
];

function materialColor(material) {
	const m = String(material ?? 'STONE').toUpperCase();
	const dye = Object.keys(DYES).sort((a, b) => b.length - a.length).find((d) => m === d || m.startsWith(d + '_'));
	if (dye && /GLASS|WOOL|CONCRETE|DYE|TERRACOTTA|BANNER|CARPET|BED|SHULKER|CANDLE/.test(m)) return DYES[dye];
	for (const [re, color] of MATERIALS) if (re.test(m)) return color;
	if (dye) return DYES[dye];
	let h = 0;
	for (const ch of m) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
	return `hsl(${h % 360} 38% 52%)`;
}

const isPane = (m) => /GLASS_PANE$/.test(String(m).toUpperCase());

function luminance(hex) {
	const m = /^#([0-9a-f]{6})$/i.exec(hex);
	if (!m) return 0.5;
	const [r, g, b] = [0, 2, 4].map((i) => parseInt(m[1].slice(i, i + 2), 16) / 255);
	return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Splits a short label over at most two lines of about [max] characters. */
function wrap(label, max = 8) {
	const words = String(label).trim().split(/\s+/);
	const lines = [];
	let line = '';
	for (const w of words) {
		if (!line) line = w;
		else if ((line + ' ' + w).length <= max) line += ' ' + w;
		else { lines.push(line); line = w; }
	}
	if (line) lines.push(line);
	const out = lines.slice(0, 2).map((l) => (l.length > max + 1 ? l.slice(0, max) + '.' : l));
	if (lines.length > 2) out[1] = out[1].replace(/\.?$/, '.');
	return out;
}

/**
 * The text drawn inside a tile: the spec's `short` if it has one. For a numbered slot without one, the label itself,
 * but only when EVERY numbered slot of the menu can show its label (so the picture is either fully labelled or
 * numbers only, never a mix). Long labels live in the table next to the picture.
 */
function labelsFit(spec, lang) {
	const numbered = Object.values(spec.slots).filter((d) => d.n !== undefined && d.badge !== false && d.role !== 'input');
	return numbered.length > 0 && numbered.every((d) => (typeof d.short === 'object' ? d.short?.[lang] : d.short) || d.label[lang].length <= 12);
}

function shortOf(def, lang, auto) {
	const own = typeof def.short === 'object' ? def.short?.[lang] : def.short;
	if (own) return own;
	if (auto && def.n !== undefined && def.badge !== false && def.role !== 'input') return def.label[lang];
	return '';
}

// ---------- validation ----------
function validate(spec, file) {
	const errors = [];
	const fail = (m) => errors.push(`${file}: ${m}`);
	if (!Number.isInteger(spec.rows) || spec.rows < 1 || spec.rows > 6) fail('rows must be an integer from 1 to 6');
	for (const lang of LANGS) if (!spec.title?.[lang]) fail(`title.${lang} is missing`);
	const size = (spec.rows ?? 0) * COLS;
	const numbers = new Map();
	for (const [slot, def] of Object.entries(spec.slots ?? {})) {
		const i = Number(slot);
		if (!Number.isInteger(i) || i < 0 || i >= size) fail(`slot ${slot} is outside a ${spec.rows}-row menu (0-${size - 1})`);
		if (!def.item) fail(`slot ${slot} has no item`);
		for (const lang of LANGS) if (!def.label?.[lang]) fail(`slot ${slot} has no label.${lang}`);
		if (def.n !== undefined) {
			if (!Number.isInteger(def.n) || def.n < 1) fail(`slot ${slot}: n must be a positive integer`);
			// Several slots may share a number (the 15 storage slots), but then they must mean the same thing.
			const known = numbers.get(def.n);
			if (known && LANGS.some((lang) => known[lang] !== def.label?.[lang])) fail(`slot ${slot}: the number ${def.n} is used for a different label`);
			numbers.set(def.n, def.label);
		}
	}
	if (errors.length) throw new Error(errors.join('\n'));
}

// ---------- drawing ----------
function slotRect(x, y) {
	return `<rect x="${x}" y="${y}" width="${SLOT}" height="${SLOT}" fill="${C.slot}"/>` +
		`<path d="M${x} ${y + SLOT}V${y}H${x + SLOT}" fill="none" stroke="${C.slotDark}" stroke-width="2"/>` +
		`<path d="M${x + SLOT} ${y}V${y + SLOT}H${x}" fill="none" stroke="${C.slotLight}" stroke-width="2"/>`;
}

function tile(x, y, def, filler) {
	const color = materialColor(def.item);
	const inset = 5;
	const w = SLOT - inset * 2;
	const pane = filler || isPane(def.item);
	const dark = luminance(color) < 0.45;
	const fg = dark ? '#ffffff' : '#1b1b1b';
	const stroke = def.role === 'input' ? '' : `stroke="${dark ? '#000000' : '#00000066'}" stroke-opacity="0.55" stroke-width="1"`;
	let svg = `<rect x="${x + inset}" y="${y + inset}" width="${w}" height="${w}" rx="4" fill="${color}" ${stroke}${pane ? ' opacity="0.35"' : ''}/>`;
	if (def.role === 'input') {
		svg = `<rect x="${x + 3}" y="${y + 3}" width="${SLOT - 6}" height="${SLOT - 6}" rx="3" fill="none" stroke="${C.inputStroke}" stroke-width="2" stroke-dasharray="5 3"/>`;
		if (def.item !== 'AIR') svg += `<rect x="${x + inset + 3}" y="${y + inset + 3}" width="${w - 6}" height="${w - 6}" rx="3" fill="${color}" opacity="0.55"/>`;
	}
	if (!filler && def.short !== '') {
		const lines = wrap(def.short ?? def._label, 8);
		const base = y + SLOT / 2 + (lines.length === 1 ? 3.5 : -1);
		lines.forEach((line, k) => {
			svg += `<text x="${x + SLOT / 2}" y="${base + k * 10}" text-anchor="middle" font-size="8.5" font-weight="700" fill="${fg}">${esc(line)}</text>`;
		});
	}
	if (def.n !== undefined && def.badge !== false) {
		svg += `<circle cx="${x + 9}" cy="${y + 9}" r="8.5" fill="${C.badgeBg}" stroke="#0b5a37" stroke-width="1"/>` +
			`<text x="${x + 9}" y="${y + 12.4}" text-anchor="middle" font-size="${def.n > 9 ? 9 : 10.5}" font-weight="800" fill="${C.badgeText}">${def.n}</text>`;
	}
	return svg;
}

function render(spec, lang) {
	const auto = labelsFit(spec, lang);
	const gridW = COLS * SLOT;
	const width = gridW + PAD * 2;
	const menuH = spec.rows * SLOT;
	const invH = spec.inventory ? INV_GAP + INV_LABEL_H + 4 * SLOT + 8 : 0;
	const height = PAD + TITLE_H + menuH + invH + PAD;
	const gx = PAD;
	const gy = PAD + TITLE_H;

	const out = [];
	out.push(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" role="img" aria-labelledby="t d" font-family="'Segoe UI', Inter, Arial, sans-serif">`);
	out.push(`<title id="t">${esc(spec.title[lang])}</title>`);
	const byNumber = new Map();
	for (const d of Object.values(spec.slots)) if (d.n !== undefined) byNumber.set(d.n, d.label[lang]);
	const labels = [...byNumber.entries()].sort((a, b) => a[0] - b[0]).map(([n, label]) => `${n}: ${label}`);
	out.push(`<desc id="d">${esc(labels.join('; '))}</desc>`);
	// panel with the vanilla bevel
	out.push(`<rect x="0.5" y="0.5" width="${width - 1}" height="${height - 1}" fill="${C.panel}" stroke="${C.outline}"/>`);
	out.push(`<path d="M2 ${height - 2}V2H${width - 2}" fill="none" stroke="${C.panelLight}" stroke-width="2"/>`);
	out.push(`<path d="M${width - 2} 2V${height - 2}H2" fill="none" stroke="${C.panelDark}" stroke-width="2"/>`);
	out.push(`<text x="${PAD + 2}" y="${PAD + 17}" font-size="14" font-weight="700" fill="${C.title}">${esc(spec.title[lang])}</text>`);

	for (let r = 0; r < spec.rows; r++) {
		for (let c = 0; c < COLS; c++) {
			const slot = r * COLS + c;
			const x = gx + c * SLOT;
			const y = gy + r * SLOT;
			out.push(slotRect(x, y));
			const def = spec.slots[String(slot)];
			if (def) out.push(tile(x, y, { ...def, _label: def.label[lang], short: shortOf(def, lang, auto) }, false));
			else if (spec.filler) out.push(tile(x, y, { item: spec.filler === true ? 'BLACK_STAINED_GLASS_PANE' : spec.filler }, true));
		}
	}

	if (spec.inventory) {
		const iy = gy + menuH + INV_GAP;
		out.push(`<text x="${PAD + 2}" y="${iy + 12}" font-size="12" font-weight="700" fill="${C.title}">${lang === 'vi' ? 'Túi đồ của bạn' : 'Your inventory'}</text>`);
		for (let r = 0; r < 3; r++) for (let c = 0; c < COLS; c++) out.push(slotRect(gx + c * SLOT, iy + INV_LABEL_H + r * SLOT));
		const hy = iy + INV_LABEL_H + 3 * SLOT + 8;
		for (let c = 0; c < COLS; c++) out.push(slotRect(gx + c * SLOT, hy));
		for (const [slot, def] of Object.entries(spec.inventory === true ? {} : spec.inventory)) {
			const i = Number(slot); // 0-26 main inventory, 27-35 hotbar
			const row = i < 27 ? Math.floor(i / 9) : 3;
			const x = gx + (i % 9) * SLOT;
			const y = i < 27 ? iy + INV_LABEL_H + row * SLOT : hy;
			out.push(tile(x, y, { ...def, _label: def.label[lang], short: shortOf(def, lang, auto) }, false));
		}
	}
	out.push('</svg>');
	return out.join('\n') + '\n';
}

// ---------- main ----------
function* specs(dir) {
	for (const entry of readdirSync(dir)) {
		const p = join(dir, entry);
		if (statSync(p).isDirectory()) yield* specs(p);
		else if (entry.endsWith('.json')) yield p;
	}
}

let count = 0;
try {
	statSync(SPEC_DIR);
} catch {
	console.log('gui: no specs yet');
	process.exit(0);
}
for (const lang of LANGS) rmSync(join(OUT_DIR, lang), { recursive: true, force: true });
for (const file of specs(SPEC_DIR)) {
	const spec = JSON.parse(readFileSync(file, 'utf8'));
	const rel = file.slice(SPEC_DIR.length + 1).replace(/\\/g, '/');
	validate(spec, rel);
	const name = rel.replace(/\.json$/, '').replace(/\//g, '-');
	for (const lang of LANGS) {
		const dir = join(OUT_DIR, lang);
		mkdirSync(dir, { recursive: true });
		writeFileSync(join(dir, `${name}.svg`), render(spec, lang));
	}
	count++;
}
console.log(`gui: drew ${count} menu diagram(s) x ${LANGS.length} languages`);
