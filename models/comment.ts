import { DataTypes, Model } from "sequelize";
import { sequelize } from "../utils/database";
import initializeUserModel from "./user";
import initializeBlogModel from "./blog";

export class Comment extends Model {
  public id!: number;
  public userId!: number;
  public blogId!: number;
  public author!: string;
  public content!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

const schemaName = "Comment";

const initializeCommentModel = async () => {
  try {
    const User = await initializeUserModel(); // Import User model
    const Blog = await initializeBlogModel(); // Import Blog model

    // Define Comment model
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
          references: {
            model: {
              tableName: "Users", // The name of the table without schema
              schema: "User", // Specify the schema if the referenced table is in a schema
            },
            key: "id",
          },
          onDelete: "CASCADE",
          onUpdate: "CASCADE",
        },
        blogId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: {
              tableName: "Blogs", // The name of the table without schema
              schema: "Blog", // Specify the schema if the referenced table is in a schema
            },
            key: "id",
          },
          onDelete: "CASCADE",
          onUpdate: "CASCADE",
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

    // Define relationships
    Comment.belongsTo(User, {
      foreignKey: "userId",
      targetKey: "id",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });

    Comment.belongsTo(Blog, {
      foreignKey: "blogId",
      targetKey: "id",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });

    // Synchronize the model with the database
    await sequelize.sync(); // Use { force: true } if you want to drop tables and recreate them
  } catch (error) {
    console.error("Failed to initialize Comment model:", error);
  }

  return Comment;
};

export default initializeCommentModel;
