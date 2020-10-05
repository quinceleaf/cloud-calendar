import React from "react";

import axios from "axios";
import { useToasts } from "react-toast-notifications";

import { Loading } from "../common";

import AuthForm from "./AuthForm";
import { apiAuth } from "../../api";

const AuthSignup = () => {
  const { addToast } = useToasts();

  const onSubmit = async (values) => {
    try {
      console.log("values entered:", values);
      console.log("apiAuth:", apiAuth);
      // setLoginLoading(true);
      const { data } = await axios.post(`${apiAuth}/signup`, values);
      console.log("data:", data);
      addToast(`${data.message}`, { appearance: "success" });

      // //authContext.setAuthState(data);
      // setSignupSuccess(data.message);
      // setSignupError("");
      // setTimeout(() => {
      //   setRedirectOnLogin(true);
      // }, 700);
    } catch (error) {
      // setLoginLoading(false);
      const { data } = error.response;
      console.log("data:", data);
      addToast(`${data.message}`, { appearance: "error" });
      // setSignupError(data.message);
      // setSignupSuccess("");
    }
  };

  return (
    <div>
      <div className="mt-5 p-4 shadow rounded bg-white">
        <div className="flex flex-row justify-between items-center">
          <div className="text-blue-500 font-bold text-xl leading-normal">
            Sign Up
          </div>
        </div>
        <div>
          <AuthForm onSubmit={onSubmit} clearOnSubmit submitText="Sign Up" />
        </div>
      </div>
    </div>
  );
};

export default AuthSignup;
