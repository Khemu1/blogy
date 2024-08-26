"use client";
import { LoginFormProps } from "@/types";
import styles from "../styles/form.module.css";
import { loginSchema, validateWithSchema } from "@/utils/user";
import React, { useState } from "react";
import { ZodError } from "zod";
import { useLoginUser } from "@/hooks/user";

const Login = () => {
  const schema = loginSchema();
  const [formData, setformData] = useState<LoginFormProps>({
    emailOrUsername: "",
    password: "",
  });
  const { handleLoginUser } = useLoginUser();
  const [errors, setErrors] = useState<Record<string, string> | null>(null);
  const handleSubmit = (data: LoginFormProps, e: React.FormEvent) => {
    try {
      e.preventDefault();
      setErrors(null);
      schema.parse(data);
      handleLoginUser(data);
      console.log("sent");
    } catch (error) {
      if (error instanceof ZodError) {
        setErrors(validateWithSchema(error));
        throw errors;
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
        className="flex flex-col  justify-between gap-5 bg-slate-200 w-max p-4 rounded-lg overflow-hi"
        onSubmit={(e: React.FormEvent) => handleSubmit(formData, e)}
      >
        <h2 className="font-semibold text-xl m-auto">Login</h2>
        <div>
          <div className={styles.inputContainer}>
            <label>Email or Username :</label>
            <input
              id="emailOrUsername"
              className={errors?.email ? styles.error_bottom_border : ""}
              type="text"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setformData((prev) => ({
                  ...prev,
                  emailOrUsername: e.target.value,
                }));
              }}
            />
          </div>
          {errors?.email && (
            <div className="flex justify-end">
              <small className={styles.error}>{errors.email}</small>
            </div>
          )}
        </div>
        <div>
          <div className={styles.inputContainer}>
            <label>Password :</label>
            <input
              id="password"
              className={errors?.password ? styles.error_bottom_border : ""}
              type="password"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setformData((prev) => ({
                  ...prev,
                  password: e.target.value,
                }));
              }}
            />
          </div>
        </div>
        <button
          type="submit"
          className="h-max w-max m-auto bg-slate-300 px-3 py-1 rounded-xl transition-all hover:bg-white font-semibold"
        >
          Login
        </button>
        {errors?.message && (
          <small className={styles.error}>{errors.message}</small>
        )}
      </form>
    </div>
  );
};

export default Login;
