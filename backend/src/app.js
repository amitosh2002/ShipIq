import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import routes from './routes/index.js';

dotenv.config();

const app = express();

// ── Middleware ──────────────────────────────────────────────────────

// CORS
app.use(cors());

// Rate limiting — 100 requests per 15 minutes per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: true,
    message: 'Too many requests, please try again later.',
    code: 429
  }
});
app.use(limiter);

// JSON body parser
app.use(express.json({ limit: '1mb' }));

// Request logger
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`);
  });
  next();
});

// ── Routes ─────────────────────────────────────────────────────────

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

app.use('/', routes);

// ── Error handlers ─────────────────────────────────────────────────

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({
    error: true,
    message: 'Endpoint not found',
    code: 404
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: true,
    message: 'Internal server error',
    code: 500
  });
});

// ── Server ─────────────────────────────────────────────────────────

const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`ShipIQ API is running on port ${PORT}`);
  });
}

export default app;
