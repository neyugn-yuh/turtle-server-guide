# Turtle Server Guide

Player guide for the Turtle Minecraft server (GitHub org MineTurtleVN), built with [Astro Starlight](https://starlight.astro.build/) on the same Emerald Base design as the Turtle Plugins Wiki. The wiki is written for the people who **configure** the plugins; this site is for the people who **play**: how each system works, a diagram of every menu, the commands a player can use and answers to common questions. Vietnamese is the default language (served at `/`), English is at `/en/`.

## Commands

| Command           | Action                                                           |
| :---------------- | :--------------------------------------------------------------- |
| `npm install`     | Install dependencies                                             |
| `npm run gui`     | Draw the menu diagrams (`public/gui/<lang>/*.svg`) from the specs |
| `npm run dev`     | Draw the diagrams, then start the dev server at `localhost:4321` |
| `npm run build`   | Draw the diagrams, build to `./dist/` (also checks links)        |
| `npm run deploy`  | Build and deploy to Cloudflare Pages                             |

## Layout

```
src/content/docs/getting-started/   how to read the guide (Vietnamese, served at /)
src/content/docs/guides/<slug>/     one folder per system: overview, menus, commands, tips
src/content/docs/en/...             English pages, same paths
src/data/guides.mjs                 the list of systems: drives the sidebar and the landing-page cards
src/data/gui/<slug>/<menu>.json     one spec per menu diagram
scripts/build-gui.mjs               draws the specs into public/gui/<lang>/<slug>-<menu>.svg (generated, committed)
src/components/GuideCards.astro     landing-page cards
src/styles/custom.css               Emerald Base mapped to Starlight tokens
```

Every page must exist in both languages; the build fails on broken links.

## Menu diagrams

The diagrams are **schematics**, not screenshots. The slot positions, titles and button names come from the plugin; the item textures do not (Mojang's textures are not redistributed), an icon is a colored block chosen from the material name. A numbered badge on a slot matches the row of the table under the picture on the Menus page.

A spec (`src/data/gui/<slug>/<menu>.json`):

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
      "role": "button"
    }
  }
}
```

- `rows` 1 to 6; slot numbers run 0 to `rows*9-1`, left to right, top to bottom.
- `item` is a Bukkit Material name (`AIR` for an empty slot the player puts items into).
- `role`: `button` (default), `display` (to look at), `input` (the player puts items in, dashed outline).
- `n` is the badge number. Several slots may share a number if they mean the same thing; give only the first `"badge": true` and the others `"badge": false`.
- `filler` draws the empty slots as black glass panes, `inventory` draws the player's inventory below.
- `label` and `short` need both `vi` and `en`.

`npm run gui` validates every spec and fails on a slot outside the menu, a missing translation or a reused number.

## Adding a guide

1. Add an entry to `src/data/guides.mjs`.
2. Create `src/content/docs/guides/<slug>/` and `src/content/docs/en/guides/<slug>/` with `overview.md` (order 1), `menus.md` (2), `commands.md` (3), `tips.md` (4).
3. Write one spec per menu in `src/data/gui/<slug>/` and reference it from `menus.md`:

   ```md
   ![Short description](/gui/vi/<slug>-<menu>.svg)
   ```

4. `npm run build`.

## Content rules

- Write for players: "bạn", short steps, examples. No config keys, file names, permission nodes or admin commands (those belong in the wiki).
- Facts come from the plugin's source. Where the source cannot answer a question, leave a visible `:::caution[Chưa rõ]` aside instead of guessing.
- Numbers that the server can change are described as "usually" or "by default".
- No credentials, tokens, webhook URLs, hostnames or IPs, no anti-cheat detection thresholds, no roadmap or internal notes.
