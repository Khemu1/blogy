import sequelize from "@/config/db";
import { CommentModel } from "@/app/types";
import { DataTypes, Model, Optional } from "sequelize";
import Blog from "./Blog";

// Define which attributes are optional for creation
interface CommentCreationAttributes
  extends Optional<
    CommentModel,
    "id" | "createdAt" | "updatedAt" | "deletedAt"
  > {}

// Define the Comment model class
class Comment
  extends Model<CommentModel, CommentCreationAttributes>
  implements CommentModel
{
  declare id: number;
  declare userId: number;
  declare blogId: number;
  declare content: string;
  declare createdAt: Date;
  declare updatedAt: Date;
  declare deletedAt: Date | null;

  static associate() {
    Comment.belongsTo(Blog, { foreignKey: "blogId" });
  }

  // You can add methods specific to this model here if needed
}

// Initialize the Comment model with the schema
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
        model: "user",
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    blogId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "blog",
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Content is required",
        },
      },
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    freezeTableName: true,
    timestamps: true,
    modelName: "comment",
    paranoid: true,
  }
);

export default Comment;
