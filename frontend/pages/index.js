import App from "@components/App";
import Layout from "@components/Layout";

import { TimezoneProvider } from "../context";

const Index = () => {
  return (
    <div>
      <Layout>
        <App />
      </Layout>
    </div>
  );
};

export default Index;
