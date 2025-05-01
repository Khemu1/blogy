"use strict";

const { faker } = require("@faker-js/faker");

module.exports = {
  async up(queryInterface) {
    const [users] = await queryInterface.sequelize.query(
      `SELECT id FROM "user"`
    );
    const [blogs] = await queryInterface.sequelize.query(
      `SELECT id, "userId" FROM "blog"`
    );
    const now = new Date();
    const comments = [];

    blogs.forEach((blog) => {
      const commentCount = faker.number.int({ min: 5, max: 10 });

      for (let i = 0; i < commentCount; i++) {
        const commenterId =
          Math.random() > 0.5
            ? blog.userId
            : users[faker.number.int({ min: 0, max: users.length - 1 })].id;

        comments.push({
          userId: commenterId,
          blogId: blog.id,
          content: generateCommentContent(commenterId === blog.userId),
          createdAt: faker.date.recent(30, now),
          updatedAt: faker.date.recent(30, now),
        });
      }
    });

    await queryInterface.bulkInsert("comment", comments, {});

    function generateCommentContent(isAuthor) {
      const commentTypes = [
        `This is ${isAuthor ? "my" : "a"} ${faker.helpers.arrayElement([
          "great",
          "interesting",
          "thought-provoking",
        ])} post! ${faker.lorem.sentences(2)}`,
        `${faker.helpers.arrayElement([
          "I agree",
          "I disagree",
          "Building on this",
        ])} because ${faker.lorem.sentence()}`,
        `${faker.lorem.paragraph()}\n\n${faker.helpers.arrayElement([
          "What do others think?",
          "Has anyone tried this?",
          "Would love to hear more!",
        ])}`,
        `${faker.helpers.arrayElement([
          "Thanks for sharing!",
          "Great perspective!",
          "Important topic.",
        ])} ${faker.lorem.sentence()}`,
        `From ${faker.helpers.arrayElement([
          "my experience",
          "what I've read",
          "industry trends",
        ])}, ${faker.lorem.sentences(2)}`,
      ];

      return faker.helpers.arrayElement(commentTypes);
    }
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("comment", null, {});
  },
};
