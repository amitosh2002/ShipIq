import supabase from '../config/supabase.js';

export async function insertTanks(tanks, sessionId) {
  const tanksToInsert = tanks.map(t => ({
    id: t.id,
    capacity: t.capacity,
    session_id: sessionId
  }));

  const { data, error } = await supabase
    .from('tanks')
    .insert(tanksToInsert)
    .select();

  if (error) {
    throw error;
  }
  return data;
}

export async function getTanksBySession(sessionId) {
  const { data, error } = await supabase
    .from('tanks')
    .select('*')
    .eq('session_id', sessionId);

  if (error) {
    throw error;
  }
  return data;
}
