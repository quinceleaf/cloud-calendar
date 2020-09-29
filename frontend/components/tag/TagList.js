import React, { useState } from "react";

import axios from "axios";
import { MdEdit } from "react-icons/md";
import { useToasts } from "react-toast-notifications";
import { queryCache, useMutation, useQuery } from "react-query";
import { Reoverlay } from "reoverlay";

import {
  CustomButton,
  Loading,
  Pagination,
  SearchBar,
  Updating,
} from "../common";
import TagForm from "./TagForm";
import { DeleteConfirmModal } from "../modals";
import { apiTagData } from "../../api/api";
import {
  alphabeticalList,
  filterList,
  paginateList,
} from "../../helpers/listFunctions";

function Tags({ tagListProps }) {
  const tagsQuery = useQuery(
    "tags",
    () => axios.get(apiTagData).then((res) => res.data),
    {
      refetchAllOnWindowFocus: false,
      retry: 1,
      staleTime: 1000,
    }
  );

  const filteredList = tagsQuery.isLoading
    ? []
    : tagsQuery.isError
    ? []
    : tagsQuery.data
    ? filterList(tagsQuery.data, "name", tagListProps.filterTerm)
    : [];

  const alphaedList = alphabeticalList(filteredList, "name");

  const pagedList = paginateList(
    alphaedList,
    tagListProps.page,
    tagListProps.pageSize
  );

  const { addToast } = useToasts();

  const renderTopPanel = () => {
    return (
      <div>
        <div className="flex flex-row justify-between items-center">
          <div className="flex flex-row items-center">
            <div className="text-blue-500 font-bold text-2xl leading-normal">
              Tags
            </div>
            <div className="ml-2">
              {tagsQuery.isFetching ? <Updating /> : null}
            </div>
          </div>

          <div className="flex flex-row align-start">
            <CustomButton
              onClick={() =>
                tagListProps.setTagState({ action: "add", id: null })
              }
              text="Add Tag"
            />
            <SearchBar
              setFilter={tagListProps.setFilterTerm}
              placeholderText={`Filter tags`}
              resetPage={tagListProps.setPage}
            />
          </div>
        </div>
        <div className="mt-3 text-gray-500 text-xs">
          Select tag to view all matching events
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="p-4 shadow rounded bg-white">
        {renderTopPanel()}

        <div>
          {tagsQuery.isLoading ? (
            <Loading />
          ) : tagsQuery.isError ? (
            <div className="mt-2 text-gray-500">
              Error: {tagsQuery.error.message}
            </div>
          ) : pagedList.length === 0 ? (
            <div className="mt-4 text-gray-500">No upcoming tags</div>
          ) : (
            pagedList.map((result) => {
              return (
                <div key={result.id} className="mt-3 text-gray-500">
                  <div className="flex flex-row">
                    <div className="text-lg">{result.name}</div>
                    <div className="mt-1 ml-2">
                      {" "}
                      <a
                        className="text-blue-500"
                        href="#"
                        onClick={() =>
                          tagListProps.setTagState({
                            action: "edit",
                            id: result.id,
                          })
                        }
                      >
                        <MdEdit />
                      </a>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
        <div className="flex flex-row align-center">
          <Pagination
            pageSize={tagListProps.pageSize}
            totalObjects={filteredList.length}
            page={tagListProps.page}
            goToPage={tagListProps.setPage}
            isFiltered={tagListProps.filterTerm ? true : false}
          />
          <div className="self-center ml-2 pt-4 text-gray-500 text-sm">
            {filteredList.length} tags
            <span className="ml-1">
              {tagListProps.filterTerm ? "match filter" : null}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function AddTag({ tagListProps }) {
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
      tagListProps.setTagState({ action: "list", id: null });
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
            onSubmit={onSubmit}
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
            setTagState={tagListProps.setTagState}
          />
        </div>
      </div>
    </div>
  );
}

function EditTag({ tagListProps }) {
  const { addToast } = useToasts();

  const tag = queryCache
    .getQueryData("tags")
    .find((tag) => tag.id === tagListProps.tagState.id);

  const editTag = async (values) => {
    return await axios.post(`${apiTagData}${tagListProps.tagState.id}`, values);
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
      const updatedTag = data.data.data;
      tagListProps.setTagState({ action: "list", id: null });
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
      tagListProps.setTagState({ action: "list", id: null });
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
            setTagState={tagListProps.setTagState}
            confirmDelete={confirmDelete}
          />
        </div>
      </div>
    </div>
  );
}

export default function TagList() {
  const [tagState, setTagState] = useState({ action: "list", id: null });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [filterTerm, setFilterTerm] = useState("");

  const tagListProps = {
    tagState: tagState,
    setTagState: setTagState,
    page: page,
    setPage: setPage,
    pageSize: pageSize,
    filterTerm: filterTerm,
    setFilterTerm: setFilterTerm,
  };

  return (
    <div>
      {tagState.action === "list" ? (
        <Tags tagListProps={tagListProps} />
      ) : tagState.action === "add" ? (
        <AddTag tagListProps={tagListProps} />
      ) : tagState.action === "edit" ? (
        <EditTag tagListProps={tagListProps} />
      ) : null}
    </div>
  );
}
