"use client";
import React from "react";

export const AddToCart = () => {
  return (
    <div>
      <button
        onClick={() => {
          console.log("clicked");
        }}
        className="btn btn-primary"
      >
        Click me
      </button>
    </div>
  );
};

export default AddToCart;
