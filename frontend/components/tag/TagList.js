import React from "react";
import Link from "next/link";

import axios from "axios";
import { MdEdit } from "react-icons/md";
import { useQuery } from "react-query";

import {
  CustomButton,
  Loading,
  Pagination,
  SearchBar,
  Updating,
} from "../common";
import { apiData } from "../../api";
import {
  alphabeticalList,
  filterList,
  paginateList,
} from "../../helpers/listFunctions";

const TagList = ({ calendarState, setCalendarState, listProps }) => {
  const tagsQuery = useQuery(
    "tags",
    () => axios.get(`${apiData}/tags`).then((res) => res.data),
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
    ? filterList(tagsQuery.data, "name", listProps.filterTerm)
    : [];

  const alphaedList = alphabeticalList(filteredList, "name");

  const pagedList = paginateList(
    alphaedList,
    listProps.page,
    listProps.pageSize
  );

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
              onClick={() => {
                setCalendarState({
                  ...calendarState,
                  viewAction: "add",
                  viewId: null,
                });
              }}
              text="Add Tag"
            />
            <SearchBar
              setFilter={listProps.setFilterTerm}
              placeholderText={`Filter tags`}
              resetPage={listProps.setPage}
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
            <div className="mt-4 text-gray-500">No tags defined</div>
          ) : (
            pagedList.map((result) => {
              return (
                <div key={result.id} className="mt-3 text-gray-500">
                  <div className="flex flex-row">
                    <div className="text-lg">
                      <Link href="/events">
                        <a
                          href="#"
                          onClick={() => {
                            setCalendarState({
                              viewAction: "list",
                              viewId: null,
                              screenByType: "tag",
                              screenById: result.id,
                              screenByName: result.name,
                            });
                          }}
                        >
                          {result.name}
                        </a>
                      </Link>
                    </div>
                    <div className="mt-1 ml-2">
                      {" "}
                      <a
                        className="text-blue-500"
                        href="#"
                        onClick={() =>
                          setCalendarState({
                            ...calendarState,
                            viewAction: "edit",
                            viewId: result.id,
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
            pageSize={listProps.pageSize}
            totalObjects={filteredList.length}
            page={listProps.page}
            goToPage={listProps.setPage}
            isFiltered={listProps.filterTerm ? true : false}
          />
          <div className="self-center ml-2 pt-4 text-gray-500 text-sm">
            {filteredList.length} tags
            <span className="ml-1">
              {listProps.filterTerm ? "match filter" : null}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TagList;
