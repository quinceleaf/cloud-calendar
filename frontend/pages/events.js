import React, { useContext, useState } from "react";

import Layout from "@components/Layout";

import {
  EventAdd,
  EventEdit,
  EventList,
  EventListByOrganization,
  EventListByTag,
  EventView,
} from "@components/event";
import { CalendarContext, TimezoneContext } from "../context";

const Events = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [filterTerm, setFilterTerm] = useState("");

  const { calendarState, setCalendarState } = useContext(CalendarContext);
  const { displayTimezone } = useContext(TimezoneContext);

  const listProps = {
    filterTerm: filterTerm,
    setFilterTerm: setFilterTerm,
    page: page,
    setPage: setPage,
    pageSize: pageSize,
  };

  const renderEvents = (calendarState) => {
    switch (calendarState.viewAction) {
      case "list":
        switch (calendarState.screenByType) {
          case "event":
            return (
              <div>
                <EventList
                  calendarState={calendarState}
                  setCalendarState={setCalendarState}
                  listProps={listProps}
                  displayTimezone={displayTimezone}
                />
              </div>
            );
          case "tag":
            return (
              <div>
                <EventListByTag
                  calendarState={calendarState}
                  setCalendarState={setCalendarState}
                  listProps={listProps}
                  displayTimezone={displayTimezone}
                />
              </div>
            );
          case "organization":
            return (
              <div>
                <EventListByOrganization
                  calendarState={calendarState}
                  setCalendarState={setCalendarState}
                  listProps={listProps}
                  displayTimezone={displayTimezone}
                />
              </div>
            );
          default:
            return (
              <div>
                <EventList
                  calendarState={calendarState}
                  setCalendarState={setCalendarState}
                  listProps={listProps}
                  displayTimezone={displayTimezone}
                />
              </div>
            );
        }

      case "add":
        return (
          <div>
            <EventAdd
              calendarState={calendarState}
              setCalendarState={setCalendarState}
            />
          </div>
        );

      case "edit":
        return (
          <div>
            <EventEdit
              calendarState={calendarState}
              setCalendarState={setCalendarState}
            />
          </div>
        );

      case "view":
        return (
          <div>
            <EventView
              calendarState={calendarState}
              setCalendarState={setCalendarState}
              displayTimezone={displayTimezone}
            />
          </div>
        );

      default:
        return (
          <div>
            <Events
              calendarState={calendarState}
              setCalendarState={setCalendarState}
              listProps={listProps}
              displayTimezone={displayTimezone}
            />
          </div>
        );
    }
  };

  return <div>{renderEvents(calendarState)}</div>;
};

const EventsPage = () => {
  return (
    <div>
      <Layout>
        <Events />
      </Layout>
    </div>
  );
};

export default EventsPage;
