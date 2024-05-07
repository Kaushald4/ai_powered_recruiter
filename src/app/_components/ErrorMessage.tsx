"use client";
import React from "react";

type TErrorMesage = {
  message: string;
};

const ErrorMessage = ({ message }: TErrorMesage) => {
  return <div className="text-red-500 text-[12px]">{message}</div>;
};

export default ErrorMessage;
