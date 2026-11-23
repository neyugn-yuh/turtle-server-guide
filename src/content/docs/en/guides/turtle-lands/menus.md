---
title: "TurtleLands: Menus"
description: How to open and use every player menu.
sidebar:
  label: Menus
  order: 2
---

## Reading the interface

Diagrams use default layouts. `{land}` and `{player}` stand for actual land or player names. Number badges match **#** column; **Slot** counts from 0, left to right then downward. Role names and displayed amounts may vary by server; money uses server formatting.

Click buttons; do not drag items into menus. When a menu asks for chat input, type content without `/`. You have 45 seconds; type `huy`, `hủy` or `cancel` to cancel. Inventory key closes menus.

## Your land

Use `/land` when you neither own nor belong to any land.

![Your land](/gui/en/turtle-lands-hub-none.svg)

*Figure: Sample layout of Your land.*

| # | Slot | Action |
| --- | --- | --- |
| 1 | 22 | Click, then type a name in chat. Chunk where you stand when submitting becomes first claim; check price before creating. |
| 2 | 24 | View nearby chunks; expansion requires an existing land. |

This menu appears when you have no land to open. Successful creation opens your new land hub.

## Land {land}

Use `/land`, or select a land in **My lands**.

![Land {land}](/gui/en/turtle-lands-hub.svg)

*Figure: Sample layout of Land {land}.*

| # | Slot | Action |
| --- | --- | --- |
| 1 | 4 | Hover for owner, role, chunk count, member limit and debt warnings. |
| 2 | 19 | Open map to claim or release chunks. |
| 3 | 20 | Open member list. |
| 4 | 21 | Open role list. |
| 5 | 22 | Open switches applying to whole land. |
| 6 | 23 | Open bank; view balance and upkeep per period. |
| 7 | 24 | Close menu and briefly show nearby borders. |
| 8 | 25 | Start travel if allowed; stand still during warmup. |
| 9 | 28 | Set destination where you stand inside land, if allowed. |
| 10 | 29 | Choose a land you own or belong to. |
| 11 | 30 | Owner clicks, then types new name in chat. |
| 12 | 33 | Owner opens permanent deletion confirmation; read refund before agreeing. |

Diagram shows owner view with taxes present. Slot 23 disappears when server has no taxes; icon becomes redstone block during debt while upkeep runs. Members see **Leave land** at slot 31; only owner sees slots 30 and 33. Other buttons may still reject actions your role cannot perform.

## My lands

Open **My lands**; `/land` also opens this list when you need to choose among several lands.

![My lands](/gui/en/turtle-lands-land-list.svg)

*Figure: Sample layout of My lands.*

| # | Slot | Action |
| --- | --- | --- |
| 1 | 10, 11, 12, 13, 14, 15, 16, 19, 20, 21, 22, 23, 24, 25, 28, 29, 30, 31, 32, 33, 34 | Hover for owner, role and chunks; click to open land hub. |
| 2 | 45 | Click for previous page, when available. |
| 3 | 53 | Click for next page, when available. |

Lists hold up to 21 entries per page. Diagram shows a populated sample; actual entries vary. Arrow at slot 45 appears only when a previous page exists, slot 53 only when a next page exists. Empty lists leave entry slots blank. Owned lands come first, then names determine order. Owned entries use grass blocks; membership entries use oak saplings. With no lands, slot 22 shows **You have no lands yet** as barrier. No back button; close with inventory key.

## Which land to visit?

Use `/land spawn` to choose a destination.

![Which land to visit?](/gui/en/turtle-lands-spawn-list.svg)

*Figure: Sample layout of Which land to visit?.*

| # | Slot | Action |
| --- | --- | --- |
| 1 | 10, 11, 12, 13, 14, 15, 16, 19, 20, 21, 22, 23, 24, 25, 28, 29, 30, 31, 32, 33, 34 | Hover for owner and role; click to start travel to land. |
| 2 | 45 | Click for previous page, when available. |
| 3 | 53 | Click for next page, when available. |

Lists hold up to 21 entries per page. Diagram shows a populated sample; actual entries vary. Arrow at slot 45 appears only when a previous page exists, slot 53 only when a next page exists. Empty lists leave entry slots blank. Owned lands come first, then names determine order. Owned entries use grass blocks; membership entries use oak saplings. With no lands, slot 22 shows **You have no lands yet** as barrier. No back button; close with inventory key.

## Claim map

Use `/land map` or **Claim map**. With several lands, open map from desired land hub to select it explicitly.

