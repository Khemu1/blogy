async function up(queryInterface, Sequelize) {
  try {
    // Create schema if it does not exist
    await queryInterface.sequelize.query('CREATE SCHEMA IF NOT EXISTS "Blog"');

    // Set search path to the "Blog" schema to make sure all operations are within this schema
    await queryInterface.sequelize.query('SET search_path TO "Blog"');
    await queryInterface.sequelize.query(`
    CREATE TABLE IF NOT EXISTS "SequelizeMeta" (
      "name" VARCHAR(255) UNIQUE NOT NULL
    );
  `);
    // Create Blogs table in the "Blog" schema
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
  } catch (error) {
    console.error("Error in migration 'up':", error);
  }
}

async function down(queryInterface, Sequelize) {
  try {
    // Set search path to the "Blog" schema before dropping the table
    await queryInterface.sequelize.query('SET search_path TO "Blog"');

    // Drop the Blogs table from the "Blog" schema
    await queryInterface.dropTable("Blogs");
  } catch (error) {
    console.error("Error in migration 'down':", error);
  }
}

module.exports = { up, down };
