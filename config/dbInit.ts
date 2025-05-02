import { setupAssociations } from "@/db/associations";
import sequelize from "./db";

let initialized = false;

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log(" Database connection established.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    throw error;
  }
}

async function syncModels() {
  try {
    await sequelize.sync();
    console.log("Models synchronized.");
  } catch (error) {
    console.error("Error synchronizing models:", error);
    throw error;
  }
}

async function initializeDatabase() {
  if (initialized) {
    console.log("Database already initialized.");
    return;
  }

  await testConnection();

  setupAssociations();

  await syncModels();
  console.log(" Database is up and ready");
  initialized = true;
}

async function closeConnection() {
  await sequelize.close();
  initialized = false;
}

export { initializeDatabase, closeConnection };
