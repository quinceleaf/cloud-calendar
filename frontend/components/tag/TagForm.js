import React, { useState } from "react";

import { Field, Form, Formik } from "formik";
import * as Yup from "yup";

import { CustomButton, CustomInput } from "../common";

const tagFormInitialValues = {
  id: "",
  name: "",
  date_added: "",
  date_updated: "",
};

const tagFormValidationSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, "Name must be at least 3 characters long")
    .max(192, "Name cannot be longer than 192 characters")
    .required("Must provide a name"),
});

const TagForm = ({
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
        label="Tag Name"
        component={CustomInput}
        placeholder="Enter name of tag"
        required={true}
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
            text="Delete Tag"
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
          : tagFormInitialValues
      }
      validationSchema={tagFormValidationSchema}
      validateOnBlur={true}
      validateOnChange={false}
      render={renderForm}
      onSubmit={handleOnSubmit}
    />
  );
};

export default TagForm;
