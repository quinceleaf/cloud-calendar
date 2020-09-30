import React from "react";

import axios from "axios";
import { useToasts } from "react-toast-notifications";
import { queryCache, useMutation } from "react-query";
import { Reoverlay } from "reoverlay";

import TagForm from "./TagForm";
import { DeleteConfirmModal } from "../modals";
import { apiTagData } from "../../api/api";

const TagEdit = ({ calendarState, setCalendarState }) => {
  const { addToast } = useToasts();

  const tag = queryCache
    .getQueryData("tags")
    .find((tag) => tag.id === calendarState.viewId);

  const editTag = async (values) => {
    return await axios.post(`${apiTagData}${calendarState.viewId}`, values);
  };

  const [
    onEditSubmit,
    { status, data, error, isLoading, isError, isSuccess },
  ] = useMutation(editTag, {
    onSuccess: (data) => {
      const updatedTag = data.data.data;
      queryCache.invalidateQueries("tags");
      queryCache.invalidateQueries(["tag", updatedTag.id]);
      queryCache.setQueryData(["tag", updatedTag.id], updatedTag);
      addToast(`Tag: ${updatedTag.name} updated`, { appearance: "success" });
    },
    onError: (error) => {
      addToast("Error: Couldn't update tag", { appearance: "error" });
    },
    onSettled: (data) => {
      setCalendarState({ ...calendarState, viewAction: "list", viewId: null });
      queryCache.refetchQueries("tags");
    },
  });

  const deleteTag = async () => {
    return await axios.delete(`${apiTagData}${tag.id}`);
  };

  const [onDeleteSubmit] = useMutation(deleteTag, {
    onSuccess: () => {
      queryCache.invalidateQueries("tags");
      queryCache.invalidateQueries(["tag", tag.id]);
      queryCache.removeQueries(["tag", tag.id]);
      Reoverlay.hideModal();
      addToast(`Tag: ${tag.name} deleted`, { appearance: "success" });
    },
    onError: (error) => {
      addToast("Error: Couldn't delete tag", { appearance: "error" });
    },
    onSettled: () => {
      setCalendarState({ ...calendarState, viewAction: "list", viewId: null });
      queryCache.refetchQueries("tags");
    },
  });

  const confirmDelete = () => {
    Reoverlay.showModal(DeleteConfirmModal, {
      item: tag,
      itemType: "tag",
      onDelete: onDeleteSubmit,
    });
  };

  return (
    <div>
      <div className="mt-5 p-4 shadow rounded bg-white">
        <div className="flex flex-row justify-between items-center">
          <div className="text-blue-500 font-bold text-xl leading-normal">
            Edit Tag: {tag.name}
          </div>
        </div>
        <div>
          <TagForm
            action="edit"
            initialValues={tag}
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

export default TagEdit;
