import axios from "axios";
import jwkToPem from "jwk-to-pem";
import jwt from "jsonwebtoken";

const decodeToken = (token) => {
  return jwt.decode(token, { complete: true });
};

const tokenIsValid = async (token) => {
  let isValid = true;

  const { header, payload, signature } = await jwt.decode(token, {
    complete: true,
  });

  // Get keys and config
  const jwks = await axios
    .get(`${payload.iss}/.well-known/jwks.json`)
    .then((res) => res.data.keys);

  // Get config
  const config = await axios
    .get(`${payload.iss}/.well-known/openid-configuration`)
    .then((res) => res.data);

  // Identify key used in token
  const currentKey = await jwks.filter((key) => key["kid"] == header["kid"]);

  //Convert jwks to pem
  const pem = await jwkToPem(currentKey[0]);

  // Disallow "none" as specified algorithim
  if (payload.alg == "none") {
    isValid = false;
  }

  // Ensure that specified algorithm is allowed
  if (config["id_token_signing_alg_values_supported"].includes(header.alg)) {
  } else {
    isValid = false;
  }

  // Check standard claims - iss
  if (payload.iss !== config.issuer) {
    isValid = false;
  }
  // Check standard claims - aud
  // --- that aud specified in payload matches app client ID created in the Amazon Cognito user pool

  // Check the signature
  try {
    await jwt.verify(token, pem, { algorithms: ["RS256"] });
  } catch {
    isValid = false;
    console.log("failed check: jwt.verify");
  }
  return isValid;
};

const getAuthorizationString = (token) => {
  return `Bearer ${token}`;
};

const tokenInfo = (token) => {
  const decodedToken = jwt_decode(token);
  const info = {
    user: decodedToken["cognito:username"],
    id: decodedToken["sub"],
    groups: decodedToken["cognito:groups"],
  };
  return info;
};

const tokenExpiresAt = (token) => {
  const decodedToken = jwt_decode(token);
  return new Date(this.decodedToken.exp * 1000);
};

const tokenIsExpired = (token) => {
  const decodedToken = jwt_decode(token);
  return new Date() > new Date(this.decodedToken.exp * 1000);
};

export {
  decodeToken,
  getAuthorizationString,
  tokenExpiresAt,
  tokenInfo,
  tokenIsExpired,
  tokenIsValid,
};
