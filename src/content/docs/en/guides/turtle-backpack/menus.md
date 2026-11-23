---
title: "TurtleBackpack: Menus"
description: How to open, read and use every TurtleBackpack interface.
sidebar:
  label: Menus
  order: 2
---

## Reading the diagrams

Diagrams use the default layout and names; the server can change names and accepted items. Button names stay as displayed in game. Slots count from 0, left to right and top to bottom; green numbers are legend numbers, not slot numbers. Black glass is decoration. You cannot drag items into a menu.

Category diagrams show a state with no stored items and no available custom item providers: special item slots use barrier icons. On a server with the relevant integration, they display their own icons and names; stored fish may show an actual fish from storage. Ordinary Minecraft item names follow your client language. Item slots sharing a function share a legend number.

## Ba lô

Open with `/bp`, or hold the hotbar backpack icon and right-click. Left- or right-clicking that icon in your personal inventory screen also opens storage.

![Ba lô menu](/gui/en/turtle-backpack-main.svg)

*Figure: Four default categories and shared controls.*

| # | Slot | Action |
| --- | --- | --- |
| 1 | 10 | **Nông sản**: click to view farming items. |
| 2 | 11 | **Khoáng sản**: click to view mining items. |
| 3 | 12 | **Cá**: click to view fish. |
| 4 | 13 | **Đồ rơi từ mob**: click to view mob drops. |
| 5 | 46 | **Nâng cấp ba lô**: open the three upgrades. |
| 6 | 49 | **Bán tất cả**: review and confirm a sale of supported, sellable items. |
| 7 | 52 | **Vật phẩm ngừng hỗ trợ**: withdraw remaining quantities of types no longer accepted. |

Button 7 appears only while you have discontinued items; the diagram illustrates that state. Category descriptions show the number of types and total stored. The upgrades button shows your backpack tier and capacity per type.

## Shared category actions

Open by clicking a category in Ba lô. Hover an item to see its stored quantity, capacity, value and **Tự bán: BẬT/TẮT** (auto-sell on/off). The value may show **không bán được** (not sellable) when you have stock but no sale price.

| Item click | Result |
| --- | --- |
| Left-click | Withdraw up to one stack, limited by stock and inventory space. |
| Shift + left-click | Withdraw as much as your inventory can hold. |
| Right-click | Sell this type immediately, without confirmation. |
| Shift + right-click | Toggle auto-sell for this type if the server allows you. |

## Nông sản

In Ba lô, click **Nông sản**.

![Nông sản category](/gui/en/turtle-backpack-farming.svg)

*Figure: The first Nông sản page using the default item list.*

| # | Slot | Action |
| --- | --- | --- |
| 1 | 0–24 | Category items: use the four actions above; these are action icons, not deposit slots. |
| 2 | 45 | **Quay lại**: return to Ba lô. |
| 3 | 49 | **Bán cả danh mục**: immediately sell sellable types throughout the category, including other pages; no confirmation. |

This default category fits on one page. If the server adds more than 45 types, each page holds up to 45 types in slots 0–44. **Trang trước** in slot 48 appears only when a previous page exists; **Trang sau** in slot 50 appears only when a next page exists. Their names show the destination page and total page count. Unused slots are black glass. Item icons glow when auto-sell is enabled.

## Khoáng sản

In Ba lô, click **Khoáng sản**.

![Khoáng sản category](/gui/en/turtle-backpack-mining.svg)

*Figure: The first Khoáng sản page using the default item list.*

| # | Slot | Action |
| --- | --- | --- |
| 1 | 0–24 | Category items: use the four actions above; these are action icons, not deposit slots. |
| 2 | 45 | **Quay lại**: return to Ba lô. |
| 3 | 49 | **Bán cả danh mục**: immediately sell sellable types throughout the category, including other pages; no confirmation. |

This default category fits on one page. If the server adds more than 45 types, each page holds up to 45 types in slots 0–44. **Trang trước** in slot 48 appears only when a previous page exists; **Trang sau** in slot 50 appears only when a next page exists. Their names show the destination page and total page count. Unused slots are black glass. Item icons glow when auto-sell is enabled.

## Cá

In Ba lô, click **Cá**.

![Cá category](/gui/en/turtle-backpack-fishing.svg)

*Figure: The first Cá page using the default item list.*

