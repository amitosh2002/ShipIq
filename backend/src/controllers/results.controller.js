import { getAllocationsBySession } from '../models/allocation.model.js';
import { getTanksBySession } from '../models/tank.model.js';

export async function handleResults(req, res) {
  try {
    const { session_id } = req.query;

    if (!session_id) {
      return res.status(400).json({
        error: true,
        message: "Missing session_id in query parameters.",
        code: 400
      });
    }

    const allocations = await getAllocationsBySession(session_id);
    
    // To calculate utilization, we might need total capacity again.
    // If allocations is empty, maybe they haven't optimized yet.
    const tanks = await getTanksBySession(session_id);

    const formattedAllocations = allocations.map(a => ({
      tankId: a.tank_id,
      cargoId: a.cargo_id,
      allocatedVolume: Number(a.allocated_volume),
      status: a.status
    }));

    const totalLoaded = formattedAllocations.reduce((sum, a) => sum + a.allocatedVolume, 0);
    const totalCapacity = tanks.reduce((sum, t) => sum + Number(t.capacity), 0);
    const utilizationPercent = totalCapacity > 0 ? (totalLoaded / totalCapacity) * 100 : 0;

    return res.status(200).json({
      session_id: session_id,
      summary: {
        totalLoaded: totalLoaded,
        totalCapacity: totalCapacity,
        utilizationPercent: parseFloat(utilizationPercent.toFixed(2))
      },
      allocations: formattedAllocations
    });
  } catch (error) {
    console.error("Results error:", error);
    return res.status(500).json({
      error: true,
      message: "Internal server error while fetching results.",
      code: 500
    });
  }
}
