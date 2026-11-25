import mysql from 'mysql2/promise';
import fs from 'node:fs';
import { DB } from './config.js';

export const pool = mysql.createPool({ ...DB, charset: 'utf8mb4', connectionLimit: 5 });

/** Cria o banco, as tabelas e carrega o seed (idempotente: IF NOT EXISTS + INSERT IGNORE). */
export async function setup() {
  const { database, ...conf } = DB;
  const conn = await mysql.createConnection({ ...conf, charset: 'utf8mb4', multipleStatements: true });
  await conn.query(`CREATE DATABASE IF NOT EXISTS \`${database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci`);
  await conn.changeUser({ database });
  for (const f of ['schema.sql', 'seed.sql'])
    await conn.query(fs.readFileSync(new URL(`../db/${f}`, import.meta.url), 'utf8'));
  await conn.end();
}
