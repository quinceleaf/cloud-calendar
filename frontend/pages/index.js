import { ReactQueryDevtools } from "react-query-devtools";

import App from "@components/App";
import Layout from "@components/Layout";

const Index = () => {
  return (
    <div>
      <Layout>
        <App />
        <ReactQueryDevtools />
      </Layout>
    </div>
  );
};

export default Index;
