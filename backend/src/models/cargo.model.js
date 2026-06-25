import supabase from '../config/supabase.js';

export async function insertCargos(cargos, sessionId) {
  const cargosToInsert = cargos.map(c => ({
    id: c.id,
    volume: c.volume,
    session_id: sessionId
  }));

  const { data, error } = await supabase
    .from('cargos')
    .insert(cargosToInsert)
    .select();

  if (error) {
    throw error;
  }
  return data;
}

export async function getCargosBySession(sessionId) {
  const { data, error } = await supabase
    .from('cargos')
    .select('*')
    .eq('session_id', sessionId);

  if (error) {
    throw error;
  }
  return data;
}