![Claim map](/gui/en/turtle-lands-map.svg)

*Figure: Sample layout of Claim map.*

| # | Slot | Action |
| --- | --- | --- |
| 1 | 0, 1, 2, 9, 10, 11, 18, 19, 20, 27, 28, 29, 36, 37, 38 | For selected land: click for unclaim confirmation, if allowed. |
| 2 | 3, 4, 5, 12, 13, 14, 21, 23, 30, 31, 32, 39, 40, 41 | Hover for price; click for claim confirmation. Read one-time fee, upkeep and limit before agreeing. |
| 3 | 6, 15, 24, 33, 42 | Hover for reason claim is blocked. |
| 4 | 7, 8, 16, 17, 25, 26, 34, 35, 43, 44 | Hover for land and owner; occupied chunks cannot be claimed. |
| 5 | 22 | Marks your chunk. Keeps name, description and click action of underlying land state; sample shows wilderness. |
| 6 | 45 | Click to pan map in this direction. |
| 7 | 46 | Click to pan map in this direction. |
| 8 | 47 | Click to pan map in this direction. |
| 9 | 48 | Click to pan map in this direction. |
| 10 | 49 | Close menu and show nearby borders. |
| 11 | 50 | Hover for color meanings and position marker. |
| 12 | 53 | Close map. |

Slots 0–44 form a 9 × 5 chunk grid, not a list. Diagram samples possible states, not a fixed map. Hover gives each cell’s coordinates. Initially slot 22 marks your position; after panning, ender eye appears only if that position remains visible. Each arrow pans 3 chunks. Green chunks in another land you also belong to are view-only for selected land. Orange cells explain why claims are blocked. Close does not return to hub.

## Members {land}

In land hub, click **Members**.

![Members {land}](/gui/en/turtle-lands-members.svg)

*Figure: Sample layout of Members {land}.*

| # | Slot | Action |
| --- | --- | --- |
| 1 | 10, 11, 12, 13, 14, 15, 16, 19, 20, 21, 22, 23, 24, 25, 28, 29, 30, 31, 32, 33, 34 | Hover for role, join date and last seen; click lower-ranked member to manage if allowed. |
| 2 | 45 | Click for previous page, when available. |
| 3 | 53 | Click for next page, when available. |
| 4 | 48 | Return to land hub. |
| 5 | 49 | Choose online player, then role for invitation. |
| 6 | 50 | View or manage bans. |

Lists hold up to 21 entries per page. Diagram shows a populated sample; actual entries vary. Arrow at slot 45 appears only when a previous page exists, slot 53 only when a next page exists. Empty lists leave entry slots blank. Owner comes first, followed by role and name. Slot 49 appears only if you may invite. You can manage only lower-ranked people; clicking owner does not open member management.

## Who to invite?

Click **Invite player** in member list.

![Who to invite?](/gui/en/turtle-lands-pick-player.svg)

*Figure: Sample layout of Who to invite?.*

| # | Slot | Action |
| --- | --- | --- |
| 1 | 10, 11, 12, 13, 14, 15, 16, 19, 20, 21, 22, 23, 24, 25, 28, 29, 30, 31, 32, 33, 34 | Click invitation recipient; next choose role. |
| 2 | 45 | Click for previous page, when available. |
| 3 | 53 | Click for next page, when available. |
| 4 | 49 | Return to member list. |

Lists hold up to 21 entries per page. Diagram shows a populated sample; actual entries vary. Arrow at slot 45 appears only when a previous page exists, slot 53 only when a next page exists. Empty lists leave entry slots blank. Lists online people outside land who are not banned; excludes yourself. Nearby people come first. If none qualify, slot 22 shows **No one to choose** as barrier. If someone disconnects, choose again.

## Invite with which role?

Select recipient in **Who to invite?**.

![Invite with which role?](/gui/en/turtle-lands-pick-role.svg)

*Figure: Sample layout of Invite with which role?.*

| # | Slot | Action |
| --- | --- | --- |
| 1 | 10 | Click to send invitation with this role. |
| 2 | 11 | Click to send invitation with this role. |
| 3 | 12 | Click to send invitation with this role. |
| 4 | 22 | Return to member list. |

Diagram shows default choices for owner inviting. Only lower ranks can be chosen; filtered choices start at slot 10. Guest role cannot be invited. Clicking sends invitation; recipient must still accept. Server may change role names and icons.

## Manage {player}

In **Members**, click someone you may manage.

