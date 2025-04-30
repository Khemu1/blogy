import bcrypt from "bcrypt";
import sequelize from "@/config/db";
import { DataTypes, Model, Optional } from "sequelize";
import Upload from "./Upload";

export interface UploadChunkModel {
  id: number;
  upload_id: string;
  chunk_length: number;
  offset: number;
  created_at: Date;
}

interface UploadChunkCreationAttributes
  extends Optional<UploadChunkModel, "created_at" | "id"> {}

class UploadChunk
  extends Model<UploadChunkModel, UploadChunkCreationAttributes>
  implements UploadChunkModel
{
  declare readonly id: number;
  declare readonly upload_id: string;
  declare readonly chunk_length: number;
  declare readonly offset: number;
  declare created_at: Date;

  static associate() {
    UploadChunk.belongsTo(Upload, { foreignKey: "upload_id" });
  }
}

UploadChunk.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
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
    tableName: "upload-chunk",
    timestamps: false, // allow those if you have createdAt and updatedAt  in your model
    createdAt: "created_at", // explicitly map createdAt to created_at
  }
);

export default UploadChunk;
