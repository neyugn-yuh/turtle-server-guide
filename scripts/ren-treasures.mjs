/**
 * Treasure chests (rương báu) and the Xui Xẻo point shops of Sky Rèn, called by sync-ren.mjs, written to treasures.json.
 *
 * Files read (relative to the plugins folder of the server repo):
 *   CrazyCrates/crates/<Crate>.yml                   the chests: name, item, tiers (Tiers) and every prize (what it gives, its tier).
 *                                                    The chance of a prize is NOT copied: the wiki shows what is in a chest and its tier, not the odds.
 *   DeluxeMenus/gui_menus/xuixeo/menuDoiDiemXuiXeo.yml   the menu that lists the shops (order of the shops)
 *   DeluxeMenus/gui_menus/xuixeo/menuXuiXeo*.yml     the Xui Xẻo shops: what a click gives and the points it costs
 *
 * What a prize (or a shop item) really gives is what its commands do, so the name and the amount come from the commands:
 *   eco give / exp give / src exp / experience add     money, experience
 *   wildstacker:stacker give <player> spawner <mob> n   spawners
 *   mi give <TYPE> <ID> <player> n                       an MMOItems item (name from MMOItems/item/<type>.yml)
 *   crazycrates give v <Crate> n <player>                a key of a chest
 *   se givercbook <GROUP> <player> n / se givebook ...   enchant books
 *   ae giveitem <player> secret n ..                     Bụi phép
 *   give <player> <vanilla item> n                       a vanilla item
 *   turtletop add <player> <currency> n                  an event currency (Kẹo)
 *   cr give to <player> <chest> n                        a chest of CrateReloaded (named as the prize or menu item is)
 * Counters (turtletop add diem.../xuixeo...), announcements and effects are not part of what the player gets. A command the
 * script does not understand is left out and reported, never guessed. When the name of a prize says "x3" but the command gives 2,
 * the command wins and the difference is reported.
 */
import { readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { skinHash } from './ren-skulls.mjs';

/** The order of the chests on the wiki (a chest that is not here comes last, by file name). */
const CHEST_ORDER = ['Phuthuy', 'Thuongco', 'cauvong', 'RuongAFK', 'HomAcMong'];
/** Vanilla items given by `give` (id -> name). */
const VANILLA = {
	golden_apple: 'Táo vàng',
	enchanted_golden_apple: 'Táo vàng phù phép',
	experience_bottle: 'Bình kinh nghiệm',
	beacon: 'Beacon',
	emerald: 'Ngọc lục bảo',
	diamond: 'Kim cương',
	elytra: 'Cánh cứng (Elytra)',
};
/** Event currencies given by `turtletop add` (id -> name); the counters (diem..., xuixeo...) are not rewards. */
const CURRENCIES = { keongo: 'Kẹo Ngô Ma Quái', keolinhhon: 'Kẹo Linh Hồn' };
const COUNTER = /^(diem|xuixeo)\w*$/;

// small capitals (ᴀ ʙ ᴄ ...) are letters written in a fancy way: back to the plain letter
const SMALL_CAPS = 'ᴀʙᴄᴅᴇꜰɢʜɪᴊᴋʟᴍɴᴏᴘǫʀꜱᴛᴜᴠᴡxʏᴢ';
const fmt = (n) => Number(n).toLocaleString('vi-VN');

export function buildTreasures({ base, readYaml, stripCodes, pretty, itemInfo, bookGroups, mobs, skulls, warn, fail }) {
	const unSmall = (text) => [...String(text ?? '')].map((c) => { const i = [...SMALL_CAPS].indexOf(c); return i >= 0 ? 'abcdefghijklmnopqrstuvwxyz'[i] : c; }).join('');
	/** "&e&l(2♦) CÚP TỐI CAO (2♦) &7[OP] (New)" -> "Cúp Tối Cao (2♦)". */
	const cleanName = (text) => {
		// only Latin and Vietnamese letters stay: the decoration of the names (ミ ๖ ঔৣ ༺ ⌘) is dropped
		const latin = [...unSmall(stripCodes(text))]
			.map((c) => {
				const code = c.codePointAt(0);
				return /[A-Za-z0-9\s()[\]'.:&,+♦-]/.test(c) || (code >= 0xc0 && code <= 0x24f) || (code >= 0x1e00 && code <= 0x1eff) ? c : ' ';
			})
			.join('');
		const level = /\(\s*(\d+)\s*♦\s*\)/.exec(latin)?.[1];
		const name = pretty(latin.replace(/\(\s*\d+\s*♦\s*\)/g, ' ').replace(/\(\s*new\s*\)/gi, ' ').replace(/\[\s*op\s*\]/gi, ' ').replace(/:{2,}/g, ' ').replace(/\(\s*\.+/g, '(').replace(/\.+\s*\)/g, ')'), { keepBrackets: true })
			.split(' ')
			.filter((w) => !/^[.:]+$/.test(w))
			.join(' ')
			.replace(/\bExp\b/g, 'EXP')
			.replace(/\bAfk\b/g, 'AFK');
		return level ? `${name} (${level}♦)` : name;
	};
	/** The name a prize or menu item shows, without the amount ("x4 Lồng Spawner", "Đại Hũ X30 Rương" -> "Lồng Spawner", "Rương") that is shown beside it. */
	const shownName = (text, amount) =>
		cleanName(text)
			.replace(/\bx\s*(\d+)\b/gi, (m, n) => (Number(n) === amount ? '' : m))
			.replace(/^Đại Hũ\s+/i, '')
			.replace(/\s+/g, ' ')
			.trim();

	const files = join(base, 'CrazyCrates/crates');
	if (!existsSync(files)) fail('CrazyCrates/crates not found');
	const ids = readdirSync(files).filter((f) => f.endsWith('.yml')).map((f) => f.slice(0, -4));
	ids.sort((a, b) => (CHEST_ORDER.includes(a) ? CHEST_ORDER.indexOf(a) : 99) - (CHEST_ORDER.includes(b) ? CHEST_ORDER.indexOf(b) : 99) || a.localeCompare(b));
	const crates = new Map(ids.map((id) => [id, readYaml(`CrazyCrates/crates/${id}.yml`).Crate]));
	const crateName = new Map([...crates].map(([id, c]) => [id.toLowerCase(), cleanName(c?.Name)]));

	/**
	 * What a list of commands gives: [{ name, amount }] plus the counters it adds ({ currency: n }).
	 * `display` is the name the prize or the menu item shows (used for the things whose name is not in a file).
	 */
	const skullOf = new Map((skulls ?? []).map((k) => [k.id, k]));
	function give(commands, display, where) {
		const items = [];
		const counters = {};
		const text = commands.map((c) => String(c).replace(/^\[(?:console|player)\]\s*/, '').replace(/%player(?:_name)?%/g, '@P').trim());
		for (const command of text) {
			let m;
			if (/^(?:broadcast|bc|execute|tcsendmsg) /.test(command) || /^turtletop remove /.test(command)) continue;
			if ((m = /^turtletop add @P (\w+) (\d+)$/.exec(command))) {
				if (COUNTER.test(m[1])) counters[m[1]] = (counters[m[1]] ?? 0) + Number(m[2]);
				else if (CURRENCIES[m[1]]) items.push({ name: CURRENCIES[m[1]], amount: Number(m[2]) });
				else warn(`${where}: currency ${m[1]} has no known name (left out)`);
			} else if ((m = /^eco give @P (\d+)$/.exec(command))) items.push({ name: `${fmt(m[1])} Tiền`, amount: 1 });
			else if ((m = /^(?:src exp|exp give|experience add) @P (\d+)(?: points)?$/.exec(command))) items.push({ name: `${fmt(m[1])} EXP`, amount: 1 });
			else if ((m = /^wildstacker:stacker give @P spawner (\w+) (\d+)$/.exec(command))) {
				const mob = mobs[m[1].toLowerCase()];
				if (mob) items.push({ name: `Spawner ${mob}`, amount: Number(m[2]) });
				else warn(`${where}: spawner of ${m[1]} has no known name (left out)`);
			} else if ((m = /^mi give (\w+) (\w+) @P(?: (\d+))?\b/.exec(command))) {
				const info = itemInfo(m[1], m[2]);
				const skull = m[1].toUpperCase() === 'SOPHEP' ? skullOf.get(m[2].toLowerCase()) : null; // a magic skull is named as on the Sọ phép page
				if (info) items.push({ name: skull?.name ?? cleanName(info.rawName), amount: Number(m[3] ?? 1), ...(skull?.texture ? { texture: skull.texture } : {}) });
				else warn(`${where}: ${m[1]}:${m[2]} is not in MMOItems (left out)`);
			} else if ((m = /^crazycrates give v (\w+) (\d+) @P$/.exec(command))) {
				const name = crateName.get(m[1].toLowerCase());
				if (name) items.push({ name: `Chìa khóa ${name}`, amount: Number(m[2]) });
				else warn(`${where}: key of the chest ${m[1]} has no known name (left out)`);
			} else if ((m = /^se givercbook (\w+) @P (\d+)$/.exec(command))) {
				if (bookGroups[m[1]]) items.push({ name: `Sách phép ${cleanName(bookGroups[m[1]])} ngẫu nhiên`, amount: Number(m[2]) });
				else warn(`${where}: enchant book group ${m[1]} is not in SkyEnchants/groups.yml (left out)`);
			} else if (/^se givebook @P \w+ /.test(command)) items.push({ name: shownName(display, 1), amount: 1 });
			else if ((m = /^ae giveitem @P secret (\d+) \w+$/.exec(command))) items.push({ name: 'Bụi phép', amount: Number(m[1]) });
			else if ((m = /^give @P (?:minecraft:)?(\w+) (\d+)$/.exec(command))) {
				const name = VANILLA[m[1].toLowerCase()];
				if (name) items.push({ name, amount: Number(m[2]) });
				else warn(`${where}: give ${m[1]} has no known name (left out)`);
			} else if ((m = /^cr give to @P ([\w-]+) (\d+)(?: (?:online|offline))?$/.exec(command))) items.push({ name: shownName(display, Number(m[2])), amount: Number(m[2]) });
			else if ((m = /^epicvouchers give @P \w+ (\d+)$/.exec(command))) items.push({ name: shownName(display, Number(m[1])), amount: Number(m[1]) });
			else if ((m = /^treomay giverefill @P (\d+)$/.exec(command))) items.push({ name: `Mảnh treo máy ${m[1]} phút`, amount: 1 });
			else warn(`${where}: command "${command}" is not understood (left out)`);
		}
		return { items, counters };
	}

	const iconOf = (material, player) => {
		const m = String(material ?? '').toLowerCase();
		if (m.startsWith('basehead-')) return { texture: skinHash(String(material).slice('basehead-'.length)) };
		if (m === 'player_head') return { texture: skinHash(Buffer.from(JSON.stringify({ textures: { SKIN: { url: String(player ?? '') } } })).toString('base64')) };
		return { icon: m || null };
	};

	const out = [];
	for (const [id, crate] of crates) {
		const where = `CrazyCrates/crates/${id}.yml`;
		if (!crate?.Prizes) {
			warn(`${where}: no prizes (chest left out)`);
			continue;
		}
		const tiers = Object.entries(crate.Tiers ?? {}).map(([tid, t]) => ({ id: tid, name: pretty(t.Name) || stripCodes(t.Name).trim() }));
		const points = {};
		const prizes = [];
		for (const [key, p] of Object.entries(crate.Prizes)) {
			const { items, counters } = give(p.Commands ?? [], p.DisplayName, `${where} prize ${key}`);
			for (const [c, n] of Object.entries(counters)) (points[c] ??= []).push(n);
			if (!items.length) {
				warn(`${where} prize ${key}: nothing the wiki can show (left out)`);
				continue;
			}
			// "x3 | Skeleton Spawner" that gives 2: the name of the prize does not match what it gives
			const said = /^x(\d+)\b/i.exec(cleanName(p.DisplayName))?.[1];
			if (said && items.length === 1 && Number(said) !== items[0].amount) warn(`${where} prize ${key}: the name says x${said} but the command gives ${items[0].amount} (wiki shows ${items[0].amount})`);
			const tier = (p.Tiers ?? [])[0] ?? null;
			if (tiers.length && !tiers.some((t) => t.id === tier)) warn(`${where} prize ${key}: tier ${tier} is not one of the tiers of the chest`);
			prizes.push({ key, counted: Object.keys(counters).some((c) => c.startsWith('xuixeo')), items, tier, big: /đại\s*hũ|jackpot/i.test(unSmall(stripCodes(p.DisplayName))), ...iconOf(p.DisplayItem, p.Player), ...(items[0].texture && String(p.DisplayItem).toLowerCase() === 'player_head' ? { texture: items[0].texture } : {}) });
		}
		if (!prizes.length) fail(`${where}: no prize could be read`);
		// the points of the Xui Xẻo shop every prize gives: one counter, the same number in every prize
		const counter = Object.entries(points).find(([c]) => c.startsWith('xuixeo'));
		let xuixeo = null;
		if (counter) {
			const [currency, list] = counter;
			// one number of points for the prizes that give points; the prizes that give none are listed
			const counts = [...new Set(list)];
			if (counts.length !== 1) warn(`${where}: the Xui Xẻo points differ between prizes (not shown)`);
			else {
				const without = prizes.filter((x) => !x.counted).map((x) => x.items.map((i) => i.name).join(' + '));
				if (without.length) warn(`${where}: ${without.join(', ')} give no Xui Xẻo point (shown as an exception)`);
				xuixeo = { currency, points: counts[0], except: without };
			}
		}
		out.push({ id: id.toLowerCase(), name: crateName.get(id.toLowerCase()), icon: String(crate.Item ?? '').toLowerCase() || null, tiers, xuixeo, prizes });
	}
	if (!out.length) fail('no treasure chests found in CrazyCrates/crates');

	// ---------- Xui Xẻo shops ----------
	const main = readYaml('DeluxeMenus/gui_menus/xuixeo/menuDoiDiemXuiXeo.yml');
	const order = Object.values(main.items ?? {})
		.map((item) => ({ slot: Number(item.slot), menu: /\[openguimenu\]\s*(menuXuiXeo\w+)/.exec((item.click_commands ?? []).join('\n'))?.[1] }))
		.filter((x) => x.menu && Number.isFinite(x.slot))
		.sort((a, b) => a.slot - b.slot)
		.map((x) => x.menu);
	if (!order.length) fail('menuDoiDiemXuiXeo.yml: no shop menus found');
	const shops = [];
	for (const menu of order) {
		const file = `DeluxeMenus/gui_menus/xuixeo/${menu}.yml`;
		const data = readYaml(file);
		const items = [];
		let currency = null;
		for (const [key, item] of Object.entries(data.items ?? {}).sort((a, b) => Number(a[1].slot ?? 999) - Number(b[1].slot ?? 999))) {
			const commands = (item.click_commands ?? []).map(String);
			const cost = commands.map((c) => /turtletop remove %player_name% (\w+) (\d+)/.exec(c)).find(Boolean);
			if (!cost) continue;
			if (currency && currency !== cost[1]) fail(`${file}: two currencies (${currency}, ${cost[1]})`);
			currency = cost[1];
			const { items: gives } = give(commands, item.display_name, `${file} ${key}`);
			if (!gives.length) {
				warn(`${file} ${key}: nothing the wiki can show (left out)`);
				continue;
			}
			items.push({ key, price: Number(cost[2]), items: gives, ...iconOf(item.material) });
		}
		if (!items.length || !currency) fail(`${file}: no shop items found`);
		shops.push({ id: menu.replace(/^menuXuiXeo/, '').replace(/^./, (c) => c.toLowerCase()), name: cleanName(data.menu_title), currency, items });
	}
	// the chest that gives the points of a shop
	for (const shop of shops) {
		const source = out.find((c) => c.xuixeo?.currency === shop.currency);
		if (!source) warn(`shop ${shop.id}: no chest gives its points (${shop.currency})`);
		shop.chest = source?.id ?? null;
	}
	return { chests: out, shops };
}
