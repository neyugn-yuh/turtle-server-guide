---
title: "TurtleHoes: Commands"
description: Player commands, examples and troubleshooting.
sidebar:
  label: Commands
  order: 3
---

## Syntax

`<...>` means required and `[...]` means optional. Replace `<player>` with an actual player name; amounts have no separators.

| Command | Purpose |
| --- | --- |
| `/hoe` | Open Harvester Hoe for your main-hand hoe. |
| `/hoe stats` | View your Essence, prestige and crop totals. |
| `/hoe levelup` | Buy the next hoe level; hold the hoe and meet its requirements. |
| `/hoe autosell` | Open AutoSell upgrades; servers using PlayerPoints open its unlock/toggle menu. |
| `/hoe prestige` | Open Prestige; requires holding a hoe. |
| `/hoe ability list` | List available ability IDs and names. |
| `/hoe ability select <id>` | Select an ability owned by the held hoe; frenzy is an example ID. |
| `/hoe ability fire` | Use the held hoe’s selected ability; cooldown applies. |
| `/hoe history` | View your own history without holding a hoe. |
| `/hoe history <player>` | View another player’s history if the server allows you. |
| `/hoe boss [status]` | View boss summoning progress; while active, view health, top damage and your damage. |
| `/essence [balance]` | View your Essence balance. |
| `/essence pay <player> <amount>` | Send a positive whole amount of Essence to another player if allowed; you cannot pay yourself. |
| `/essence withdraw <amount>` | Withdraw a positive whole amount into an Essence Note if allowed; right-click it to redeem Essence. |
| `/essence top` | View the top 10 Essence balances in chat. |
| `/crops [balance]` | View your totals for each crop type. |
| `/crops balance <player> [crop]` | View a player’s totals; add a crop ID to show one type. |
| `/crops top [crop\|all] [day\|week\|month]` | View the top 10 crop totals; omit the period for all time. |
| `/harvesterevent` | View remaining time, your position and the current contest’s top five. |

## Examples

```text
/hoe
/hoe ability select frenzy
/hoe ability fire
/essence withdraw 100
/crops top wheat week
/harvesterevent
```

`/hoe` aliases are `/hoes`, `/turtlehoes`, `/harvesterhoe`; `/crops` has `/crop`; `/harvesterevent` has `/harvesterevents`, `/hevent`, `/he`.

Crop IDs: `wheat`, `carrot`, `potato`, `beetroot`, `nether_wart`, `cocoa_bean`, `melon`, `pumpkin`, `sugar_cane`, `bamboo`, `pitcher`. For `/crops balance`, the player name comes before the crop ID. Crop totals count harvested crops, not items currently in your inventory.

## Common errors

| Message or situation | What to do |
| --- | --- |
| Hold a harvester hoe in your main hand. | Hold a valid Harvester Hoe in your main hand. An ordinary Minecraft hoe does not substitute. |
| You do not have permission. | The server has not allowed this action; ask an administrator. |
| Unknown player | Check the recipient or statistics target’s player name. |
| Usage | Check argument order. Essence transfers and withdrawals require positive whole numbers. |
| Không đủ tài nguyên / Insufficient resources | Read the current price; check the correct currency and hoe level/prestige requirements. |
| Coming soon! | The server currently has this feature disabled. |
| Không có sự kiện / No event | No contest is running; try again after an announcement. |

:::note[Leaderboard periods]
Days, weeks and months follow the server’s time zone; defaults are UTC and Monday-start weeks (the server may change the time zone). Command results appear in chat.
:::
