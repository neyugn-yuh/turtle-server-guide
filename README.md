# Turtle Server Guide

Player guide for the Turtle Minecraft servers (GitHub org MineTurtleVN), built with [Astro Starlight](https://starlight.astro.build/) on the same Emerald Base design as the Turtle Plugins Wiki. The wiki is written for the people who **configure** the plugins; this site is for the people who **play**: how each system works, an interactive picture of every menu, the commands a player can use and answers to common questions. Vietnamese is the default language (served at `/`), English is at `/en/`.

**The guide is split by server.** Every server has its own section (`/<server>/...`), its own list of systems and its own copy of the pages, because the plugins and the numbers differ from server to server. Players never see plugin names: page titles, the sidebar, URLs and text use the names players know (Minion, not the plugin).

## Commands

| Command           | Action                                                     |
| :---------------- | :--------------------------------------------------------- |
| `npm install`     | Install dependencies                                       |
| `npm run dev`     | Start the dev server at `localhost:4321`                   |
| `npm run build`   | Build to `./dist/` (also checks links and every menu spec) |
| `npm run deploy`  | Build and deploy to Cloudflare Pages                       |

Menu specs are read when a page is built: restart `npm run dev` after editing a spec.

## Layout

```
src/data/servers.mjs                   the servers and which systems each one has (drives the sidebar and the home cards)
src/data/guides.mjs                    catalog of the systems: player-facing name and one-line description
src/content/docs/getting-started/      pages that apply to every server (Vietnamese, served at /)
src/content/docs/<server>/index.mdx    start page of a server (cards of its systems)
src/content/docs/<server>/<system>/    one folder per system: overview, menus, commands, tips
src/content/docs/en/...                English pages, same paths
src/data/gui/<system>/<menu>.json      one spec per menu picture
src/plugins/gui-menus.mjs              Markdown plugin: turns a menu image into the interactive menu
public/gui-viewer.js                   opens the detail box on hover, tap or focus
src/styles/gui.css                     look of the menu and of the detail box
src/components/                        GuideCards (systems of one server), ServerCards (home page)
src/styles/custom.css                  Emerald Base mapped to Starlight tokens
```

Every page must exist in both languages; the build fails on broken links.

## Interactive menus

A menu is drawn from a spec and shown on the Menus page. Hovering a slot (tapping it on a phone, focusing it with the keyboard) opens a box in the style of the game's item tooltip: the slot name, what kind of slot it is (button, item slot, display only), what it does and where it is. Slots that mean the same thing (for example the locked storage slots) light up together.

The picture is a **schematic**, not a screenshot: slot positions, titles and button names come from the game; the textures do not (Mojang's textures are not redistributed), an item is a colored block chosen from its material name.

Reference a menu from `menus.md` with an image line, optionally followed by an italic caption. The plugin swaps both for the interactive menu:

```md
![Short description](/gui/vi/<system>-<menu>.svg)

*Figure: what the picture shows.*
```

The language in the path (`vi` or `en`) picks the text. The path is only a key (no file exists there): `<system>-<menu>` is `src/data/gui/<system>/<menu>.json`.

A spec (`src/data/gui/<system>/<menu>.json`):

```json
{
  "title": { "vi": "Ba lô", "en": "Backpack" },
  "rows": 6,
  "filler": true,
  "inventory": true,
  "slots": {
    "13": {
      "item": "EMERALD",
      "n": 1,
      "label": { "vi": "Bán tất cả", "en": "Sell all" },
      "short": { "vi": "Bán hết", "en": "Sell all" },
      "desc": {
        "vi": "Bán mọi thứ trong ba lô theo giá hiện tại.",
        "en": "Sells everything in the backpack at the current prices."
      },
      "role": "button"
    }
  }
}
```

- `rows` 1 to 6; slot numbers run 0 to `rows*9-1`, left to right, top to bottom.
- `item` is a Bukkit Material name (`AIR` for an empty slot the player puts items into).
- `label` is the name in the box; `desc` is the text in the box (`` `code` `` is the only Markdown allowed). Both need `vi` and `en`. A slot without `desc` is decoration: no box.
- `role`: `button` (default), `display` (to look at), `input` (the player puts items in, dashed outline).
- `short` is the text inside the slot. Without it the label is used when every described slot of the menu has a label of at most 12 characters; otherwise the picture shows no text in slots.
- `n` groups slots that mean the same thing (they must have the same `label` and `desc`); the group lights up together and the box lists all its slot numbers. Optional `range` overrides that list when a group stands for a dynamic list (for example `"0–44"`).
- `filler` draws the empty slots as black glass panes, `inventory` draws the player's inventory below. `inventory` can also be an object keyed 0-35 (0-26 main, 27-35 hotbar) with slot definitions like `slots`.

The build fails on a slot outside the menu, a missing translation, a desc without both languages or a group whose slots disagree.

## Adding a server

1. Add an entry to `src/data/servers.mjs` (`slug`, `title`, `description`, `guides`: slugs from `guides.mjs`).
2. Create `src/content/docs/<server>/index.mdx` and `src/content/docs/en/<server>/index.mdx` (copy an existing one and change `<GuideCards server="..." />`).
3. Put the pages of each system in `src/content/docs/<server>/<system>/` and `src/content/docs/en/<server>/<system>/`. Copy them from another server when the system is the same, then change what differs there (prices, layouts, availability).
4. `npm run build`.

## Adding a system

1. Add an entry to `src/data/guides.mjs` (player-facing `title` and `description`, never the plugin name).
2. List its slug in the `guides` of every server that has it.
3. Create `overview.md` (order 1), `menus.md` (2), `commands.md` (3), `tips.md` (4) in both languages under each server folder.
4. Write one spec per menu in `src/data/gui/<system>/` and reference it from `menus.md`.
5. `npm run build`.

## Content rules

- Write for players: "bạn", short steps, examples. No config keys, file names, permission nodes or admin commands (those belong in the wiki).
- Never write a plugin name (`Turtle...`) in a title, description, heading, URL or text. Use what players call the system.
- Facts come from the plugin's source. Where the source cannot answer a question, leave a visible `:::caution[Chưa rõ]` aside instead of guessing.
- Numbers that the server can change are described as "usually" or "by default".
- No credentials, tokens, webhook URLs, hostnames or IPs, no anti-cheat detection thresholds, no roadmap or internal notes.
