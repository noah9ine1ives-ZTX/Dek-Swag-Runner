import { supabase } from './supabaseClient.js';

export const DEFAULT_LOADOUT = {
  hair: 'cap-fade',
  top: 'oversized-hoodie',
  pants: 'baggy-gray',
  shoes: 'chunky-white',
};

export const DEFAULT_INVENTORY = {
  hairs: ['cap-fade'],
  tops: ['oversized-hoodie'],
  pants: ['baggy-gray'],
  shoes: ['chunky-white'],
  effects: ['classic'],
};

export function hasCloudSave() {
  return Boolean(supabase);
}

export async function signUpWithEmail(email, password, username = 'SWAG PLAYER') {
  if (!supabase) throw new Error('Supabase env is missing');
  return supabase.auth.signUp({ email, password, options: { data: { name: username } } });
}

export async function signInWithEmail(email, password) {
  if (!supabase) throw new Error('Supabase env is missing');
  return supabase.auth.signInWithPassword({ email, password });
}

export async function signOut() {
  if (!supabase) return;
  return supabase.auth.signOut();
}

export async function ensurePlayerDefaults(user, username = 'SWAG PLAYER') {
  if (!supabase || !user) return;
  await supabase.from('profiles').upsert({
    id: user.id,
    username,
    updated_at: new Date().toISOString(),
  }, { onConflict: 'id' });
  await supabase.from('player_inventory').upsert({
    user_id: user.id,
    ...DEFAULT_INVENTORY,
    updated_at: new Date().toISOString(),
  }, { onConflict: 'user_id', ignoreDuplicates: true });
  await supabase.from('player_loadouts').upsert({
    user_id: user.id,
    ...DEFAULT_LOADOUT,
    skin_effect: 'classic',
    updated_at: new Date().toISOString(),
  }, { onConflict: 'user_id', ignoreDuplicates: true });
}

export async function loadPlayerData(user) {
  if (!supabase || !user) throw new Error('Not logged in');
  const [profile, inventory, loadout, leaderboard] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).maybeSingle(),
    supabase.from('player_inventory').select('*').eq('user_id', user.id).maybeSingle(),
    supabase.from('player_loadouts').select('*').eq('user_id', user.id).maybeSingle(),
    supabase.from('leaderboard').select('*').order('score', { ascending: false }).limit(10),
  ]);
  for (const result of [profile, inventory, loadout, leaderboard]) {
    if (result.error) throw result.error;
  }
  return {
    profile: profile.data,
    inventory: inventory.data,
    loadout: loadout.data,
    leaderboard: leaderboard.data || [],
  };
}

export async function saveLoadout(user, loadout, inventory, effects) {
  if (!supabase || !user) return;
  await Promise.all([
    supabase.from('player_loadouts').upsert({
      user_id: user.id,
      hair: loadout.hair,
      top: loadout.top,
      pants: loadout.pants,
      shoes: loadout.shoes,
      skin_effect: loadout.skin_effect || 'classic',
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id' }),
    supabase.from('player_inventory').upsert({
      user_id: user.id,
      hairs: inventory.hairs,
      tops: inventory.tops,
      pants: inventory.pants,
      shoes: inventory.shoes,
      effects,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id' }),
  ]);
}

export async function saveGameResult(user, result) {
  if (!supabase || !user) return null;
  const username = result.username || user.email?.split('@')[0] || 'SWAG PLAYER';
  const { data: profile } = await supabase
    .from('profiles')
    .select('coins,best_score,best_combo,best_style')
    .eq('id', user.id)
    .maybeSingle();

  const coins = Math.max(0, Number(profile?.coins || 0) + Number(result.coins || 0));
  const bestScore = Math.max(Number(profile?.best_score || 0), Number(result.score || 0));
  const bestCombo = Math.max(Number(profile?.best_combo || 1), Number(result.maxCombo || 1));
  const bestStyle = Math.max(Number(profile?.best_style || 0), Number(result.styleScore || 0));

  await supabase.from('profiles').upsert({
    id: user.id,
    username,
    coins,
    best_score: bestScore,
    best_combo: bestCombo,
    best_style: bestStyle,
    updated_at: new Date().toISOString(),
  }, { onConflict: 'id' });

  const { data: oldScore } = await supabase
    .from('leaderboard')
    .select('score')
    .eq('user_id', user.id)
    .maybeSingle();

  if (!oldScore || Number(result.score || 0) > Number(oldScore.score || 0)) {
    await supabase.from('leaderboard').upsert({
      user_id: user.id,
      username,
      score: Math.floor(Number(result.score || 0)),
      coins: Math.floor(Number(result.coins || 0)),
      max_combo: Math.floor(Number(result.maxCombo || 1)),
      style_score: Math.floor(Number(result.styleScore || 0)),
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id' });
  }

  const { data: board } = await supabase
    .from('leaderboard')
    .select('*')
    .order('score', { ascending: false })
    .limit(10);

  return { coins, bestScore, leaderboard: board || [] };
}
