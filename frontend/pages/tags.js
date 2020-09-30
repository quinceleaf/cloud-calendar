import React, { useContext, useState } from "react";

import Layout from "@components/Layout";
import { TagAdd, TagEdit, TagList } from "@components/tag";
import { CalendarContext } from "../context";

const Tags = () => {
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
            <TagList
              calendarState={calendarState}
              setCalendarState={setCalendarState}
              listProps={listProps}
            />
          </div>
        );

      case "add":
        return (
          <div>
            <TagAdd
              calendarState={calendarState}
              setCalendarState={setCalendarState}
            />
          </div>
        );

      case "edit":
        return (
          <div>
            <TagEdit
              calendarState={calendarState}
              setCalendarState={setCalendarState}
            />
          </div>
        );

      default:
        return (
          <div>
            <TagList
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

const TagsPage = () => {
  return (
    <div>
      <Layout>
        <Tags />
      </Layout>
    </div>
  );
};

export default TagsPage;
