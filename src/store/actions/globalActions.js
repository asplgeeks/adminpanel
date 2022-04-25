export const SET_ACTIVE_MENU = "SET_ACTIVE_MENU";
export const SET_CONTENT_DATA = "SET_CONTENT_DATA";
export const SET_CONTENT_PAGE = "SET_CONTENT_PAGE";
export const SET_CONTENT_DETAILS_DATA = "SET_CONTENT_DETAILS_DATA";
export const SET_CONTENT_METADATA = "SET_CONTENT_METADATA";
export const SET_CONTENT_UPDATED = "SET_CONTENT_UPDATED";
export const SET_USERS_DATA = "SET_USERS_DATA";
export const SET_USERS_PAGE = "SET_USERS_PAGE";
export const SET_SESSIONS_DATA = "SET_SESSIONS_DATA";
export const SET_SESSIONS_PAGE = "SET_SESSIONS_PAGE";
export const SET_SESSION_DETAILS_DATA = "SET_SESSION_DETAILS_DATA";
export const SET_SESSIONS_UPDATED = "SET_SESSIONS_UPDATED";
export const SET_SESSIONS_DETAILS_CONTENT_LIST = "SET_SESSIONS_DETAILS_CONTENT_LIST";


export const setActiveMenu = (menuItem) => {
  return { type: SET_ACTIVE_MENU, menuItem };
};

export const setContentData = (data) => {
  return { type: SET_CONTENT_DATA, contentData: data };
};

export const setContentPage = (contentPage) => {
  return { type: SET_CONTENT_PAGE, contentPage };
};

export const setContentDetailsData = (data) => {
  return { type: SET_CONTENT_DETAILS_DATA, contentDetailsData: data };
};

export const setContentUpdated = (flag) => {
  return { type: SET_CONTENT_UPDATED, contentUpdated: flag };
};


export const setContentMetadata = (data) => {
  return { type: SET_CONTENT_METADATA, contentMetaData: data };
};

export const setUsersData = (data) => {
  return { type: SET_USERS_DATA, usersData: data };
};

export const setUserPage = (userPage) => {
  return { type: SET_USERS_PAGE, userPage };
};

export const setSessionsData = (data) => {
  return { type: SET_SESSIONS_DATA, sessionsData: data };
};

export const setSessionsPage = (sessionsPage) => {
  return { type: SET_SESSIONS_PAGE, sessionsPage };
};

export const setSessionDetailsData = (data) => {
  return { type: SET_SESSION_DETAILS_DATA, sessionDetailsData: data };
};

export const setSessionsUpdated = (flag) => {
  return { type: SET_SESSIONS_UPDATED, sessionUpdated: flag };
};

export const setSessionDetailsContentList = (data) => {
  return { type: SET_SESSIONS_DETAILS_CONTENT_LIST, sessionDetailsContentList: data };
};