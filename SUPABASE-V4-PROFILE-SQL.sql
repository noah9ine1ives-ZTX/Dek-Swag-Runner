
-- SWAG NIGHT RUNNER V3 SOCIAL UPDATE
-- Run this in Supabase SQL Editor AFTER the previous game tables already exist.

-- 1) Make sure profiles can store online status.
alter table public.profiles
add column if not exists last_seen timestamptz;

alter table public.profiles
add column if not exists friend_code text;

-- Username rules: English letters, numbers, and _ . - @ only, 3-16 chars.
alter table public.profiles
alter column username set default 'SWAGPLAYER';

update public.profiles
set username = left(regexp_replace(coalesce(username, 'SWAGPLAYER'), '[^A-Za-z0-9_.@-]', '', 'g'), 16)
where username is null or username !~ '^[A-Za-z0-9_.@-]{3,16}$';

update public.profiles
set username = 'SWAGPLAYER'
where length(username) < 3;

with ranked as (
  select
    id,
    username,
    row_number() over (partition by lower(username) order by created_at nulls last, id) as rn
  from public.profiles
)
update public.profiles p
set username = left(r.username, 12) || lpad(r.rn::text, 4, '0')
from ranked r
where p.id = r.id and r.rn > 1;


create index if not exists profiles_username_idx
on public.profiles (lower(username));


create unique index if not exists profiles_username_unique_lower_idx
on public.profiles (lower(username))
where username is not null;


create unique index if not exists profiles_friend_code_unique_idx
on public.profiles (upper(friend_code))
where friend_code is not null;

create index if not exists profiles_last_seen_idx
on public.profiles (last_seen);


do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'profiles_username_english_only_chk'
  ) then
    alter table public.profiles
    add constraint profiles_username_english_only_chk
    check (username ~ '^[A-Za-z0-9_.@-]{3,16}$')
    not valid;
  end if;
end $$;


-- Allow logged-in users to search public profile basics.
drop policy if exists "Authenticated users can read public profile basics" on public.profiles;
create policy "Authenticated users can read public profile basics"
on public.profiles for select
to authenticated
using (true);

-- 2) Friend requests.
create table if not exists public.friend_requests (
  id uuid primary key default gen_random_uuid(),
  requester_id uuid not null references auth.users(id) on delete cascade,
  receiver_id uuid not null references auth.users(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending','accepted','rejected')),
  created_at timestamptz not null default now(),
  responded_at timestamptz,
  constraint friend_requests_no_self check (requester_id <> receiver_id),
  constraint friend_requests_unique_pair unique (requester_id, receiver_id)
);

alter table public.friend_requests enable row level security;

drop policy if exists "Users can read own friend requests" on public.friend_requests;
create policy "Users can read own friend requests"
on public.friend_requests for select
to authenticated
using (auth.uid() = requester_id or auth.uid() = receiver_id);

drop policy if exists "Users can send friend requests" on public.friend_requests;
create policy "Users can send friend requests"
on public.friend_requests for insert
to authenticated
with check (auth.uid() = requester_id and requester_id <> receiver_id);

drop policy if exists "Receivers can update friend requests" on public.friend_requests;
create policy "Receivers can update friend requests"
on public.friend_requests for update
to authenticated
using (auth.uid() = receiver_id)
with check (auth.uid() = receiver_id);


-- Prevent opposite-direction duplicate pending requests such as A→B and B→A.
create unique index if not exists friend_requests_unique_unordered_pending_idx
on public.friend_requests (
  least(requester_id, receiver_id),
  greatest(requester_id, receiver_id)
)
where status = 'pending';

-- 3) Friendships.
create table if not exists public.friendships (
  user_id uuid not null references auth.users(id) on delete cascade,
  friend_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, friend_id),
  constraint friendships_no_self check (user_id <> friend_id)
);

alter table public.friendships enable row level security;

drop policy if exists "Users can read own friendships" on public.friendships;
create policy "Users can read own friendships"
on public.friendships for select
to authenticated
using (auth.uid() = user_id or auth.uid() = friend_id);

drop policy if exists "Users can insert own friendships" on public.friendships;
create policy "Users can insert own friendships"
on public.friendships for insert
to authenticated
with check (auth.uid() = user_id or auth.uid() = friend_id);

drop policy if exists "Users can delete own friendships" on public.friendships;
create policy "Users can delete own friendships"
on public.friendships for delete
to authenticated
using (auth.uid() = user_id or auth.uid() = friend_id);

-- 4) Optional helper view for checking online status manually.
create or replace view public.online_profiles as
select
  id,
  username,
  friend_code,
  best_score,
  last_seen,
  (last_seen > now() - interval '2 minutes') as is_online
from public.profiles;



-- SWAG NIGHT RUNNER V4 PROFILE UPDATE
-- Public profile fields + Supabase Storage avatar bucket.

alter table public.profiles
add column if not exists bio text not null default '';

alter table public.profiles
add column if not exists avatar_url text;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'profiles_bio_length_chk'
  ) then
    alter table public.profiles
    add constraint profiles_bio_length_chk
    check (char_length(bio) <= 160)
    not valid;
  end if;
end $$;

