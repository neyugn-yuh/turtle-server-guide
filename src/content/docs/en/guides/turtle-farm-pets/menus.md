---
title: "TurtleFarmPets: Menus"
description: How to open and use every pet ranch interface.
sidebar:
  label: Menus
  order: 2
---

## Reading diagrams

Slots count from 0, left to right, top to bottom. Diagrams show example states, not screenshots. Menu and button names retain Vietnamese used by bundled game text. `{player}` means ranch owner. Gray panes are decoration; do not drag items into menus.

## Trại pet của {player}

Run `/traithu`.

![Trại pet của {player}](/gui/en/turtle-farm-pets-hub.svg)

*Figure: Trại pet của {player}.*

| # | Slot | Action |
| --- | --- | --- |
| 1 | 10 | Click to choose a stored pet. |
| 2 | 11 | Click to view price and unlock next pen. |
| 3 | 12 | Requires previous pen and server approval. |
| 4 | 46 | Hover to see combined buffs from penned pets. |
| 5 | 47 | Click to open trough. |
| 6 | 48 | Click to view eggs and incubation. |
| 7 | 49 | Click to view stored pets. |
| 8 | 50 | Click to choose a ranch to visit. |
| 9 | 51 | Click to cycle privacy. |
| 10 | 52 | Click to teleport to ranch entrance. |

This shows a new ranch with defaults. Occupied pens show pet icons. Empty pens open pet selection; locked pens open purchase details. Unlock in order. If server adds pens, each page holds 21 at slots 10–16, 19–25, 28–34; arrows at 45/53 appear only when previous/next pages exist. Privacy cycles through Công khai, Cùng đảo, Riêng tư.

## Chuồng 2 · Chuồng 2

Click a locked pen in ranch or hub.

![Chuồng 2 · Chuồng 2](/gui/en/turtle-farm-pets-pen.svg)

*Figure: Chuồng 2 · Chuồng 2.*

| # | Slot | Action |
| --- | --- | --- |
| 1 | 13 | Hover to check price. |
| 2 | 15 | Click to open confirmation, then confirm or cancel. |
| 3 | 22 | Return to hub. |

Example shows pen 2. Default prices are 50,000 orbs for pen 2 and 250,000 orbs for pen 3, which also requires server approval (server may change these). Without previous pen, slot 15 becomes Chưa thể mở.

## Kho pet

Click Kho pet in hub.

![Kho pet](/gui/en/turtle-farm-pets-storage.svg)

*Figure: Kho pet.*

| # | Slot | Action |
| --- | --- | --- |
| 1 | 0–44 | Click to open pet details. |
| 2 | 49 | Return to hub. |

Example shows one stored Sói Lửa. Pets occupy slots 0–44, up to 45 per page; arrows at 45/53 appear only for available pages. Empty storage shows Kho trống at slot 22.

## Chọn pet cho chuồng 1

Click an unlocked empty pen.

![Chọn pet cho chuồng 1](/gui/en/turtle-farm-pets-pet-pick.svg)

*Figure: Chọn pet cho chuồng 1.*

| # | Slot | Action |
| --- | --- | --- |
| 1 | 0–44 | Click to place pet in selected pen. |
| 2 | 49 | Return to hub. |

Example shows one stored Sói Lửa. Pets occupy slots 0–44, up to 45 per page; arrows at 45/53 appear only for available pages. Empty storage shows Kho trống at slot 22.

## Pet · Sói Lửa

Click a pet in pen or Kho pet.

![Pet · Sói Lửa](/gui/en/turtle-farm-pets-pet.svg)

*Figure: Pet · Sói Lửa.*

| # | Slot | Action |
| --- | --- | --- |
| 1 | 13 | Hover for species, rarity, level, EXP, satiety, current/next damage and buffs. |
| 2 | 29 | Open food selection from trough. |
| 3 | 30 | Withdraw pet to storage. |
| 4 | 32 | Open rename anvil. |
| 5 | 33 | Open confirmation to permanently release pet. |
| 6 | 40 | Return to hub. |

Example shows a penned pet. For stored pets, slot 30 becomes Đặt vào chuồng (wooden gate), using first empty pen. Visitors see information and Đóng at slot 40; edit buttons are absent.

## Máng ăn · {player}

Click Máng ăn in hub or at ranch.

![Máng ăn · {player}](/gui/en/turtle-farm-pets-trough.svg)

*Figure: Máng ăn · {player}.*

