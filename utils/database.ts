import { Sequelize } from "sequelize";
import pg from "pg";

const sequelize = new Sequelize({
  dialect: "postgres",
  dialectModule: pg,
  host: "localhost",
  username: "postgres",
  password: "9513572680",
  database: "test",
  logging: false,
  port: 5432,
});

const connectDB = async () => {
  try {
    // Test the connection to the database
    await sequelize.authenticate();
    console.log("Database connected... from DB");

    // Sync the database schema with the models
    await sequelize.sync({ alter: true });
    console.log("Database synced... from DB");
  } catch (err) {
    // Log the error message
    console.error("Error connecting to the database:");
  }
};

export { sequelize, connectDB };