| # | Slot | Action |
| --- | --- | --- |
| 1 | 0–13 | Category items: use the four actions above; these are action icons, not deposit slots. |
| 2 | 45 | **Quay lại**: return to Ba lô. |
| 3 | 49 | **Bán cả danh mục**: immediately sell sellable types throughout the category, including other pages; no confirmation. |

This default category fits on one page. If the server adds more than 45 types, each page holds up to 45 types in slots 0–44. **Trang trước** in slot 48 appears only when a previous page exists; **Trang sau** in slot 50 appears only when a next page exists. Their names show the destination page and total page count. Unused slots are black glass. Item icons glow when auto-sell is enabled.

## Đồ rơi từ mob

In Ba lô, click **Đồ rơi từ mob**.

![Đồ rơi từ mob category](/gui/en/turtle-backpack-mobs.svg)

*Figure: The first Đồ rơi từ mob page using the default item list.*

| # | Slot | Action |
| --- | --- | --- |
| 1 | 0–6 | Category items: use the four actions above; these are action icons, not deposit slots. |
| 2 | 45 | **Quay lại**: return to Ba lô. |
| 3 | 49 | **Bán cả danh mục**: immediately sell sellable types throughout the category, including other pages; no confirmation. |

This default category fits on one page. If the server adds more than 45 types, each page holds up to 45 types in slots 0–44. **Trang trước** in slot 48 appears only when a previous page exists; **Trang sau** in slot 50 appears only when a next page exists. Their names show the destination page and total page count. Unused slots are black glass. Item icons glow when auto-sell is enabled.

## Vật phẩm ngừng hỗ trợ

In Ba lô, click **Vật phẩm ngừng hỗ trợ** when it appears.

![Discontinued items category](/gui/en/turtle-backpack-discontinued.svg)

*Figure: Example of wheat remaining after the server stops accepting that type.*

| # | Slot | Action |
| --- | --- | --- |
| 1 | 0 | Remaining items: left-click withdraws up to one stack; Shift + left-click withdraws as much as fits. |
| 2 | 45 | **Quay lại**: return to Ba lô. |

The list depends on what you still hold; the default list has no discontinued types. Additional types fill slots 0–44, then use pagination with buttons in slots 48 and 50 as above. There is no **Bán cả danh mục**; right-click and Shift + right-click do not sell or toggle auto-sell here. A barrier replaces an icon when the item cannot currently be created; ask an administrator if withdrawal fails.

## Backpack Upgrades

Open with `/bp upgrades` or **Nâng cấp ba lô** in the main menu.

![Backpack upgrades menu](/gui/en/turtle-backpack-upgrades.svg)

*Figure: Three upgrade paths and the back button.*

| # | Slot | Action |
| --- | --- | --- |
| 1 | 11 | **Sức chứa**: increase capacity per type; the description includes current and next backpack names. |
| 2 | 13 | **Hệ số bán**: increase sale money and lucky sale chance. |
| 3 | 15 | **Giữ đồ**: increase the chance to receive money while keeping that item type. |
| 4 | 22 | **Quay lại**: return to the previous menu; close if opened by command. |

Descriptions change with your level, balance and the next level's cost. **Thiếu …** shows the shortfall; **ĐÃ ĐẠT CẤP TỐI ĐA** replaces the upgrade prompt when no further level can be purchased. Clicking an upgrade buys its next level, or opens confirmation if the cost exceeds the server's confirmation limit. Read the price and currency before clicking.

## Two confirmation dialogs

**Xác nhận bán** opens from **Bán tất cả** when sellable stock exists. It has 3 rows: **Xác nhận** in slot 11, **Chi tiết** (paper) in slot 13 and **Hủy** in slot 15. Hover the paper for up to 14 item-type lines with quantities; an extra line reports additional types. Hover **Xác nhận** for the estimated total. Clicking closes the dialog and sells; **Hủy** returns to Ba lô. If nothing can be sold, only a message appears.

**Xác nhận nâng cấp** uses the same layout, but slot 13 displays the upgrade you are buying. The amount on **Xác nhận** here is the **cost you pay**, even though its default wording still says “Bạn nhận” (you receive). **Hủy** returns to Backpack Upgrades. Cheaper upgrades may be purchased immediately without this dialog; the server can change the confirmation limit.

:::note[Sale preview]
Sale confirmation shows an estimate; it does not lock shop prices. Confirming recalculates stock and prices at the time of sale. Lucky sales are not included in the estimate.
:::
