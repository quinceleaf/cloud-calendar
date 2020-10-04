import React from "react";

import axios from "axios";
import { useToasts } from "react-toast-notifications";
import { queryCache, useMutation } from "react-query";

import OrganizationForm from "./OrganizationForm";
import { apiData } from "../../api";

const OrganizationAdd = ({ calendarState, setCalendarState }) => {
  const { addToast } = useToasts();

  const addOrganization = async (values) => {
    return await axios.post({`${apiData}/organizations`}, values);
  };

  const [
    onSubmit,
    { status, data, error, isLoading, isError, isSuccess },
  ] = useMutation(addOrganization, {
    onSuccess: (data) => {
      const newOrganization = data.data.data;
      queryCache.invalidateQueries("organizations");
      queryCache.invalidateQueries(["organization", newOrganization.id]);
      queryCache.setQueryData(
        ["organization", newOrganization.id],
        newOrganization
      );
      addToast(`Organization: ${newOrganization.name} added`, {
        appearance: "success",
      });
    },
    onError: (error) => {
      addToast("Error: Couldn't add organization", { appearance: "error" });
    },
    onSettled: (data) => {
      setCalendarState({ action: "list", id: null });
      queryCache.refetchQueries("organizations");
    },
  });

  return (
    <div>
      <div className="mt-5 p-4 shadow rounded bg-white">
        <div className="flex flex-row justify-between items-center">
          <div className="text-blue-500 font-bold text-xl leading-normal">
            Add Organization
          </div>
        </div>
        <div>
          <OrganizationForm
            action="add"
            onSubmit={onSubmit}
            clearOnSubmit
            submitText={
              isLoading
                ? "Saving..."
                : isError
                ? "Error!"
                : isSuccess
                ? "Saved"
                : "Add Organization"
            }
            calendarState={calendarState}
            setCalendarState={setCalendarState}
          />
        </div>
      </div>
    </div>
  );
};

export default OrganizationAdd;
