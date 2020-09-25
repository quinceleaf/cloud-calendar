import React from "react";
import Select from "react-select";

const CustomSelect = ({
  field,
  form,
  options,
  closeMenuOnSelect = true,
  placeholder,
  className,
  label,
  inputId = null,
  required = false,
  initialValue = null,
}) => {
  const onChange = (option) => {
    option !== null
      ? form.setFieldValue(field.name, option.value)
      : form.setFieldValue(field.name, "");
  };

  const getValue = () => {
    options
      .filter((option) => field.value.includes(option.value))
      .map((item) => field.value.push(item.value));
  };

  const styles = {
    multiValue: (styles) => {
      return {
        ...styles,
        backgroundColor: "rgba(66, 153, 225, var(--bg-opacity))",
        opacity: 0.25,
      };
    },
  };

  return (
    <div className={className || "mt-4 w-full"}>
      <div>
        <label
          htmlFor={inputId || field.name}
          className="text-sm text-gray-600"
        >
          {label}
          {required ? <span className="text-red-600">*</span> : null}
        </label>
      </div>
      <div>
        <Select
          id={inputId || field.name}
          name={field.name}
          value={options.find((option) => option.value === field.value)}
          onChange={onChange}
          options={options}
          closeMenuOnSelect={closeMenuOnSelect}
          placeholder={placeholder}
          defaultValue={
            initialValue
              ? options.find((option) => option.value === initialValue)
              : "" // options.find((option) => option.value === field.value)
          }
          //styles={styles}
          isClearable={true}
          //error={form.errors[field.name]}
        />
        {/* <Error
          touched={form.touched[field.name]}
          message={form.errors[field.name]}
        /> */}
      </div>
    </div>
  );
};

export default CustomSelect;
