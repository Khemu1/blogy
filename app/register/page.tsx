"use client";

import React, { useState } from "react";
import styles from "../styles/form.module.css";
import { registerSchema, validateWithSchema } from "@/utils/user";
import { RegisterFormProps } from "@/types";
import { ZodError } from "zod";
import { useAddUser } from "@/hooks/user";

const Register = () => {
  const schema = registerSchema();
  const [formData, setformData] = useState<RegisterFormProps>({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const { handleAddUser, error: ApiError } = useAddUser();
  const [errors, setErrors] = useState<null | Record<string, string>>(null);
  const handleSubmit = async (data: RegisterFormProps, e: React.FormEvent) => {
    try {
      e.preventDefault();
      setErrors(null);
      schema.parse(data);
      handleAddUser(data);
      console.log("sent");
    } catch (error) {
      if (error instanceof ZodError) {
        setErrors(validateWithSchema(error));
        throw validateWithSchema(error);
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
        className="flex flex-col  justify-between gap-10 bg-base-200 w-[75dvw] sm:w-max min-h-[500px] p-4 rounded-lg overflow-hidden"
        onSubmit={(e: React.FormEvent) => handleSubmit(formData, e)}
      >
        <h2 className="font-semibold text-xl m-auto">sign Up</h2>
        <div>
          <div className={styles.inputContainer}>
            <label>Email :</label>
            <input
              id="email"
              className={`form_input 
                ${
                  errors?.email || ApiError?.email
                    ? styles.error_bottom_border
                    : ""
                }`}
              type="Email"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setformData((prev) => ({
                  ...prev,
                  email: e.target.value,
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
            <label>Username :</label>
            <input
              id="username"
              className={`form_input ${
                errors?.username || ApiError?.username
                  ? styles.error_bottom_border
                  : ""
              }`}
              type="text"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setformData((prev) => ({
                  ...prev,
                  username: e.target.value,
                }));
              }}
            />
          </div>
          {(errors?.username || ApiError?.username) && (
            <div className="flex justify-end">
              <small className={styles.error}>
                {errors?.username ?? ApiError?.username}
              </small>
            </div>
          )}
        </div>
        <div>
          <div className={styles.inputContainer}>
            <label>Password :</label>
            <input
              id="password"
              className={`form_input ${
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
        <div>
          <div className={styles.inputContainer}>
            <label>Confirm Password : </label>
            <input
              id="confirmPassword"
              className={`form_input ${
                errors?.confirmPassword ? styles.error_bottom_border : ""
              }`}
              type="password"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setformData((prev) => ({
                  ...prev,
                  confirmPassword: e.target.value,
                }));
              }}
            />
          </div>

          {(errors?.confirmPassword || ApiError?.confirmPassword) && (
            <div className="flex justify-end">
              <small className={styles.error}>
                {errors?.confirmPassword ?? ApiError?.confirmPassword}
              </small>
            </div>
          )}
        </div>
        <button
          type="submit"
          className="h-max w-max m-auto text-xl bg-[#eb512b] text-white px-5 py-1 rounded-lg transition-all  font-extrabold"
        >
          Register
        </button>
        {ApiError?.message && (
          <small className={styles.login_error}>{ApiError.message}</small>
        )}
      </form>
    </div>
  );
};

export default Register;
