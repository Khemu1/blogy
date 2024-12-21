import { UserRoleModel } from "@/types";
import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "@/config/db";
import User from "./User";
import Role from "./Role";

interface UserRolesCreationAttributes
  extends Optional<UserRoleModel, "createdAt" | "updatedAt" | "id"> {}

class UserRole extends Model<UserRoleModel, UserRolesCreationAttributes> {
  declare readonly id: number;
  declare readonly userId: number;
  declare readonly roleId: number;
  declare createdAt: Date;
  declare updatedAt: Date;

  // Associations
  static associate() {
    UserRole.belongsTo(User, { foreignKey: "userId" });
    UserRole.belongsTo(Role, { foreignKey: "roleId" });
  }
}

UserRole.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
      unique: true,
    },
    roleId: {
      type: DataTypes.INTEGER,
      references: {
        model: Role,
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
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
  },
  {
    timestamps: true,
    sequelize,
    tableName: "user_roles",
  }
);

export default UserRole;
