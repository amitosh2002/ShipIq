import { jest } from '@jest/globals';
import request from 'supertest';

// Mock models
jest.unstable_mockModule('../../src/models/cargo.model.js', () => ({
  insertCargos: jest.fn().mockResolvedValue([]),
  getCargosBySession: jest.fn().mockResolvedValue([])
}));

jest.unstable_mockModule('../../src/models/tank.model.js', () => ({
  insertTanks: jest.fn().mockResolvedValue([]),
  getTanksBySession: jest.fn().mockResolvedValue([])
}));

jest.unstable_mockModule('../../src/models/allocation.model.js', () => ({
  insertAllocations: jest.fn().mockResolvedValue([]),
  getAllocationsBySession: jest.fn().mockResolvedValue([])
}));

// Import dynamically after mocks
const app = (await import('../../src/app.js')).default;
const cargoModel = await import('../../src/models/cargo.model.js');
const tankModel = await import('../../src/models/tank.model.js');
const allocationModel = await import('../../src/models/allocation.model.js');

describe('API Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('POST /input with valid data -> 201, returns session_id', async () => {
    cargoModel.insertCargos.mockResolvedValue([]);
    tankModel.insertTanks.mockResolvedValue([]);

    const response = await request(app)
      .post('/input')
      .send({
        cargos: [{ id: 'C1', volume: 1000 }],
        tanks: [{ id: 'T1', capacity: 2000 }]
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('session_id');
  });

  it('POST /input with missing fields -> 400 with error message', async () => {
    const response = await request(app)
      .post('/input')
      .send({ cargos: [{ id: 'C1', volume: 1000 }] }); // missing tanks

    expect(response.status).toBe(400);
    expect(response.body.error).toBe(true);
  });

  it('POST /optimize with valid session_id -> 200, returns summary', async () => {
    cargoModel.getCargosBySession.mockResolvedValue([{ id: 'C1', volume: 1000 }]);
    tankModel.getTanksBySession.mockResolvedValue([{ id: 'T1', capacity: 2000 }]);
    allocationModel.insertAllocations.mockResolvedValue([]);

    const response = await request(app)
      .post('/optimize')
      .send({ session_id: 'test-session-id' });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('totalLoaded', 1000);
    expect(response.body).toHaveProperty('utilizationPercent', 50);
  });

  it('POST /optimize with unknown session_id -> 404', async () => {
    cargoModel.getCargosBySession.mockResolvedValue([]); // returns empty
    tankModel.getTanksBySession.mockResolvedValue([]);

    const response = await request(app)
      .post('/optimize')
      .send({ session_id: 'unknown-session-id' });

    expect(response.status).toBe(404);
  });

  it('GET /results with valid session_id -> 200, allocations array populated', async () => {
    allocationModel.getAllocationsBySession.mockResolvedValue([
      { tank_id: 'T1', cargo_id: 'C1', allocated_volume: 1000, status: 'partial_tank' }
    ]);
    tankModel.getTanksBySession.mockResolvedValue([{ id: 'T1', capacity: 2000 }]);

    const response = await request(app)
      .get('/results')
      .query({ session_id: 'test-session-id' });

    expect(response.status).toBe(200);
    expect(response.body.allocations).toHaveLength(1);
    expect(response.body.summary.totalLoaded).toBe(1000);
  });

  it('GET /results before /optimize is called -> 200 with empty allocations', async () => {
    allocationModel.getAllocationsBySession.mockResolvedValue([]);
    tankModel.getTanksBySession.mockResolvedValue([{ id: 'T1', capacity: 2000 }]);

    const response = await request(app)
      .get('/results')
      .query({ session_id: 'test-session-id' });

    expect(response.status).toBe(200);
    expect(response.body.allocations).toEqual([]);
    expect(response.body.summary.totalLoaded).toBe(0);
  });

  it('Full flow: input -> optimize -> results in sequence (using mocks)', async () => {
    // 1. Input
    cargoModel.insertCargos.mockResolvedValue([]);
    tankModel.insertTanks.mockResolvedValue([]);
    const inputRes = await request(app).post('/input').send({
      cargos: [{ id: 'C1', volume: 500 }],
      tanks: [{ id: 'T1', capacity: 1000 }]
    });
    const sessionId = inputRes.body.session_id;

    // 2. Optimize
    cargoModel.getCargosBySession.mockResolvedValue([{ id: 'C1', volume: 500 }]);
    tankModel.getTanksBySession.mockResolvedValue([{ id: 'T1', capacity: 1000 }]);
    allocationModel.insertAllocations.mockResolvedValue([]);
    const optimizeRes = await request(app).post('/optimize').send({ session_id: sessionId });
    expect(optimizeRes.status).toBe(200);

    // 3. Results
    allocationModel.getAllocationsBySession.mockResolvedValue([
      { tank_id: 'T1', cargo_id: 'C1', allocated_volume: 500, status: 'partial_tank' }
    ]);
    const resultsRes = await request(app).get(`/results?session_id=${sessionId}`);
    expect(resultsRes.status).toBe(200);
    expect(resultsRes.body.allocations).toHaveLength(1);
  });
});
