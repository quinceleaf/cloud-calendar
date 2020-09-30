import React, { useContext, useState } from "react";

import Layout from "@components/Layout";
import {
  OrganizationAdd,
  OrganizationEdit,
  OrganizationList,
} from "@components/organization";
import { CalendarContext } from "../context";

const Organizations = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [filterTerm, setFilterTerm] = useState("");

  const { calendarState, setCalendarState } = useContext(CalendarContext);

  const listProps = {
    filterTerm: filterTerm,
    setFilterTerm: setFilterTerm,
    page: page,
    setPage: setPage,
    pageSize: pageSize,
  };

  const renderPage = (calendarState) => {
    switch (calendarState.viewAction) {
      case "list":
        return (
          <div>
            <OrganizationList
              calendarState={calendarState}
              setCalendarState={setCalendarState}
              listProps={listProps}
            />
          </div>
        );

      case "add":
        return (
          <div>
            <OrganizationAdd
              calendarState={calendarState}
              setCalendarState={setCalendarState}
            />
          </div>
        );

      case "edit":
        return (
          <div>
            <OrganizationEdit
              calendarState={calendarState}
              setCalendarState={setCalendarState}
            />
          </div>
        );

      default:
        return (
          <div>
            <OrganizationList
              calendarState={calendarState}
              setCalendarState={setCalendarState}
              listProps={listProps}
            />
          </div>
        );
    }
  };

  return <div>{renderPage(calendarState)}</div>;
};

const OrganizationsPage = () => {
  return (
    <div>
      <Layout>
        <Organizations />
      </Layout>
    </div>
  );
};

export default OrganizationsPage;
