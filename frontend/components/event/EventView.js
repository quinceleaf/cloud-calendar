import React from "react";

import axios from "axios";
import { MdEvent, MdLink } from "react-icons/md";
import { useToasts } from "react-toast-notifications";
import { queryCache, useMutation, useQuery } from "react-query";
import { Reoverlay } from "reoverlay";

import { CustomButton, Loading, Updating } from "../common";
import { DeleteConfirmModal } from "../modals";
import { apiEventData } from "../../api/api";
import { displayDateInUserTimezone } from "../../helpers/timeFunctions";

const EventView = ({ calendarState, setCalendarState, displayTimezone }) => {
  const { addToast } = useToasts();

  const eventQuery = useQuery(
    ["event", calendarState.viewId],

    () =>
      axios
        .get(`${apiEventData}${calendarState.viewId}?collection=true`)
        .then((res) => res.data),
    {
      initialData: () =>
        queryCache
          .getQueryData("events")
          ?.find((event) => event.id === calendarState.viewId),
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
      setCalendarState({
        ...calendarState,
        viewAction: "list",
        viewId: null,
      });

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
              {displayDateInUserTimezone(eventQuery.data.date, displayTimezone)}
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
                      <a
                        className="text-blue-500"
                        href="#"
                        onClick={() =>
                          setCalendarState({
                            viewAction: "list",
                            viewId: null,
                            screenByType: "tag",
                            screenById: tag.id,
                            screenByName: tag.name,
                          })
                        }
                      >
                        {tag.name}
                      </a>

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
                      <a
                        className="text-blue-500"
                        href="#"
                        onClick={() =>
                          setCalendarState({
                            viewAction: "list",
                            viewId: null,
                            screenByType: "organization",
                            screenById: org.id,
                            screenByName: org.name,
                          })
                        }
                      >
                        {org.name}
                      </a>
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
                setCalendarState({
                  ...calendarState,
                  viewAction: "list",
                  viewId: null,
                })
              }
              text="Back to Events"
            />
            <CustomButton
              onClick={() =>
                setCalendarState({
                  ...calendarState,
                  viewAction: "edit",
                  viewId: eventQuery.data.id,
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
};

export default EventView;