| # | Slot | Action |
| --- | --- | --- |
| 1 | 4 | View stored/maximum satiety points. |
| 2 | 10 | Wheat: view amount, satiety and EXP. |
| 3 | 11 | Melon Slice: view details; this icon does not deposit food. |
| 4 | 12 | Cooked Salmon: view details. |
| 5 | 40 | Return to hub. |
| 6 | 41 | Click to load food from TurtleBackpack up to capacity. |
| 7 | 13 | Thit Nuong x0: custom food information only. |

Example shows three ordinary foods, custom food and backpack button when available. Slot 13 shows fallback paper named Thit Nuong when custom item is unavailable; when available, server supplies its name and icon. Foods sort by increasing satiety at slots 10–16, 19–25; arrows at 36/44 appear for additional pages. Visitors can only view; slot 40 is Đóng and backpack button is absent.

1. Keep food in your inventory.
2. Click that food in lower inventory. All matching stacks are considered; only amount fitting trough is taken.
3. Open pet and Cho ăn to use it. Clicking food icons in trough section does not deposit or withdraw items.

## Cho Sói Lửa ăn

Click Cho ăn in pet details.

![Cho Sói Lửa ăn](/gui/en/turtle-farm-pets-feed.svg)

*Figure: Cho Sói Lửa ăn.*

| # | Slot | Action |
| --- | --- | --- |
| 1 | 4 | View pet being fed. |
| 2 | 10 | Click to feed Wheat until full; Shift-click feeds one item. |
| 3 | 11 | Click to feed Melon Slice until full; Shift-click feeds one item. |
| 4 | 12 | Click to feed Cooked Salmon until full; Shift-click feeds one item. |
| 5 | 31 | Return to pet details. |

Only foods currently in trough appear at slots 10–16, 19–25; no pagination. Example has three ordinary foods. Empty trough shows Máng đang trống at slot 22. Hover to see favorites and actual satiety gain.

## Lò ấp · {player}

Click Lò ấp in hub or at ranch.

![Lò ấp · {player}](/gui/en/turtle-farm-pets-incubator.svg)

*Figure: Lò ấp · {player}.*

| # | Slot | Action |
| --- | --- | --- |
| 1 | 10 | Click to place one carried egg; hover for amount and duration. |
| 2 | 22 | Return to hub. |

Example shows empty incubator while carrying Trứng Lửa. Carried egg types appear in inventory order at slots 10–16 without pagination. While incubating or ready, egg appears only at slot 13: wait, then click to hatch. With ranch scene active and owner online, a ready egg may also hatch automatically. No eggs shows a notice at slot 13. Visitors only view; slot 22 is Đóng.

## Xem trại người khác

Click Xem trại người khác in hub.

![Xem trại người khác](/gui/en/turtle-farm-pets-visit.svg)

*Figure: Xem trại người khác.*

| # | Slot | Action |
| --- | --- | --- |
| 1 | 3 | Click to select online players. |
| 2 | 5 | Click to view featured ranches by total pet level. |
| 3 | 9–44 | Hover for total level; click to start visit. |
| 4 | 47 | Click to change your own ranch privacy. |
| 5 | 49 | End current visit, if any, then open your hub. |

Example shows online tab with one ranch. Entries occupy slots 9–44, up to 36 per page; arrows at 45/53 appear for available pages. Online sorts by descending total level; Nổi bật includes offline owners. Private ranches may appear but deny entry. Empty/loading notice occupies slot 22. While visiting, slot 49 changes to an exit-visit prompt.

## Đổi tên pet

Click Đổi tên in pet details.

![Đổi tên pet](/gui/en/turtle-farm-pets-rename.svg)

*Figure: Đổi tên pet.*

| # | Slot | Action |
| --- | --- | --- |
| 1 | 0 | Paper bears current name; type in anvil text field above, without inserting items. |
| 2 | 1 | Click to remove custom name and restore species name. |
| 3 | 2 | Click result to rename; no experience levels charged. |

This schematically shows anvil slots 0–2; slots 3–8 come from nine-column diagram format and do not exist in actual anvil. Slot 1 appears only with a custom name. Slot 2 appears only after typing a different, nonblank name.

## Purchase and release confirmation

Mở chuồng and Thả đi use confirmation dialogs. Check price or selected pet before confirming; cancel to keep current state. If confirmation menu is unavailable, action does not proceed.

:::caution[Releasing pets]
Thả đi permanently removes pet. Refunded food only fills remaining trough capacity.
:::
