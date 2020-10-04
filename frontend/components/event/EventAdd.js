import React from "react";

import axios from "axios";
import { useToasts } from "react-toast-notifications";
import { queryCache, useMutation, useQuery } from "react-query";

import { Loading } from "../common";

import EventForm from "./EventForm";
import { apiData } from "../../api";
import { convertDatetimeToUTC, generateTTL } from "../../helpers/timeFunctions";

const EventAdd = ({ calendarState, setCalendarState }) => {
  const { addToast } = useToasts();

  const tagQuery = useQuery(
    "tags",
    () => axios.get(`${apiData}/tags`, {}).then((res) => res.data),
    {
      refetchAllOnWindowFocus: false,
      retry: 3,
      staleTime: 1000,
    }
  );

  const orgQuery = useQuery(
    "organizations",
    () => axios.get(`${apiData}/organizations`, {}).then((res) => res.data),
    {
      refetchAllOnWindowFocus: false,
      retry: 3,
      staleTime: 1000,
    }
  );

  const addEvent = async (values) => {
    values.date = convertDatetimeToUTC(values.date, values.timezone);
    values.expires = generateTTL(values.date);
    return await axios.post(`${apiData}/events`, values);
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
              calendarState={calendarState}
              setCalendarState={setCalendarState}
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
};

export default EventAdd;
