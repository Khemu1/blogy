import { DataTypes, Model, ModelStatic } from "sequelize";
import { sequelize } from "../utils/database";

const schemaName = "User";

const createSchemaIfNotExists = async (schema: string) => {
  try {
    await sequelize.query(`CREATE SCHEMA IF NOT EXISTS "${schema}"`);
    console.log(`Schema ${schema} ensured.`);
  } catch (error) {
    console.error(`Failed to create or check schema ${schema}:`, error);
  }
};

class User extends Model {
  public name!: string;
  public email!: string;
}

const initializeUserModel = async () => {
  await createSchemaIfNotExists(schemaName);

  User.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
    },
    {
      sequelize,
      schema: schemaName,
      timestamps: false,
    }
  );

  try {
    await sequelize.sync({ alter: true });
    console.log("Database synced... from user");
  } catch (error) {
    console.error("Failed to sync the database from User:", error);
  }

  return User as ModelStatic<User>;
};

export const getUserModel = async () => {
  return await initializeUserModel();
};
