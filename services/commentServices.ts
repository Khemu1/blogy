import User from "@/db/models/User";
import Comment from "@/db/models/Comment";
import { CustomError } from "@/middlewares/error/CustomError";
import { NewCommentProps } from "@/app/types";

const addCommentService = async (
  data: {
    content: string;
    blogId: number;
  },
  userId: number
) => {
  try {
    if (!data || isNaN(+data.blogId) || isNaN(userId)) {
      throw new CustomError(
        "invalid comment data , id or userId",
        400,
        "try checking blog id and user id",
        true
      );
    }
    const user = await User.findByPk(userId, {
      attributes: ["username"],
    });
    console.log(data);
    await Comment.create({
      content: data.content,
      userId: userId,
      blogId: data.blogId,
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const deleteCommentService = async (commendId: number, userId: number) => {
  try {
    if (!commendId || isNaN(commendId) || isNaN(userId)) {
      throw new CustomError(
        "invalid comment id or userId",
        400,
        "try checking comment id and user id",
        true
      );
    }
    const comment = await Comment.findOne({
      where: { userId: userId, id: commendId },
    });
    if (!comment) {
      throw new CustomError(
        "Comment not found",
        404,
        "comment not found",
        true
      );
    }
    await comment.destroy();
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const updateCommentService = async (
  commendId: number,
  userId: number,
  newContent: string
) => {
  try {
    if (!commendId || isNaN(commendId) || isNaN(userId) || !newContent) {
      throw new CustomError(
        "invalid comment id or userId or new content",
        400,
        "try checking comment id, user id and new content",
        true
      );
    }
    const comment = await Comment.findOne({
      where: { userId: userId, id: commendId },
    });
    if (!comment) {
      throw new CustomError(
        "Comment not found",
        404,
        "comment not found",
        true
      );
    }
    await comment.update({ content: newContent, updatedAt: new Date() });
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getBlogCommentsService = async (blogId: number) => {
  try {
    if (!blogId || isNaN(blogId)) {
      throw new CustomError(
        "invalid blog id",
        400,
        "try checking blog id",
        true
      );
    }
    const comments = await Comment.findAll({
      where: { blogId: blogId },
      include: [
        {
          model: User,
          attributes: ["username"],
        },
      ],
    });
    return comments;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export {
  addCommentService,
  deleteCommentService,
  updateCommentService,
  getBlogCommentsService,
};
