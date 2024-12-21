import bcrypt from "bcrypt";
import User from "@/db/models/User";
import UserRole from "@/db/models/UserRole";
import sequelize from "@/config/db";
import { CustomError } from "@/middlewares/error/CustomError";
import { LoginFormProps, RegisterFormProps } from "@/types";
import { Op } from "sequelize";
import Role from "@/db/models/Role";
import { sendEmail } from "@/app/api/email";

const registerUserService = async (data: RegisterFormProps) => {
  const transaction = await sequelize.transaction();
  try {
    const [existingUsername, existingEmail] = await Promise.all([
      User.findOne({ where: { username: data.username } }),
      User.findOne({ where: { email: data.email } }),
    ]);

    if (existingUsername) {
      throw new CustomError("Username already exists", 401, "", true);
    }

    if (existingEmail) {
      throw new CustomError("Email already exists", 401, "", true);
    }

    const hashedPassword = bcrypt.hashSync(data.password, 10);
    const userModifiedData = {
      username: data.username,
      email: data.email,
      password: hashedPassword,
    };

    const userRoleId = await Role.findOne({ where: { name: "user" } });
    if (!userRoleId || isNaN(+userRoleId.id)) {
      throw new CustomError(
        "Role 'user' not found",
        400,
        "check the roles table",
        true
      );
    }

    const user = await User.create(
      { ...userModifiedData, roleId: userRoleId.id },
      { transaction }
    );

    await UserRole.create(
      { userId: user.id, roleId: userRoleId.id },
      { transaction }
    );

    await transaction.commit();

    const {
      password,
      createdAt,
      updatedAt,
      deletedAt,
      email,
      ...modifiedUser
    } = user.get();
    const emailBody = `Hello, ${data.username} thank you for registering with us `;
    const emailSubject = "Email created";
    sendEmail(email, emailSubject, emailBody);

    return modifiedUser;
  } catch (error) {
    await transaction.rollback();

    console.error("Error in registerUserService:", error);

    throw error;
  }
};

const loginUserService = async (data: LoginFormProps) => {
  try {
    const user = await User.findOne({
      where: {
        [Op.or]: [
          { username: data.emailOrUsername },
          { email: data.emailOrUsername },
        ],
      },
    });
    if (!user || !bcrypt.compareSync(data.password, user.password)) {
      throw new CustomError("invalid email or password", 401, "", true);
    }
    const {
      password,
      createdAt,
      updatedAt,
      deletedAt,
      email,
      ...modifiedUser
    } = user.get();
    return modifiedUser;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export { registerUserService, loginUserService };
