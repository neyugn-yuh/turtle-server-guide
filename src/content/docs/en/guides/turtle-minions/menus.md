---
title: "TurtleMinions: Menus"
description: How to open and use the minion, attached storage and tier upgrade menus.
sidebar:
  label: Menus
  order: 2
---

## Reading the diagrams

Numbered badges match the `#` column; Slot uses slot numbers starting at 0, from left to right and then down each row. Diagrams use the default layout without text colors. English names match those shown in game. Your server may change layouts and contents. These menus have no pagination.

## Minion menu

Right-click your minion. The diagram shows `Cobblestone Minion I` with a product, without fuel, support items or a hopper installed.

![Cobblestone Minion I menu](/gui/en/turtle-minions-minion.svg)

*Figure: A tier I minion with one unlocked storage slot and empty support slots.*

| # | Slot | What it does |
| --- | --- | --- |
| 1 | 4 | `Cobblestone Minion I`: hover for tier, actual speed, capacity, products and statistics; clicking has no action. |
| 2 | 21 | Click the `Cobblestone` stack to collect it into your inventory; this is not a deposit slot. |
| 3 | 22–25, 30–34, 39–43 | `Locked storage slot`: locked slots; increase the tier to unlock more. |
| 4 | 19 | `Fuel`: with fuel on your cursor, left-click to add the whole stack or right-click to add one item; an empty cursor can only remove permanent fuel. |
| 5 | 28, 37 | `Upgrade slot`: install a valid support item; click with an empty cursor to remove it. |
| 6 | 46 | `Automated Shipping`: install a special hopper; with an empty cursor, left-click to collect coins or right-click to remove the hopper and attempt coin collection. |
| 7 | 48 | `Collect all`: collect products from both main and attached storage; anything that does not fit stays stored. |
| 8 | 50 | `Upgrade minion`: request the next tier; opens the upgrade menu when your server has provided costs. |
| 9 | 53 | `Pickup minion`: pick it up immediately without a confirmation dialog; returned items that do not fit drop on the ground. |

As tiers increase, storage slots unlock in this order: 21, 22, 23, 24, 25, 30, 31, 32, 33, 34, 39, 40, 41, 42, 43. The number unlocked depends on type and tier. Unlocked slots may be empty or show products. The title, statistics head and products change with the minion. Support slots show installed items; fuel shows its remaining time and the hopper shows held coins.

You can also click a valid item in your inventory while this menu is open: fuel uses one item, or the entire stack with Shift-click if temporary; support items and hoppers use one item. Dragging does not move items as it would in an ordinary chest. `Collect all` only collects products, not hopper coins.

## Minion Storage

Place a Minion Storage item next to a minion, then right-click the attached storage block to open it. This diagram uses the default Small Storage with 3 extra slots and one example product stack.

![Minion Storage menu](/gui/en/turtle-minions-storage.svg)

*Figure: A 3-slot attached storage with the remaining slots blocked by black glass.*

| # | Slot | What it does |
| --- | --- | --- |
| 1 | 0–2 | Click a product slot to collect its entire stack; anything that does not fit remains stored. You cannot deposit items here. |

Default extra capacities are 3, 9, 15, 21 or 27 slots depending on the item; your server may change them. The title shows the actual capacity. The menu rounds up to complete rows of 9 slots and blocks unused spaces with black glass. Empty slots receive products automatically; they are not item inputs. There is no back button: close this menu and right-click the minion. If you are sneaking with an item in your main hand, right-clicking the storage block may place an item instead of opening the menu.

## Upgrade Minion

Click `Upgrade minion` in the minion menu. This menu only opens if another tier exists and your server provides costs or allows free upgrades. By default, costs are absent and free upgrades are disabled: you receive a message instead of seeing the menu.

![Upgrade Minion layout](/gui/en/turtle-minions-upgrade.svg)

*Figure: The default layout for tier 1 to 2, with the materials area blank because no default requirements exist.*

| # | Slot | What it does |
| --- | --- | --- |
| 1 | 16 | `Upgrade minion`: click to check and consume the required materials and increase the tier by one; the menu closes on success. |
| 2 | 22 | `Back`: return to the minion menu. |

This shows the layout when your server makes upgrades available, not an included free upgrade. The title changes with the current and target tiers. Material requirements, if present, appear in order in slots 10–14; these are displays, not deposit slots. Unused spaces remain black glass. Keep materials in your inventory or offhand; clicking inventory items does not move them into this menu. Check the list and the total requirement on the button before confirming. Missing materials prevent the upgrade without consuming materials. Only the minion's owner can confirm through ordinary gameplay.
