---
title: "TurtleBackpack: Overview"
description: Get started with personal storage, collecting, withdrawing, selling and upgrades.
sidebar:
  label: Overview
  order: 1
---

## What is the backpack for?

TurtleBackpack gives you personal storage that tracks quantities by item type. It is virtual storage: you check quantities in a menu, then withdraw actual items into your inventory when needed. The backpack icon on your hotbar is only a button that opens storage; it does not contain your items.

The default categories are **Nông sản** (farming), **Khoáng sản** (mining), **Cá** (fish) and **Đồ rơi từ mob** (mob drops). For example, wheat and carrots belong to Nông sản; cobblestone and coal belong to Khoáng sản. The server can change categories and accepted items. You cannot drag arbitrary items into a menu to store them.

## Start step by step

1. Enter `/bp` to open **Ba lô**. If you have a hotbar icon, hold it and right-click to open storage too.
2. Choose a category to see each type, its stored amount, capacity, value and **Tự bán** (auto-sell) status.
3. Use tools integrated by the server to collect items into your backpack. Accepted items produce a quantity notification above your hotbar.
4. Open the category again. Left-click an item to withdraw up to one stack, meaning a group limited by that item's stack size. Hold Shift and left-click to withdraw as much as your inventory can hold.
5. To earn money, right-click the type you want to sell or use **Bán cả danh mục**. To review a sale of everything first, return to the main menu, choose **Bán tất cả**, then **Xác nhận**.
6. Open **Nâng cấp ba lô** to check the price, required currency and next level's stats. Choose **Sức chứa** if you often run out of space.

:::note[How do items enter storage?]
Automatic storage of ground pickups is disabled by default; the server can enable it. When enabled, only supported items whose entire stack fits are transferred. Items thrown by players are not automatically stored this way.
:::

## Capacity and upgrades

Capacity applies separately to each type. By default, **Ba lô Gỗ** holds 50,000 of each type; the server can change this. Full wheat storage does not mean carrot storage is full. Special fish of the same type share capacity even when their lengths or values differ.

**Hệ số bán** increases sale money and the chance of a lucky sale. **Giữ đồ** can pay you while leaving that item type in storage; by default, it only applies to manual sales. Read the current and next stats before buying.

## Repeat the gameplay loop

Collect items, check storage, withdraw or sell, then upgrade. If the server allows you, Shift + right-click a type to enable **Tự bán**. Sales run in batches roughly every 5 seconds while you are online, rather than immediately for each item.

:::caution[Do not wait until storage and inventory are full]
By default, excess tool drops go into your inventory, then wait for automatic selling if they have a price and the server allows you. Any remainder is discarded, without dropping on the ground. The server can change this handling. Sell or increase capacity before running out of space.
:::
