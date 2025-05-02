import Blog from "./models/Blog";
import Upload from "./models/Upload";
import UploadChunk from "./models/UploadChunk";
import User from "./models/User";
import Comment from "./models/Comment";
let associationsInitialized = false;

export function setupAssociations() {
  if (associationsInitialized) return;
  associationsInitialized = true;

  User.hasMany(Blog, { foreignKey: "userId" });
  Blog.belongsTo(User, { foreignKey: "userId" });

  Blog.hasMany(Comment, { foreignKey: "blogId" });
  Comment.belongsTo(Blog, { foreignKey: "blogId" });

  User.hasMany(Comment, { foreignKey: "userId" });
  Comment.belongsTo(User, { foreignKey: "userId" });

  Blog.hasOne(Upload, { foreignKey: "blogId", as: "image" });
  Upload.belongsTo(Blog, { foreignKey: "blogId", as: "blog" });

  User.hasMany(Upload, { foreignKey: "userId" });
  Upload.belongsTo(User, { foreignKey: "userId" });

  Upload.hasMany(UploadChunk, { foreignKey: "upload_id" });
  UploadChunk.belongsTo(Upload, { foreignKey: "upload_id" });
}
