// import fs from "fs";
// import path from "path";
// import { Sequelize, DataTypes, Model } from "sequelize";
// import config from "../config/config.json"; // Adjust path if needed

// const basename = path.basename(__filename);
// const env = process.env.NODE_ENV || "development";
// const dbConfig = config[env];
// const sequelize = new Sequelize(
//   dbConfig.database,
//   dbConfig.username,
//   dbConfig.password,
//   dbConfig
// );

// interface DB {
//   [key: string]: typeof Model;
//   sequelize: Sequelize;
//   Sequelize: typeof Sequelize;
// }

// const db: DB = { sequelize, Sequelize };

// // Read all model files in the directory
// fs.readdirSync(__dirname)
//   .filter((file) => {
//     return (
//       file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".ts"
//     );
//   })
//   .forEach((file) => {
//     const model = require(path.join(__dirname, file)).default(
//       sequelize,
//       DataTypes
//     );
//     db[model.name] = model;
//   });

// // Setup model associations
// Object.keys(db).forEach((modelName) => {
//   if (db[modelName].associate) {
//     db[modelName].associate(db);
//   }
// });

// export { sequelize, Sequelize };
// export default db;
