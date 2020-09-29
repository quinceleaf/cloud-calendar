import React, { useState } from "react";
import Link from "next/link";

import { useMutation, useQuery, queryCache } from "react-query";

import axios from "axios";
import { format, utcToZonedTime, zonedTimeToUtc } from "date-fns-tz";
import { MdAutorenew, MdEvent } from "react-icons/md";

import EventForm from "./EventForm";

import { convertDatetimeToUTC, generateTTL } from "../../helpers/timeFunctions";
import { Loading } from "@components/common";

const apiEventData =
  "https://lpwe4r4k7h.execute-api.us-east-1.amazonaws.com/dev/events/";

const apiTagData =
  "https://lpwe4r4k7h.execute-api.us-east-1.amazonaws.com/dev/tags/";

const apiOrgData =
  "https://lpwe4r4k7h.execute-api.us-east-1.amazonaws.com/dev/organizations/";

export default function AddEvent() {
  const [createEvent, createEventInfo] = useMutation((values) => {
    console.log("Form values passed to createEvent:", values);
    values.date = convertDatetimeToUTC(values.date, values.timezone);
    values.expiration = generateTTL(values.date);
    console.log("Form values modified:", values);
    axios.post(apiEventData, values);
  });

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
              onSubmit={createEvent}
              clearOnSubmit
              submitText={
                createEventInfo.isLoading
                  ? "Saving..."
                  : createEventInfo.isError
                  ? "Error!"
                  : createEventInfo.isSuccess
                  ? "Saved"
                  : "Create Event"
              }
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
