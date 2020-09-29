import React, { useContext, useState } from "react";
import Link from "next/link";

import axios from "axios";
import { MdEvent, MdLink } from "react-icons/md";
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
import { TimezoneContext } from "../../context";
import EventForm from "./EventForm";
import { SetTimezoneModal, DeleteConfirmModal } from "../modals";
import { apiEventData, apiTagData, apiOrgData } from "../../api/api";
import {
  convertDatetimeToUTC,
  displayDateInUserTimezone,
  generateTTL,
} from "../../helpers/timeFunctions";
import { filterList, paginateList } from "../../helpers/listFunctions";

function Events({ eventListProps }) {
  const eventsQuery = useQuery(
    "events",
    () => axios.get(apiEventData).then((res) => res.data),
    {
      refetchAllOnWindowFocus: false,
      retry: 1,
      staleTime: 1000,
    }
  );

  const filteredList = eventsQuery.isLoading
    ? []
    : eventsQuery.isError
    ? []
    : eventsQuery.data
    ? filterList(eventsQuery.data, "name", eventListProps.filterTerm)
    : [];

  const pagedList = paginateList(
    filteredList,
    eventListProps.page,
    eventListProps.pageSize
  );

  const { addToast } = useToasts();

  const changeTimezone = (currentTimezone) => {
    Reoverlay.showModal(SetTimezoneModal, {
      currentTimezone: eventListProps.displayTimezone,
    });
  };

  const renderTopPanel = () => {
    return (
      <div>
        <div className="flex flex-row justify-between items-center">
          <div className="flex flex-row items-center">
            <div className="text-blue-500 font-bold text-2xl leading-normal">
              Upcoming Events
            </div>
            <div className="ml-2">
              {eventsQuery.isFetching ? <Updating /> : null}
            </div>
          </div>

          <div className="flex flex-row align-start">
            <CustomButton
              onClick={() =>
                eventListProps.setEventState({ action: "add", id: null })
              }
              text="Add Event"
            />
            <SearchBar
              setFilter={eventListProps.setFilterTerm}
              placeholderText={`Filter events`}
              resetPage={eventListProps.setPage}
            />
          </div>
        </div>
        <div className="flex flex-row justify-between items-center">
          <div className="text-gray-500 text-xs leading-normal">
            Dates/times displayed in{" "}
            <span className="text-blue-500">
              {eventListProps.displayTimezone}
            </span>{" "}
            timezone |
            <a className="ml-1 text-blue-500" href="#" onClick={changeTimezone}>
              Change timezone
            </a>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="p-4 shadow rounded bg-white">
        {renderTopPanel()}

        <div>
          {eventsQuery.isLoading ? (
            <Loading />
          ) : eventsQuery.isError ? (
            <div className="mt-2 text-gray-500">
              Error: {eventsQuery.error.message}
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
                        eventListProps.setEventState({
                          action: "view",
                          id: result.id,
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
                    {displayDateInUserTimezone(
                      result.date,
                      eventListProps.displayTimezone
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
        <div className="flex flex-row align-center">
          <Pagination
            pageSize={eventListProps.pageSize}
            totalObjects={filteredList.length}
            page={eventListProps.page}
            goToPage={eventListProps.setPage}
            isFiltered={eventListProps.filterTerm ? true : false}
          />
          <div className="self-center ml-2 pt-4 text-gray-500 text-sm">
            {filteredList.length} events
            <span className="ml-1">
              {eventListProps.filterTerm ? "match filter" : null}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Event({ eventListProps }) {
  const { addToast } = useToasts();

  const eventQuery = useQuery(
    ["event", eventListProps.eventState.id],
    () =>
      axios
        .get(`${apiEventData}${eventListProps.eventState.id}?collection=true`)
        .then((res) => res.data),
    {
      initialData: () =>
        queryCache
          .getQueryData("events")
          ?.find((event) => event.id === eventListProps.eventState.id),
      initialStale: true,
      refetchAllOnWindowFocus: false,
      retry: 0,
      staleTime: 1000,
    }
  );

  const deleteEvent = async () => {
    return await axios.delete(`${apiEventData}${eventQuery.data.id}`);
  };

  const [onDeleteSubmit] = useMutation(deleteEvent, {
    onSuccess: () => {
      const deletedEvent = eventQuery.data;
      queryCache.invalidateQueries("events");
      queryCache.invalidateQueries(["event", deletedEvent.id]);
      queryCache.removeQueries(["event", deletedEvent.id]);
      Reoverlay.hideModal();
      addToast(`Event: ${deletedEvent.name} deleted`, {
        appearance: "success",
      });
    },
    onError: (error) => {
      addToast("Error: Couldn't delete event", { appearance: "error" });
    },
    onSettled: () => {
      eventListProps.setEventState({ action: "list", id: null });
      queryCache.refetchQueries("events");
    },
  });

  const confirmDelete = () => {
    Reoverlay.showModal(DeleteConfirmModal, {
      item: eventQuery.data,
      itemType: "event",
      onDelete: onDeleteSubmit,
    });
  };

  return (
    <div className="p-2 md:p-4">
      {eventQuery.isLoading ? (
        <Loading />
      ) : eventQuery.isError ? (
        <div className="mt-2 text-gray-500">
          Error: {eventQuery.error.message}
        </div>
      ) : (
        <div>
          <div className="flex flex-row items-center">
            <div className="text-blue-500 font-bold text-2xl leading-normal">
              {eventQuery.data.name}
            </div>
            <div className="ml-2">
              {eventQuery.isFetching ? <Updating /> : null}
            </div>
          </div>

          <div className="flex flex-row mb-3">
            <span className="mt-1 mr-2 text-blue-200 text-sm">
              <MdEvent />
            </span>
            <span className="text-gray-500 text-sm">
              {displayDateInUserTimezone(
                eventQuery.data.date,
                eventListProps.displayTimezone
              )}
            </span>
          </div>
          <div className="flex flex-row mb-3">
            <span className="mt-1 mr-2 text-blue-200 text-sm">
              <MdLink />
            </span>
            <span>
              <a
                className=" text-blue-500"
                href={eventQuery.data.url}
                target="_blank"
              >
                {eventQuery.data.url}
              </a>
            </span>
          </div>

          <div className="mb-3 text-gray-500 font-xs">
            Visit event link to sign up or for more information
          </div>
          <div>{eventQuery.data.description}</div>

          <div>
            <div className="mt-3 text-blue-500 font-semibold font-sm">Tags</div>

            <div className="flex flex-row">
              {!eventQuery.data.tags ? (
                <Loading />
              ) : eventQuery.data.tags.length === 0 ? (
                <div className="text-gray-500">No tags assigned</div>
              ) : (
                eventQuery.data.tags.map((tag) => {
                  return (
                    <div key={tag.id} className="tag">
                      <Link href={`/eventsByTag/${tag.id}`}>
                        <a className="text-blue-500">{tag.name}</a>
                      </Link>
                      <span className="text-gray-500"> </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div>
            <div className="mt-3 text-blue-500 font-semibold font-sm">
              Organizations
            </div>

            <div className="flex flex-row">
              {!eventQuery.data.organizations ? (
                <Loading />
              ) : eventQuery.data.organizations.length === 0 ? (
                <div className="text-gray-500">No organizations assigned</div>
              ) : (
                eventQuery.data.organizations.map((org) => {
                  return (
                    <div key={org.id} className="tag">
                      <Link href={`/eventsByOrganization/${org.id}`}>
                        <a className="text-blue-500">{org.name}</a>
                      </Link>
                      <span className="text-gray-500"> </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="flex flex-row mt-6">
            <CustomButton
              onClick={() =>
                eventListProps.setEventState({ action: "list", id: null })
              }
              text="Back to Events"
            />
            <CustomButton
              onClick={() =>
                eventListProps.setEventState({
                  action: "edit",
                  id: eventQuery.data.id,
                })
              }
              text="Edit Event"
            />
            <CustomButton
              onClick={() => {
                confirmDelete();
              }}
              text="Delete Event"
            />
          </div>
        </div>
      )}
    </div>
  );
}

function AddEvent({ eventListProps }) {
  const { addToast } = useToasts();

  const tagQuery = useQuery(
    "tags",
    () => axios.get(apiTagData, {}).then((res) => res.data),
    {
      refetchAllOnWindowFocus: false,
      retry: 3,
      staleTime: 1000,
    }
  );

  const orgQuery = useQuery(
    "organizations",
    () => axios.get(apiOrgData, {}).then((res) => res.data),
    {
      refetchAllOnWindowFocus: false,
      retry: 3,
      staleTime: 1000,
    }
  );

  const addEvent = async (values) => {
    values.date = convertDatetimeToUTC(values.date, values.timezone);
    values.expires = generateTTL(values.date);
    return await axios.post(apiEventData, values);
  };

  const [
    onSubmit,
    { status, data, error, isLoading, isError, isSuccess },
  ] = useMutation(addEvent, {
    onSuccess: (data) => {
      const newEvent = data.data.data;
      queryCache.invalidateQueries("events");
      queryCache.invalidateQueries(["event", newEvent.id]);
      queryCache.setQueryData(["event", newEvent.id], newEvent);
      addToast(`Event: ${newEvent.name} added`, { appearance: "success" });
    },
    onError: (error) => {
      addToast("Error: Couldn't update event", { appearance: "error" });
    },
    onSettled: (data) => {
      const newEvent = data.data.data;
      eventListProps.setEventState({ action: "view", id: newEvent.id });
      queryCache.refetchQueries("events");
    },
  });

  return (
    <div>
      <div className="mt-5 p-4 shadow rounded bg-white">
        <div className="flex flex-row justify-between items-center">
          <div className="text-blue-500 font-bold text-xl leading-normal">
            Add Event
          </div>
        </div>
        <div>
          {tagQuery.isLoading || orgQuery.isLoading ? (
            <Loading />
          ) : tagQuery.isError || orgQuery.isError ? (
            `Error: ${tagQuery.error.message} ${orgQuery.error.message}`
          ) : tagQuery.data && orgQuery.data ? (
            <EventForm
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
                  : "Create Event"
              }
              setEventState={eventListProps.setEventState}
              tagData={
                tagQuery.isLoading ? [] : tagQuery.isError ? [] : tagQuery.data
              }
              orgData={
                orgQuery.isLoading ? [] : orgQuery.isError ? [] : orgQuery.data
              }
            />
          ) : (
            "No data"
          )}
        </div>
      </div>
    </div>
  );
}

function EditEvent({ eventListProps }) {
  const { addToast } = useToasts();

  const eventQuery = useQuery(
    ["event", eventListProps.eventState.id],
    () =>
      axios
        .get(`${apiEventData}${eventListProps.eventState.id}?collection=true`)
        .then((res) => res.data),
    {
      initialData: () =>
        queryCache
          .getQueryData("events")
          ?.find((event) => event.id === eventListProps.eventState.id),
      initialStale: true,
      refetchAllOnWindowFocus: false,
      retry: 0,
      staleTime: 1000,
    }
  );

  const tagQuery = useQuery(
    "tags",
    () => axios.get(apiTagData, {}).then((res) => res.data),
    {
      refetchAllOnWindowFocus: false,
      retry: 3,
      staleTime: 1000,
    }
  );

  const orgQuery = useQuery(
    "organizations",
    () => axios.get(apiOrgData, {}).then((res) => res.data),
    {
      refetchAllOnWindowFocus: false,
      retry: 3,
      staleTime: 1000,
    }
  );

  const editEvent = async (values) => {
    values.date = convertDatetimeToUTC(values.date, values.timezone);
    values.expires = generateTTL(values.date);
    await axios.post(`${apiEventData}${eventQuery.data.id}`, values);
  };

  const [
    onSubmit,
    { status, data, error, isLoading, isError, isSuccess },
  ] = useMutation(editEvent, {
    onSuccess: (data) => {
      const newEvent = data.data.data;
      queryCache.invalidateQueries("events");
      queryCache.invalidateQueries(["event", newEvent.id]);
      queryCache.setQueryData(["event", newEvent.id], newEvent);
      addToast(`Event: ${newEvent.name} added`, { appearance: "success" });
    },
    onError: (error) => {
      addToast("Error: Couldn't update event", { appearance: "error" });
    },
    onSettled: (data) => {
      const newEvent = data.data.data;
      eventListProps.setEventState({ action: "view", id: newEvent.id });
      queryCache.refetchQueries("events");
    },
  });

  return (
    <div>
      <div className="mt-5 p-4 shadow rounded bg-white">
        <div className="flex flex-row justify-between items-center">
          <div className="text-blue-500 font-bold text-xl leading-normal">
            Edit Event
          </div>
        </div>
        <div>
          {eventQuery.isLoading || tagQuery.isLoading || orgQuery.isLoading ? (
            <Loading />
          ) : eventQuery.isError || tagQuery.isError || orgQuery.isError ? (
            "Error"
          ) : eventQuery.isSuccess ? (
            <EventForm
              action="edit"
              initialValues={eventQuery.data}
              onSubmit={editEvent}
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
              setEventState={eventListProps.setEventState}
              tagData={tagQuery.data}
              orgData={orgQuery.data}
            />
          ) : (
            "No data"
          )}
        </div>
      </div>
    </div>
  );
}

export default function EventList() {
  const [eventState, setEventState] = useState({ action: "list", id: null });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [filterTerm, setFilterTerm] = useState("");

  const { displayTimezone } = useContext(TimezoneContext);

  const eventListProps = {
    eventState: eventState,
    setEventState: setEventState,
    page: page,
    setPage: setPage,
    pageSize: pageSize,
    filterTerm: filterTerm,
    setFilterTerm: setFilterTerm,
    displayTimezone: displayTimezone,
  };

  return (
    <div>
      {eventState.action === "list" ? (
        <Events eventListProps={eventListProps} />
      ) : eventState.action === "add" ? (
        <AddEvent eventListProps={eventListProps} />
      ) : eventState.action === "edit" ? (
        <EditEvent eventListProps={eventListProps} />
      ) : (
        <Event eventListProps={eventListProps} />
      )}
    </div>
  );
}
