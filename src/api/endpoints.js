const BASE_URL = "https://api.ima-india.com/";

const BASE_URL_N = "http://localhost:3500/";

/* Articles */
export const articles = {
  GET: {
    ARTICLE_LIST: `${BASE_URL}getArticles?pageNo=:num`,
  },
};

/* Users */
export const users = {
  GET: {
    USERS_LIST: `${BASE_URL}admin/usersList`,
  },
  PUT: {
    USER_IMAGE: `${BASE_URL}user/userImageUpload?userId=:fbuid`,
  },
};

// Threds

export const thread = {
  POST: {
    THREAD: `http://65.1.145.79/admin/listThreads`
  }
}
/* Content */
export const content = {
  GET: {
    CONTENT_LIST: `${BASE_URL}admin/contentsList`,
    METADATA: `${BASE_URL}admin/getConfig`,
  },
  PUT: {
    CONTENT: `${BASE_URL}content/updateInsightContent`
  },
  POST: {
    COMMENT: `http://65.1.145.79/admin/listThreadsComments`
  }
};

/* Content */
export const category = {
  POST: {
    CreateUpdate: `http://65.1.145.79/admin/addupdateThreadCategory`,
    CategoryList: `http://65.1.145.79/admin/listThreadCategories`,
    UpdateStatus: `http://65.1.145.79/admin/activeDeactiveCategory`
  }
};

/*---------------thread request----------*/
export const ThreadRequest = {
  POST: {
    List: `http://65.1.145.79/admin/listThreadsRequest`,
    // CategoryList: `http://65.1.145.79/admin/listThreadCategories`,
   UpdateStatus: `http://65.1.145.79/admin/updateThreadRequest`
  }
};

export const comment ={
  POST: {
    COMMENT: `http://65.1.145.79/admin/removeThreadComment`
  }
}

export const THREADLIST = {
  POST: {
    THREAD: `http://65.1.145.79/admin/addThread`
  },
}

export const SELECT_THREAD_USER_CATEGORY = {
  POST: {
    THREADUSERLIST: `http://65.1.145.79/admin/addUpdateThreadSelectors`
  },
}
export const GETTHREAD ={
  POST: {
    UPDATETHREAD: `http://65.1.145.79/admin/updateThread`
  }
}

/* Sessions */
export const sessions = {
  GET: {
    SESSIONS_LIST: `${BASE_URL}session/getSessionList?sId=0`,
    SESSION_CONTENT_LIST: `${BASE_URL}admin/getSessionBasedContent`,
    CONTENT_LIST: `${BASE_URL}admin/getContentListDisplay`,
    SESSION_BASED_CONTENT: `${BASE_URL}admin/getSessionBasedContentTagId`,
    SESSION_BASED_CONTENT_TITLE: `${BASE_URL}admin/getContentListTitle`
  },
  POST:
  {
    SESSION_IMAGE: `${BASE_URL}session/setSessionImage?sessionId=:sessionId`
  },
  PUT: {
    SESSION_DETAILS: `${BASE_URL}session/setContentSessionMapping`
  }
};

/* Subscribe to Notifications */
export const notifications = {
  POST: {
    PUSH_NOTIFICATIONS: `${BASE_URL}notification/setNotification`
  },
  PUT :{
    CREATE_GROUP : `${BASE_URL}user/createUserGroup`,
    SEARCH_USERS : `${BASE_URL}user/searchUsers`

  },
  GET: {
    USER_FILTER_TYPE : `${BASE_URL}user/getUsergroupDropdownList`,
    LIST_USER_GROUP : `${BASE_URL}user/listUserGroups`
  }

};


export const Login = {
  PUT :{
    user : `http://65.1.145.79/user/getIdByEmail`,
  }

};