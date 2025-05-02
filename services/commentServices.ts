import User from "@/db/models/User";
import Comment from "@/db/models/Comment";
import { CustomError } from "@/middlewares/error/CustomError";

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
    const comment = await Comment.create({
      content: data.content,
      userId: userId,
      blogId: data.blogId,
    });
    return comment;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const deleteCommentService = async (commendId: number, userId: number) => {
  try {
    const res = await Comment.destroy({
      where: { userId: userId, id: commendId },
    });
    if (!res) {
      throw new CustomError(
        "Comment not found",
        404,
        "comment not found",
        true
      );
    }
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
    const res = await Comment.update(
      { content: newContent, updatedAt: new Date() },
      {
        where: {
          id: commendId,
          userId: userId,
        },
      }
    );
    if (!res[0]) {
      throw new CustomError(
        "Comment not found",
        404,
        "comment not found",
        true
      );
    }
    console.log("comment updated");
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

const getUserCommentsService = async (userId: number) => {
  try {
    const comments = await Comment.findAll({
      where: { userId: userId },
    });
    return comments;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export {
  getUserCommentsService,
  addCommentService,
  deleteCommentService,
  updateCommentService,
  getBlogCommentsService,
};
