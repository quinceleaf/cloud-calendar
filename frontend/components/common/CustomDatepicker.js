import React from "react";

import { format } from "date-fns-tz";
import DatePicker from "react-datepicker";

import Error from "./Error";

// customize picker options per-project
const DatePickerField = ({
  name,
  value,
  onChange,
  placeholder,
  initialValue,
}) => {
  return (
    <DatePicker
      className="focus:outline-none w-full min-w-full"
      selected={
        initialValue ? initialValue : (value && new Date(value)) || null
      }
      onChange={(val) => {
        const valStr = format(val, "yyyy-MM-dd HH:mm:ss");
        onChange(name, valStr);
      }}
      showMonthDropdown
      useShortMonthInDropdown
      showTimeSelect
      timeFormat="h:mm aa"
      timeIntervals={15}
      timeCaption="time"
      dateFormat="MMMM d, yyyy h:mm aa"
      placeholderText={placeholder}
    />
  );
};

const CustomDatepicker = ({
  field,
  form,
  inputId = "datepicker",
  label = "Date/Time",
  required = true,
  placeholder = "Select a date",
  initialValue = null,
}) => {
  return (
    <div className="mt-2 mb-2 w-full">
      <label htmlFor={inputId} className="text-sm text-gray-600">
        {label} {required ? <span className="text-red-600">*</span> : null}
      </label>
      <br />
      <div className="p-2 w-full text-sm focus:outline-none rounded-md border-2 border-gray-200 {touched && errors ? 'border-red-600' : null}">
        <DatePickerField
          id={inputId}
          name={field.name}
          value={field.value}
          onChange={form.setFieldValue}
          placeholder={placeholder}
          initialValue={initialValue}
        />
      </div>
      <Error
        touched={form.touched[field.name]}
        message={form.errors[field.name]}
      />
    </div>
  );
};

export default CustomDatepicker;
