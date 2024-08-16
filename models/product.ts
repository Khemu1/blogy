import { DataTypes, Model } from "sequelize";
import { sequelize } from "../utils/database";
class Product extends Model {
  public name!: string;
  public price!: number;
}

const schemaName = "Product";

const createSchemaIfNotExists = async (schema: string) => {
  try {
    await sequelize.query(`CREATE SCHEMA IF NOT EXISTS "${schema}"`);
    console.log(`Schema ${schema} ensured.`);
  } catch (error) {
    console.error(`Failed to create or check schema ${schema}:`, error);
  }
};

const initializeProductModel = async () => {
  await createSchemaIfNotExists(schemaName);

  Product.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      price: {
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
    console.log("Database synced... from Product");
  } catch (err) {
    console.error("Error syncing the database from Product:", err);
  }

  return Product;
};

export const getProductModel = async () => {
  return await initializeProductModel();
};
