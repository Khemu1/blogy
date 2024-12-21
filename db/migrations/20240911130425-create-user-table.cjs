"use strict";

const { DataTypes } = require("sequelize");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.createTable(
      "user",
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        username: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
          validate: {
            notEmpty: {
              msg: "Username is required",
            },
            len: {
              args: [3, 255],
              msg: "Username must be between 3 and 255 characters",
            },
          },
        },
        email: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
          validate: {
            isEmail: {
              msg: "Please enter a valid email address",
            },
          },
        },
        password: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
            notEmpty: {
              msg: "Password is required",
            },
            len: {
              args: [8, 100],
              msg: "Password must be between 8 and 100 characters",
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
            unique: true,
            fields: ["email"],
          },
          {
            unique: true,
            fields: ["username"],
          },
          {
            fields: ["createdAt", "deletedAt", "updatedAt"],
          },
        ],
      }
    );
  },

  async down(queryInterface) {
    await queryInterface.dropTable("user");
  },
};
