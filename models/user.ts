import { DataTypes, Model } from "sequelize";
import { sequelize } from "../utils/database";

export class User extends Model {
  public id!: number;
  public name!: string;
  public username!: string;
  public password!: string;
}

const schemaName = "User";

const initializeUserModel = async () => {
  try {
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
        },
        email: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
        },
        password: {
          type: DataTypes.STRING,
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
        tableName: "Users",
        indexes: [
          {
            fields: ["createdAt"],
          },
        ],
      }
    );
    await sequelize.sync(); // Use { force: true } if you want to drop tables and recreate them
  } catch (error) {
    console.error("Failed to initialize User model:", error);
  }

  return User;
};

export default initializeUserModel;
