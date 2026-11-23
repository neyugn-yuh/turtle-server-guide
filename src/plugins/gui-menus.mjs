/**
 * Turns a menu picture into an interactive menu (a Sätteri plugin for Astro's Markdown pipeline).
 *
 * A Markdown page writes the picture like this, with an optional italic caption right under it:
 *
 *     ![Short description](/gui/vi/<system>-<menu>.svg)
 *
 *     *Figure: what the picture shows.*
 *
 * At build time this plugin finds that line, loads src/data/gui/<system>/<menu>.json and replaces the line (and the
 * caption) with a <figure> of 9-column slots. public/gui-viewer.js opens a detail box when a reader hovers, taps or
 * focuses a slot; the box is built from the `label` and `desc` of the slot in the spec.
 *
 * The menu is schematic on purpose: slot positions, titles and button names come from the game, the textures do not
 * (Mojang's item textures are not redistributed), so an item is a colored block chosen from its material name.
 *
 * The build fails on a spec it cannot draw faithfully (a slot outside the menu, a missing translation), so a wrong
 * slot number breaks the build instead of shipping a misleading picture. Specs are read when a page is built: restart
 * `npm run dev` after editing one.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const SPEC_DIR = join(ROOT, 'src/data/gui');
const LANGS = ['vi', 'en'];
const COLS = 9;

// ---------- colors ----------
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
	return hslToHex(h % 360, 38, 52);
}

function hslToHex(h, s, l) {
	s /= 100;
	l /= 100;
	const k = (n) => (n + h / 30) % 12;
	const a = s * Math.min(l, 1 - l);
	const f = (n) => Math.round(255 * (l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))));
	return '#' + [f(0), f(8), f(4)].map((v) => v.toString(16).padStart(2, '0')).join('');
}

const isPane = (m) => /GLASS_PANE$/.test(String(m).toUpperCase());

function luminance(hex) {
	const m = /^#([0-9a-f]{6})$/i.exec(hex);
	if (!m) return 0.5;
	const [r, g, b] = [0, 2, 4].map((i) => parseInt(m[1].slice(i, i + 2), 16) / 255);
	return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

// ---------- text ----------
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Escapes a description and turns `code` into <code>. Descriptions use no other Markdown. */
const richText = (s) => esc(s).replace(/`([^`]+)`/g, '<code>$1</code>');

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

const own = (def, lang) => (typeof def.short === 'object' ? def.short?.[lang] : def.short);

/**
 * The text drawn inside a tile: the spec's `short` if it has one. Without one, the label itself, but only when EVERY
 * slot of the menu that has a description can show its label (so a picture is either fully labelled or not at all,
 * never a mix). The full label is always in the detail box.
 */
function labelsFit(spec, lang) {
	const named = allDefs(spec).filter((d) => d.desc && d.role !== 'input');
	return named.length > 0 && named.every((d) => own(d, lang) || d.label[lang].length <= 12);
}

function shortOf(def, lang, auto) {
	const text = own(def, lang);
	if (text) return text;
	if (auto && def.desc && def.role !== 'input') return def.label[lang];
	return '';
}

const allDefs = (spec) => [...Object.values(spec.slots), ...(spec.inventory && spec.inventory !== true ? Object.values(spec.inventory) : [])];

const T = {
	vi: { hint: 'Rê chuột vào một ô (trên điện thoại: chạm) để xem chi tiết.', inventory: 'Túi đồ của bạn', slot: 'Ô', slots: 'Ô', inv: 'Túi đồ', hotbar: 'Thanh phím tắt', kind: { button: 'Nút bấm', input: 'Ô đặt đồ', display: 'Chỉ để xem' } },
	en: { hint: 'Hover over a slot (on a phone: tap) to see details.', inventory: 'Your inventory', slot: 'Slot', slots: 'Slots', inv: 'Inventory', hotbar: 'Hotbar', kind: { button: 'Button', input: 'Item slot', display: 'Display only' } },
};

// ---------- validation ----------
function validate(spec, file) {
	const errors = [];
	const fail = (m) => errors.push(`${file}: ${m}`);
	if (!Number.isInteger(spec.rows) || spec.rows < 1 || spec.rows > 6) fail('rows must be an integer from 1 to 6');
	for (const lang of LANGS) if (!spec.title?.[lang]) fail(`title.${lang} is missing`);
	const size = (spec.rows ?? 0) * COLS;
	const check = (where, def) => {
		if (!def.item) fail(`${where} has no item`);
		for (const lang of LANGS) if (!def.label?.[lang]) fail(`${where} has no label.${lang}`);
		if (def.desc) for (const lang of LANGS) if (!def.desc[lang]) fail(`${where} has a desc without ${lang}`);
		if (def.role && !['button', 'display', 'input'].includes(def.role)) fail(`${where}: role must be button, display or input`);
	};
	for (const [slot, def] of Object.entries(spec.slots ?? {})) {
		const i = Number(slot);
		if (!Number.isInteger(i) || i < 0 || i >= size) fail(`slot ${slot} is outside a ${spec.rows}-row menu (0-${size - 1})`);
		check(`slot ${slot}`, def);
	}
	if (spec.inventory && spec.inventory !== true) {
		for (const [slot, def] of Object.entries(spec.inventory)) {
			const i = Number(slot);
			if (!Number.isInteger(i) || i < 0 || i > 35) fail(`inventory slot ${slot} must be 0-35 (0-26 main, 27-35 hotbar)`);
			check(`inventory slot ${slot}`, def);
		}
	}
	// Slots with the same n are one group: they must mean the same thing.
	const groups = new Map();
	for (const def of allDefs(spec)) {
		if (def.n === undefined) continue;
		if (!Number.isInteger(def.n) || def.n < 1) fail(`n must be a positive integer (got ${def.n})`);
		const known = groups.get(def.n);
		if (known && LANGS.some((lang) => known.label?.[lang] !== def.label?.[lang] || known.desc?.[lang] !== def.desc?.[lang])) fail(`the number ${def.n} is used for different slots`);
		groups.set(def.n, def);
	}
	if (errors.length) throw new Error(errors.join('\n'));
}

// ---------- html ----------
/** "22–25, 30–34" from a list of slot numbers. */
function ranges(list) {
	const sorted = [...list].sort((a, b) => a - b);
	const parts = [];
	for (let i = 0; i < sorted.length; ) {
		let j = i;
		while (sorted[j + 1] === sorted[j] + 1) j++;
		parts.push(j === i ? String(sorted[i]) : j === i + 1 ? `${sorted[i]}, ${sorted[j]}` : `${sorted[i]}–${sorted[j]}`);
		i = j + 1;
	}
	return parts.join(', ');
}

function slotHtml(def, { lang, auto, group, where, filler, row, col, kind }) {
	if (!def) {
		if (!filler) return '<span class="gui-slot"></span>';
		const item = filler === true ? 'BLACK_STAINED_GLASS_PANE' : filler;
		return `<span class="gui-slot"><span class="gui-tile gui-pane" style="--c:${materialColor(item)}"></span></span>`;
	}
	const color = materialColor(def.item);
	const dark = luminance(color) < 0.45;
	const role = def.role ?? 'button';
	const pane = isPane(def.item);
	const text = shortOf(def, lang, auto);
	const lines = text ? wrap(text, 8) : [];
	const label = lines.length ? `<span class="gui-text" style="--fg:${dark ? '#ffffff' : '#1b1b1b'}">${lines.map(esc).join('<br>')}</span>` : '';
	const tile = role === 'input'
		? `<span class="gui-tile gui-drop">${def.item !== 'AIR' ? `<span class="gui-ghost" style="--c:${color}"></span>` : ''}</span>`
		: `<span class="gui-tile${pane ? ' gui-pane' : ''}${dark ? ' gui-dark' : ''}" style="--c:${color}"></span>`;
	if (!def.desc) return `<span class="gui-slot">${tile}${label}</span>`;
	const t = T[lang];
	const place = where ?? (group ? `${group.length > 1 ? t.slots : t.slot} ${ranges(group)}` : '');
	const tip = `<span class="gui-src" hidden><strong class="gui-name">${esc(def.label[lang])}</strong><em class="gui-kind gui-kind-${role}">${t.kind[role]}</em><span class="gui-desc">${richText(def.desc[lang])}</span>${place ? `<span class="gui-where">${esc(place)}</span>` : ''}</span>`;
	const aria = `${def.label[lang]}. ${def.desc[lang].replace(/`/g, '')}`;
	const g = def.n !== undefined ? ` data-g="${def.n}"` : '';
	return `<button type="button" class="gui-slot gui-hit" data-r="${row}" data-c="${col}"${g} aria-label="${esc(aria)}">${tile}${label}${tip}</button>`;
}

function render(spec, lang, alt, caption) {
	const auto = labelsFit(spec, lang);
	const t = T[lang];
	// where each group sits, for the footer of the detail box
	const groups = new Map();
	for (const [slot, def] of Object.entries(spec.slots)) if (def.n !== undefined) groups.set(def.n, [...(groups.get(def.n) ?? []), Number(slot)]);
	const invGroups = new Map();
	if (spec.inventory && spec.inventory !== true) for (const def of Object.values(spec.inventory)) if (def.n !== undefined && !groups.has(def.n)) invGroups.set(def.n, true);

	const cells = [];
	for (let r = 0; r < spec.rows; r++) {
		for (let c = 0; c < COLS; c++) {
			const slot = r * COLS + c;
			const def = spec.slots[String(slot)];
			const group = def?.n !== undefined ? groups.get(def.n) : [slot];
			cells.push(slotHtml(def, { lang, auto, group, where: def?.range ? `${t.slots} ${def.range}` : undefined, filler: spec.filler, row: r, col: c }));
		}
	}

	let inventory = '';
	if (spec.inventory) {
		const items = spec.inventory === true ? {} : spec.inventory;
		const part = (from, count, rowBase) => {
			const out = [];
			for (let i = 0; i < count; i++) {
				const def = items[String(from + i)];
				const r = rowBase + Math.floor(i / COLS);
				out.push(slotHtml(def, { lang, auto, group: null, where: from + i < 27 ? t.inv : t.hotbar, row: r, col: i % COLS }));
			}
			return out.join('');
		};
		inventory = `<p class="gui-inv-label">${t.inventory}</p><div class="gui-grid">${part(0, 27, spec.rows)}</div><div class="gui-grid gui-hotbar">${part(27, 9, spec.rows + 3)}</div>`;
	}

	const total = spec.rows + (spec.inventory ? 4 : 0);
	const cap = caption ? `<figcaption>${esc(caption)}</figcaption>` : '';
	return `<figure class="gui not-content" role="group" aria-label="${esc(alt || spec.title[lang])}"><div class="gui-panel" data-rows="${total}"><p class="gui-title">${esc(spec.title[lang])}</p><div class="gui-grid">${cells.join('')}</div>${inventory}</div><p class="gui-hint">${t.hint}</p>${cap}</figure>`;
}

// ---------- specs ----------
const specFiles = new Map(); // name ("system-menu") -> absolute path
(function walk(dir) {
	let entries = [];
	try { entries = readdirSync(dir); } catch { return; }
	for (const entry of entries) {
		const p = join(dir, entry);
		if (statSync(p).isDirectory()) walk(p);
		else if (entry.endsWith('.json')) specFiles.set(p.slice(SPEC_DIR.length + 1).replace(/\\/g, '/').replace(/\.json$/, '').replace(/\//g, '-'), p);
	}
})(SPEC_DIR);

function loadSpec(name) {
	const file = specFiles.get(name);
	if (!file) throw new Error(`remark-gui: no spec for "${name}" (expected src/data/gui/<system>/<menu>.json)`);
	const spec = JSON.parse(readFileSync(file, 'utf8'));
	validate(spec, name);
	return spec;
}

// ---------- the plugin ----------
const IMAGE = /^\/gui\/(vi|en)\/([a-z0-9-]+)\.svg$/;

/**
 * A Sätteri mdast plugin (Astro 7's Markdown processor): swaps the paragraph that holds only a menu image, and the
 * italic caption paragraph after it, for the interactive menu. Register it with
 * `markdown: { processor: satteri({ mdastPlugins: [guiMenus] }) }`.
 */
export const guiMenus = {
	name: 'gui-menus',
	paragraph(node, ctx) {
		const image = node.children.length === 1 && node.children[0].type === 'image' ? node.children[0] : null;
		const m = image ? IMAGE.exec(image.url) : null;
		if (!m) return;
		const [, lang, name] = m;
		let caption = '';
		const parent = ctx.parent(node);
		const index = ctx.indexOf(node);
		const next = parent && index !== undefined ? parent.children[index + 1] : undefined;
		if (next?.type === 'paragraph' && next.children.length === 1 && next.children[0].type === 'emphasis') {
			caption = ctx.textContent(next);
			ctx.removeNode(next);
		}
		try {
			return { type: 'html', value: render(loadSpec(name), lang, image.alt, caption) };
		} catch (error) {
			throw new Error(`${ctx.fileURL ? fileURLToPath(ctx.fileURL) : 'page'}: ${error.message}`);
		}
	},
};
