"use client";
import { LoginFormProps } from "@/types";
import styles from "../styles/form.module.css";
import { loginSchema, validateWithSchema } from "@/utils/user";
import { useState } from "react";
import { ZodError } from "zod";
import { useLoginUser } from "@/hooks/user";

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
      console.log(schema.parse(data));
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
    <div className="flex justify-center items-center h-full">
      <form
        action=""
        className="flex justify-around flex-col bg-base-200 min-h-[400px] w-max p-4 rounded-lg"
        onSubmit={(e: React.FormEvent) => handleSubmit(formData, e)}
      >
        <h2 className="font-extrabold text-2xl mx-auto">Login</h2>
        <div>
          <div className={styles.inputContainer}>
            <label>Email or Username :</label>
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
          {(errors?.emailOrUsername || ApiError?.emailOrUsername) && (
            <div className="flex justify-end">
              <small className={styles.error}>
                {errors?.emailOrUsername ?? ApiError?.emailOrUsername}
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
                  errors?.password || ApiError?.password
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
          {(errors?.password || ApiError?.password) && (
            <div className="flex justify-end">
              <small className={styles.error}>
                {errors?.password ?? ApiError?.password}
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
        {ApiError?.message && (
          <p className={styles.login_error}>{ApiError.message}</p>
        )}
      </form>
    </div>
  );
};

export default Login;
