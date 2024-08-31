const { DataTypes } = require("sequelize");

async function up(queryInterface, Sequelize) {
  // Create schema if it doesn't exist
  await queryInterface.sequelize.query('CREATE SCHEMA IF NOT EXISTS "User"');
  await queryInterface.sequelize.query('SET search_path TO "User"');
  await queryInterface.sequelize.query(`
    CREATE TABLE IF NOT EXISTS "SequelizeMeta" (
      "name" VARCHAR(255) UNIQUE NOT NULL
    );
  `);
  // Create the Users table within the specified schema
  await queryInterface.createTable("Users", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    username: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
    },
  });
}

async function down(queryInterface, Sequelize) {
  await queryInterface.sequelize.query('SET search_path TO "User"');
  // Drop the table from the specified schema using raw query
  await queryInterface.sequelize.query('DROP TABLE IF EXISTS "User"."Users"');
}

module.exports = { up, down };
