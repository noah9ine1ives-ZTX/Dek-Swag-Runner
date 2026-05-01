# Swag Night Runner v3 Social Update

## New systems
- Friend requests by Friend Code or username
- Friend list with online/offline status
- Friends leaderboard
- Shop/Wardrobe real character preview before buy/equip

## Required Supabase SQL
Before using Friends, run:

`SUPABASE-V5-SQL.sql`

in Supabase → SQL Editor → New Query → Run.

## Upload
Upload all files/folders in this ZIP to the root of the GitHub repo and replace existing files.

## Vercel
Environment variables must already exist:
- VITE_SUPABASE_URL
- VITE_SUPABASE_ANON_KEY


## v3.1 improvements
- Friend Code prevents duplicate username issues.
- Shop Preview now renders the actual outfit preview on canvas instead of emoji.


## v3.2 Username Safety
- Username now accepts English letters and numbers only: `A-Z`, `a-z`, `0-9`.
- No spaces, special characters, Thai characters, or emoji.
- Supabase SQL adds a unique lower-case username index to prevent duplicate names.
- Friend Code remains the safest way to add friends.


## v3.3 Username Symbols
- Username now allows English letters, numbers, and these symbols: `_ . - @`.
- Still blocks Thai characters, spaces, emoji, and other special characters.
- Duplicate usernames are still blocked by Supabase unique index.

## v4 Profile Update
- Click users in Global Leaderboard / Friends Leaderboard to open profile modal.
- Players can edit username and bio.
- Players can upload avatar images from device.
- Profile displays avatar, username, friend code, rank, best score, coins, max combo, style, online status, and bio.
- You can add friends from another player's profile.
- Run `SUPABASE-V5-SQL.sql` in Supabase SQL Editor.
- Avatar bucket name: `avatars`; max upload size: 2MB; allowed: jpg/png/webp/gif.


## v4.1 Avatar Leaderboard
- Global Leaderboard and Friends Leaderboard show player avatar images.
- Shows top 50 entries.
- If no avatar exists, it shows the first letter of the username.


## v4.2 My Profile Button
- Added `👤 My Profile` button in the Login/Settings tab after login.
- Opens the current user's profile modal directly for viewing/editing avatar, username, and bio.
- Added `Sync Profile` button to refresh cloud data.

## v4.3 Login Required
- Players must login before starting the game.
- Landing button becomes `🔐 Login to Play` when logged out.
- Pressing play while logged out opens the Login/Settings tab and shows a message.
- Game restart controls are protected by the same login check.

## v4.4 Beautiful Login
- Reworked Login/Settings into a polished neon login panel.
- Added Login to Play messaging.
- Added password show/hide toggle.
- Added account status card, My Profile, Sync Profile, and Logout area after login.

## v4.5 Username Account Update
- Username is set once during Sign up.
- Landing page no longer asks for player name every time.
- Username availability is checked before account creation.
- Username can be changed only in My Profile.
- Changing Username costs 10,000 coins.
- Bio and Avatar edits remain free.

## v4.6 Realtime Username Check
- Sign up username is checked automatically while typing.
- Uses 500ms debounce to avoid too many Supabase requests.
- Username input turns green when available.
- Username input turns red when invalid or already taken.
- Create Account button is disabled until username is available.

## v4.7 Dev Account / Dev Panel
- Adds `profiles.role` with values `player` or `dev`.
- Dev-only panel appears in Login/Settings when `role = 'dev'`.
- Dev can add coins to self, unlock all items/effects, reset own test data.
- Dev can rename for free in My Profile.
- Dev panel cannot edit other players.

### Make your account Dev
Run this in Supabase SQL Editor after creating/logging into the account:

```sql
update public.profiles
set role = 'dev'
where username = 'YOUR_USERNAME';
```

