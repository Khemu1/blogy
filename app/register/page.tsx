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
  const { handleAddUser } = useAddUser();
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
        <h2 className="font-semibold text-xl m-auto">sign Up</h2>
        <div>
          <div className={styles.inputContainer}>
            <label>Email :</label>
            <input
              id="email"
              className={errors?.email ? styles.error_bottom_border : ""}
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
              className={errors?.username ? styles.error_bottom_border : ""}
              type="text"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setformData((prev) => ({
                  ...prev,
                  username: e.target.value,
                }));
              }}
              minLength={1}
            />
          </div>
          {errors?.username && (
            <div className="flex justify-end">
              <small className={styles.error}>{errors.username}</small>
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
              minLength={5}
            />
          </div>
          {errors?.password && (
            <div className="flex justify-end">
              <small className={styles.error}>{errors.password}</small>
            </div>
          )}
        </div>
        <div>
          <div className={styles.inputContainer}>
            <label>Confirm Password : </label>
            <input
              id="confirmPassword"
              className={
                errors?.confirmPassword ? styles.error_bottom_border : ""
              }
              type="password"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setformData((prev) => ({
                  ...prev,
                  confirmPassword: e.target.value,
                }));
              }}
              minLength={5}
            />
          </div>

          {errors?.confirmPassword && (
            <div className="flex justify-end">
              <small className={styles.error}>{errors.confirmPassword}</small>
            </div>
          )}
        </div>
        <button
          type="submit"
          className="h-max w-max m-auto bg-slate-300 px-3 py-1 rounded-xl transition-all hover:bg-white font-semibold"
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
