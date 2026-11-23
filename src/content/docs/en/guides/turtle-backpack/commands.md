---
title: "TurtleBackpack: Commands"
description: Player commands for opening storage, selling items and toggling auto-sell.
sidebar:
  label: Commands
  order: 3
---

## Syntax

Use these commands in game, if the server allows you. `/backpack` and `/turtlebackpack` are aliases of `/bp`.

| Command | Effect | Example |
| --- | --- | --- |
| `/bp` | Open Ba lô. | `/bp` |
| `/bp sell` | Immediately sell all supported, sellable types in your backpack. | `/bp sell` |
| `/bp sell <category>` | Immediately sell sellable items in that category. | `/bp sell farming` |
| `/bp sell <item>` | Immediately sell one type. | `/bp sell minecraft:wheat` |
| `/bp autosell <item>` | Toggle auto-sell for that type. | `/bp autosell wheat` |
| `/bp upgrades` | Open Backpack Upgrades. | `/bp upgrades` |
| `/bp icon` | Toggle the backpack icon if the server allows it. | `/bp icon` |
| `/bp help` | Show brief command help in chat. | `/bp help` |

:::caution[Sale commands do not ask for confirmation]
`/bp sell` and its variants sell immediately. To review first, use **Bán tất cả** in the main menu.
:::

## Choose the right category and item

The default command names are `farming` for Nông sản, `mining` for Khoáng sản, `fishing` for Cá and `mobs` for Đồ rơi từ mob. These are the words you enter in commands, rather than the Vietnamese menu names. The server can change categories.

An item ID is its command name, such as `minecraft:wheat`. For ordinary Minecraft items, `wheat` also means `minecraft:wheat`. For special items, use the exact ID suggested by Tab completion; do not enter an arbitrary display name.

```text
/bp sell mining
/bp sell wheat
/bp autosell minecraft:carrot
/bp upgrades
```

Press Tab after `/bp sell ` to find a category or item. After `/bp autosell `, Tab suggests items. Auto-sell requires one item, not an entire category; run the command again to disable it.

## Common errors

| Message meaning | What should you do? |
| --- | --- |
| You do not have permission. | Ask an administrator whether you can use the backpack. |
| Your backpack is loading; try again shortly. | Wait, then retry. |
| No category or item named … | Check the ID using Tab; discontinued items cannot be sold with this command. |
| No item: … | Add an ID after the auto-sell command, or choose a suggested ID. |
| Nothing to sell. | Check whether your backpack contains items with sale prices. |
| You cannot use auto-sell. | Ask an administrator about access to this feature. |
| Payment failed; nothing was sold. | Removed items are refunded; tell an administrator if it keeps happening. |
| The server has disabled the hotbar backpack icon. | Use `/bp` to open storage. |
| The server does not allow disabling the icon. | Keep the icon; `/bp` still opens storage. |
| Clear an empty slot to receive the icon. | Make inventory space, then wait for the icon to be checked again. |
