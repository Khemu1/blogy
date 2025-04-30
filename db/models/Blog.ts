import sequelize from "@/config/db";
import { DataTypes, Model, Optional } from "sequelize";
import Comment from "./Comment";
import User from "./User";
import { BlogModel } from "@/app/types";
import Upload from "./Upload";

interface BlogCreationAttributes
  extends Optional<BlogModel, "id" | "createdAt" | "updatedAt" | "deletedAt"> {}

class Blog
  extends Model<BlogModel, BlogCreationAttributes>
  implements BlogModel
{
  declare readonly id: number;
  declare readonly userId: number;
  declare title: string;
  declare content: string;
  declare createdAt: Date;
  declare updatedAt: Date;
  declare deletedAt: Date | null;

  static associate() {
    Blog.belongsTo(User, { foreignKey: "userId" });
    User.hasMany(Blog, { foreignKey: "userId" });
    Blog.hasMany(Comment, { foreignKey: "blogId" });
    Blog.hasOne(Upload, { foreignKey: "blogId", as: "image" });
    Upload.belongsTo(Blog, { foreignKey: "blogId", as: "image" });
  }
}

Blog.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
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
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Title is required",
        },
        notNull: {
          msg: "Title can't be null",
        },
      },
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Content is required",
        },
        notNull: {
          msg: "Content can't be null",
        },
      },
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "blog",
    freezeTableName: true,
  }
);

export default Blog;
