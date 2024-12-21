import { Sequelize } from "sequelize";
import Config from "./config.mjs";
import dotenv from "dotenv";
import path from "path";
import pg from "pg";

const envPath = path.join(process.cwd(), "..", ".env");
dotenv.config({ path: envPath });

const mode = process.env.NODE_ENV;
const dbConfig = Config[mode];
const sequelize = new Sequelize(
  dbConfig.database as string,
  dbConfig.username as string,
  dbConfig.password as string,
  {
    host: dbConfig.host!,
    port: parseInt(process.env.DB_PORT!, 10),
    dialect: "postgres",
    dialectModule: pg,
    logging: false,
    pool: {
      max: 10, // Maximum number of connections in the pool
      min: 0, // Minimum number of connections in the pool
      acquire: 30000, // Maximum time (in milliseconds) to wait for a connection
      idle: 10000, // Maximum time (in milliseconds) that a connection can be idle before being released
    },
  }
);

export default sequelize;
