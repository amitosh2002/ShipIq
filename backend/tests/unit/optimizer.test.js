import { optimize } from '../../src/services/optimizer.service.js';

describe('Optimizer Service', () => {

  // ── Empty / null inputs ──────────────────────────────────────────
  describe('edge cases', () => {
    it('returns [] for empty cargos and tanks', () => {
      expect(optimize([], [])).toEqual([]);
    });

    it('returns [] when cargos is empty', () => {
      expect(optimize([], [{ id: 'T1', capacity: 100 }])).toEqual([]);
    });

    it('returns [] when tanks is empty', () => {
      expect(optimize([{ id: 'C1', volume: 100 }], [])).toEqual([]);
    });

    it('returns [] for null inputs', () => {
      expect(optimize(null, null)).toEqual([]);
      expect(optimize(undefined, undefined)).toEqual([]);
    });

    it('handles cargo with volume 0', () => {
      const result = optimize(
        [{ id: 'C1', volume: 0 }],
        [{ id: 'T1', capacity: 1000 }]
      );
      expect(result).toEqual([]);
    });

    it('handles tank with capacity 0', () => {
      const result = optimize(
        [{ id: 'C1', volume: 1000 }],
        [{ id: 'T1', capacity: 0 }]
      );
      // Tank has 0 capacity so min(0, 1000) = 0, should not allocate
      expect(result.length).toBe(0);
    });
  });

  // ── Assignment dataset ───────────────────────────────────────────
  describe('assignment dataset (10 cargos, 10 tanks)', () => {
    const assignmentData = [
      { id: 'C1', value: 1234 },
      { id: 'C2', value: 4352 },
      { id: 'C3', value: 3321 },
      { id: 'C4', value: 2456 },
      { id: 'C5', value: 5123 },
      { id: 'C6', value: 1879 },
      { id: 'C7', value: 4987 },
      { id: 'C8', value: 2050 },
      { id: 'C9', value: 3678 },
      { id: 'C10', value: 5432 },
    ];

    it('achieves 100% utilization when cargo and tank lists are identical', () => {
      const cargos = assignmentData.map(d => ({ id: d.id, volume: d.value }));
      const tanks = assignmentData.map(d => ({ id: d.id, capacity: d.value }));

      const result = optimize(cargos, tanks);

      const totalLoaded = result.reduce((sum, a) => sum + a.allocatedVolume, 0);
      const totalCapacity = tanks.reduce((sum, t) => sum + t.capacity, 0);

      expect(totalLoaded).toBe(totalCapacity);
      expect(totalLoaded).toBe(34512);
      expect(result.length).toBe(10);
    });

    it('every allocation is full_cargo when cargo = tank capacity', () => {
      const cargos = assignmentData.map(d => ({ id: d.id, volume: d.value }));
      const tanks = assignmentData.map(d => ({ id: d.id, capacity: d.value }));

      const result = optimize(cargos, tanks);

      result.forEach(alloc => {
        expect(alloc.status).toBe('full_cargo');
      });
    });

    it('each tank holds exactly one cargo ID', () => {
      const cargos = assignmentData.map(d => ({ id: d.id, volume: d.value }));
      const tanks = assignmentData.map(d => ({ id: d.id, capacity: d.value }));

      const result = optimize(cargos, tanks);

      // Check no duplicate tank IDs in results
      const tankIds = result.map(a => a.tankId);
      expect(new Set(tankIds).size).toBe(tankIds.length);
    });
  });

  // ── Perfect fit ──────────────────────────────────────────────────
  it('allocates perfect fit correctly (100% utilization)', () => {
    const cargos = [
      { id: 'C1', volume: 5000 },
      { id: 'C2', volume: 3000 }
    ];
    const tanks = [
      { id: 'T1', capacity: 5000 },
      { id: 'T2', capacity: 3000 }
    ];

    const result = optimize(cargos, tanks);
    expect(result).toHaveLength(2);

    const t1 = result.find(r => r.tankId === 'T1');
    expect(t1.cargoId).toBe('C1');
    expect(t1.allocatedVolume).toBe(5000);
    expect(t1.status).toBe('full_cargo');

    const t2 = result.find(r => r.tankId === 'T2');
    expect(t2.cargoId).toBe('C2');
    expect(t2.allocatedVolume).toBe(3000);
    expect(t2.status).toBe('full_cargo');
  });

  // ── Splitting ────────────────────────────────────────────────────
  it('splits a large cargo across multiple tanks', () => {
    const cargos = [{ id: 'C1', volume: 10000 }];
    const tanks = [
      { id: 'T1', capacity: 5000 },
      { id: 'T2', capacity: 3000 }
    ];

    const result = optimize(cargos, tanks);
    expect(result).toHaveLength(2);

    const t1 = result.find(r => r.tankId === 'T1');
    expect(t1.allocatedVolume).toBe(5000);
    expect(t1.status).toBe('split');

    const t2 = result.find(r => r.tankId === 'T2');
    expect(t2.allocatedVolume).toBe(3000);
    expect(t2.status).toBe('split');
  });

  it('cargo splits across exactly 3 tanks', () => {
    const cargos = [{ id: 'C1', volume: 9000 }];
    const tanks = [
      { id: 'T1', capacity: 4000 },
      { id: 'T2', capacity: 3000 },
      { id: 'T3', capacity: 2000 }
    ];

    const result = optimize(cargos, tanks);
    expect(result).toHaveLength(3);

    const totalLoaded = result.reduce((s, a) => s + a.allocatedVolume, 0);
    expect(totalLoaded).toBe(9000);
    result.forEach(r => expect(r.status).toBe('split'));
  });

  // ── Partial tank ─────────────────────────────────────────────────
  it('marks partial_tank when cargo fits but tank has leftover space', () => {
    const cargos = [{ id: 'C1', volume: 2000 }];
    const tanks = [{ id: 'T1', capacity: 5000 }];

    const result = optimize(cargos, tanks);
    expect(result).toHaveLength(1);
    expect(result[0].allocatedVolume).toBe(2000);
    expect(result[0].status).toBe('partial_tank');
  });

  // ── Partial load (cargo > capacity) ──────────────────────────────
  it('partially loads when single cargo exceeds single tank', () => {
    const cargos = [{ id: 'C1', volume: 5000 }];
    const tanks = [{ id: 'T1', capacity: 2000 }];

    const result = optimize(cargos, tanks);
    expect(result).toHaveLength(1);
    expect(result[0].allocatedVolume).toBe(2000);
    expect(result[0].status).toBe('split');
  });

  // ── Same sizes ───────────────────────────────────────────────────
  it('handles all tanks same capacity, all cargos same volume', () => {
    const cargos = [
      { id: 'C1', volume: 2000 },
      { id: 'C2', volume: 2000 }
    ];
    const tanks = [
      { id: 'T1', capacity: 2000 },
      { id: 'T2', capacity: 2000 },
      { id: 'T3', capacity: 2000 }
    ];

    const result = optimize(cargos, tanks);
    expect(result).toHaveLength(2);
    result.forEach(r => {
      expect(r.allocatedVolume).toBe(2000);
      expect(r.status).toBe('full_cargo');
    });
  });

  // ── Maximization ─────────────────────────────────────────────────
  it('maximizes loaded volume when total cargo > total capacity', () => {
    const cargos = [
      { id: 'C1', volume: 5000 },
      { id: 'C2', volume: 3000 },
      { id: 'C3', volume: 2000 }
    ];
    const tanks = [
      { id: 'T1', capacity: 4000 },
      { id: 'T2', capacity: 3000 }
    ];

    const result = optimize(cargos, tanks);
    const totalLoaded = result.reduce((s, a) => s + a.allocatedVolume, 0);

    // Total capacity is 7000. Should load 7000 out of 10000.
    expect(totalLoaded).toBe(7000);
  });

  // ── String numeric values (from DB) ──────────────────────────────
  it('handles string numeric values from database', () => {
    const cargos = [{ id: 'C1', volume: '3000' }];
    const tanks = [{ id: 'T1', capacity: '5000' }];

    const result = optimize(cargos, tanks);
    expect(result).toHaveLength(1);
    expect(result[0].allocatedVolume).toBe(3000);
  });
});
