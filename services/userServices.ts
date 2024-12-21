import Blog from "@/db/models/Blog";
import Comment from "@/db/models/Comment";
import User from "@/db/models/User";
import { CustomError } from "@/middlewares/error/CustomError";

const getMyData = async (userId: number) => {
  try {
    if (isNaN(userId) || userId < 1) {
      throw new CustomError("invalid user id", 401, "try to login again", true);
    }
    const userData = await User.findByPk(userId, {
      include: [
        {
          model: Blog,
          attributes: {
            exclude: ["deletedAt", "userId"],
          },
        },
        {
          model: Comment,
          attributes: {
            exclude: ["deletedAt", "userId"],
          },
        },
      ],
      attributes: {
        exclude: ["password"],
      },
    });
    if (!userData) {
      throw new CustomError("user not found", 404, "try again", true);
    }
    return userData.get();
  } catch (error) {
    throw error;
  }
};

export { getMyData };
