import { RoleModel, ROLES } from "@/types";
import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "@/config/db";
import User from "./User";

interface RoleCreationAttributes
  extends Optional<RoleModel, "createdAt" | "updatedAt" | "id"> {}

class Role extends Model<RoleModel, RoleCreationAttributes> {
  declare readonly id: number;
  declare readonly name: string;
  declare createdAt: Date;
  declare updatedAt: Date;

  // Associations
  static associate() {
    Role.hasMany(User, { foreignKey: "roleId" });
    User.belongsTo(Role, { foreignKey: "roleId" });
  }
}

Role.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: DataTypes.ENUM(...Object.keys(ROLES)),
      allowNull: false,
      // can't be unique and have a default value
      defaultValue: "user",
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
    tableName: "roles",
  }
);

export default Role;
