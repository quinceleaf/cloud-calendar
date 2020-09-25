import React from "react";

const Error = ({ touched, message }) => {
  if (!touched) {
    return null;
  }

  if (message) {
    return <div className="text-xs text-red-500">{message}</div>;
  }

  return null;
};

export default Error;
