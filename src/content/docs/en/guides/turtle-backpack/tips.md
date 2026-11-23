---
title: "TurtleBackpack: Tips and FAQ"
description: Answers to practical questions about using TurtleBackpack.
sidebar:
  label: Tips and FAQ
  order: 4
---

## Why can I not drag items into the backpack?

Menus are for viewing and clicking actions. Dragging, Shift-clicking inventory items and number keys do not deposit items. Use collection sources integrated by the server; the player commands have no manual deposit command.

## Why does picked-up wheat still enter my normal inventory?

Automatic storage of ground pickups is disabled by default. If the server enables it, the whole stack must fit that type's remaining capacity. Items thrown by players, or ordinary items with custom names, lore or enchantments, are not accepted as plain Minecraft materials.

## Does one full type mean the whole backpack is full?

No. Each type has its own limit. You can continue storing other types with space available. Special fish of the same type share a limit even when individual fish have different lengths or values.

## Do excess items drop on the ground for me to recover?

For tool drops routed through the backpack, no. By default, excess items try your inventory, then wait for automatic selling if they have a price and the server allows you. Anything that cannot be handled is discarded. If pending overflow cannot be sold, the system tries to return it to storage; anything that does not fit can still be lost. Make space before collecting more.

## I enabled auto-sell; why have I not received money?

Auto-sell runs roughly every 5 seconds while you are online. The type needs stored items and a sale price. Check **Tự bán** in the description; its icon glows when enabled. If the server no longer allows you to use it, auto-sell for your selected types stops too. Overflow may be sold through full-storage handling even if you did not enable auto-sell for that type.

## Why are items left after selling everything?

Items without a price or no longer supported are not part of the sellable selection. A shop may accept only some items. Also, **Giữ đồ** can pay you while leaving that type in storage; by default, this does not apply to auto-sell.

## Does the estimate include lucky sales?

No. The estimate includes the sale multiplier but not the lucky roll. Luck is rolled once for the whole sale batch, rather than separately for each item. By default, a lucky sale doubles the money; the server can change this. Actual prices are recalculated when selling.

## What should I do if I cannot withdraw items?

Make inventory space. Left-click withdraws up to one stack; Shift + left-click withdraws as much as fits. If the message says the item cannot currently be created, ask an administrator: a custom item may be temporarily unavailable. Stored quantities are not reduced when the item cannot be created.

## Are discontinued items lost?

Stored quantities remain available through **Vật phẩm ngừng hỗ trợ** while you still have some. You can only withdraw there; its category controls cannot sell or toggle auto-sell. If you see a barrier icon and withdrawal fails, ask an administrator.

## Is the backpack icon an item I can trade?

No. It only opens a menu; you cannot drop it, store it in a chest or move it to your offhand. By default, it occupies the ninth hotbar slot; the server can change this. Use `/bp icon` to hide or show it if the server allows you. If its slot is occupied and your inventory is full, clear an empty slot. Hiding the icon does not delete stored items.

## What if an upgrade fails or is already maxed?

Check the price and the exact currency shown. **ĐÃ ĐẠT CẤP TỐI ĐA** means that upgrade cannot be bought again. If another upgrade is being saved, wait for its result. Failed upgrade saves refund the money. If the currency is unavailable on the server, ask an administrator.

## Are collection milestones based on items currently stored?

No. Milestones use the lifetime amount accepted into your backpack for each type; selling or withdrawing does not reset it. Default milestones of 10,000, 100,000 and 1,000,000 reward 1,000, 10,000 and 100,000 money respectively; the server can change or disable them. Crossing a milestone shows a reward notification, with no separate claim button.