![Manage {player}](/gui/en/turtle-lands-member.svg)

*Figure: Sample layout of Manage {player}.*

| # | Slot | Action |
| --- | --- | --- |
| 1 | 4 | Hover for current role. |
| 2 | 19 | Click to assign role immediately. |
| 3 | 20 | Click to assign role immediately. |
| 4 | 21 | Click to assign role immediately. |
| 5 | 38 | Confirm kick; person loses membership. |
| 6 | 39 | Confirm ban; removes membership and blocks entry. |
| 7 | 41 | Owner must confirm twice. You then cease to own land. |
| 8 | 49 | Return to member list. |

Diagram shows owner view with default roles. Slots 19–25 hold up to 7 assignable roles, packed from left; shown only if you may change roles and outrank target. Current role has its own description. Slots 38–39 require kick rights and higher rank; slot 41 is owner-only. After transfer, you become highest-ranked member.

## Ban list

From **Members**, click **Ban list**.

![Ban list](/gui/en/turtle-lands-bans.svg)

*Figure: Sample layout of Ban list.*

| # | Slot | Action |
| --- | --- | --- |
| 1 | 10, 11, 12, 13, 14, 15, 16, 19, 20, 21, 22, 23, 24, 25, 28, 29, 30, 31, 32, 33, 34 | Click to lift ban immediately, if allowed. Unbanning does not restore membership. |
| 2 | 45 | Click for previous page, when available. |
| 3 | 53 | Click for next page, when available. |
| 4 | 48 | Return to member list. |
| 5 | 49 | Click and type name in chat; valid ban applies immediately. |

Lists hold up to 21 entries per page. Diagram shows a populated sample; actual entries vary. Arrow at slot 45 appears only when a previous page exists, slot 53 only when a next page exists. Empty lists leave entry slots blank. Entries sort by name. Slot 49 appears only with kick/ban rights; lifting bans requires same rights. Chat entry needs an online name or someone server still recognizes; ask administrator if name is not found.

## Roles and permissions

In land hub, click **Roles and permissions**.

![Roles and permissions](/gui/en/turtle-lands-role-list.svg)

*Figure: Sample layout of Roles and permissions.*

| # | Slot | Action |
| --- | --- | --- |
| 1 | 10 | Click to open this role’s permissions if you may edit. |
| 2 | 11 | Click to open this role’s permissions if you may edit. |
| 3 | 12 | Click to open this role’s permissions if you may edit. |
| 4 | 13 | Click to open this role’s permissions if you may edit. |
| 5 | 22 | Return to land hub. |

Default roles occupy slots 10–13; server may change names, icons, permissions and count, up to 7 in slots 10–16. Hover for enabled permission count and default/custom status. Editing requires role-management rights and lower rank than yours; owner has no separate role entry here.

## Permissions of Manager

Click an editable role in **Roles and permissions**. Diagram uses default **Manager** role.

![Permissions of Manager](/gui/en/turtle-lands-role-perms.svg)

*Figure: Sample layout of Permissions of Manager.*

| # | Slot | Action |
| --- | --- | --- |
| 1 | 4 | Role information and permission colors. |
| 2 | 10 | Click to toggle **Build** for role, if allowed. |
| 3 | 11 | Click to toggle **Break** for role, if allowed. |
| 4 | 12 | Click to toggle **Containers** for role, if allowed. |
| 5 | 13 | Click to toggle **Doors** for role, if allowed. |
| 6 | 14 | Click to toggle **Redstone** for role, if allowed. |
| 7 | 15 | Click to toggle **Entity interaction** for role, if allowed. |
| 8 | 16 | Click to toggle **Attack animals** for role, if allowed. |
| 9 | 19 | Click to toggle **Vehicles** for role, if allowed. |
| 10 | 20 | Click to toggle **Teleport** for role, if allowed. |
| 11 | 21 | Click to toggle **Invite** for role, if allowed. |
| 12 | 22 | Click to toggle **Kick and ban** for role, if allowed. |
| 13 | 23 | Click to toggle **Claim land** for role, if allowed. |
| 14 | 24 | Click to toggle **Unclaim** for role, if allowed. |
| 15 | 25 | Click to toggle **Set spawn** for role, if allowed. |
| 16 | 28 | Click to toggle **Manage flags** for role, if allowed. |
| 17 | 29 | Click to toggle **Manage roles** for role, if allowed. |
| 18 | 30 | Click to toggle **Bank deposit** for role, if allowed. |
| 19 | 31 | Click to toggle **Bank withdraw** for role, if allowed. |
| 20 | 48 | Click to restore all this role’s permissions to server defaults. |
| 21 | 49 | Return to role list. |

