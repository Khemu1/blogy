import { DataTypes, Model } from "sequelize";
import { sequelize } from "../utils/database";
import initializeUserModel from "./user";

export class Blog extends Model {
  public id!: number;
  public userId!: number;
  public author!: string;
  public title!: string;
  public content!: string;
}

const schemaName = "Blog";

const initializeBlogModel = async () => {
  try {
    // Initialize User model for relationships
    const User = await initializeUserModel();

    // Define the Blog model
    Blog.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        userId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        author: {
          type: DataTypes.STRING,
          allowNull: true,
          defaultValue: "Unknown", // Corrected typo from "Unkown"
        },
        title: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        content: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        createdAt: {
          type: DataTypes.DATE,
          defaultValue: DataTypes.NOW,
        },
        updatedAt: {
          type: DataTypes.DATE,
          defaultValue: DataTypes.NOW,
        },
      },
      {
        sequelize,
        schema: schemaName,
        tableName: "Blogs",
        timestamps: true,
        indexes: [
          {
            fields: ["userId"],
          },
          {
            fields: ["createdAt"],
          },
        ],
      }
    );

    // Define the relationship
    Blog.belongsTo(User, {
      foreignKey: "userId",
      targetKey: "id",
    });

    // Synchronize the model with the database
    await sequelize.sync(); // Use { force: true } if you want to drop tables and recreate them

    // Reset search path to default (optional)
    await sequelize.query('SET search_path TO "$user", public');
  } catch (error) {
    console.error("Failed to initialize Blog model:", error);
  }

  return Blog;
};

export default initializeBlogModel;
