"use strict";

const { DataTypes } = require("sequelize");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      "upload",
      {
        id: {
          type: Sequelize.STRING,
          primaryKey: true,
          allowNull: false,
        },
        fileName: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        fileSize: {
          type: Sequelize.BIGINT,
          allowNull: false,
        },
        mimeType: {
          type: Sequelize.STRING,
          allowNull: false,
          defaultValue: false,
        },
        isCompleted: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
        isCanceled: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
        userId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: "user",
            key: "id",
          },
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
        },
        blogId: {
          type: Sequelize.INTEGER,
          allowNull: true,
          references: {
            model: "blog",
            key: "id",
          },
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
        },
        createdAt: {
          type: DataTypes.DATE,
          defaultValue: DataTypes.NOW,
          allowNull: false,
        },
        updatedAt: {
          type: DataTypes.DATE,
          defaultValue: DataTypes.NOW,
          allowNull: false,
        },
      },
      {
        indexes: [
          {
            fields: ["userId", "blogId"],
          },
        ],
      }
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("upload");
  },
};