## v4.8 Dev Dashboard
Adds advanced dev tools:
- Search player by Username or Friend Code.
- View player profile summary.
- Set target player coins.
- Add coins to target player.
- Remove target player's leaderboard score.
- Set target role: player/dev.
- Reset target avatar/bio.
- View target profile.
- Audit log table: `dev_audit_log`.

Run `SUPABASE-V5-SQL.sql` again after deploying this version.

## v4.9 Moderation System
Adds advanced player moderation:
1. Ban / Unban players.
2. Suspend players for a chosen number of days.
3. Reset Score Full: leaderboard + profile best_score/best_combo/best_style.
4. Reset Wardrobe to defaults.
5. Give Item / Remove Item for Hair, Top, Pants, Shoes, Effect.
6. Reset Avatar/Bio with reason.
7. Reason Required for important dev actions.
8. Audit Log Viewer in-game.

Run `SUPABASE-V5-SQL.sql` again after deploying.

## v5.0 Clean Foundation Overhaul
This is the first v5 foundation update.

### Changed
- Default character is intentionally simple:
  - Basic Short Hair
  - Plain Tee
  - Basic Pants
  - Simple Sneakers
  - No Accessory
  - No Trail Effect
- Skin Effect is now treated as Trail Effect.
- Starter effect is No Trail; premium effects must be unlocked.
- Shop/Style system now supports bodyType, accessory, trailEffect, and item rarity.
- Existing Login / Profile / Dev Dashboard / Leaderboard systems remain.

### New starter values
bodyType = male
hair = basic-short
top = plain-tee
pants = basic-pants
shoes = simple-sneakers
accessory = none
trailEffect = none

### Required SQL
Run SUPABASE-V5-SQL.sql in Supabase SQL Editor.

## v5.1 Shop Item Thumbnail System
- Shop item cards now show mini visual thumbnails instead of simple color swatches.
- Added thumbnail renderers for:
  - Hair
  - Top
  - Bottom
  - Shoes
  - Accessory
  - Trail Effect
- Players can visually understand each item before preview/buy/equip.
- No new Supabase SQL is required for this version if `SUPABASE-V5-SQL.sql` was already run.

## v5.2 Male / Female Character Preview
- Added Male Runner / Female Runner selector in Style Preview.
- Body type preview is free and can be equipped through Buy / Equip Preview.
- Prepared preview rendering for male/female visual differences.
- Fixed Style Preview text overlap:
  - Outfit text is now below the character canvas.
  - Long item names are clipped safely.
  - Character outfit is no longer blocked by text.
- No new Supabase SQL is required if `SUPABASE-V5-SQL.sql` was already run.

## v5.4 Foot Trail System
- Trail effects now render closer to the feet instead of behaving like body aura.
- Added foot anchor based trail generation for running and landing.
- Added safer low-motion particle shapes for Ember, Neon, Lightning, Smoke, and Holo effects.
- Added preview trail at the feet in Style Preview.
- Reduced glow intensity to avoid eye strain.
- No new Supabase SQL is required.

## v5.4.1 No Body Aura
- Removed body glow / aura from the character render completely.
- Trail effects now stay at the feet only in gameplay and Style Preview.
- No new Supabase SQL is required.

## v5.5 Double Jump + Jump Feedback
- Added 2-jump system:
  - First jump from ground.
  - Second jump in air.
  - Jump count resets on landing.
- Added mobile tap support for repeated jump taps.
- Added foot burst feedback for normal jump, double jump, and landing.
- Added small style/combo reward for successful double jump.
- No new Supabase SQL is required.

## v5.6 Fast Fall + Slide Control
- Holding Slide/Duck while airborne now triggers Fast Fall.
- Fast Fall makes the character drop faster instead of floating too long.
- If Slide is still held when landing, the character continues into slide posture.
- Added FAST FALL / QUICK LAND feedback.
- Added small style/combo reward for controlled quick landing.
- Added subtle downward speed streaks during fast fall.
- No new Supabase SQL is required.
