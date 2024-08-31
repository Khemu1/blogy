import { Sequelize } from "sequelize";
import pg from "pg";

const sequelize = new Sequelize({
  dialect: "postgres",
  dialectModule: pg,
  host: "localhost",
  username: "postgres",
  password: "9513572680",
  database: "Blogy",
  logging: console.log,
  port: 5432,
  pool: {
    max: 5, // Maximum number of connection in pool
    min: 0, // Minimum number of connection in pool
    acquire: 30000, // Maximum time, in milliseconds, that pool will try to get connection before throwing error
    idle: 10000, // Maximum time, in milliseconds, that a connection can be idle before being released
  },
});

const connectDB = async () => {
  try {
    // Test the connection to the database
    await sequelize.authenticate();
    console.log("Database connected... from DB");

    // Sync the database schema with the models
    await sequelize.sync();
    console.log("Database synced... from DB");
  } catch (err) {
    // Log the error message
    console.error("Error connecting to the database:");
  }
};

export { sequelize, connectDB };
