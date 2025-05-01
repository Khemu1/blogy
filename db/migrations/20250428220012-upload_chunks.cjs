"use strict";
const { DataTypes } = require("sequelize");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      "upload-chunk",
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        upload_id: {
          type: Sequelize.STRING,
          allowNull: false,
          references: {
            model: "upload",
            key: "id",
          },
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
        },

        chunk_length: {
          type: Sequelize.BIGINT,
          allowNull: false,
        },
        offset: {
          type: Sequelize.BIGINT,
          allowNull: false,
        },
        created_at: {
          type: DataTypes.DATE,
          defaultValue: DataTypes.NOW,
          allowNull: false,
        },
      },
      {
        indexes: [
          {
            fields: ["upload_id"],
          },
        ],
      }
    );
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("upload-chunk");
  },
};
