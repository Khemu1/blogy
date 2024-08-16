import { NewUser } from "@/types";
import * as Yup from "Yup";

import { transformYupErrorsIntoObject, getNewUserSchema } from "@/utils/user";

export const validateNewUser = async (user: NewUser) => {
  try {
    const schema = getNewUserSchema();
    const validatedUser = await schema.validate(user, { abortEarly: false });
    return { validatedUser, errors: null };
  } catch (error) {
    if (error instanceof Yup.ValidationError) {
      const errors = transformYupErrorsIntoObject(error);
      return { validatedUser: null, errors };
    } else {
      console.error("An error occurred during validation:", error);
      return {
        validatedUser: null,
        errors: "An error occurred during validation",
      };
    }
  }
};
