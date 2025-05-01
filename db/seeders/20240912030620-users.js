"use strict";

const bcrypt = require("bcrypt");
const { faker } = require("@faker-js/faker"); // Correct import

module.exports = {
  async up(queryInterface) {
    const users = [];
    const now = new Date();

    for (let i = 1; i <= 20; i++) {
      const username = `${faker.person.firstName()}${faker.person.lastName()}`;
      const email = faker.internet.email().toLowerCase();
      const hashedPassword = await bcrypt.hash(`Password${i}!`, 10);

      users.push({
        username,
        email,
        password: hashedPassword,
        createdAt: now,
        updatedAt: now,
      });
    }

    await queryInterface.bulkInsert("user", users, {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("user", null, {});
  },
};
