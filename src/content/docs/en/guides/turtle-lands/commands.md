---
title: "TurtleLands: Commands"
description: Menu commands, invitation buttons and common command problems.
sidebar:
  label: Commands
  order: 3
---

## Commands you can type

Use these in game if server allows you. `/lands` aliases `/land` and accepts the same arguments. Commands mainly open menus; creation, renaming, invitations, claiming and transactions use menu buttons.

| Syntax | Action | Example |
| --- | --- | --- |
| `/land` | Open the land you stand in if you belong to it; otherwise open your only land, a list when you have several, or creation menu when you have none. | `/land` |
| `/land map` | Open nearby map. Prefer the land you stand in and belong to; otherwise use first land in your list. Without a land, view only. | `/land map` |
| `/land spawn` | List lands you own or belong to; click one to travel if allowed. | `/land spawn` |
| `/lands` | Alias of main command. | `/lands map` |

```text
/land
/land map
/land spawn
```

:::tip[Choose the right land]
With several lands, open `/land`, select a land, then open **Claim map**. `/land map` does not first ask which land to use.
:::

## Invitation buttons

You normally do not need to type these commands. Clicking **[Chấp nhận]** or **[Từ chối]** in an invitation runs the corresponding command and opens confirmation.

| Syntax | Action |
| --- | --- |
| `/land invite accept <code>` | Open confirmation to join a land using your valid invitation. |
| `/land invite decline <code>` | Open confirmation to decline your valid invitation. |

`<code>` is the land code supplied by invitation button; do not type brackets literally or guess codes. Confirming in the menu completes your decision. Ask someone with invitation rights to resend expired invitations.

## When commands do not do what you expect

| Symptom | What to do |
| --- | --- |
| Usage lists `/land`, `/land map`, `/land spawn` | Use syntax above. No separate player command creates, claims or invites by name. |
| Command unavailable | Ask administrator if server has not allowed you access. Player commands work only in game. |
| Invitation expired or missing | Ask for a new invitation; invitations can disappear when land is gone. |
| No destination available | Ask administrator; destination world may not be loaded. |
| No teleport permission | Ask owner to check your role’s permissions. |
| Travel canceled | Stand still, avoid damage, then select land again. |

## Chat input is not a command

Type land names, player names or amounts only after clicking a button that requests them. For example, after **Custom deposit**, type `10k` to deposit 10,000 currency units. Do not add `/`. `huy`, `hủy` and `cancel` cancel input; waiting 45 seconds also cancels it. After an error, reopen menu and click the button again to retry.
