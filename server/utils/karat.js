import 'dotenv/config.js';
import sql from 'mssql';

const config = {
  server: process.env.MSSQL_DATABASE_SERVER,
  port: 1433,
  user: process.env.MSSQL_DATABASE_USER,
  password: process.env.MSSQL_DATABASE_PASSWORD,
  database: process.env.MSSQL_DATABASE_NAME_KARAT,
  connectionTimeout: 30000,
  driver: 'tedious',
  stream: false,
  options: {
    appName: 'Intranet',
    encrypt: true,
    trustServerCertificate: true,
  },
};

export const pool = new sql.ConnectionPool(config)
  .connect()
  .then((pool) => {
    console.log('Connected to KARAT MSSQL');
    return pool;
  })
  .catch((err) => console.log('KARAT MSSQL database connection failed!'));

export default sql;
