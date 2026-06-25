import { getCargosBySession } from '../models/cargo.model.js';
import { getTanksBySession } from '../models/tank.model.js';
import { insertAllocations } from '../models/allocation.model.js';
import { optimize } from '../services/optimizer.service.js';

export async function handleOptimize(req, res) {
  try {
    const { session_id } = req.body;

    if (!session_id) {
      return res.status(400).json({
        error: true,
        message: "Missing session_id in request body.",
        code: 400
      });
    }

    // Fetch data
    const cargos = await getCargosBySession(session_id);
    const tanks = await getTanksBySession(session_id);

    if (!cargos || cargos.length === 0 || !tanks || tanks.length === 0) {
      return res.status(404).json({
        error: true,
        message: "Session not found or contains no cargos/tanks.",
        code: 404
      });
    }

    // Run optimizer (pure function)
    const allocations = optimize(cargos, tanks);

    // Save results
    if (allocations.length > 0) {
      await insertAllocations(allocations, session_id);
    }

    // Calculate summary
    const totalLoaded = allocations.reduce((sum, a) => sum + Number(a.allocatedVolume), 0);
    const totalCapacity = tanks.reduce((sum, t) => sum + Number(t.capacity), 0);
    const utilizationPercent = totalCapacity > 0 ? (totalLoaded / totalCapacity) * 100 : 0;

    return res.status(200).json({
      session_id: session_id,
      totalLoaded: totalLoaded,
      totalCapacity: totalCapacity,
      utilizationPercent: parseFloat(utilizationPercent.toFixed(2)),
      allocationCount: allocations.length
    });
  } catch (error) {
    console.error("Optimize error:", error);
    return res.status(500).json({
      error: true,
      message: "Internal server error during optimization.",
      code: 500
    });
  }
}
