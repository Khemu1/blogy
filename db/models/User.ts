import bcrypt from "bcrypt";
import sequelize from "@/config/db";
import { DataTypes, Model, Optional } from "sequelize";
import Comment from "./Comment";

interface UserCreationAttributes
  extends Optional<UserModel, "id" | "createdAt" | "updatedAt" | "deletedAt"> {}

class User
  extends Model<UserModel, UserCreationAttributes>
  implements UserModel
{
  declare readonly id: number;
  declare readonly username: string;
  declare readonly email: string;
  declare readonly password: string;
  declare createdAt: Date;
  declare updatedAt: Date;
  declare deletedAt: Date | null;

  public static hashPassword(password: string): string {
    return bcrypt.hashSync(password, 10);
  }

  static associate() {
    User.hasMany(Comment, { foreignKey: "userId" });
    Comment.belongsTo(User, { foreignKey: "userId" });
  }
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: {
          msg: "Username is required",
        },
        len: {
          args: [3, 255],
          msg: "Username must be between 3 and 255 characters",
        },
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: {
          msg: "Please enter a valid email address",
        },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Password is required",
        },
        len: {
          args: [8, 100],
          msg: "Password must be between 8 and 100 characters",
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
    freezeTableName: true,
    timestamps: true,
    modelName: "user",
    paranoid: true, // This ensures soft deletes
  }
);

export default User;

export interface UserModel {
  id: number;
  username: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}
