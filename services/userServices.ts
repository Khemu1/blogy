import Blog from "@/db/models/Blog";
import Comment from "@/db/models/Comment";
import User from "@/db/models/User";
import { CustomError } from "@/middlewares/error/CustomError";

const getMyData = async (userId: number) => {
  try {
    const userData = await User.findByPk(userId, {
      attributes: {
        exclude: ["password"],
      },
    });
    if (!userData) {
      throw new CustomError("user not found", 403, "try again", true);
    }
    return userData.get();
  } catch (error) {
    throw error;
  }
};

export { getMyData };
