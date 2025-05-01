"use client";
import { LoginFormProps } from "@/app/types";
import styles from "../styles/form.module.css";
import { loginSchema } from "@/app/utils/user";
import { useState } from "react";
import { ZodError } from "zod";
import { useLoginUser } from "@/app/hooks/user";
import Link from "next/link"; // Import Link component from Next.js
import { validateWithSchema } from "../utils/comment";

const Login = () => {
  const schema = loginSchema();
  const [formData, setformData] = useState<LoginFormProps>({
    emailOrUsername: "",
    password: "",
  });
  const { handleLoginUser, error: ApiError } = useLoginUser();
  const [errors, setErrors] = useState<Record<string, string> | null>(null);

  const handleSubmit = (data: LoginFormProps, e: React.FormEvent) => {
    try {
      e.preventDefault();
      setErrors(null);
      schema.parse(data);
      handleLoginUser(data);
    } catch (error) {
      if (error instanceof ZodError) {
        console.log(validateWithSchema(error));
        setErrors(validateWithSchema(error));
      } else {
        console.error("An error occurred during validation:", error);
        setErrors({ message: "An error occurred during validation" });
      }
    }
  };

  return (
    <div className="flex justify-center items-center h-full px-4 sm:px-0">
      <form
        action=""
        className="flex flex-col justify-between gap-10 bg-base-200 w-[85dvw] sm:w-[400px] p-4 rounded-lg overflow-hidden"
        onSubmit={(e) => handleSubmit(formData, e)}
      >
        <h2 className="font-extrabold text-2xl mx-auto">Login</h2>

        <div>
          <div className={styles.inputContainer}>
            <label className="">Email or Username :</label>
            <input
              id="emailOrUsername"
              className={`form_input ${
                errors?.emailOrUsername ? styles.error_bottom_border : ""
              }`}
              type="text"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setformData((prev) => ({
                  ...prev,
                  emailOrUsername: e.target.value,
                }));
              }}
            />
          </div>
          {(errors?.emailOrUsername || ApiError?.errors.emailOrUsername) && (
            <div className="flex">
              <small className={styles.error}>
                {errors?.emailOrUsername ?? ApiError?.errors.emailOrUsername}
              </small>
            </div>
          )}
        </div>

        <div>
          <div className={styles.inputContainer}>
            <label>Password :</label>
            <input
              id="password"
              className={`form_input 
                ${
                  errors?.password || ApiError?.errors.password
                    ? styles.error_bottom_border
                    : ""
                }`}
              type="password"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setformData((prev) => ({
                  ...prev,
                  password: e.target.value,
                }));
              }}
            />
          </div>
          {(errors?.password || ApiError?.errors.password) && (
            <div className="flex ">
              <small className={styles.error}>
                {errors?.password ?? ApiError?.errors.password}
              </small>
            </div>
          )}
        </div>

        <button
          type="submit"
          className="h-max w-max mx-auto text-xl bg-[#eb512b] text-white px-5 py-1 rounded-lg transition-all font-extrabold"
        >
          Login
        </button>

        {ApiError?.errors.message && (
          <p className={styles.login_error}>{ApiError.message}</p>
        )}

        {/* Add a link to the registration page */}
        <div className="mt-4 text-center">
          <p>
            Don't have an account?{" "}
            <Link href="/register" className="text-[#eb512b] font-bold">
              Register here
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Login;
