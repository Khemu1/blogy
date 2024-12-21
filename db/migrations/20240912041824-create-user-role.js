"use strict";
const { DataTypes } = require("sequelize");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.addColumn("user", "roleId", {
      type: DataTypes.INTEGER,
      references: {
        model: "roles",
        key: "id",
      },
      unique: false,
      allowNull: false,
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn("user", "roleId");
  },
};
