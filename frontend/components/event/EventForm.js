import React, { useState } from "react";

import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import tzIds from "tz-ids";

import {
  CustomButton,
  CustomDatepicker,
  CustomInput,
  CustomMultiSelect,
  CustomSelect,
  CustomTextArea,
} from "../common";
import { alphabeticalList } from "../../helpers/listFunctions";
import { combineDateAndTimezone } from "../../helpers/timeFunctions";

const convertItemsForSelect = (arr) => {
  const options = [];
  arr.map((item) => options.push({ label: item.name, value: item.id }));
  return alphabeticalList(options, "label");
};

const convertTimezonesForSelect = (arr) => {
  const options = [];
  arr.map((str) => options.push({ label: str, value: str }));
  return alphabeticalList(options, "label");
};

const eventFormInitialValues = {
  id: "",
  name: "",
  date: "",
  url: "",
  timezone: "",
  tags: [],
  organizations: [],
  description: "",
  date_added: "",
  date_updated: "",
  expires: 0,
};

const eventFormValidationSchema = Yup.object().shape({
  name: Yup.string()
    .min(10, "Name must be at least 10 characters long")
    .max(192, "Name cannot be longer than 192 characters")
    .required("Must provide a name"),
  date: Yup.string().required("Must provide a date"),
  url: Yup.string().required("Must provide a URL"),
  timezone: Yup.string().required("Must indicate the timezone"),
  tags: Yup.array()
    .min(1, "Must select at least 1 tag")
    .required("Select tag(s) for event"),
});

const EventForm = ({
  action,
  initialValues = null,
  submitText,
  onSubmit,
  setEventState,
  tagData,
  orgData,
}) => {
  const eventTimezoneOptions = tzIds ? convertTimezonesForSelect(tzIds) : [];

  const initialTagOptions = initialValues
    ? convertItemsForSelect(initialValues["tags"])
    : eventFormInitialValues["tags"]
    ? convertItemsForSelect(eventFormInitialValues["tags"])
    : [];

  const eventTagOptions = tagData ? convertItemsForSelect(tagData) : [];

  const initialOrgOptions = initialValues
    ? convertItemsForSelect(initialValues["organizations"])
    : eventFormInitialValues["organizations"]
    ? convertItemsForSelect(eventFormInitialValues["organizations"])
    : [];

  const eventOrgOptions = orgData ? convertItemsForSelect(orgData) : [];

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
        label="Event Name"
        component={CustomInput}
        placeholder="Enter name of event"
        required={true}
      />

      <Field
        className="mt-4"
        name="url"
        label="URL"
        component={CustomInput}
        placeholder="Enter url of event"
        required={true}
      />

      <Field
        className="mt-4"
        name="description"
        label="Description"
        component={CustomTextArea}
        placeholder="Enter description of event"
        size="medium"
      />

      <Field
        className="mt-4"
        name="date"
        label="Date"
        component={CustomDatepicker}
        initialValue={
          eventFormInitialValues["date"] && eventFormInitialValues["timezone"]
            ? combineDateAndTimezone(
                eventFormInitialValues["date"],
                eventFormInitialValues["timezone"]
              )
            : null
        }
        placeholder="Enter date of event"
      />

      <Field
        className="mt-4"
        name="timezone"
        label="Time Zone"
        placeholder="Select event timezone"
        options={eventTimezoneOptions}
        component={CustomSelect}
        initialValue={
          initialValues
            ? initialValues.timezone
            : eventFormInitialValues["timezone"]
        }
        required={true}
      />

      <Field
        className="mt-4"
        name="tags"
        label="Tags"
        options={eventTagOptions}
        component={CustomMultiSelect}
        placeholder="Select tags for event"
        closeMenuOnSelect={true}
        required={true}
        initialValue={initialTagOptions}
      />

      <Field
        className="mt-4"
        name="organizations"
        label="Organizations"
        options={eventOrgOptions}
        component={CustomMultiSelect}
        placeholder="Select organizations for event"
        closeMenuOnSelect={true}
        required={false}
        initialValue={initialOrgOptions}
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
              setEventState({ action: "view", id: initialValues.id })
            }
            text="Cancel"
          />
        )}

        {action == "add" && (
          <CustomButton
            onClick={() => setEventState({ action: "list", id: null })}
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
          : eventFormInitialValues
      }
      validationSchema={eventFormValidationSchema}
      validateOnBlur={true}
      validateOnChange={false}
      render={renderForm}
      onSubmit={handleOnSubmit}
    />
  );
};

export default EventForm;
