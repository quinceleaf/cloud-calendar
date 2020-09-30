import React, { createContext, useState } from "react";

export const CalendarContext = createContext();

export const CalendarProvider = ({ children }) => {
  const [calendarState, setCalendarState] = useState({
    viewAction: "list",
    viewId: null,
    screenByType: "event",
    screenById: null,
    screenByName: null,
  });
  console.log("calendarState:", calendarState);

  return (
    <CalendarContext.Provider
      value={{
        calendarState,
        setCalendarState,
      }}
    >
      {children}
    </CalendarContext.Provider>
  );
};
