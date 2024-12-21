"use strict";

const { DataTypes } = require("sequelize");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.createTable(
      "comment",
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        userId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: "user",
            key: "id",
          },
          onDelete: "CASCADE",
          onUpdate: "CASCADE",
          validate: {
            notNull: {
              msg: "UserId is required",
            },
          },
        },
        blogId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: "blog",
            key: "id",
          },
          onDelete: "CASCADE",
          onUpdate: "CASCADE",
          validate: {
            notNull: {
              msg: "UserId is required",
            },
          },
        },
        content: {
          type: DataTypes.TEXT,
          allowNull: false,
          validate: {
            notEmpty: {
              msg: "Content is required",
            },
            notNull: {
              msg: "Content can't be null",
            },
          },
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
        deletedAt: {
          type: DataTypes.DATE,
          allowNull: true,
        },
      },
      {
        indexes: [
          {
            fields: ["createdAt", "deletedAt", "updatedAt"],
          },
        ],
      }
    );
  },

  async down(queryInterface) {
    await queryInterface.dropTable("comment");
  },
};
