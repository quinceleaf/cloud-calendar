import React, { createContext, useState } from "react";

export const TimezoneContext = createContext();

export const TimezoneProvider = ({ children }) => {
  const [displayTimezone, setDisplayTimezone] = useState(
    Intl.DateTimeFormat().resolvedOptions().timeZone
  );

  return (
    <TimezoneContext.Provider
      value={{
        displayTimezone,
        setDisplayTimezone,
      }}
    >
      {children}
    </TimezoneContext.Provider>
  );
};
