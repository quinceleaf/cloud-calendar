import React from "react";

import axios from "axios";
import { useToasts } from "react-toast-notifications";
import { queryCache, useMutation, useQuery } from "react-query";

import { Loading } from "../common";
import EventForm from "./EventForm";
import { apiEventData, apiTagData, apiOrgData } from "../../api/api";
import { convertDatetimeToUTC, generateTTL } from "../../helpers/timeFunctions";

const EventEdit = ({ calendarState, setCalendarState }) => {
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

    return await axios.post(`${apiEventData}${calendarState.viewId}`, values);
  };

  const [
    onEditSubmit,
    { status, data, error, isLoading, isError, isSuccess },
  ] = useMutation(editEvent, {
    onSuccess: (data) => {
      const newEvent = data.data.data;
      queryCache.invalidateQueries("events");
      queryCache.invalidateQueries(["event", newEvent.id]);
      addToast(`Event: ${newEvent.name} updated`, { appearance: "success" });
    },
    onError: (error) => {
      addToast("Error: Couldn't update event", { appearance: "error" });
    },
    onSettled: (data) => {
      const newEvent = data.data.data;
      setCalendarState({
        ...calendarState,
        viewAction: "view",
        viewId: newEvent.id,
      });

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
              setEventState={setCalendarState}
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
};

export default EventEdit;
