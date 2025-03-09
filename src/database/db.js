import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "investments_db",
  password: "postgres",
  port: 5432,
});

//Funcion para ejecutar las consultas
const query = (text, params) => pool.query(text, params);
export { pool, query };
