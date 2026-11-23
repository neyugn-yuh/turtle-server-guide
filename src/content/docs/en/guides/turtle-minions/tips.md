---
title: "TurtleMinions: Tips and FAQ"
description: Answers about offline production, full storage, fuel, upgrades and picking up minions.
sidebar:
  label: Tips and FAQ
  order: 4
---

## Does my minion work while I am offline?

Yes. Production uses elapsed time, including periods when the area is unloaded or the server is shut down and later restarted. Storage and the ability to sell overflow still limit the result. You do not need to stand nearby to keep the animation running.

## Why have products stopped increasing?

Check both the main and attached storage. When products no longer fit and cannot be sold, the minion stops accumulating more; that time does not become a backlog you can collect in full later. Collect regularly or increase storage capacity.

## Where do collected items go if my inventory is full?

When collecting through a storage slot or `Collect all`, anything that does not fit remains in storage. When removing support items, breaking attached storage or picking up a minion, returned items that do not fit may drop on the ground. Clear your inventory before moving a minion.

## Is fuel required? Can I change fuel types?

Fuel is not required for basic production. Clicking fuel in your inventory uses one item; Shift-clicking uses the entire stack of temporary fuel. With fuel on your cursor, click the `Fuel` slot: left-click uses the whole stack, right-click uses one item. Adding the same fuel extends its duration. You cannot install a different type while the current fuel is active. Only permanent fuel can be removed with an empty cursor; temporary fuel is not refunded, even when picking up the minion.

## How should I use the two upgrade slots?

`Upgrade slot` spaces hold support items. Auto Smelter smelts suitable products; Compactor compresses them according to recipes; Super Compactor 3000 compresses them into enchanted items. These do not increase the minion's tier. Some items only work with suitable types, such as Enchanted Egg for Chicken minions and Flint Shovel for Gravel minions. By default, Flycatcher and Minion Expander allow two identical copies; other items may reject duplicates. Your server may change effects and restrictions.

## Why is my hopper not selling or paying immediately?

Automated Shipping only sells overflow, not items already in storage. You need a special hopper, not an ordinary hopper. By default, Budget Hopper sells at 50% of the sell price and Enchanted Hopper at 70%; your server may change this. The item must have a valid sell price. Coins stay at the minion: left-click the hopper slot with an empty cursor to collect them into the owner's balance; right-click to remove the hopper and attempt collection. Ask an administrator if collection fails.

## Is attached storage an ordinary barrel? How much does it add?

You need a special Minion Storage item, placed next to a minion you can use. Each minion accepts one storage; avoid placing it between several minions if you want to select a particular one. By default, Small Storage adds 3 slots, Medium Storage 9, Large Storage 15, X-Large Storage 21 and XX-Large Storage 27; your server may change these. Attached storage receives products after the main storage runs out of room. Break it to receive the storage item and its stored products back.

## Why does the tier button fail to open or report missing materials?

The minion may be at its maximum tier, or your server may not have provided upgrade costs. By default, costs are absent and free upgrades are disabled, so the upgrade GUI cannot open yet. When upgrades are available, carry enough matching materials in your inventory or offhand; the confirmation menu's `Upgrade minion` button consumes them and increases the tier by exactly one. The menu closes after success. Only the minion's owner can confirm through ordinary gameplay.

## How do I get more placement slots? Does replacing the same minion help?

The whole island shares placement slots. By default, first placing or upgrading to a previously unrecorded type and tier combination can add a slot, within your server's limits. Each combination counts once. Picking up a minion frees its occupied slot but does not erase the recorded combination; deleting the island resets this progress.

## Do I need to build a mining area around my minion?

Nearby blocks and creatures only simulate activity; production does not depend on harvesting real blocks. Leave open space to see the animation. By default, only the owner can open and pick up a minion, even if other members can build on the island; your server may allow shared access.
