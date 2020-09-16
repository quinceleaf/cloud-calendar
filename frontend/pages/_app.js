import "../styles/index.css";

// The following import prevents a Font Awesome icon server-side rendering bug,
// where the icons flash from a very large icon down to a properly sized one:
// import "@fortawesome/fontawesome-svg-core/styles.css";

// Prevent fontawesome from adding its CSS since we did it manually above:
// import { config } from "@fortawesome/fontawesome-svg-core";
// config.autoAddCss = false; /* eslint-disable import/first */

// Fix credit due to David Deprost https://stackoverflow.com/users/6033410/david-deprost
// https://stackoverflow.com/questions/56334381/why-my-font-awesome-icons-are-being-displayed-big-at-first-and-then-updated-to-t

export default function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}
