import bcrypt from "bcrypt";
import sequelize from "@/config/db";
import { DataTypes, Model, Optional } from "sequelize";
import Upload from "./Upload";

export interface UploadChunkModel {
  id: string;
  upload_id: string;
  chunk_index: number;
  chunk_length: number;
  offset: number;
  created_at: Date;
}

interface UploadChunkCreationAttributes
  extends Optional<UploadChunkModel, "created_at"> {}

class UploadChunk
  extends Model<UploadChunkModel, UploadChunkCreationAttributes>
  implements UploadChunkModel
{
  declare readonly id: string;
  declare readonly upload_id: string;
  declare readonly chunk_index: number;
  declare readonly chunk_length: number;
  declare readonly offset: number;
  declare created_at: Date;

  public static hashPassword(password: string): string {
    return bcrypt.hashSync(password, 10);
  }

  static associate() {
    UploadChunk.belongsTo(Upload, { foreignKey: "upload_id" });
  }
}

UploadChunk.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
    },
    upload_id: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: "upload",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    chunk_index: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    chunk_length: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    offset: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
  },
  {
    sequelize,
    freezeTableName: true,
    modelName: "upload_chunk",
    timestamps: true,
    createdAt: "created_at",
  }
);

export default UploadChunk;
