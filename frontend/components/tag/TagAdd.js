import React from "react";

import axios from "axios";
import { useToasts } from "react-toast-notifications";
import { queryCache, useMutation } from "react-query";

import TagForm from "./TagForm";
import { apiTagData } from "../../api/api";

const TagAdd = ({ calendarState, setCalendarState }) => {
  const { addToast } = useToasts();

  const addTag = async (values) => {
    return await axios.post(apiTagData, values);
  };

  const [
    onSubmit,
    { status, data, error, isLoading, isError, isSuccess },
  ] = useMutation(addTag, {
    onSuccess: (data) => {
      const newTag = data.data.data;
      queryCache.invalidateQueries("tags");
      queryCache.invalidateQueries(["tag", newTag.id]);
      queryCache.setQueryData(["tag", newTag.id], newTag);
      addToast(`Tag: ${newTag.name} added`, { appearance: "success" });
    },
    onError: (error, newTag, rollback) => {
      rollback();
      addToast("Error: Couldn't add tag", { appearance: "error" });
    },
    onSettled: (data) => {
      const newTag = data.data.data;
      setCalendarState({ ...calendarState, viewAction: "list", viewId: null });
      queryCache.refetchQueries("tags");
    },
  });

  return (
    <div>
      <div className="mt-5 p-4 shadow rounded bg-white">
        <div className="flex flex-row justify-between items-center">
          <div className="text-blue-500 font-bold text-xl leading-normal">
            Add Tag
          </div>
        </div>
        <div>
          <TagForm
            action="add"
            onSubmit
            clearOnSubmit
            submitText={
              isLoading
                ? "Saving..."
                : isError
                ? "Error!"
                : isSuccess
                ? "Saved"
                : "Add Tag"
            }
            calendarState
            setCalendarState
          />
        </div>
      </div>
    </div>
  );
};

export default TagAdd;
