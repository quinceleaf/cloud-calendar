import React, { useState } from "react";

import { Field, Form, Formik } from "formik";
import * as Yup from "yup";

import { CustomButton, CustomInput } from "../common";

const organizationFormInitialValues = {
  id: "",
  name: "",
  url: "",
  date_added: "",
  date_updated: "",
};

const organizationFormValidationSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, "Name must be at least 3 characters long")
    .max(192, "Name cannot be longer than 192 characters")
    .required("Must provide a name"),
  //url: Yup.string().required("Must provide a URL"),
});

const OrganizationForm = ({
  action,
  initialValues = null,
  submitText,
  onSubmit,
  calendarState,
  setCalendarState,
  confirmDelete,
}) => {
  const handleOnSubmit = async (values, actions) => {
    actions.setSubmitting(true);
    await onSubmit({ ...values });
    actions.resetForm();
    actions.setSubmitting(false);
  };

  const renderForm = (formikBag, actions) => (
    <Form>
      <Field
        className="mt-4"
        name="name"
        label="Organization Name"
        component={CustomInput}
        placeholder="Enter name of organization"
        required={true}
      />

      <Field
        className="mt-4"
        name="url"
        label="Organization URL"
        component={CustomInput}
        placeholder="Enter URL of organization's site"
        required={false}
      />

      <div className="flex flex-row mt-4">
        <CustomButton
          disabled={formikBag.isSubmitting}
          buttonType="submit"
          text={submitText}
        />

        {action == "edit" && (
          <CustomButton
            onClick={() =>
              setCalendarState({
                ...calendarState,
                viewAction: "list",
                viewId: null,
              })
            }
            text="Cancel"
          />
        )}

        {action == "edit" && (
          <CustomButton
            onClick={() => {
              confirmDelete();
            }}
            text="Delete Organization"
          />
        )}

        {action == "add" && (
          <CustomButton
            onClick={() =>
              setCalendarState({
                ...calendarState,
                viewAction: "list",
                viewId: null,
              })
            }
            text="Cancel"
          />
        )}

        {action == "add" && (
          <CustomButton
            disabled={formikBag.isSubmitting}
            buttonType="submit"
            text={"Submit and Create Another"}
          />
        )}
      </div>
    </Form>
  );

  return (
    <Formik
      initialValues={
        action === "edit" && initialValues
          ? initialValues
          : organizationFormInitialValues
      }
      validationSchema={organizationFormValidationSchema}
      validateOnBlur={true}
      validateOnChange={false}
      render={renderForm}
      onSubmit={handleOnSubmit}
    />
  );
};

export default OrganizationForm;
