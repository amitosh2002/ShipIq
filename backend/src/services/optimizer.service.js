/**
 * Pure function to optimize cargo allocation to tanks using a greedy approach.
 *
 * Algorithm:
 * 1. Sort tanks descending by capacity
 * 2. Sort cargos descending by volume
 * 3. Track remaining volume per cargo in a Map
 * 4. For each tank, pick the cargo with the largest remaining volume
 *    and allocate min(tank.capacity, cargo.remainingVolume)
 *
 * Why greedy works here:
 * Because cargo splitting is allowed, the problem reduces to a simple
 * assignment — not NP-hard bin-packing. Greedy maximizes total loaded
 * volume in O(N*M) time (N tanks, M cargos).
 *
 * Status meanings:
 * - 'full_cargo'   → the entire cargo volume fit into this single tank
 * - 'partial_tank' → the cargo fit but the tank still has leftover space
 * - 'split'        → only a portion of the cargo was placed in this tank
 *
 * @param {Array<{id: string, volume: number}>} cargos
 * @param {Array<{id: string, capacity: number}>} tanks
 * @returns {Array<{tankId: string, cargoId: string, allocatedVolume: number, status: string}>}
 */
export function optimize(cargos, tanks) {
  if (!cargos || cargos.length === 0 || !tanks || tanks.length === 0) {
    return [];
  }

  // 1. Sort tanks descending by capacity
  const sortedTanks = [...tanks].sort((a, b) => Number(b.capacity) - Number(a.capacity));

  // 2. Sort cargos descending by volume
  const sortedCargos = [...cargos].sort((a, b) => Number(b.volume) - Number(a.volume));

  // 3. Track remaining volume per cargo
  const cargoRemaining = new Map();
  const cargoOriginal = new Map();
  sortedCargos.forEach(c => {
    const vol = Number(c.volume);
    cargoRemaining.set(c.id, vol);
    cargoOriginal.set(c.id, vol);
  });

  const allocations = [];

  // 4. For each tank, allocate the largest remaining cargo
  for (const tank of sortedTanks) {
    // Find cargo with the largest remaining volume
    let bestCargoId = null;
    let maxRemaining = 0;

    for (const [id, remaining] of cargoRemaining.entries()) {
      if (remaining > maxRemaining) {
        maxRemaining = remaining;
        bestCargoId = id;
      }
    }

    // No more cargo to allocate
    if (!bestCargoId || maxRemaining <= 0) {
      break;
    }

    const tankCapacity = Number(tank.capacity);
    
    if (tankCapacity <= 0) {
      continue;
    }

    const allocatedVolume = Math.min(tankCapacity, maxRemaining);
    const originalVolume = cargoOriginal.get(bestCargoId);

    // Determine status
    let status;
    if (allocatedVolume === originalVolume && allocatedVolume <= tankCapacity) {
      // Entire cargo fit in this one tank
      status = allocatedVolume < tankCapacity ? 'partial_tank' : 'full_cargo';
    } else {
      // Only a portion of the cargo was placed here
      status = 'split';
    }

    allocations.push({
      tankId: tank.id,
      cargoId: bestCargoId,
      allocatedVolume,
      status
    });

    // Deduct from remaining
    cargoRemaining.set(bestCargoId, maxRemaining - allocatedVolume);
  }

  return allocations;
}
