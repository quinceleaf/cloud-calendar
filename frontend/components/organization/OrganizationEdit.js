import React from "react";

import axios from "axios";
import { useToasts } from "react-toast-notifications";
import { queryCache, useMutation } from "react-query";
import { Reoverlay } from "reoverlay";

import OrganizationForm from "./OrganizationForm";
import { DeleteConfirmModal } from "../modals";
import { apiOrgData } from "../../api/api";

const OrganizationEdit = ({ calendarState, setCalendarState }) => {
  const { addToast } = useToasts();

  const organization = queryCache
    .getQueryData("organizations")
    .find((organization) => organization.id === calendarState.viewId);

  const editOrganization = async (values) => {
    return await axios.post(`${apiOrgData}${calendarState.viewId}`, values);
  };

  const [
    onEditSubmit,
    { status, data, error, isLoading, isError, isSuccess },
  ] = useMutation(editOrganization, {
    onSuccess: (data) => {
      const updatedOrganization = data.data.data;
      queryCache.invalidateQueries("organizations");
      queryCache.invalidateQueries(["organization", updatedOrganization.id]);
      queryCache.setQueryData(
        ["organization", updatedOrganization.id],
        updatedOrganization
      );
      addToast(`Organization: ${updatedOrganization.name} updated`, {
        appearance: "success",
      });
    },
    onError: (error) => {
      addToast("Error: Couldn't update organization", { appearance: "error" });
    },
    onSettled: (data) => {
      const updatedOrganization = data.data.data;
      setCalendarState({ action: "list", id: null });
      queryCache.refetchQueries("organizations");
    },
  });

  const deleteOrganization = async () => {
    return await axios.delete(`${apiOrgData}${organization.id}`);
  };

  const [onDeleteSubmit] = useMutation(deleteOrganization, {
    onSuccess: () => {
      queryCache.invalidateQueries("organizations");
      queryCache.invalidateQueries(["organization", organization.id]);
      queryCache.removeQueries(["organization", organization.id]);
      Reoverlay.hideModal();
      addToast(`Organization: ${organization.name} deleted`, {
        appearance: "success",
      });
    },
    onError: (error) => {
      addToast("Error: Couldn't delete organization", { appearance: "error" });
    },
    onSettled: () => {
      setCalendarState({ action: "list", id: null });
      queryCache.refetchQueries("organizations");
    },
  });

  const confirmDelete = () => {
    Reoverlay.showModal(DeleteConfirmModal, {
      item: organization,
      itemType: "organization",
      onDelete: onDeleteSubmit,
    });
  };

  return (
    <div>
      <div className="mt-5 p-4 shadow rounded bg-white">
        <div className="flex flex-row justify-between items-center">
          <div className="text-blue-500 font-bold text-xl leading-normal">
            Edit Organization: {organization.name}
          </div>
        </div>
        <div>
          <OrganizationForm
            action="edit"
            initialValues={organization}
            onSubmit={onEditSubmit}
            clearOnSubmit
            submitText={
              isLoading
                ? "Saving..."
                : isError
                ? "Error!"
                : isSuccess
                ? "Saved"
                : "Save Edits"
            }
            calendarState
            setCalendarState
            confirmDelete
          />
        </div>
      </div>
    </div>
  );
};

export default OrganizationEdit;
