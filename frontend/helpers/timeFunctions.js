import { format, utcToZonedTime, zonedTimeToUtc } from "date-fns-tz";

export const combineDateAndTimezone = (utcStr, timezone) => {
  const userDate = utcToZonedTime(utcStr, timezone);
};

export const convertDatetimeToUTC = (localStr, localTimezone) => {
  return zonedTimeToUtc(localStr, localTimezone);
};

export const displayDateInUserTimezone = (utcStr, userTimeZone) => {
  const fmt = "EEE',' MMM d yyyy 'at' h:mm a";
  const userDate = utcToZonedTime(utcStr, userTimeZone);
  return format(userDate, fmt, { userTimeZone });
};

export const generateTTL = (utcDate) => {
  return Math.floor(utcDate.getTime() / 1000.0).toString();
};
