import bcrypt from "bcrypt";
import sequelize from "@/config/db";
import { DataTypes, Model, Optional } from "sequelize";
import User from "./User";

interface UploadCreationAttributes
  extends Optional<
    UploadModel,
    "createdAt" | "updatedAt" | "isCanceled" | "isCompleted"
  > {}

class Upload
  extends Model<UploadModel, UploadCreationAttributes>
  implements UploadModel
{
  declare readonly id: string;
  declare readonly userId: number;
  declare readonly filePath: string;
  declare readonly fileName: string;
  declare readonly fileSize: number;
  declare readonly mimeType: string;
  declare readonly isCompleted: boolean;
  declare readonly isCanceled: boolean;
  declare createdAt: Date;
  declare updatedAt: Date;
  declare deletedAt: Date | null;

  public static hashPassword(password: string): string {
    return bcrypt.hashSync(password, 10);
  }

  static associate() {
    User.hasMany(Upload, { foreignKey: "userId" });
    Upload.belongsTo(User, { foreignKey: "userId" });
  }
}

Upload.init(
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
    fileName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fileSize: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    mimeType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isCompleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    isCanceled: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    freezeTableName: true,
    timestamps: true,
    modelName: "upload", // <-- You wrote "user" here by mistake!
  }
);

export default Upload;

export interface UploadModel {
  id: string;
  userId: number;
  fileName: string;
  fileSize: number;
  mimeType: string;
  createdAt: Date;
  updatedAt: Date;
  isCompleted: boolean;
  isCanceled: boolean;
}
