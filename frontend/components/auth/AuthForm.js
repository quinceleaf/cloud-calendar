import React, { useState } from "react";

import { Field, Form, Formik } from "formik";
import * as Yup from "yup";

import { CustomButton, CustomInput, CustomPassword } from "../common";

const authFormInitialValues = {
  username: "",
  password: "",
};
const authFormValidationSchema = Yup.object().shape({
  username: Yup.string()
    .min(3, "Name must be at least 3 characters long")
    .max(192, "Name cannot be longer than 192 characters")
    .required("Must provide an email"),
  password: Yup.string()
    .min(3, "Name must be at least 3 characters long")
    .max(192, "Name cannot be longer than 192 characters")
    .required("Must provide a password"),
});

const AuthSignupForm = ({ action, submitText, onSubmit }) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleOnSubmit = async (values, actions) => {
    // console.log("values passed inside form:", values);
    actions.setSubmitting(true);
    await onSubmit({ ...values });
    actions.resetForm();
    actions.setSubmitting(false);
  };

  const renderForm = (formikBag, actions) => (
    <Form>
      <Field
        className="mt-4"
        name="username"
        label="Email"
        component={CustomInput}
        placeholder="Enter your email"
        required={true}
      />

      <Field
        className="mt-4"
        name="password"
        label="Password"
        component={CustomPassword}
        placeholder="Enter your password"
        required={true}
        showPassword={showPassword}
      />

      <div className="flex flex-row justify-between mt-4">
        <div className="flex flex-row">
          <CustomButton
            disabled={formikBag.isSubmitting}
            buttonType="submit"
            text={submitText}
          />

          <CustomButton text="Cancel" />
        </div>

        <div className="flex flex-row self-center">
          <input
            type="checkbox"
            className="mt-1 bg-white opacity-25"
            checked={showPassword}
            onChange={() => setShowPassword(!showPassword)}
          ></input>
          <div className="ml-2 text-gray-500 text-sm">Show Password</div>
        </div>
      </div>
    </Form>
  );

  return (
    <Formik
      initialValues={authFormInitialValues}
      validationSchema={authFormValidationSchema}
      validateOnBlur={true}
      validateOnChange={false}
      render={renderForm}
      onSubmit={handleOnSubmit}
    />
  );
};

export default AuthSignupForm;
