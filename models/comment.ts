import { DataTypes, Model } from "sequelize";
import { sequelize } from "../utils/database";
import initializeUserModel from "./user";
import initializeBlogModel from "./blog";

export class Comment extends Model {
  public id!: number;
  public userId!: number;
  public blogId!: number;
  public content!: string;
}

const schemaName = "Comment";

const initializeCommentModel = async () => {

  const User = await initializeUserModel(); // Import here but only use for relationships
  const Blog = await initializeBlogModel(); // Import here but only use for relationships
  try {
    Comment.init(
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
        blogId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        author: {
          type: DataTypes.STRING,
          allowNull: true,
          defaultValue: "Unknown",
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
        timestamps: true,
        tableName: "Comments",
        indexes: [
          {
            fields: ["userId"],
          },
          {
            fields: ["blogId"],
          },
          {
            fields: ["createdAt"],
          },
        ],
      }
    );

    Comment.belongsTo(User, {
      foreignKey: "userId",
    });

    Comment.belongsTo(Blog, {
      foreignKey: "blogId",
    });
    await sequelize.sync(); // Use { force: true } if you want to drop tables and recreate them
  } catch (error) {
    console.error("Failed to initialize Comment model:");
  }

  return Comment;
};

export default initializeCommentModel;
