const { DataTypes } = require("sequelize");

async function up(queryInterface, Sequelize) {
  // Create schema if it doesn't exist
  await queryInterface.sequelize.query('SET search_path TO "Comment"');
  await queryInterface.sequelize.query('CREATE SCHEMA IF NOT EXISTS "Comment"');

  // Ensure the SequelizeMeta table exists in the default schema
    await queryInterface.sequelize.query(`
    CREATE TABLE IF NOT EXISTS "SequelizeMeta" (
      "name" VARCHAR(255) UNIQUE NOT NULL
    );
  `);

  // Create table in the specified schema
  await queryInterface.createTable("Comments", {
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
          tableName: "Users", // The name of the table without schema
          schema: "User", // Specify the schema if the referenced table is in a schema
        },
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    blogId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: {
          tableName: "Blogs", // The name of the table without schema
          schema: "Blog", // Specify the schema if the referenced table is in a schema
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
  await queryInterface.sequelize.query('SET search_path TO "Comment"');
  // Drop the table from the specified schema
  await queryInterface.dropTable("Comments");
}

module.exports = { up, down };
