import { v4 as uuidv4 } from 'uuid';
import { insertCargos } from '../models/cargo.model.js';
import { insertTanks } from '../models/tank.model.js';

export async function handleInput(req, res) {
  try {
    const { cargos, tanks } = req.body;

    // Validate top-level arrays exist
    if (!cargos || !Array.isArray(cargos) || !tanks || !Array.isArray(tanks)) {
      return res.status(400).json({
        error: true,
        message: "Invalid input. 'cargos' and 'tanks' must be arrays.",
        code: 400
      });
    }

    if (cargos.length === 0 || tanks.length === 0) {
      return res.status(400).json({
        error: true,
        message: "Cargos and tanks arrays must not be empty.",
        code: 400
      });
    }

    // Validate each cargo object
    for (const cargo of cargos) {
      if (!cargo.id || typeof cargo.id !== 'string' || cargo.id.trim() === '') {
        return res.status(400).json({
          error: true,
          message: "Each cargo must have a non-empty string 'id'.",
          code: 400
        });
      }
      if (cargo.volume === undefined || cargo.volume === null || isNaN(Number(cargo.volume)) || Number(cargo.volume) < 0) {
        return res.status(400).json({
          error: true,
          message: `Cargo '${cargo.id}' has an invalid volume. Must be a non-negative number.`,
          code: 400
        });
      }
    }

    // Validate each tank object
    for (const tank of tanks) {
      if (!tank.id || typeof tank.id !== 'string' || tank.id.trim() === '') {
        return res.status(400).json({
          error: true,
          message: "Each tank must have a non-empty string 'id'.",
          code: 400
        });
      }
      if (tank.capacity === undefined || tank.capacity === null || isNaN(Number(tank.capacity)) || Number(tank.capacity) < 0) {
        return res.status(400).json({
          error: true,
          message: `Tank '${tank.id}' has an invalid capacity. Must be a non-negative number.`,
          code: 400
        });
      }
    }

    // Check for duplicate cargo IDs
    const cargoIds = cargos.map(c => c.id);
    if (new Set(cargoIds).size !== cargoIds.length) {
      return res.status(400).json({
        error: true,
        message: "Duplicate cargo IDs found. Each cargo must have a unique ID.",
        code: 400
      });
    }

    // Check for duplicate tank IDs
    const tankIds = tanks.map(t => t.id);
    if (new Set(tankIds).size !== tankIds.length) {
      return res.status(400).json({
        error: true,
        message: "Duplicate tank IDs found. Each tank must have a unique ID.",
        code: 400
      });
    }

    const sessionId = uuidv4();

    await insertCargos(cargos, sessionId);
    await insertTanks(tanks, sessionId);

    return res.status(201).json({
      session_id: sessionId,
      message: "Input stored successfully",
      cargoCount: cargos.length,
      tankCount: tanks.length
    });
  } catch (error) {
    console.error("Input error:", error);
    return res.status(500).json({
      error: true,
      message: "Internal server error while processing input.",
      code: 500
    });
  }
}
