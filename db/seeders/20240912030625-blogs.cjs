"use strict";

module.exports = {
  async up(queryInterface) {
    const [users] = await queryInterface.sequelize.query(
      `SELECT id FROM "user";`
    );
    const userIds = users.map((user) => user.id);

    const categoryTemplates = {
      Technology: [
        "The Future of {FRAMEWORK} Development",
        "Why {FRAMEWORK} is Changing Web Development",
        "{FRAMEWORK} vs {OTHER_FRAMEWORK}: A Comprehensive Comparison",
        "5 Hidden Features in {FRAMEWORK} You Should Know",
        "Migrating from {FRAMEWORK} to {OTHER_FRAMEWORK}: Lessons Learned",
      ],
      Travel: [
        "Hidden Gems in {DESTINATION} Most Tourists Miss",
        "The Ultimate {DESTINATION} Travel Guide on a Budget",
        "How I Spent 30 Days in {DESTINATION} for Under ${BUDGET}",
        "{DESTINATION}'s Best Kept Culinary Secrets",
        "Off-the-Beaten-Path Adventures in {DESTINATION}",
      ],
      Food: [
        "The Science Behind Perfect {DISH}",
        "How to Master {CUISINE} Cooking at Home",
        "10 Minute {DISH} Recipe That Tastes Like You Spent Hours",
        "The History of {INGREDIENT} and How It Changed Cooking",
        "Vegan Alternatives for Classic {DISH} That Actually Taste Good",
      ],
      Health: [
        "The Truth About {TREND} and Your Health",
        "How {ACTIVITY} Changed My Mental Health",
        "Debunking 5 Common Myths About {TOPIC}",
        "The {NUMBER}-Minute Daily Routine That Transformed My Health",
        "What Doctors Won't Tell You About {CONDITION}",
      ],
      Business: [
        "How {COMPANY} Revolutionized the {INDUSTRY} Industry",
        "The {NUMBER} Most Common Mistakes New Entrepreneurs Make",
        "Why {TREND} is Disrupting Traditional Business Models",
        "From ${START} to ${END}: My {TIMEFRAME} Business Journey",
        "The Psychology Behind Successful {INDUSTRY} Marketing",
      ],
      Lifestyle: [
        "Minimalism: How Living With Less Gave Me More",
        "The {NUMBER}-Item Capsule Wardrobe That Works For Everything",
        "Digital Detox: What Happened When I Quit {PLATFORM} For {TIMEFRAME}",
        "The Art of {ACTIVITY}: Finding Joy in Simple Things",
        "How I Organized My Entire Life Using Just {NUMBER} Tools",
      ],
      Education: [
        "Why Traditional {SUBJECT} Education is Failing Students",
        "How to Learn {SKILL} in Just {TIMEFRAME}",
        "The Future of {SUBJECT} Learning: {TREND} Explained",
        "{NUMBER} Free Resources to Master {TOPIC} This Year",
        "What {FAMOUS_PERSON} Can Teach Us About Learning",
      ],
    };

    const contentTemplates = [
      `# {TITLE}\n\n## Introduction\n{INTRODUCTION}\n\n### Key Points\n- **Point 1**: {POINT_1}\n- **Point 2**: {POINT_2}\n\n> "{QUOTE}" - {AUTHOR}\n\n## Conclusion\n{CONCLUSION}`,

      `# {TITLE}\n\n!\n\n## My Experience\n{EXPERIENCE}\n\n### Lessons Learned\n1. **Lesson One**: {LESSON_1}\n2. **Lesson Two**: {LESSON_2}\n\n## Final Thoughts\n{THOUGHTS}`,

      `# {TITLE}\n\n## The Problem\n{PROBLEM_DESCRIPTION}\n\n\`\`\`{LANGUAGE}\n{SAMPLE_CODE}\n\`\`\`\n\n### Solution Approach\n{SOLUTION}\n\n## Results\n| Metric | Before | After |\n|--------|--------|-------|\n| {METRIC_1} | {BEFORE_1} | {AFTER_1} |`,

      `# {TITLE}\n\n## Why This Matters\n{CONTEXT}\n\n### Step-by-Step Guide\n1. **Step 1**: {STEP_1}\n2. **Step 2**: {STEP_2}\n3. **Step 3**: {STEP_3}\n\n> "Pro Tip: {TIP}"\n\n## Common Mistakes to Avoid\n{MISTAKES}`,
    ];

    const replacementValues = {
      FRAMEWORK: ["React", "Vue", "Angular", "Svelte", "SolidJS"],
      OTHER_FRAMEWORK: ["React", "Vue", "Angular", "Svelte", "SolidJS"],
      DESTINATION: ["Bali", "Japan", "Portugal", "Mexico", "Thailand"],
      BUDGET: ["500", "1000", "1500", "2000"],
      DISH: ["Pasta", "Sourdough", "Curry", "Steak", "Sushi"],
      CUISINE: ["Italian", "Japanese", "Mexican", "Indian", "French"],
      INGREDIENT: ["Garlic", "Saffron", "Truffle", "Soy Sauce"],
      TREND: ["AI", "Blockchain", "VR", "Remote Work"],
      ACTIVITY: ["Yoga", "Running", "Meditation", "Journaling"],
      TOPIC: ["Keto", "Intermittent Fasting", "Sleep", "Supplements"],
      NUMBER: ["5", "7", "10", "15", "30"],
      CONDITION: ["Anxiety", "Insomnia", "Back Pain", "Digestion"],
      COMPANY: ["Apple", "Tesla", "Amazon", "Netflix"],
      INDUSTRY: ["Tech", "Finance", "Healthcare", "Retail"],
      START: ["0", "1000", "5000"],
      END: ["10000", "50000", "100000"],
      TIMEFRAME: ["30 Days", "6 Months", "1 Year"],
      PLATFORM: ["Instagram", "Twitter", "TikTok", "Facebook"],
      SUBJECT: ["Math", "Programming", "History", "Science"],
      SKILL: ["Coding", "Design", "Public Speaking", "Writing"],
      FAMOUS_PERSON: ["Einstein", "Da Vinci", "Musk", "Jobs"],
      IMAGE_KEYWORD: ["tech", "travel", "food", "health", "business"],
    };

    const blogs = [];
    const now = new Date();

    userIds.forEach((userId) => {
      Object.entries(categoryTemplates).forEach(([category, titles]) => {
        const titleTemplate = getRandomElement(titles);
        const contentTemplate = getRandomElement(contentTemplates);

        // Generate title with replacements
        let title = titleTemplate;
        Object.entries(replacementValues).forEach(([key, values]) => {
          if (title.includes(`{${key}}`)) {
            title = title.replace(`{${key}}`, getRandomElement(values));
          }
        });

        let content = contentTemplate.replace("{TITLE}", title);
        Object.entries(replacementValues).forEach(([key, values]) => {
          if (content.includes(`{${key}}`)) {
            content = content.replace(
              new RegExp(`{${key}}`, "g"),
              getRandomElement(values)
            );
          }
        });

        content = content
          .replace(
            "{INTRODUCTION}",
            getRandomElement([
              `In today's fast-paced world of ${category.toLowerCase()}, new developments are changing how we approach this field.`,
              `After spending ${getRandomElement([
                "6 months",
                "1 year",
                "3 years",
              ])} studying ${category.toLowerCase()}, I've discovered some surprising insights.`,
              `What if I told you everything you know about ${category.toLowerCase()} might be wrong?`,
            ])
          )
          .replace(
            "{CONCLUSION}",
            getRandomElement([
              `These developments in ${category.toLowerCase()} suggest we're entering a new era of possibilities.`,
              `As we've seen, ${category.toLowerCase()} continues to evolve in exciting ways.`,
              `The future of ${category.toLowerCase()} looks brighter than ever.`,
            ])
          );

        blogs.push({
          userId,
          title: title,
          content: content,
          createdAt: now,
          updatedAt: now,
        });
      });
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
