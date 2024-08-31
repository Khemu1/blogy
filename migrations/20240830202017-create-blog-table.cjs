const { DataTypes } = require("sequelize");

async function up(queryInterface, Sequelize) {
  // Create schema if it does not exist
  await queryInterface.sequelize.query('CREATE SCHEMA IF NOT EXISTS "Blog"');

  await queryInterface.sequelize.query('SET search_path TO "Blog"');
  await queryInterface.sequelize.query(`
    CREATE TABLE IF NOT EXISTS "SequelizeMeta" (
      "name" VARCHAR(255) UNIQUE NOT NULL
    );
  `);
  // Create Blogs table in the Blog schema
  await queryInterface.createTable("Blogs", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    userId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: {
          tableName: "Users",
          schema: "User", // Assuming the Users table is in the "User" schema
        },
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    author: {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: "Unknown",
    },
    title: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    content: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    createdAt: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
    },
    updatedAt: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
    },
  });
}

async function down(queryInterface, Sequelize) {
  // Drop the Blogs table from the Blog schema
  await queryInterface.sequelize.query('DROP TABLE IF EXISTS "Blog"."Blogs"');
}

module.exports = { up, down };
