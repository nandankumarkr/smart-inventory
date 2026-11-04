import { Pool } from 'pg';

let pool: Pool | null = null;

export function getDbPool(): Pool | null {
  if (pool) return pool;

  const connectionString = process.env.DATABASE_URL || 
    `postgresql://${process.env.PGUSER || 'postgres'}:${process.env.PGPASSWORD || 'postgres'}@${process.env.PGHOST || 'localhost'}:${process.env.PGPORT || '5432'}/${process.env.PGDATABASE || 'smart_inventory'}`;

  try {
    pool = new Pool({
      connectionString,
      connectionTimeoutMillis: 2000,
      idleTimeoutMillis: 10000,
      max: 10
    });

    pool.on('error', (err) => {
      console.warn('PostgreSQL Pool background error:', err.message);
    });

    return pool;
  } catch (err) {
    console.warn('Could not initialize PostgreSQL pool:', err);
    return null;
  }
}

/**
 * Executes a SQL query against PostgreSQL with automatic fallback
 */
export async function queryDb<T = any>(text: string, params: any[] = []): Promise<{ rows: T[]; isLiveDb: boolean }> {
  const dbPool = getDbPool();
  if (!dbPool) {
    return { rows: [], isLiveDb: false };
  }

  try {
    const client = await dbPool.connect();
    try {
      const res = await client.query(text, params);
      return { rows: res.rows, isLiveDb: true };
    } finally {
      client.release();
    }
  } catch (err: any) {
    console.warn(`[Live PostgreSQL Notice] Query execution fallback (PostgreSQL offline or connecting): ${err.message}`);
    return { rows: [], isLiveDb: false };
  }
}
