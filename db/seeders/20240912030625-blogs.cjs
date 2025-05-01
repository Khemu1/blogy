"use strict";

module.exports = {
  async up(queryInterface) {
    // Fetch user IDs
    const [users] = await queryInterface.sequelize.query(
      `SELECT id FROM "user";`
    );
    const userIds = users.map((user) => user.id);

    // Categories and sample content templates
    const categories = [
      "Technology",
      "Travel",
      "Food",
      "Health",
      "Business",
      "Lifestyle",
      "Education",
    ];

    const sampleContents = [
      `# The Future of {CATEGORY}\n\nIn recent years, we've seen tremendous growth in the {CATEGORY} sector.\n\n## Key Trends\n- **Trend 1**: Explanation of first trend\n- **Trend 2**: Analysis of second development\n\n> "The only way to predict the future is to create it." - Peter Drucker\n\n### Final Thoughts\nWhat does this mean for professionals in this field?`,

      `# My {CATEGORY} Journey\n\nWhen I first started exploring {CATEGORY}, I never imagined...\n\n## Lessons Learned\n1. **Lesson One**: Detailed experience\n2. **Lesson Two**: Personal insight\n\n![Sample Image](https://example.com/image.jpg)\n\nWould you like to share your own experiences?`,

      `# 10 Tips for Better {CATEGORY}\n\nAfter years of working with {CATEGORY}, I've compiled these essential tips:\n\n1. **Tip One**: Detailed explanation\n2. **Tip Two**: Practical example\n\n\`\`\`javascript\n// Sample code if relevant\nfunction example() {\n  return "Hello World";\n}\n\`\`\``,

      `# Why {CATEGORY} Matters More Than Ever\n\nIn today's world, {CATEGORY} has become...\n\n## The Data\n| Metric | 2020 | 2023 |\n|--------|------|------|\n| Growth | 15%  | 32%  |\n\n### Implications\nWhat this means for...`,
    ];

    const blogs = [];
    const now = new Date();

    userIds.forEach((userId) => {
      for (let i = 1; i <= 5; i++) {
        const category = getRandomElement(categories);
        const contentTemplate = getRandomElement(sampleContents);
        const content = contentTemplate.replace(/{CATEGORY}/g, category);

        const title = `Exploring the Future of ${category}`;

        blogs.push({
          userId,
          title: title,
          content: content,
          createdAt: now,
          updatedAt: now,
        });
      }
    });

    await queryInterface.bulkInsert("blog", blogs, {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("blog", null, {});
  },
};

function getRandomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
