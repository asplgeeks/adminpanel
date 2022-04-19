import {
  SET_ACTIVE_MENU,
  SET_CONTENT_DATA,
  SET_CONTENT_PAGE,
  SET_CONTENT_DETAILS_DATA,
  SET_CONTENT_METADATA,
  SET_USERS_DATA,
  SET_USERS_PAGE,
  SET_CONTENT_UPDATED,
  SET_SESSIONS_DATA,
  SET_SESSIONS_PAGE,
  SET_SESSION_DETAILS_DATA,
  SET_SESSIONS_UPDATED,
  SET_SESSIONS_DETAILS_CONTENT_LIST,
} from "../actions/globalActions";

// Initial state
const initialState = {
  contentData: [],
  contentDetailsData: {},
  contentMetadata: {},
  menuItem: "users",
  usersData: [],
  userPage: 1,
  contentPage: 1,
  contentUpdated: true,

  sessionsData: [],
  sessionDetailsData: {},
  sessionsPage: 1,
  sessionsUpdated: true,
  sessionDetailsContentList: [],
};

const globalReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_ACTIVE_MENU: {
      return {
        ...state,
        menuItem: action.menuItem,
      };
    }

    case SET_CONTENT_DATA: {
      return {
        ...state,
        contentData: action.contentData,
      };
    }

    case SET_CONTENT_PAGE: {
      return {
        ...state,
        contentPage: action.contentPage,
      };
    }

    case SET_CONTENT_DETAILS_DATA: {
      return {
        ...state,
        contentDetailsData: action.contentDetailsData,
      };
    }

    case SET_CONTENT_METADATA: {
      return {
        ...state,
        contentMetaData: action.contentMetaData,
      };
    }

    case SET_CONTENT_UPDATED: {
      return {
        ...state,
        contentUpdated: action.contentUpdated,
      };
    }

    case SET_USERS_DATA: {
      return {
        ...state,
        usersData: action.usersData,
      };
    }

    case SET_USERS_PAGE: {
      return {
        ...state,
        userPage: action.userPage,
      };
    }

    case SET_SESSIONS_DATA: {
      return {
        ...state,
        sessionsData: action.sessionsData,
      };
    }

    case SET_SESSIONS_PAGE: {
      return {
        ...state,
        sessionsPage: action.sessionsPage,
      };
    }

    case SET_SESSION_DETAILS_DATA: {
      return {
        ...state,
        sessionDetailsData: action.sessionDetailsData,
      };
    }

    case SET_SESSIONS_UPDATED: {
      return {
        ...state,
        sessionsUpdated: action.sessionsUpdated,
      };
    }

    case SET_SESSIONS_DETAILS_CONTENT_LIST: {
      return {
        ...state,
        sessionDetailsContentList: action.sessionDetailsContentList,
      };
    }


    default:
      return state;
  }
};

export default globalReducer;
