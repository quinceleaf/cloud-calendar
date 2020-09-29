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

import { combineDateAndTimezone } from "../../helpers/timeFunctions";

const convertTagsForSelect = (arr) => {
  const options = [];
  arr.map((item) => options.push({ label: item.name, value: item.id }));
  return options;
};

const convertOrgsForSelect = (arr) => {
  const options = [];
  arr.map((item) => options.push({ label: item.name, value: item.id }));
  return options;
};

const convertTimezonesForSelect = (arr) => {
  const options = [];
  arr.map((str) => options.push({ label: str, value: str }));
  return options;
};

const createEventFormInitialValues = {
  name: "",
  date: "",
  url: "",
  timezone: "",
  tags: [],
  organizations: [],
  description: "",
};

const createEventFormValidationSchema = Yup.object().shape({
  name: Yup.string()
    .min(10, "Name must be at least 4 characters long")
    .max(192, "Name cannot be longer than 192 characters")
    .required("Must provide a name"),
  date: Yup.string().required("Must provide a date"),
  url: Yup.string().required("Must provide a URL"),
  timezone: Yup.string().required("Must indicate the timezone"),
  tags: Yup.array()
    .min(1, "Must select at least 1 tag")
    .required("Select tag(s) for event"),
});

const CreateEventForm = ({ submitText, onSubmit, tagData, orgData }) => {
  const [eventTimezoneOptions, createEventTimezoneOptions] = useState(
    tzIds ? convertTimezonesForSelect(tzIds) : []
  );

  const [eventTagOptions, createEventTagOptions] = useState(
    tagData ? convertTagsForSelect(tagData) : []
  );

  const [eventOrgOptions, createEventOrgOptions] = useState(
    orgData ? convertOrgsForSelect(orgData) : []
  );

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
      />

      <Field
        className="mt-4"
        name="date"
        label="Date"
        component={CustomDatepicker}
        initialValue={
          createEventFormInitialValues["date"] &&
          createEventFormInitialValues["timezone"]
            ? combineDateAndTimezone(
                createEventFormInitialValues["date"],
                createEventFormInitialValues["timezone"]
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
          createEventFormInitialValues["timezone"]
          // ? createEventFormInitialValues["timezone"]
          // : null
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
        initialValue={
          createEventFormInitialValues["tags"]
            ? convertTagsForSelect(createEventFormInitialValues["tags"])
            : []
        }
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
        initialValue={
          createEventFormInitialValues["organizations"]
            ? convertOrgsForSelect(
                createEventFormInitialValues["organizations"]
              )
            : []
        }
      />

      <div className="flex flex-row mt-4">
        <CustomButton
          onClick={formikBag.handleReset}
          disabled={formikBag.isSubmitting || formikBag.dirty}
          buttonType="button"
          text="Reset"
        />

        <CustomButton
          disabled={formikBag.isSubmitting}
          buttonType="submit"
          text={submitText}
        />
      </div>
    </Form>
  );

  return (
    <Formik
      initialValues={createEventFormInitialValues}
      validationSchema={createEventFormValidationSchema}
      validateOnBlur={true}
      validateOnChange={false}
      render={renderForm}
      onSubmit={handleOnSubmit}
    />
  );
};

export default CreateEventForm;
