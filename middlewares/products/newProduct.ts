import { newProductProps } from "@/types";
import { z, ZodSchema } from "zod";

export const validateWithSchema = <T>(
  schema: ZodSchema<T>,
  data: newProductProps
) => {
  try {
    const validatedData = schema.parse(data);
    return { validatedData, errors: null };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.reduce(
        (acc: Record<string, string>, curr) => {
          acc[curr.path.join(".")] = curr.message;
          return acc;
        },
        {}
      );
      return { validatedData: null, errors };
    }
    return { validatedData: null, errors: "Unknown error occurred" };
  }
};

export const newProductSchmea = () => {
  return z.object({
    name: z
      .string({ required_error: "Product name is Required" })
      .min(4, { message: "Minimum length is 4 characters" }),
    price: z
      .number({ required_error: "Price it required" })
      .min(1, { message: "Price can't be less than 1" }),
  });
};

export const editProductSchema = () => {
  return z
    .object({
      name: z
        .string({ required_error: "Product name is Required" })
        .min(4, { message: "Minimum length is 4 characters" })
        .optional(),
      price: z
        .number({ required_error: "Price is required" })
        .min(1, { message: "Price can't be less than 1" })
        .optional(),
    })
    .refine((data) => data.name || data.price, {
      // refine is used to check if either the product name or price is provided
      message: "Either 'name' or 'price' must be provided",
      path: [], // This indicates the error applies to the entire object
    });
};
