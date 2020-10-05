import React, { useContext, useState } from "react";

import axios from "axios";

import { useToasts } from "react-toast-notifications";

import AuthForm from "./AuthForm";
import { AuthContext } from "../../context";
import { apiAuth } from "../../api";
import {
  decodeToken,
  getAuthorizationString,
  tokenExpiresAt,
  tokenInfo,
  tokenIsExpired,
  tokenIsValid,
} from "../../helpers/authFunctions";
import { Loading } from "@components/common";

const AuthSignin = () => {
  const { addToast } = useToasts();

  const authContext = useContext(AuthContext);
  const [loginSuccess, setLoginSuccess] = useState();
  const [loginError, setLoginError] = useState();
  const [redirectOnLogin, setRedirectOnLogin] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);

  // To validate JWT:
  // - Check that the JWT is well formed
  // - Check the signature
  // - Check the standard claims

  const onSubmit = async (values) => {
    try {
      setLoginLoading(true);
      const { data } = await axios.post(`${apiAuth}/signin`, values);
      const isValid = await tokenIsValid(data.token);
      console.log("isValid:", isValid);
      if (isValid) {
        const userInfo = tokenInfo(data.token);
        console.log("userInfo:", userInfo);
        const expiresAt = tokenExpiresAt(data.token);
        console.log("expiresAt:", expiresAt);
        authContext.setAuthState({
          token,
          userInfo,
          expiresAt,
        });
        addToast(`Successfully logged in as: ${userInfo.user}`, {
          appearance: "success",
        });
      } else {
        console.log("token is invalid");
        addToast("Could not log in: token invalid", { appearance: "error" });
      }
      setLoginError(null);
      setTimeout(() => {
        setRedirectOnLogin(true);
      }, 700);
      setLoginLoading(false);
    } catch (error) {
      console.log("In error");
      setLoginLoading(false);
      const { data } = error.response;
      addToast(`Could not log in: ${data.message}`, { appearance: "error" });
      setLoginSuccess(null);
    }
  };

  return (
    <div>
      <div className="mt-5 p-4 shadow rounded bg-white">
        <div className="flex flex-row  items-center">
          <div className="text-blue-500 font-bold text-xl leading-normal">
            Sign In
          </div>
          <div>{loginLoading ? <Loading /> : null}</div>
        </div>
        <div>
          <AuthForm onSubmit={onSubmit} clearOnSubmit submitText={"Sign In"} />
        </div>
      </div>
    </div>
  );
};

export default AuthSignin;
