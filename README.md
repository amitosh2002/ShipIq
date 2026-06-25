# ShipIQ — Cargo Optimization Service

A **production-ready cargo-to-tank allocation service** for maritime logistics, built with Node.js (Express) and Supabase. It maximizes total loaded cargo volume across vessel tanks using a greedy algorithm.

---

## Approach

### Problem Analysis
The assignment asks us to allocate **cargos** (with volume) into **tanks** (with capacity), maximizing total loaded volume. Key constraints:
1. A cargo **can be split** across multiple tanks.
2. Each tank can hold **only one cargo ID** (but a partial volume of it).
3. Maximize total loaded cargo volume.

### Why Greedy?
In classic bin-packing where items **cannot** be split, finding an optimal solution is NP-hard. However, because this problem **allows splitting**, it becomes a simple assignment problem. A greedy strategy — filling the largest tanks with the largest available cargos — is **provably optimal** in O(N·M) time (N tanks, M cargos), dominated by sorting at O(N log N).

There is no benefit to using Linear Programming or more complex optimization techniques here; they would add complexity without improving the result.

### Algorithm Steps
1. Sort tanks descending by capacity.
2. Sort cargos descending by volume.
3. Track remaining volume per cargo in a Map.
4. For each tank, pick the cargo with the largest remaining volume and allocate `min(tank.capacity, cargo.remaining)`.
5. Classify each allocation as `full_cargo`, `partial_tank`, or `split`.

---

## Assumptions

- Cargo IDs and Tank IDs are unique within a single request.
- Volumes and capacities are non-negative numbers.
- The service is stateless — all data is persisted in Supabase for horizontal scalability.
- Session-based isolation (UUID per request) is used instead of user authentication for simplicity.

---

## Trade-offs

| Decision | Chosen | Alternative | Reasoning |
|---|---|---|---|
| Algorithm | Greedy | LP / ILP | Splitting makes greedy optimal. LP is overkill. |
| Database | Supabase (cloud) | Local PostgreSQL | Zero infra setup, free tier, instant REST API. |
| Persistence | DB per session | In-memory | Enables stateless horizontal scaling and audit trail. |
| Auth | Anonymous session_id | JWT / OAuth | Lowers friction for API usage; session isolation is sufficient. |

---

## Project Structure

```
shipIq/
├── backend/
│   ├── src/
│   │   ├── config/supabase.js         # Supabase client init
│   │   ├── models/                    # DB access (cargo, tank, allocation)
│   │   ├── services/optimizer.service.js  # Pure greedy algorithm
│   │   ├── controllers/              # Request handlers
│   │   ├── routes/index.js            # Express router
│   │   └── app.js                     # Express app setup
│   ├── tests/
│   │   ├── unit/optimizer.test.js     # 15+ pure function tests
│   │   └── integration/api.test.js    # 7 Supertest API tests
│   ├── supabase/migrations/001_init.sql
│   ├── Dockerfile
│   ├── docker-compose.yml
│   └── .env.example
├── frontend/                          # React + Vite UI
│   ├── src/
│   │   ├── pages/ManualInputPage.jsx  # Manual cargo/tank entry
│   │   ├── pages/CsvTestPage.jsx      # CSV upload & test runner
│   │   └── App.jsx                    # Router shell
└── README.md
```

---

## API Endpoints

### `GET /health`
Health check for monitoring.
```bash
curl http://localhost:3000/health
# {"status":"ok","uptime":123.45}
```

### `POST /input`
Accept cargo and tank data, returns a session ID.
```bash
curl -X POST http://localhost:3000/input \
  -H "Content-Type: application/json" \
  -d '{
    "cargos": [
      {"id": "C1", "volume": 1234},
      {"id": "C2", "volume": 4352}
    ],
    "tanks": [
      {"id": "T1", "capacity": 5000},
      {"id": "T2", "capacity": 3000}
    ]
  }'
# {"session_id":"uuid","message":"Input stored successfully","cargoCount":2,"tankCount":2}
```

### `POST /optimize`
Run the allocation algorithm for a session.
```bash
curl -X POST http://localhost:3000/optimize \
  -H "Content-Type: application/json" \
  -d '{"session_id": "uuid-from-input"}'
# {"session_id":"...","totalLoaded":7234,"totalCapacity":8000,"utilizationPercent":90.43,"allocationCount":2}
```

### `GET /results?session_id=<uuid>`
Fetch full allocation breakdown.
```bash
curl http://localhost:3000/results?session_id=uuid-from-input
# {"session_id":"...","summary":{...},"allocations":[...]}
```

---

## Setup & Run Instructions

### Prerequisites
- Node.js 20+
- A [Supabase](https://supabase.com) project (free tier works)

### 1. Supabase Setup
1. Create a new project on Supabase.
2. Go to **SQL Editor** and run the migration at `backend/supabase/migrations/001_init.sql`.
3. Copy your **Project URL** and **service_role** key from **Settings → API**.

### 2. Environment Variables
```bash
cd backend
cp .env.example .env
```
Fill in:
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
PORT=3000
NODE_ENV=development
```

### 3. Run Locally (Node)
```bash
cd backend
npm install
npm run dev        # Starts on http://localhost:3000
```

### 4. Run Locally (Docker)
```bash
cd backend
docker-compose up --build
```

### 5. Run Frontend (Optional UI)
```bash
cd frontend
npm install
npm run dev        # Starts on http://localhost:5173
```

### 6. Run Tests
```bash
cd backend
npm test
```

---

## Testing

### Unit Tests (15+ cases)
Pure function tests for the greedy optimizer covering:
- **Assignment dataset** — the exact 10 cargo / 10 tank data from the problem statement → 100% utilization
- Perfect fit, partial load, split across multiple tanks
- Edge cases: empty arrays, null inputs, zero volume/capacity, string numerics from DB
- Maximization verification

### Integration Tests (7 cases)
Supertest against the Express app with mocked Supabase:
- Valid and invalid `POST /input`
- Valid and unknown session `POST /optimize`
- `GET /results` before and after optimization
- Full end-to-end flow: input → optimize → results

---

## Features

- **Rate Limiting** — 100 requests per 15 minutes per IP
- **Request Logging** — logs method, path, status code, and duration for every request
- **Input Validation** — validates types, non-empty IDs, non-negative numbers, and duplicate IDs
- **Health Check** — `GET /health` for container orchestration
- **CORS** enabled for frontend communication
- **Session Isolation** — UUID-based, no data collisions between runs
- **Frontend UI** — React app with manual input and CSV bulk upload pages
