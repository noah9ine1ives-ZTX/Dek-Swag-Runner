# Swag Night Runner v3 Social Update

## New systems
- Friend requests by Friend Code or username
- Friend list with online/offline status
- Friends leaderboard
- Shop/Wardrobe real character preview before buy/equip

## Required Supabase SQL
Before using Friends, run:

`SUPABASE-V3-SOCIAL-SQL.sql`

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
