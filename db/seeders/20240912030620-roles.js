"use strict";

module.exports = {
  async up(queryInterface) {
    const roles = [
      { name: "admin", createdAt: new Date(), updatedAt: new Date() },
      { name: "user", createdAt: new Date(), updatedAt: new Date() },
    ];

    await queryInterface.bulkInsert("roles", roles, {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("roles", null, {});
  },
};
