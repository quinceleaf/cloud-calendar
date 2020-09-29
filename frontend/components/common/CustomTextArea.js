import React from "react";

import Error from "./Error";

const CustomTextarea = ({
  field,
  form,
  inputId,
  label,
  required,
  placeholder,
  className,
  size,
  touched,
  errors,
}) => {
  const textareaRows = size === "large" ? 10 : size === "medium" ? 7 : 4;
  return (
    <div className={className || "mt-4 w-full"}>
      <label htmlFor={inputId} className="text-sm text-gray-600">
        {label}
        {required ? <span className="text-red-600">*</span> : null}
      </label>
      <br />
      <textarea
        id={inputId}
        className="p-2 w-full text-sm focus:outline-none rounded-md border-2 border-gray-200 {touched && errors ? 'border-red-600' : null}"
        onChange={field.onChange}
        value={field.value}
        name={field.name}
        placeholder={placeholder}
        rows={textareaRows}
      ></textarea>
      <Error
        touched={form.touched[field.name]}
        message={form.errors[field.name]}
      />
    </div>
  );
};

export default CustomTextarea;
