import Blog from "@/db/models/Blog";
import sequelize from "./db";
import User from "@/db/models/User";
import Comment from "@/db/models/Comment"


async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}

async function syncModels() {
  try {
    /**
     * true is commonly used during development when you are actively modifying your models and want Sequelize to automatically update the database schema to match the model definitions.
It can be convenient because it automatically alters existing tables to add new columns or change column types without having to manually write SQL ALTER TABLE statements
     */
    await sequelize.sync();
    console.log("Models have been synchronized successfully.");
  } catch (error) {
    console.error("Error synchronizing models:", error);
  }
}
async function initializeDatabase() {
  await testConnection();
  /**
   * setting up assocations before syncing the models tells sequelize how to link models
   */
  User.associate();
  Blog.associate();
  Comment.associate();
  await syncModels();
}

export { initializeDatabase };
