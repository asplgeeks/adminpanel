import { AUTH_BASIC } from "./constants";

/**
 * checks whether backend has sent an error
 * @param status status code of api call
 */
const hasError = (status) => {
  const ERROR_HEADERS = [400, 401, 403, 404, 405, 500];
  return ERROR_HEADERS.includes(status);
};

/**
 * Function to make API calls
 * @param url url endpoint to make request
 * @param method type of request. ex- get, post
 * @param data additional data to send
 */
export async function ApiRequest(url, method, data, fileUpload = false) {
  const requestUrl = new URL(url);
  const headers = {
    Authorization: AUTH_BASIC,
    "Content-Type": "application/json",
  };

  if (fileUpload) {
    delete headers["Content-Type"];
  }

  // returns formatted data according to its type
  const getFormattedData = () =>
    data instanceof FormData ? data : JSON.stringify(data);

  if (method === "GET" && data) {
    Object.keys(data).forEach((key) =>
      requestUrl.searchParams.append(key, data[key])
    );
  }

  const request = new Request(requestUrl.href, {
    method,
    headers: new Headers(headers),
    body: method !== "GET" && data ? getFormattedData() : undefined,
  });

  let response;

  try {
    response = await fetch(request);
  } catch (e) {
    return Promise.reject(e);
  }
  try {
    const contentType = response.headers.get("content-type");

    if (
      (contentType && contentType.indexOf("application/json") !== -1) ||
      fileUpload
    ) {
      const json = await response.json();

      if (!json) return Promise.reject(new Error(`Invalid JSON ${json}`));

      if (json.not_authenticated) {
        return Promise.reject(new Error(json.message));
      }

      if (hasError(response.status)) {
        return Promise.resolve({ success: false, response: json });
      }

      return Promise.resolve({ success: true, response: json });
    }

    return Promise.reject(new Error("API Request Failed"));
  } catch (e) {
    return Promise.reject(e);
  }
}

/**
 * Function
 */


 export async function ApiRequest1(url, method, data, fileUpload = false) {
  const requestUrl = new URL(url);
  const headers = {
    auth: { 
      username: "asuWorks",
      password: "ergbhjwfvbhjkegvfvkgbhjbhjksfdgvsdjfvhnklhnjklhjkSJKHhjkBHJKbhjkhjkkjBHJvHJKBHJK"
   },
    "Content-Type": "application/json",
  };

  if (fileUpload) {
    delete headers["Content-Type"];
  }

  // returns formatted data according to its type
  const getFormattedData = () =>
    data instanceof FormData ? data : JSON.stringify(data);

  if (method === "GET" && data) {
    Object.keys(data).forEach((key) =>
      requestUrl.searchParams.append(key, data[key])
    );
  }

  const request = new Request(requestUrl.href, {
    method,
    headers: new Headers(headers),
    body: method !== "GET" && data ? getFormattedData() : undefined,
  });

  let response;

  try {
    response = await fetch(request);
  } catch (e) {
    return Promise.reject(e);
  }
  try {
    const contentType = response.headers.get("content-type");

    if (
      (contentType && contentType.indexOf("application/json") !== -1) ||
      fileUpload
    ) {
      const json = await response.json();

      if (!json) return Promise.reject(new Error(`Invalid JSON ${json}`));

      if (json.not_authenticated) {
        return Promise.reject(new Error(json.message));
      }

      if (hasError(response.status)) {
        return Promise.resolve({ success: false, response: json });
      }

      return Promise.resolve({ success: true, response: json });
    }

    return Promise.reject(new Error("API Request Failed"));
  } catch (e) {
    return Promise.reject(e);
  }
}