---
title: "TurtleFarmPets: Commands"
description: Pet ranch command syntax, aliases and help with common errors.
sidebar:
  label: Commands
  order: 3
---

## Player commands

Use these commands in game. If server does not let you open or visit ranches, ask an administrator.

| Command | Purpose | Example |
| --- | --- | --- |
| `/traithu` | Open your ranch menu. | `/traithu` |
| `/traithu xem <tên>` | Start viewing a ranch you are allowed to visit. Replace `<tên>` with an in-game account name. | Type `/traithu xem `, then press Tab to select an online player. |
| `/traithu thoat` | Cancel visit warmup or end visit and resume displaying your ranch. | `/traithu thoat` |
| `/ranch`, `/farmpets`, `/trai` | Aliases of `/traithu`, accepting same subcommands. | `/ranch thoat` |

## Example workflow

1. Run command below to open ranch.
2. Click **Xem trại người khác**, then select someone to visit. You can also use `xem` if you know account name.
3. If a teleport countdown appears, stand still until it finishes. Default wait is 3 seconds (server may change it). When already in ranch area, changing viewed ranch does not require this teleport step.
4. Run exit command to view your own ranch again.

```text
/traithu
/traithu thoat
```

:::note[Ending a visit does not return you to previous location]
Exit command switches displayed ranch back to yours. It does not teleport you to location you occupied before visiting. To reach ranch entrance, use Tới trại in hub.
:::

## Common errors

| Message or situation | What to do |
| --- | --- |
| Bạn không có quyền. | Ask administrator whether server allows you to use this feature. |
| Dùng: /traithu xem (tên) | Name is missing after `xem`; enter account name without brackets. |
| Không tìm thấy người chơi | Check name. Offline players must be known to server and still resolvable by name. |
| Không cho bạn xem trại | Owner restricts visitors. Ask them to change privacy if they wish to invite you. |
| Bạn đã di chuyển, hủy dịch chuyển. | Start visit again and stand still during countdown. |
| Ranch not found or ranch data could not load | Retry later; if problem persists, ask administrator. |
| Ranch world is unavailable or cannot be found | Ask administrator; you cannot fix this through menus. |
| Bạn chỉ được xem trại này, không sửa được. | Visitors only inspect information; return to your own ranch to manage pets. If your own ranch remains read-only, ask administrator. |

Incubating eggs, filling trough, feeding, unlocking pens, renaming and releasing pets all use menus; no separate commands are needed.
