"use strict";

const { DataTypes } = require("sequelize");

module.exports = {
  async up(queryInterface) {
    const ROLES = ["admin", "user"]; // Enum values should be an array of strings
    await queryInterface.createTable("roles", {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.ENUM(...ROLES),
        allowNull: false,
        // unique: true,
        // can't be unique and have a default value
        defaultValue: "user",
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
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("roles");
  },
};
