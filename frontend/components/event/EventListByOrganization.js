import React from "react";
import axios from "axios";
import { MdEvent, MdRemoveCircleOutline } from "react-icons/md";
import { useQuery } from "react-query";
import { Reoverlay } from "reoverlay";

import {
  CustomButton,
  Loading,
  Pagination,
  SearchBar,
  Updating,
} from "../common";
import { SetTimezoneModal } from "../modals";
import { apiEventData } from "../../api/api";
import { displayDateInUserTimezone } from "../../helpers/timeFunctions";
import { filterList, paginateList } from "../../helpers/listFunctions";

const EventsByOrganization = ({
  calendarState,
  setCalendarState,
  listProps,
  displayTimezone,
}) => {
  const eventsByOrganizationQuery = useQuery(
    ["eventsByOrganization", calendarState.screenById],

    () =>
      axios
        .get(`${apiEventData}?organization=${calendarState.screenById}`)
        .then((res) => res.data),
    {
      refetchAllOnWindowFocus: false,
      retry: 1,
      staleTime: 1000,
    }
  );

  const filteredList = eventsByOrganizationQuery.isLoading
    ? []
    : eventsByOrganizationQuery.isError
    ? []
    : eventsByOrganizationQuery.data
    ? filterList(eventsByOrganizationQuery.data, "name", listProps.filterTerm)
    : [];

  const pagedList = paginateList(
    filteredList,
    listProps.page,
    listProps.pageSize
  );

  const changeTimezone = (currentTimezone) => {
    Reoverlay.showModal(SetTimezoneModal, {
      currentTimezone: displayTimezone,
    });
  };

  const renderTopPanel = () => {
    return (
      <div>
        <div className="flex flex-row justify-between items-center">
          <div className="flex flex-row items-center">
            <div className="text-blue-500 font-bold text-2xl leading-normal">
              Events
            </div>
            <div className="ml-2">
              {eventsByOrganizationQuery.isFetching ? <Updating /> : null}
            </div>
          </div>

          <div className="flex flex-row align-start">
            <CustomButton
              onClick={() =>
                setCalendarState({
                  ...calendarState,
                  viewAction: "add",
                  viewId: null,
                })
              }
              text="Add Event"
            />
            <SearchBar
              setFilter={listProps.setFilterTerm}
              placeholderText={`Filter events`}
              resetPage={listProps.setPage}
            />
          </div>
        </div>
      </div>
    );
  };

  const renderBottomPanel = () => {
    return (
      <div className="flex flex-col mt-5 align-center">
        {calendarState.screenByType != "event" && (
          <div className="flex flex-row justify-start align-center text-gray-500 font-sm">
            <div className="mr-3">
              Displaying events matching {calendarState.screenByType}:
              <span className="ml-2 text-blue-500">
                {calendarState.screenByName}
              </span>
            </div>{" "}
            <div className="flex flex-row font-xs">
              <div className="mt-1 mr-1">
                <MdRemoveCircleOutline />
              </div>
              <div>
                {" "}
                <a
                  className="text-blue-500"
                  href="#"
                  onClick={() =>
                    setCalendarState({
                      ...calendarState,
                      screenByType: "event",
                      screenById: null,
                      screenByName: null,
                    })
                  }
                >
                  Dismiss
                </a>
              </div>
            </div>
          </div>
        )}
        <div className="mt-3 text-gray-500 text-xs leading-normal">
          Dates/times displayed in{" "}
          <span className="text-blue-500">{displayTimezone}</span> timezone |
          <a className="ml-1 text-blue-500" href="#" onClick={changeTimezone}>
            Change timezone
          </a>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="p-4 shadow rounded bg-white">
        {renderTopPanel()}

        <div>
          {eventsByOrganizationQuery.isLoading ? (
            <Loading />
          ) : eventsByOrganizationQuery.isError ? (
            <div className="mt-2 text-gray-500">
              Error: {eventsByOrganizationQuery.error.message}
            </div>
          ) : pagedList.length === 0 ? (
            <div className="mt-4 text-gray-500">No upcoming events</div>
          ) : (
            pagedList.map((result) => {
              return (
                <div key={result.id} className="mt-3 text-gray-500">
                  <div className="text-lg">
                    <a
                      className="mt-3 text-blue-500"
                      href="#"
                      onClick={() =>
                        setCalendarState({
                          ...calendarState,
                          viewAction: "view",
                          viewId: result.id,
                        })
                      }
                    >
                      {result.name}
                    </a>
                  </div>
                  <div className="flex flex-row text-sm">
                    <span className="mt-1 mr-2 text-blue-200">
                      <MdEvent />
                    </span>
                    {displayDateInUserTimezone(result.date, displayTimezone)}
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
            {filteredList.length} events
            <span className="ml-1">
              {listProps.filterTerm || calendarState.screenByType != "event"
                ? "match filter"
                : null}
            </span>
          </div>
        </div>
        {renderBottomPanel()}
      </div>
    </div>
  );
};

export default EventsByOrganization;
