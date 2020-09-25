import React from "react";
import Select from "react-select";

const CustomMultiSelect = ({
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
    form.setFieldValue(
      field.name,
      option
        ? option.map(({ value: id, label: name, ...rest }) => ({
            id,
            name,
            ...rest,
          }))
        : []
    );
  };

  // const onChange = (option) => {
  //   form.setFieldValue(
  //     field.name,
  //     option
  //       ? option.map((item) => {
  //           item.value;
  //         })
  //       : []
  //   );
  // };

  const getValue = () => {
    options.filter((option) => field.value.includes(option.value));
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
      {options === null ? (
        <div>Loading...</div>
      ) : (
        <Select
          id={inputId || field.name}
          name={field.name}
          value={getValue()}
          onChange={onChange}
          options={options}
          closeMenuOnSelect={closeMenuOnSelect}
          placeholder={placeholder}
          isMulti={true}
          isClearable={true}
          defaultValue={
            initialValue
              ? initialValue // options.filter((option) => initialValue.includes(option.value))
              : []
          }
          //styles={styles}
        />
      )}
      {/* <Error
        touched={form.touched[field.name]}
        message={form.errors[field.name]}
      /> */}
    </div>
  );
};

export default CustomMultiSelect;
