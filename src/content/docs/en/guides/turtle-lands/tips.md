---
title: "TurtleLands: Tips and FAQ"
description: Answers about claiming, roles, upkeep and land protection.
sidebar:
  label: Tips and FAQ
  order: 4
---

## Why can’t I claim wilderness?

Hover over orange cells for reasons: claiming disabled in world, locked chunk, proximity to spawn or another land, chunk limit, or missing adjacency. Defaults require at least 300 blocks from spawn, a 1-chunk gap from other lands and edge connection to your claims; server may change these rules. Missing rights, insufficient money and land debt also block expansion. Diagonal contact does not count as adjacency.

## Why can’t I unclaim? Will my house disappear?

You cannot release the final chunk; owner must delete land to release everything. When connection rules apply, you cannot remove a chunk that splits claims into separate pieces in the same world. Built blocks remain after unclaiming but lose protection. Read refund before confirming; default claim-fee refund is 0%, which server may change. Any unclaim refund goes to clicking player’s wallet.

## Why is my land in debt when my wallet has money?

Upkeep draws only from land bank. Open **Bank and taxes**, check amount due and deposit. While upkeep is running, depositing enough for the current period automatically pays it and clears debt; insufficient deposits report remaining shortfall. Leave extra money for future periods. Claim fees instead come from clicking player’s wallet, not land bank.

## When is upkeep collected? Does logging off preserve land?

By default, new lands get 3 days free, then collection at the next scheduled period; daily collection is at 00:00 Vietnam time. Default continuous debt deadline is 7 days before disbanding. Server may change these times; trust menu’s due time and countdown. Logging off does not stop upkeep. Paused upkeep also freezes debt clocks; your being offline is different. By default, server downtime longer than 30 minutes is treated as a pause, but server may change this.

## What if debt has already disbanded my land?

Claims lose protection and remaining bank balance is refunded to owner. Contact administrator promptly: code allows restoration within 24 hours of disbanding. Restoration cannot guarantee recovery of chunks claimed by others; land name must still be available and restored bank starts at 0. Voluntary deletion is permanent and differs from debt restoration.

## How does Trusted guest differ from Member?

By default, **Member** can build, break, use containers and deposit money; **Trusted guest** only uses doors, containers and teleportation, and does not count toward member limit. **Guest** means someone outside membership and can use doors by default. Server and owner may change rights. With **Everyone can pick up items** off, only owner and counted members can collect drops; default Trusted guest cannot. Do not infer permissions from role name alone.

## Why can’t I edit permissions or manage someone?

You need relevant rights and can manage only people and roles below yours. You cannot enable a permission you lack for someone else. Owner has all permissions; guest may hold action rights only, not management rights. Default **Manager** lacks role-management and unclaim rights. Ask owner to check; server may have changed these permissions.

## How do kicking, banning, unbanning and transfer differ?

Kicking removes membership; banning also blocks entry and moves person outside if already inside. Unbanning does not restore membership: send another invitation. Owner cannot leave without transferring or deleting land. Transfer to a member requires two confirmations and makes former owner highest-ranked member. Recipient must have room under their owned-land limit.

## Why is travel canceled or taking me somewhere unexpected?

Movement or damage cancels warmup. You need teleport rights in destination land. Without a set spawn, plugin picks a land chunk’s center and a point above ground; set an explicit destination inside land to control arrival. **Set spawn** is used for travel to land; this code does not change death respawn location.

## Do disabled explosions, monsters or fire guarantee safety?

**Explosions** off protects blocks from blasts, not a promise of damage immunity. **Monster spawning** off blocks handled spawn types; it does not remove existing mobs or stop every spawn method. Fire flag controls spreading and block burning; players lighting fires are still checked for build rights. PvP uses land where victim stands. Read each flag’s description before changing it.

## Why won’t hoppers, pistons or water cross land borders?

Plugin blocks several effects entering another land: water/lava, pistons, dispensers and tree growth. Outside hoppers cannot pull items from inside land; transfers into another land are also blocked. Keep systems within one land and check borders before building machines near edges.

## What should I do about failed deposits or “awaiting admin” entries?

Enter positive whole amounts, such as `5000`, `5.000` or `10k`; no negative or fractional amounts. Check your wallet for deposits, land balance for withdrawals, and your rights. If an action is still processing, wait for result and check again. Transactions awaiting admin require administrator review; do not treat them as completed. Report repeated economy or storage errors with transaction time and amount.
