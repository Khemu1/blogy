import { DataTypes, Model,ForeignKey } from "sequelize";
import { sequelize } from "../utils/database";
class Blog extends Model {
  public title!: string;
  public body!: number;
}

const schemaName = "Blog";

const createSchemaIfNotExists = async (schema: string) => {
  try {
    await sequelize.query(`CREATE SCHEMA IF NOT EXISTS "${schema}"`);
    console.log(`Schema ${schema} ensured.`);
  } catch (error) {
    console.error(`Failed to create or check schema ${schema}:`, error);
  }
};

const initializeBlogModel = async () => {
  await createSchemaIfNotExists(schemaName);

  Blog.init(
    {
      userId: {
        type: ForeignKey("user"),
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      body: {
        type: DataTypes.FLOAT,
        allowNull: false,
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
    console.log("Database synced... from Blog");
  } catch (err) {
    console.error("Error syncing the database from Blog:", err);
  }

  return Blog;
};

export const getProductModel = async () => {
  return await initializeBlogModel();
};
