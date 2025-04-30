// dbInit.ts

import Blog from "@/db/models/Blog";
import sequelize from "./db";
import User from "@/db/models/User";
import Comment from "@/db/models/Comment";
import Upload from "@/db/models/Upload";
import UploadChunk from "@/db/models/UploadChunk";

let initialized = false;

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connection established.");
  } catch (error) {
    console.error("❌ Unable to connect to the database:", error);
    throw error;
  }
}

async function syncModels() {
  try {
    await sequelize.sync();
    console.log("✅ Models synchronized.");
  } catch (error) {
    console.error("❌ Error synchronizing models:", error);
    throw error;
  }
}

async function initializeDatabase() {
  if (initialized) {
    return;
  }

  await testConnection();

  User.associate();
  Blog.associate();
  Comment.associate();
  Upload.associate();
  UploadChunk.associate();

  await syncModels();

  initialized = true;
}

export { initializeDatabase };