drop policy if exists "Users can update own public profile" on public.profiles;
create policy "Users can update own public profile"
on public.profiles for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'avatars',
  'avatars',
  true,
  2097152,
  array['image/jpeg','image/png','image/webp','image/gif']
)
on conflict (id) do update
set public = true,
    file_size_limit = 2097152,
    allowed_mime_types = array['image/jpeg','image/png','image/webp','image/gif'];

drop policy if exists "Avatar images are public" on storage.objects;
create policy "Avatar images are public"
on storage.objects for select
to public
using (bucket_id = 'avatars');

drop policy if exists "Users can upload own avatar" on storage.objects;
create policy "Users can upload own avatar"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'avatars'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "Users can update own avatar" on storage.objects;
create policy "Users can update own avatar"
on storage.objects for update
to authenticated
using (
  bucket_id = 'avatars'
  and (storage.foldername(name))[1] = auth.uid()::text
)
with check (
  bucket_id = 'avatars'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "Users can delete own avatar" on storage.objects;
create policy "Users can delete own avatar"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'avatars'
  and (storage.foldername(name))[1] = auth.uid()::text
);



-- SWAG NIGHT RUNNER v4.7 DEV ACCOUNT / DEV PANEL
alter table public.profiles
add column if not exists role text not null default 'player';

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'profiles_role_chk'
  ) then
    alter table public.profiles
    add constraint profiles_role_chk
    check (role in ('player','dev'))
    not valid;
  end if;
end $$;

-- IMPORTANT:
-- After creating your dev account in the game, run one of these:
-- update public.profiles set role = 'dev' where username = 'DEV';
-- update public.profiles set role = 'dev' where username = '_nxah.qt';
--
-- To remove dev:
-- update public.profiles set role = 'player' where username = 'DEV';



-- SWAG NIGHT RUNNER v4.8 DEV DASHBOARD
-- Safer dev helper function used by RLS policies.
create or replace function public.is_dev(uid uuid)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = uid and role = 'dev'
  );
$$;

grant execute on function public.is_dev(uuid) to authenticated;

-- Dev audit log.
create table if not exists public.dev_audit_log (
  id bigserial primary key,
  dev_id uuid references auth.users(id) on delete set null,
  target_id uuid references auth.users(id) on delete set null,
  action text not null,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.dev_audit_log enable row level security;

drop policy if exists "Devs can insert audit logs" on public.dev_audit_log;
create policy "Devs can insert audit logs"
on public.dev_audit_log for insert
to authenticated
with check (public.is_dev(auth.uid()));

drop policy if exists "Devs can read audit logs" on public.dev_audit_log;
create policy "Devs can read audit logs"
on public.dev_audit_log for select
to authenticated
using (public.is_dev(auth.uid()));

-- Dev can update public profile data for moderation/economy tools.
drop policy if exists "Devs can update any profile" on public.profiles;
create policy "Devs can update any profile"
on public.profiles for update
to authenticated
using (public.is_dev(auth.uid()))
with check (public.is_dev(auth.uid()));

-- Dev can manage suspicious leaderboard rows.
drop policy if exists "Devs can update leaderboard" on public.leaderboard;
create policy "Devs can update leaderboard"
on public.leaderboard for update
to authenticated
using (public.is_dev(auth.uid()))
with check (public.is_dev(auth.uid()));

drop policy if exists "Devs can delete leaderboard rows" on public.leaderboard;
create policy "Devs can delete leaderboard rows"
on public.leaderboard for delete
to authenticated
using (public.is_dev(auth.uid()));

-- Dev can update player inventory/loadout if future tools need it.
drop policy if exists "Devs can update any player inventory" on public.player_inventory;
create policy "Devs can update any player inventory"
on public.player_inventory for update
to authenticated
using (public.is_dev(auth.uid()))
with check (public.is_dev(auth.uid()));

drop policy if exists "Devs can update any player loadout" on public.player_loadouts;
create policy "Devs can update any player loadout"
on public.player_loadouts for update
to authenticated
using (public.is_dev(auth.uid()))
with check (public.is_dev(auth.uid()));



-- SWAG NIGHT RUNNER v4.9 MODERATION SYSTEM
alter table public.profiles
add column if not exists account_status text not null default 'active';

alter table public.profiles
add column if not exists suspended_until timestamptz;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'profiles_account_status_chk'
  ) then
    alter table public.profiles
    add constraint profiles_account_status_chk
    check (account_status in ('active','suspended','banned'))
    not valid;
  end if;
end $$;

create index if not exists profiles_account_status_idx
on public.profiles (account_status);

create index if not exists profiles_suspended_until_idx
on public.profiles (suspended_until);

-- Dev can upsert target inventory/loadout for Give/Remove Item and Reset Wardrobe tools.
drop policy if exists "Devs can insert any player inventory" on public.player_inventory;
create policy "Devs can insert any player inventory"
on public.player_inventory for insert
to authenticated
with check (public.is_dev(auth.uid()));

drop policy if exists "Devs can insert any player loadout" on public.player_loadouts;
create policy "Devs can insert any player loadout"
on public.player_loadouts for insert
to authenticated
with check (public.is_dev(auth.uid()));
