import React, { useState } from "react";
import { useRouter } from "next/router";

import axios from "axios";
import { useQuery } from "react-query";

import { SetTimezoneModal } from "../modals";
import { CustomButton, Loading, Updating } from "../common";
import {
  convertDatetimeToUTC,
  displayDateInUserTimezone,
  combineDateAndTimezone,
} from "../../helpers/timeFunctions";

const apiEventData =
  "https://lpwe4r4k7h.execute-api.us-east-1.amazonaws.com/dev/events/";

const EventView = () => {
  const [displayTimezone, setDisplayTimezone] = useState(
    Intl.DateTimeFormat().resolvedOptions().timeZone
  );

  const router = useRouter();
  console.log(`Query id: ${router.query.id}`);

  const eventQuery = useQuery(
    "event",
    () =>
      !router.query.id
        ? null
        : axios
            .get(`${apiEventData}${router.query.id}`)
            .then((res) => res.data),
    {
      refetchAllOnWindowFocus: false,
      retry: 3,
      staleTime: 1000,
    }
  );
  console.log(eventQuery);

  const renderEvent = (data) => {
    <div>
      <div>
        <div className="flex flex-row justify-between items-center">
          <div className="flex flex-row align-bottom">
            <div className="text-blue-500 font-bold text-2xl leading-normal">
              {data.name}
              {data.url}
              {data.date}
            </div>
            {eventQuery.isFetching ? <Updating /> : null} <Updating />
          </div>
        </div>
        <div className="flex flex-row justify-between items-center">
          <div className="text-gray-500 text-xs leading-normal">
            Dates/times displayed in{" "}
            <span className="text-blue-500">{displayTimezone}</span> timezone |
            <a className="ml-1 text-blue-500" href="#">
              Change timezone
            </a>
          </div>
        </div>
      </div>
    </div>;
  };

  return (
    <div className="p-4 shadow rounded bg-white">
      <div>
        {eventQuery.isFetching ? (
          <Updating />
        ) : eventQuery.isError ? (
          "Error"
        ) : eventQuery.isSuccess ? (
          renderEvent(eventQuery.data[0])
        ) : (
          "Error"
        )}
      </div>
    </div>
  );
};

export default EventView;
