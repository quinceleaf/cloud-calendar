import React from "react";

import Error from "./Error";

const CustomInput = ({
  field,
  form,
  inputId,
  label,
  required,
  placeholder,
  className,
  // handleChange,
  touched,
  errors,
}) => {
  return (
    <div className={className || "mt-4 w-full"}>
      <div>
        <label htmlFor={inputId} className="text-sm text-gray-600">
          {label}
          {required ? <span className="text-red-600">*</span> : null}
        </label>
      </div>
      <div>
        <input
          id={inputId}
          className="p-2 w-full text-sm focus:outline-none rounded-md border-2 border-gray-200 {touched && errors ? 'border-red-600' : null}"
          onChange={field.onChange}
          value={field.value}
          name={field.name}
          type="text"
          placeholder={placeholder}
        ></input>
      </div>
      <Error
        touched={form.touched[field.name]}
        message={form.errors[field.name]}
      />
    </div>
  );
};

export default CustomInput;
