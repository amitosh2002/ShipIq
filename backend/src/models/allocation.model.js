import supabase from '../config/supabase.js';

export async function insertAllocations(allocations, sessionId) {
  const allocationsToInsert = allocations.map(a => ({
    session_id: sessionId,
    tank_id: a.tankId,
    cargo_id: a.cargoId,
    allocated_volume: a.allocatedVolume,
    status: a.status
  }));

  const { data, error } = await supabase
    .from('allocations')
    .insert(allocationsToInsert)
    .select();

  if (error) {
    throw error;
  }
  return data;
}

export async function getAllocationsBySession(sessionId) {
  const { data, error } = await supabase
    .from('allocations')
    .select('*')
    .eq('session_id', sessionId);

  if (error) {
    throw error;
  }
  return data;
}
