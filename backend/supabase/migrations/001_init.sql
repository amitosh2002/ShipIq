-- Cargos input
CREATE TABLE cargos (
  id TEXT,
  volume NUMERIC NOT NULL,
  session_id UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (session_id, id)
);

-- Tanks input
CREATE TABLE tanks (
  id TEXT,
  capacity NUMERIC NOT NULL,
  session_id UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (session_id, id)
);

-- Allocation results
CREATE TABLE allocations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL,
  tank_id TEXT NOT NULL,
  cargo_id TEXT NOT NULL,
  allocated_volume NUMERIC NOT NULL,
  status TEXT CHECK (status IN ('full_cargo', 'partial_tank', 'split')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
