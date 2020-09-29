import React from "react";
import { useRouter } from "next/router";

import axios from "axios";
import { useMutation, useQuery } from "react-query";

import EventForm from "./EventForm";
import { convertDatetimeToUTC, generateTTL } from "../../helpers/timeFunctions";
import { Loading } from "@components/common";

const apiEventData =
  "https://lpwe4r4k7h.execute-api.us-east-1.amazonaws.com/dev/events/";

const apiTagData =
  "https://lpwe4r4k7h.execute-api.us-east-1.amazonaws.com/dev/tags/";

const apiOrgData =
  "https://lpwe4r4k7h.execute-api.us-east-1.amazonaws.com/dev/organizations/";

const fetchEvent = async (id) => {
  await new Promise((r) => setTimeout(r, 500));
  return axios
    .get(`${apiEventData}${id}?collection=true`)
    .then((res) => res.data);
};

export const getServerSideProps = async ({ params: { id } }) => {
  alert("params.id in gSSP:", id);
  const event = await fetchEvent(id);
  console.log("in gSSP, event obj:", event);
  return { props: { event } };
};

export default function EditEvent({ event }) {
  // // console.log("passed props, event:", event);
  // const [editEvent, editEventInfo] = useMutation((values) => {
  //   console.log("Form values passed to createEvent:", values);
  //   values.date = convertDatetimeToUTC(values.date, values.timezone);
  //   values.expiration = generateTTL(values.date);
  //   console.log("Form values modified:", values);
  //   axios.post(apiEventData, values);
  // });

  // const router = useRouter();

  // const collectionQuery = useQuery(
  //   ["collection", router.query?.id],
  //   axios
  //     .get(`${apiEventData}${router.query?.id}?collection=true`)
  //     .then((res) => res.data),
  //   {
  //     initialData: event,
  //     initialStale: true,
  //     refetchAllOnWindowFocus: false,
  //     retry: 3,
  //     staleTime: 1000,
  //   }
  // );
  // console.log(collectionQuery);

  // const tagQuery = useQuery(
  //   "tags",
  //   () => axios.get(apiTagData, {}).then((res) => res.data),
  //   {
  //     refetchAllOnWindowFocus: false,
  //     retry: 3,
  //     staleTime: 1000,
  //   }
  // );
  //console.log(tagQuery);

  // const orgQuery = useQuery(
  //   "organizations",
  //   () => axios.get(apiOrgData, {}).then((res) => res.data),
  //   {
  //     refetchAllOnWindowFocus: false,
  //     retry: 3,
  //     staleTime: 1000,
  //   }
  // );
  //console.log(orgQuery);

  // const loadingState = () => {
  //   return eventId &&
  //     (collectionQuery.isLoading || tagQuery.isLoading || orgQuery.isLoading)
  //     ? true
  //     : false;
  // };

  // const errorState = () => {
  //   return collectionQuery.isError || tagQuery.isError || orgQuery.isError
  //     ? true
  //     : false;
  // };

  // const successState = () => {
  //   return collectionQuery.isSuccess && tagQuery.isSuccess && orgQuery.isSuccess
  //     ? true
  //     : false;
  // };

  return (
    <div>
      <div className="mt-5 p-4 shadow rounded bg-white">
        <div className="flex flex-row justify-between items-center">
          <div className="text-blue-500 font-bold text-xl leading-normal">
            Edit Event
          </div>
        </div>

        {/* <div>
          {collectionQuery.isLoading ||
          tagQuery.isLoading ||
          orgQuery.isLoading ? (
            <Loading />
          ) : collectionQuery.isError ||
            tagQuery.isError ||
            orgQuery.isError ? (
            "Error" ? (
              collectionQuery.isSuccess
            ) : (
              <EventForm
                action="edit"
                initialValues={collectionQuery.data}
                onSubmit={editEvent}
                clearOnSubmit
                submitText={
                  editEventInfo.isLoading
                    ? "Saving..."
                    : editEventInfo.isError
                    ? "Error!"
                    : editEventInfo.isSuccess
                    ? "Saved"
                    : "Create Event"
                }
                tagData={tagQuery.data}
                orgData={orgQuery.data}
              />
            )
          ) : (
            "No data"
          )}
        </div> */}
      </div>
    </div>
  );
}