Lime means on, red means off. Click to toggle immediately; you cannot enable a permission you lack. Only lower-ranked roles are editable. Guest role shows only first 9 action permissions in slots 10–16 and 19–20; management permissions are absent. Title, slot 4 icon and states vary with selected role. Slots 32–34 are empty in sample, not extra permissions.

## Land flags

In land hub, click **Land flags**. Flags are switches applying to whole land.

![Land flags](/gui/en/turtle-lands-flags.svg)

*Figure: Sample layout of Land flags.*

| # | Slot | Action |
| --- | --- | --- |
| 1 | 10 | Click to toggle. Allow player combat; uses victim’s land. |
| 2 | 11 | Click to toggle. Allow natural monsters and protected hostile spawn events. |
| 3 | 12 | Click to toggle. Allow explosions to damage blocks in land. |
| 4 | 14 | Click to toggle. Allow fire to spread and burn blocks. |
| 5 | 15 | Click to toggle. Allow mobs such as endermen to change blocks; sheep grazing and villager farming are treated separately. |
| 6 | 16 | Click to toggle. On: everyone may pick up drops. Off: only owner and members counted toward member limit may pick up; default Trusted guest cannot. |
| 7 | 22 | Return to land hub. |

Each button name includes **ON** or **OFF**. Sample uses defaults: only **Everyone can pick up items** is on; server may change defaults. You may view switches, but changing requires role rights. Explosions off protects blocks; it does not guarantee immunity to blast damage. Disabling monster spawns neither removes existing mobs nor blocks every spawn method.

## Bank and taxes

In land hub, click **Bank and taxes**. Land bank is separate from your wallet.

![Bank and taxes](/gui/en/turtle-lands-bank.svg)

*Figure: Sample layout of Bank and taxes.*

| # | Slot | Action |
| --- | --- | --- |
| 1 | 4 | Hover for balance, upkeep, periods covered, next collection and debt warning. |
| 2 | 10 | Transfer money from your wallet to land bank immediately. Amount: 1,000. |
| 3 | 11 | Transfer money from your wallet to land bank immediately. Amount: 10,000. |
| 4 | 12 | Transfer money from your wallet to land bank immediately. Amount: 100,000. |
| 5 | 13 | Transfer money from your wallet to land bank immediately. Amount: 1,000,000. |
| 6 | 19 | Transfer money from land bank to your wallet immediately. Amount: 1,000. |
| 7 | 20 | Transfer money from land bank to your wallet immediately. Amount: 10,000. |
| 8 | 21 | Transfer money from land bank to your wallet immediately. Amount: 100,000. |
| 9 | 22 | Transfer money from land bank to your wallet immediately. Amount: 1,000,000. |
| 10 | 14 | Click and type positive whole amount in chat, e.g. `5000`, `5.000`, `10k`. |
| 11 | 23 | Click and type amount in chat. |
| 12 | 31 | Hover for deposits, withdrawals, refunds and taxes. Ask administrator about entries awaiting admin review. |
| 13 | 49 | Return to land hub. |

Menu exists only when server uses taxes. Deposit/withdraw buttons depend on your rights; sample shows both groups. Information varies with chunks, exemption, due time, debt and pause status. History loads on opening and combines up to 10 latest bank/tax entries. Do not place items here; transactions use money.

## Reading borders in the world

**Show borders** briefly displays outlines only to you: green for lands you own or belong to, red for other lands, gold for newly claimed chunks. Default duration is 10 seconds; server may change it. These are position markers, not actual placed blocks.

## Confirmation dialogs

Claiming opens **Claim this chunk?**; releasing opens **Unclaim this chunk?**. Read price, upkeep, refund and consequences before confirming. Cancel to leave action unapplied.

**Leave land?**, **Delete land?**, **Kick this person?** and **Ban this person?** require confirmation. **Transfer ownership (1/2)** proceeds to **Confirm transfer? (2/2)**; final confirmation removes your ownership.

For invitations, click **[Chấp nhận]** or **[Từ chối]** in chat to open **Join land {land}?** or **Decline land {land}?**. Check inviter and role, then confirm. Typing a code cannot join a land without a valid invitation.

:::caution[Not confirmed]
The confirmation box is a shared server menu, so this guide does not draw it. If game reports confirmation unavailable, ask administrator; action has not been performed.
:::
