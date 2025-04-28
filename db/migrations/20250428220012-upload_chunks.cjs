"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("upload-chunk", {
      id: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false,
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
      chunk_index: {
        type: Sequelize.INTEGER,
        allowNull: false,
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
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: false,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("upload-chunk");
  },
};
