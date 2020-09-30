import { ToastProvider } from "react-toast-notifications";
import { CalendarProvider, TimezoneProvider } from "../context";

import "react-datepicker/dist/react-datepicker.css";
import "reoverlay/lib/ModalWrapper.css";
import "../styles/index.css";

export default function MyApp({ Component, pageProps }) {
  return (
    <ToastProvider autoDismiss autoDismissTimeout={5000} placement="top-right">
      <CalendarProvider>
        <TimezoneProvider>
          <Component {...pageProps} />
        </TimezoneProvider>
      </CalendarProvider>
    </ToastProvider>
  );
}
